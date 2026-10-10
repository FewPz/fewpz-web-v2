export type CurrentPlayback = {
  trackId: string;
  trackName: string;
  artists: string[];
  albumName: string;
  durationMs: number;
  progressMs: number;
};

const client_id = process.env.SPOTIFY_CLIENT_ID;
const client_secret = process.env.SPOTIFY_CLIENT_SECRET;
const refresh_token = process.env.SPOTIFY_REFRESH_TOKEN;

const basic = Buffer.from(`${client_id}:${client_secret}`).toString('base64');
const NOW_PLAYING_ENDPOINT = 'https://api.spotify.com/v1/me/player/currently-playing';
const TOKEN_ENDPOINT = 'https://accounts.spotify.com/api/token';

// Access tokens last an hour; reuse one instead of refreshing on every request.
let tokenCache: { accessToken: string; expiresAt: number } | null = null;

const getAccessToken = async (): Promise<{ access_token: string }> => {
  if (tokenCache && Date.now() < tokenCache.expiresAt) {
    return { access_token: tokenCache.accessToken };
  }

  const response = await fetch(TOKEN_ENDPOINT, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${basic}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      grant_type: 'refresh_token',
      refresh_token: refresh_token!,
    }),
  });

  const token = await response.json();
  if (token.access_token) {
    // Refresh a minute early so a token never expires mid-request.
    tokenCache = { accessToken: token.access_token, expiresAt: Date.now() + (token.expires_in - 60) * 1000 };
  }
  return token;
};

export const getNowPlaying = async () => {
  const { access_token } = await getAccessToken();

  return fetch(NOW_PLAYING_ENDPOINT, {
    headers: {
      Authorization: `Bearer ${access_token}`,
    },
  });
};

const TOP_ITEMS_ENDPOINT = 'https://api.spotify.com/v1/me/top';

/** Most-played tracks or artists. Requires the `user-top-read` scope on the refresh token. */
export const getTopItems = async (
  type: 'tracks' | 'artists',
  limit: number,
  timeRange: 'short_term' | 'medium_term' | 'long_term' = 'short_term',
) => {
  const { access_token } = await getAccessToken();

  return fetch(`${TOP_ITEMS_ENDPOINT}/${type}?${new URLSearchParams({ limit: String(limit), time_range: timeRange })}`, {
    headers: {
      Authorization: `Bearer ${access_token}`,
    },
  });
};

const RECENTLY_PLAYED_ENDPOINT = 'https://api.spotify.com/v1/me/player/recently-played';

/** Last plays, newest first (Spotify caps this at 50). Requires the `user-read-recently-played` scope. */
export const getRecentlyPlayed = async (limit = 50) => {
  const { access_token } = await getAccessToken();

  return fetch(`${RECENTLY_PLAYED_ENDPOINT}?${new URLSearchParams({ limit: String(limit) })}`, {
    headers: {
      Authorization: `Bearer ${access_token}`,
    },
  });
};
