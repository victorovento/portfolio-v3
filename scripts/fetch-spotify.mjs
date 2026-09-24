// Snapshots Spotify listening stats into public/assets/spotify.json.
//
//   npm run spotify      (also runs automatically before `npm run build`)
//
// Needs SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET and SPOTIFY_REFRESH_TOKEN in
// .env (gitignored). Get the refresh token once with `npm run spotify:auth`.
// If anything is missing or Spotify can't be reached, the existing snapshot is
// kept so builds never break.

import { readFile, writeFile } from 'node:fs/promises';

const OUT = new URL('../public/assets/spotify.json', import.meta.url);
const ENV = new URL('../.env', import.meta.url);
const id = process.env.SPOTIFY_CLIENT_ID?.trim();
const secret = process.env.SPOTIFY_CLIENT_SECRET?.trim();
const refresh = process.env.SPOTIFY_REFRESH_TOKEN?.trim();

// Spotify's names for its three top-items windows.
const RANGES = { short_term: '4 weeks', medium_term: '6 months', long_term: '1 year' };

async function accessToken() {
  const res = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      authorization: 'Basic ' + Buffer.from(`${id}:${secret}`).toString('base64'),
      'content-type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({ grant_type: 'refresh_token', refresh_token: refresh }),
    signal: AbortSignal.timeout(15000),
  });
  const data = await res.json();
  if (!data.access_token) throw new Error(`token refresh failed: ${data.error_description ?? data.error ?? res.status}`);
  // Spotify may rotate the refresh token; keep .env up to date if it does.
  if (data.refresh_token && data.refresh_token !== refresh) {
    const text = await readFile(ENV, 'utf8');
    await writeFile(ENV, text.replace(/^SPOTIFY_REFRESH_TOKEN=.*$/m, `SPOTIFY_REFRESH_TOKEN=${data.refresh_token}`), { mode: 0o600 });
  }
  return data.access_token;
}

async function fetchSpotify() {
  const token = await accessToken();
  const api = async (path) => {
    const res = await fetch(`https://api.spotify.com/v1/${path}`, {
      headers: { authorization: `Bearer ${token}` },
      signal: AbortSignal.timeout(15000),
    });
    if (!res.ok) throw new Error(`${res.status} ${res.statusText} for /${path}`);
    return res.json();
  };
  const image = (images) => images?.[0]?.url ?? null;
  const smallest = (images) => images?.at(-1)?.url ?? null;

  const [me, recent, playlists, ...tops] = await Promise.all([
    api('me'),
    api('me/player/recently-played?limit=6'),
    api('me/playlists?limit=50'),
    ...Object.keys(RANGES).flatMap((r) => [api(`me/top/artists?time_range=${r}&limit=5`), api(`me/top/tracks?time_range=${r}&limit=5`)]),
  ]);

  const top = {};
  Object.keys(RANGES).forEach((range, i) => {
    top[range] = {
      label: RANGES[range],
      artists: tops[i * 2].items.map((a) => ({
        name: a.name,
        image: smallest(a.images.filter((x) => x.width >= 64)) ?? image(a.images),
        genres: a.genres?.slice(0, 2) ?? [],
        url: a.external_urls.spotify,
      })),
      tracks: tops[i * 2 + 1].items.map((t) => ({
        name: t.name,
        artist: t.artists.map((a) => a.name).join(', '),
        image: smallest(t.album.images.filter((x) => x.width >= 64)) ?? image(t.album.images),
        url: t.external_urls.spotify,
      })),
    };
  });

  return {
    profile: {
      name: me.display_name ?? me.id,
      image: image(me.images),
      followers: me.followers?.total ?? null,
      url: me.external_urls.spotify,
    },
    top,
    recent: recent.items.map((i) => ({
      name: i.track.name,
      artist: i.track.artists.map((a) => a.name).join(', '),
      image: smallest(i.track.album.images.filter((x) => x.width >= 64)) ?? image(i.track.album.images),
      url: i.track.external_urls.spotify,
      playedAt: i.played_at,
    })),
    // Only public playlists you made yourself; private ones never leave Spotify.
    playlists: playlists.items
      .filter((p) => p && p.public && p.owner?.id === me.id)
      .slice(0, 6)
      .map((p) => ({ name: p.name, image: image(p.images), tracks: p.tracks?.total ?? 0, url: p.external_urls.spotify })),
  };
}

if (!id || !secret || !refresh) {
  console.warn('spotify: SPOTIFY_CLIENT_ID / _SECRET / _REFRESH_TOKEN not all set, keeping the previous snapshot. See scripts/spotify-auth.mjs.');
} else {
  try {
    const data = await fetchSpotify();
    await writeFile(OUT, JSON.stringify({ fetchedAt: new Date().toISOString(), ...data }, null, 2) + '\n');
    console.log(`spotify: wrote snapshot for ${data.profile.name}`);
  } catch (err) {
    console.warn(`spotify: fetch failed, keeping the previous snapshot. ${err.message}`);
  }
}
