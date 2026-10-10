// One-off helper to mint a Spotify refresh token with the scopes the site needs,
// and write it to .env as SPOTIFY_REFRESH_TOKEN. The token is never printed.
//
// 1. In the Spotify developer dashboard, add this Redirect URI to your app:
//      http://127.0.0.1:8888/callback
// 2. Run: node --env-file=.env scripts/spotify-auth.mjs
// 3. Open the printed URL, approve, and the script updates .env.
import { createServer } from 'node:http';
import { readFileSync, writeFileSync } from 'node:fs';

const SCOPES = ['user-read-currently-playing', 'user-top-read', 'user-read-recently-played'];
const REDIRECT_URI = 'http://127.0.0.1:8888/callback';
const ENV_FILE = new URL('../.env', import.meta.url);

const { SPOTIFY_CLIENT_ID: clientId, SPOTIFY_CLIENT_SECRET: clientSecret } = process.env;
if (!clientId || !clientSecret) {
  console.error('SPOTIFY_CLIENT_ID and SPOTIFY_CLIENT_SECRET must be set in .env');
  process.exit(1);
}

const authorizeUrl =
  'https://accounts.spotify.com/authorize?' +
  new URLSearchParams({ client_id: clientId, response_type: 'code', redirect_uri: REDIRECT_URI, scope: SCOPES.join(' ') });

const server = createServer(async (req, res) => {
  const url = new URL(req.url, REDIRECT_URI);
  if (url.pathname !== '/callback') return res.writeHead(404).end();

  const code = url.searchParams.get('code');
  if (!code) {
    res.end(`Authorization failed: ${url.searchParams.get('error') ?? 'no code'}`);
    return server.close();
  }

  const response = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      Authorization: `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString('base64')}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({ grant_type: 'authorization_code', code, redirect_uri: REDIRECT_URI }),
  });
  const token = await response.json();

  if (!token.refresh_token) {
    console.error('Token exchange failed:', token.error_description ?? token.error);
    res.end('Token exchange failed, see terminal.');
    return server.close();
  }

  const env = readFileSync(ENV_FILE, 'utf8');
  const line = `SPOTIFY_REFRESH_TOKEN=${token.refresh_token}`;
  writeFileSync(
    ENV_FILE,
    /^SPOTIFY_REFRESH_TOKEN=.*$/m.test(env) ? env.replace(/^SPOTIFY_REFRESH_TOKEN=.*$/m, line) : `${env.trimEnd()}\n${line}\n`,
  );

  console.log(`Updated SPOTIFY_REFRESH_TOKEN in .env (scopes: ${token.scope})`);
  res.end('Done! You can close this tab.');
  server.close();
});

server.listen(8888, '127.0.0.1', () => {
  console.log('Open this URL to authorize:\n');
  console.log(authorizeUrl);
});
