// One-time Spotify login. Saves SPOTIFY_REFRESH_TOKEN to .env.
//
//   npm run spotify:auth
//
// Before running, create an app at https://developer.spotify.com/dashboard:
//   - Redirect URI: http://127.0.0.1:8888/callback   (exactly this)
//   - API: Web API
//   - Settings → User Management: add your own Spotify account
// Then put SPOTIFY_CLIENT_ID and SPOTIFY_CLIENT_SECRET in .env.

import { createServer } from 'node:http';
import { randomBytes } from 'node:crypto';
import { readFile, writeFile } from 'node:fs/promises';
import { exec } from 'node:child_process';

const ENV = new URL('../.env', import.meta.url);
const PORT = 8888;
const REDIRECT = `http://127.0.0.1:${PORT}/callback`;
const SCOPES = ['user-top-read', 'user-read-recently-played'];

const id = process.env.SPOTIFY_CLIENT_ID?.trim();
const secret = process.env.SPOTIFY_CLIENT_SECRET?.trim();
if (!id || !secret) {
  console.error('spotify: set SPOTIFY_CLIENT_ID and SPOTIFY_CLIENT_SECRET in .env first (see the top of this file).');
  process.exit(1);
}

const state = randomBytes(16).toString('hex');
const authorize =
  'https://accounts.spotify.com/authorize?' +
  new URLSearchParams({ client_id: id, response_type: 'code', redirect_uri: REDIRECT, scope: SCOPES.join(' '), state });

async function saveToEnv(key, value) {
  let text = '';
  try {
    text = await readFile(ENV, 'utf8');
  } catch {}
  const line = `${key}=${value}`;
  const re = new RegExp(`^${key}=.*$`, 'm');
  text = re.test(text) ? text.replace(re, line) : `${text.replace(/\n?$/, '\n')}${line}\n`;
  await writeFile(ENV, text, { mode: 0o600 });
}

const server = createServer(async (req, res) => {
  const url = new URL(req.url, REDIRECT);
  if (url.pathname !== '/callback') return res.writeHead(404).end();

  const done = (msg) => {
    res.writeHead(200, { 'content-type': 'text/html' }).end(`<body style="font:16px monospace;padding:2rem">${msg}</body>`);
    server.close();
  };

  if (url.searchParams.get('state') !== state) return done('State mismatch, please run npm run spotify:auth again.');
  const code = url.searchParams.get('code');
  if (!code) return done(`Spotify said: ${url.searchParams.get('error') ?? 'no code returned'}`);

  const tokenRes = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      authorization: 'Basic ' + Buffer.from(`${id}:${secret}`).toString('base64'),
      'content-type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({ grant_type: 'authorization_code', code, redirect_uri: REDIRECT }),
  });
  const token = await tokenRes.json();
  if (!token.refresh_token) {
    console.error('spotify: token exchange failed:', token.error_description ?? token.error ?? tokenRes.status);
    return done('Token exchange failed, check the terminal.');
  }

  await saveToEnv('SPOTIFY_REFRESH_TOKEN', token.refresh_token);
  console.log('spotify: saved SPOTIFY_REFRESH_TOKEN to .env. Now run: npm run spotify');
  done('All set! SPOTIFY_REFRESH_TOKEN was saved to .env. You can close this tab.');
});

server.listen(PORT, '127.0.0.1', () => {
  console.log(`spotify: opening the Spotify login page. If it doesn't open, visit:\n${authorize}\n`);
  exec(`${process.platform === 'darwin' ? 'open' : process.platform === 'win32' ? 'start ""' : 'xdg-open'} "${authorize}"`);
});
