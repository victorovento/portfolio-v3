// Snapshots PlayStation trophy stats into public/assets/psn.json.
//
//   npm run psn          (also runs automatically before `npm run build`)
//
// PlayStation has no public API, so this signs in with an NPSSO token via the
// unofficial psn-api library. PSN_NPSSO lives in .env (gitignored). The token
// is a login session for your account: never commit it or share it.
// It expires after ~2 months; get a fresh one (while logged in to
// playstation.com) from https://ca.account.sony.com/api/v1/ssocookie
//
// If the token is missing or expired, the existing snapshot is kept so
// builds never break.

import { writeFile } from 'node:fs/promises';
import {
  exchangeAccessCodeForAuthTokens,
  exchangeNpssoForAccessCode,
  getProfileFromUserName,
  getTitleTrophies,
  getUserTitles,
  getUserTrophiesEarnedForTitle,
  getUserTrophyProfileSummary,
} from 'psn-api';

const ONLINE_ID = 'victorvento';
const OUT = new URL('../public/assets/psn.json', import.meta.url);
const NPSSO = process.env.PSN_NPSSO?.trim();

// How many recent titles to scan for latest / rarest trophies.
const SCAN_TITLES = 10;
const GRADES = ['bronze', 'bronze', 'bronze', 'silver', 'silver', 'silver', 'gold', 'gold', 'gold', 'platinum'];

async function fetchPsn() {
  const auth = await exchangeAccessCodeForAuthTokens(await exchangeNpssoForAccessCode(NPSSO));

  const { profile } = await getProfileFromUserName(auth, ONLINE_ID);
  const accountId = profile.accountId;

  const [summary, titles] = await Promise.all([
    getUserTrophyProfileSummary(auth, accountId),
    getUserTitles(auth, accountId, { limit: 50 }),
  ]);

  const visible = titles.trophyTitles.filter((t) => !t.hiddenFlag);

  // Earned status + trophy names/icons for the most recent titles, merged by id.
  const earned = (
    await Promise.all(
      visible.slice(0, SCAN_TITLES).map(async (t) => {
        const opts = { npServiceName: t.npServiceName };
        const [mine, info] = await Promise.all([
          getUserTrophiesEarnedForTitle(auth, accountId, t.npCommunicationId, 'all', opts),
          getTitleTrophies(auth, t.npCommunicationId, 'all', opts),
        ]);
        const byId = new Map(info.trophies.map((x) => [x.trophyId, x]));
        return mine.trophies
          .filter((x) => x.earned)
          .map((x) => {
            const meta = byId.get(x.trophyId) ?? {};
            return {
              name: meta.trophyName ?? 'Hidden trophy',
              detail: meta.trophyDetail ?? '',
              icon: meta.trophyIconUrl ?? null,
              type: x.trophyType,
              game: t.trophyTitleName,
              earnedAt: x.earnedDateTime ?? null,
              rate: x.trophyEarnedRate ? Number(x.trophyEarnedRate) : null,
            };
          });
      }),
    )
  ).flat();

  const counts = summary.earnedTrophies;
  const avatar = [...profile.avatarUrls].sort((a, b) => parseInt(b.size) - parseInt(a.size))[0]?.avatarUrl;

  return {
    profile: {
      onlineId: profile.onlineId,
      avatar: avatar ?? null,
      plus: profile.plus === 1,
      aboutMe: profile.aboutMe || null,
      url: `https://psnprofiles.com/${ONLINE_ID}`,
    },
    trophies: {
      level: Number(summary.trophyLevel),
      progress: summary.progress,
      tier: summary.tier,
      grade: GRADES[summary.tier - 1] ?? 'bronze',
      counts,
      total: counts.platinum + counts.gold + counts.silver + counts.bronze,
    },
    games: {
      count: titles.totalItemCount,
      platinumed: visible.filter((t) => t.earnedTrophies.platinum > 0).length,
      completed: visible.filter((t) => t.progress === 100).length,
    },
    recent: visible.slice(0, 5).map((t) => ({
      name: t.trophyTitleName,
      icon: t.trophyTitleIconUrl,
      platform: t.trophyTitlePlatform,
      progress: t.progress,
      earned: t.earnedTrophies,
      defined: t.definedTrophies,
      lastPlayed: t.lastUpdatedDateTime,
    })),
    latestTrophies: [...earned]
      .filter((x) => x.earnedAt)
      .sort((a, b) => Date.parse(b.earnedAt) - Date.parse(a.earnedAt))
      .slice(0, 4),
    rarestTrophies: [...earned]
      .filter((x) => x.rate !== null)
      .sort((a, b) => a.rate - b.rate)
      .slice(0, 4),
  };
}

if (!NPSSO) {
  console.warn('psn: no PSN_NPSSO set, keeping the previous snapshot. See scripts/fetch-psn.mjs for how to get one.');
} else {
  try {
    const data = await fetchPsn();
    await writeFile(OUT, JSON.stringify({ fetchedAt: new Date().toISOString(), ...data }, null, 2) + '\n');
    console.log(`psn: wrote snapshot for ${data.profile.onlineId} (level ${data.trophies.level})`);
  } catch (err) {
    const hint = /npsso|access code|401|invalid_grant/i.test(err.message)
      ? ' Your PSN_NPSSO has probably expired; grab a new one (see scripts/fetch-psn.mjs).'
      : '';
    console.warn(`psn: fetch failed, keeping the previous snapshot. ${err.message}${hint}`);
  }
}
