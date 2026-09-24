// Snapshots public Steam stats into public/assets/steam.json.
//
//   npm run steam        (also runs automatically before `npm run build`)
//
// With STEAM_API_KEY set (in .env, which is gitignored) it uses the Steam Web
// API for the full stats. Without a key it falls back to the public profile
// XML, which only has the profile card and recent games. If Steam can't be
// reached, the existing snapshot is kept so builds never break.

import { writeFile } from 'node:fs/promises';

const VANITY = 'victorvento';
const OUT = new URL('../public/assets/steam.json', import.meta.url);
const KEY = process.env.STEAM_API_KEY?.trim();

const PERSONA = ['offline', 'online', 'busy', 'away', 'snooze', 'looking to trade', 'looking to play'];

const hours = (minutes) => Math.round((minutes / 60) * 10) / 10;
const capsule = (appid) => `https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/${appid}/capsule_184x69.jpg`;
const icon = (appid, hash) =>
  hash ? `https://media.steampowered.com/steamcommunity/public/images/apps/${appid}/${hash}.jpg` : null;

async function get(url) {
  const res = await fetch(url, { signal: AbortSignal.timeout(15000) });
  if (!res.ok) throw new Error(`${res.status} ${res.statusText} for ${url.replace(KEY ?? '\0', '***')}`);
  return res;
}

async function api(path, params) {
  const qs = new URLSearchParams({ key: KEY, format: 'json', ...params });
  return (await get(`https://api.steampowered.com/${path}/?${qs}`)).json();
}

// Newer apps keep art at hashed paths, so ask the store for the real capsule URL.
async function storeCapsule(appid) {
  try {
    const res = await get(`https://store.steampowered.com/api/appdetails?appids=${appid}&filters=basic`);
    const data = (await res.json())[appid]?.data;
    return data?.capsule_image ?? data?.header_image ?? capsule(appid);
  } catch {
    return capsule(appid);
  }
}

async function fromApi() {
  const { response: vanity } = await api('ISteamUser/ResolveVanityURL/v1', { vanityurl: VANITY });
  if (vanity.success !== 1) throw new Error(`Could not resolve Steam vanity URL "${VANITY}"`);
  const steamid = vanity.steamid;

  const [summaries, owned, recent, level, badges] = await Promise.all([
    api('ISteamUser/GetPlayerSummaries/v2', { steamids: steamid }),
    api('IPlayerService/GetOwnedGames/v1', { steamid, include_appinfo: 1, include_played_free_games: 1 }),
    api('IPlayerService/GetRecentlyPlayedGames/v1', { steamid, count: 5 }),
    api('IPlayerService/GetSteamLevel/v1', { steamid }),
    api('IPlayerService/GetBadges/v1', { steamid }),
  ]);

  const p = summaries.response.players[0];
  const games = owned.response.games ?? [];
  const totalMinutes = games.reduce((sum, g) => sum + (g.playtime_forever ?? 0), 0);
  // GetOwnedGames often omits playtime_2weeks; the recently-played list is reliable.
  const recentGames = recent.response.games ?? [];
  const twoWeekMinutes = recentGames.reduce((sum, g) => sum + (g.playtime_2weeks ?? 0), 0);

  return {
    source: 'api',
    profile: {
      name: p.personaname,
      avatar: p.avatarfull,
      url: p.profileurl,
      status: PERSONA[p.personastate] ?? 'offline',
      inGame: p.gameextrainfo ?? null,
      memberSince: p.timecreated ? new Date(p.timecreated * 1000).toISOString().slice(0, 10) : null,
      country: p.loccountrycode ? new Intl.DisplayNames(['en'], { type: 'region' }).of(p.loccountrycode) : null,
      level: level.response.player_level ?? null,
    },
    library: {
      gameCount: owned.response.game_count ?? games.length,
      totalHours: hours(totalMinutes),
      hours2Weeks: hours(twoWeekMinutes),
    },
    badges: {
      count: badges.response.badges?.length ?? 0,
      xp: badges.response.player_xp ?? 0,
    },
    topGames: await Promise.all(
      [...games]
        .sort((a, b) => b.playtime_forever - a.playtime_forever)
        .filter((g) => g.playtime_forever > 0)
        .slice(0, 5)
        .map(async (g) => ({
          appid: g.appid,
          name: g.name,
          hours: hours(g.playtime_forever),
          image: await storeCapsule(g.appid),
        })),
    ),
    recent: recentGames.map((g) => ({
      appid: g.appid,
      name: g.name,
      hours2Weeks: hours(g.playtime_2weeks ?? 0),
      hours: hours(g.playtime_forever ?? 0),
      icon: icon(g.appid, g.img_icon_url),
    })),
  };
}

async function fromXml() {
  const xml = await (await get(`https://steamcommunity.com/id/${VANITY}/?xml=1`)).text();
  const tag = (name, src = xml) =>
    src.match(new RegExp(`<${name}>(?:<!\\[CDATA\\[)?([\\s\\S]*?)(?:\\]\\]>)?</${name}>`))?.[1]?.trim() ?? null;
  const since = tag('memberSince');

  return {
    source: 'xml',
    profile: {
      name: tag('steamID'),
      avatar: tag('avatarFull'),
      url: `https://steamcommunity.com/id/${VANITY}/`,
      status: tag('onlineState') === 'in-game' ? 'online' : tag('onlineState') ?? 'offline',
      inGame: tag('gameName', tag('inGameInfo') ?? '') ?? null,
      memberSince: since ? new Date(`${since} UTC`).toISOString().slice(0, 10) : null,
      country: tag('location'),
      level: null,
    },
    library: null,
    badges: null,
    topGames: [],
    recent: [...xml.matchAll(/<mostPlayedGame>([\s\S]*?)<\/mostPlayedGame>/g)].map(([, g]) => ({
      appid: Number(tag('statsName', g)) || null,
      name: tag('gameName', g),
      hours2Weeks: Number(tag('hoursPlayed', g)) || 0,
      hours: Number(tag('hoursOnRecord', g)?.replace(/,/g, '')) || 0,
      icon: tag('gameIcon', g),
    })),
  };
}

try {
  const data = KEY ? await fromApi() : await fromXml();
  if (!KEY) console.warn('steam: no STEAM_API_KEY set, using public profile only (no library totals / top games).');
  await writeFile(OUT, JSON.stringify({ fetchedAt: new Date().toISOString(), ...data }, null, 2) + '\n');
  console.log(`steam: wrote ${data.source} snapshot for ${data.profile.name}`);
} catch (err) {
  console.warn(`steam: fetch failed, keeping the previous snapshot. ${err.message}`);
}
