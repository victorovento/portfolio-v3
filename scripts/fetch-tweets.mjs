// Snapshots your latest posts on X into public/assets/tweets.json.
//
//   npm run tweets         (also runs automatically before `npm run build`)
//   npm run tweets -- --force   (ignore the cache below)
//
// Needs X_BEARER_TOKEN in .env (gitignored): developer.x.com → your app →
// Keys and tokens → Bearer Token. X's free tier allows very few reads per
// month, so this skips the API when the snapshot is younger than
// X_MIN_HOURS (default 12). On any failure the previous snapshot is kept.

import { readFile, writeFile } from 'node:fs/promises';

const USERNAME = 'victorovento';
const COUNT = 5; // X requires 5-100 per request
const OUT = new URL('../public/assets/tweets.json', import.meta.url);
const TOKEN = process.env.X_BEARER_TOKEN?.trim();
const MIN_HOURS = Number(process.env.X_MIN_HOURS ?? 12);
const FORCE = process.argv.includes('--force');

async function api(path) {
  const res = await fetch(`https://api.x.com/2/${path}`, {
    headers: { authorization: `Bearer ${TOKEN}` },
    signal: AbortSignal.timeout(15000),
  });
  const body = await res.json().catch(() => ({}));
  if (!res.ok) {
    const detail = body.detail ?? body.title ?? body.errors?.[0]?.message ?? res.statusText;
    const reset = res.headers.get('x-rate-limit-reset');
    const when = reset ? ` (resets ${new Date(Number(reset) * 1000).toISOString()})` : '';
    throw new Error(`${res.status} ${detail}${when}`);
  }
  return body;
}

const decode = (s) => s.replaceAll('&lt;', '<').replaceAll('&gt;', '>').replaceAll('&amp;', '&');

// Split tweet text into safe segments so the page never renders raw HTML.
function segments(tweet, mediaUrls) {
  const urls = new Map((tweet.entities?.urls ?? []).map((u) => [u.url, u]));
  const parts = [];
  const re = /(https:\/\/t\.co\/\w+)|(@\w{1,15})|(#\w+)/g;
  const text = decode(tweet.text);
  let last = 0;
  for (const m of text.matchAll(re)) {
    if (m.index > last) parts.push({ type: 'text', text: text.slice(last, m.index) });
    const [whole, url, mention, tag] = m;
    if (url) {
      const u = urls.get(url);
      // Media links are shown as images instead.
      if (!mediaUrls.has(url) && !u?.media_key) {
        parts.push({ type: 'link', text: u?.display_url ?? url, href: u?.expanded_url ?? url });
      }
    } else if (mention) {
      parts.push({ type: 'link', text: mention, href: `https://x.com/${mention.slice(1)}` });
    } else if (tag) {
      parts.push({ type: 'link', text: tag, href: `https://x.com/hashtag/${tag.slice(1)}` });
    }
    last = m.index + whole.length;
  }
  if (last < text.length) parts.push({ type: 'text', text: text.slice(last) });
  // Drop the trailing space a removed media link leaves behind.
  const end = parts.at(-1);
  if (end?.type === 'text') end.text = end.text.trimEnd();
  return parts.filter((p) => p.text);
}

async function fetchTweets(previous) {
  // Reuse the user id from the last snapshot to save a request.
  let user = previous?.user;
  const userFields = 'user.fields=name,username,profile_image_url,public_metrics,verified';
  if (!user?.id) {
    const { data } = await api(`users/by/username/${USERNAME}?${userFields}`);
    user = {
      id: data.id,
      name: data.name,
      username: data.username,
      avatar: data.profile_image_url?.replace('_normal', '_200x200') ?? null,
      followers: data.public_metrics?.followers_count ?? null,
    };
  }

  const params = new URLSearchParams({
    max_results: String(COUNT),
    exclude: 'replies,retweets',
    'tweet.fields': 'created_at,public_metrics,entities,attachments',
    expansions: 'attachments.media_keys',
    'media.fields': 'type,url,preview_image_url,width,height',
  });
  const res = await api(`users/${user.id}/tweets?${params}`);
  const media = new Map((res.includes?.media ?? []).map((m) => [m.media_key, m]));

  return {
    user,
    tweets: (res.data ?? []).map((t) => {
      const images = (t.attachments?.media_keys ?? [])
        .map((k) => media.get(k))
        .filter(Boolean)
        .map((m) => ({ url: m.url ?? m.preview_image_url, video: m.type !== 'photo' }))
        .filter((m) => m.url);
      const mediaUrls = new Set((t.entities?.urls ?? []).filter((u) => u.media_key).map((u) => u.url));
      return {
        id: t.id,
        url: `https://x.com/${user.username}/status/${t.id}`,
        createdAt: t.created_at,
        parts: segments(t, mediaUrls),
        images,
        likes: t.public_metrics?.like_count ?? 0,
        reposts: t.public_metrics?.retweet_count ?? 0,
        replies: t.public_metrics?.reply_count ?? 0,
      };
    }),
  };
}

let previous = null;
try {
  previous = JSON.parse(await readFile(OUT, 'utf8'));
} catch {}

if (!TOKEN) {
  console.warn('tweets: no X_BEARER_TOKEN set, keeping the previous snapshot.');
} else if (!FORCE && previous?.fetchedAt && Date.now() - Date.parse(previous.fetchedAt) < MIN_HOURS * 36e5) {
  console.log(`tweets: snapshot is under ${MIN_HOURS}h old, skipping the API to save reads (use -- --force).`);
} else {
  try {
    const data = await fetchTweets(previous);
    await writeFile(OUT, JSON.stringify({ fetchedAt: new Date().toISOString(), ...data }, null, 2) + '\n');
    console.log(`tweets: wrote ${data.tweets.length} posts for @${data.user.username}`);
  } catch (err) {
    const hint = /^40[13]/.test(err.message)
      ? ' Check the token, and that your X plan allows reading posts.'
      : /^429/.test(err.message)
        ? ' Monthly or rate limit reached.'
        : '';
    console.warn(`tweets: fetch failed, keeping the previous snapshot. ${err.message}${hint}`);
  }
}
