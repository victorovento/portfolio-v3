import { Injectable, signal } from '@angular/core';
import { lastfm } from '../config';

export interface Track {
  name: string;
  artist: string;
  url: string;
}

const API = 'https://ws.audioscrobbler.com/2.0/';
const POLL_MS = 60_000;

/** Live "now playing" from Last.fm, for the sidebar status box. */
@Injectable({ providedIn: 'root' })
export class LastfmService {
  readonly enabled = !!(lastfm.username && lastfm.apiKey);
  readonly nowPlaying = signal<Track | null>(null);

  private started = false;

  /** Starts polling; safe to call more than once. */
  start() {
    if (!this.enabled || this.started) return;
    this.started = true;
    this.load();
    setInterval(() => {
      if (!document.hidden) this.load();
    }, POLL_MS);
    document.addEventListener('visibilitychange', () => {
      if (!document.hidden) this.load();
    });
  }

  private async load() {
    try {
      const qs = new URLSearchParams({
        method: 'user.getrecenttracks',
        user: lastfm.username,
        api_key: lastfm.apiKey,
        format: 'json',
        limit: '1',
      });
      const data = await (await fetch(`${API}?${qs}`)).json();
      // Last.fm returns a bare object instead of an array when there is one item.
      const tracks = [data.recenttracks?.track ?? []].flat();
      const t = tracks.find((x: any) => x['@attr']?.nowplaying === 'true');
      this.nowPlaying.set(t ? { name: t.name, artist: t.artist?.['#text'] ?? '', url: t.url } : null);
    } catch {
      // Network hiccup: keep whatever was showing.
    }
  }
}
