// Snapshots public GitHub activity into public/assets/github.json.
//
//   npm run github       (also runs automatically before `npm run build`)
//
// No token needed: the contribution calendar comes from your public profile
// page and repos from the public REST API. On failure the previous snapshot
// is kept so builds never break.

import { writeFile } from 'node:fs/promises';

const USER = 'victorovento';
const OUT = new URL('../public/assets/github.json', import.meta.url);

async function get(url, type = 'json') {
  const res = await fetch(url, {
    headers: { 'user-agent': 'victorvento.net build', accept: type === 'json' ? 'application/vnd.github+json' : 'text/html' },
    signal: AbortSignal.timeout(15000),
  });
  if (!res.ok) throw new Error(`${res.status} ${res.statusText} for ${url}`);
  return type === 'json' ? res.json() : res.text();
}

async function calendar() {
  const html = await get(`https://github.com/users/${USER}/contributions`, 'text');
  // Each day is a <td> with an id, a date and an intensity level 0-4; the
  // exact count lives in a matching <tool-tip for="that id">.
  const counts = new Map();
  for (const [, id, text] of html.matchAll(/<tool-tip[^>]*\bfor="([^"]+)"[^>]*>([^<]*)<\/tool-tip>/g)) {
    const n = text.match(/^(\d+) contributions?/);
    counts.set(id, n ? Number(n[1]) : 0);
  }
  const days = [];
  for (const [tag] of html.matchAll(/<td[^>]*\bdata-date="[^"]+"[^>]*>/g)) {
    const date = tag.match(/data-date="([^"]+)"/)[1];
    const level = Number(tag.match(/data-level="(\d)"/)?.[1] ?? 0);
    const id = tag.match(/\bid="([^"]+)"/)?.[1];
    days.push({ date, level, count: counts.get(id) ?? 0 });
  }
  if (!days.length) throw new Error('contribution calendar not found (GitHub changed its markup?)');
  return days.sort((a, b) => a.date.localeCompare(b.date));
}

async function fetchGithub() {
  const [user, repos, days] = await Promise.all([
    get(`https://api.github.com/users/${USER}`),
    get(`https://api.github.com/users/${USER}/repos?sort=pushed&per_page=10`),
    calendar(),
  ]);
  return {
    user: {
      login: user.login,
      name: user.name,
      avatar: user.avatar_url,
      url: user.html_url,
      repos: user.public_repos,
      followers: user.followers,
    },
    totalLastYear: days.reduce((sum, d) => sum + d.count, 0),
    days,
    recentRepos: repos
      .filter((r) => !r.fork && r.name !== USER) // skip forks and the profile README repo
      .slice(0, 3)
      .map((r) => ({ name: r.name, url: r.html_url, language: r.language, description: r.description, pushedAt: r.pushed_at })),
  };
}

try {
  const data = await fetchGithub();
  await writeFile(OUT, JSON.stringify({ fetchedAt: new Date().toISOString(), ...data }) + '\n');
  console.log(`github: wrote snapshot for ${data.user.login} (${data.totalLastYear} contributions in the last year)`);
} catch (err) {
  console.warn(`github: fetch failed, keeping the previous snapshot. ${err.message}`);
}
