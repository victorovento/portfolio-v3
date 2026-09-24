import { Component, computed, signal } from '@angular/core';

type Range = 'short_term' | 'medium_term' | 'long_term';

interface Item {
  name: string;
  image: string | null;
  url: string;
}

// Shape of public/assets/spotify.json, written by scripts/fetch-spotify.mjs.
interface SpotifyData {
  fetchedAt: string;
  profile: { name: string; image: string | null; followers: number | null; url: string };
  top: Record<Range, { label: string; artists: (Item & { genres: string[] })[]; tracks: (Item & { artist: string })[] }>;
  recent: (Item & { artist: string; playedAt: string })[];
  playlists: (Item & { tracks: number })[];
}

@Component({
  selector: 'app-spotify-stats',
  template: `
    @if (data(); as d) {
      <article class="box">
        <div class="box-title">spotify.exe <span class="controls"><span></span><span></span><span></span></span></div>
        <div class="box-body">
          <div class="profile">
            @if (d.profile.image) {
              <a [href]="d.profile.url" target="_blank" rel="noopener" class="avatar">
                <img [src]="d.profile.image" [alt]="d.profile.name + ' on Spotify'" width="72" height="72" (error)="hideBroken($event)" />
              </a>
            }
            <div class="who">
              <span class="label">● spotify profile</span>
              <a [href]="d.profile.url" target="_blank" rel="noopener" class="name">{{ d.profile.name }}</a>
              <span class="meta">
                @if (d.profile.followers !== null) { {{ d.profile.followers }} followers }
                @if (d.playlists.length) { · {{ d.playlists.length }} public playlists }
              </span>
            </div>
          </div>

          <div class="ranges" role="tablist" aria-label="Time range">
            @for (r of ranges; track r) {
              <button
                type="button"
                role="tab"
                [attr.aria-selected]="range() === r"
                [class.active]="range() === r"
                (click)="range.set(r)"
              >{{ d.top[r].label }}</button>
            }
          </div>

          <div class="cols">
            <section>
              <h3>top artists</h3>
              <ol class="top">
                @for (a of top()?.artists; track a.url; let i = $index) {
                  <li>
                    <span class="rank">{{ i + 1 }}</span>
                    @if (a.image) {
                      <img class="round" [src]="a.image" alt="" width="40" height="40" loading="lazy" (error)="hideBroken($event)" />
                    }
                    <div class="text">
                      <a [href]="a.url" target="_blank" rel="noopener">{{ a.name }}</a>
                      @if (a.genres.length) {
                        <span class="mini">{{ a.genres.join(' · ') }}</span>
                      }
                    </div>
                  </li>
                } @empty {
                  <li class="meta">not enough listening in this range yet.</li>
                }
              </ol>
            </section>
            <section>
              <h3>top tracks</h3>
              <ol class="top">
                @for (t of top()?.tracks; track t.url; let i = $index) {
                  <li>
                    <span class="rank">{{ i + 1 }}</span>
                    @if (t.image) {
                      <img [src]="t.image" alt="" width="40" height="40" loading="lazy" (error)="hideBroken($event)" />
                    }
                    <div class="text">
                      <a [href]="t.url" target="_blank" rel="noopener">{{ t.name }}</a>
                      <span class="mini">{{ t.artist }}</span>
                    </div>
                  </li>
                } @empty {
                  <li class="meta">not enough listening in this range yet.</li>
                }
              </ol>
            </section>
          </div>

          @if (d.recent.length) {
            <h3>recently played</h3>
            <ul class="recent">
              @for (t of d.recent; track $index) {
                <li>
                  @if (t.image) {
                    <img [src]="t.image" alt="" width="32" height="32" loading="lazy" (error)="hideBroken($event)" />
                  }
                  <div class="text">
                    <a [href]="t.url" target="_blank" rel="noopener">{{ t.name }}</a>
                    <span class="mini">{{ t.artist }}</span>
                  </div>
                  <span class="mini when">{{ t.playedAt.slice(0, 10) }}</span>
                </li>
              }
            </ul>
          }

          @if (d.playlists.length) {
            <h3>playlists</h3>
            <div class="playlists">
              @for (p of d.playlists; track p.url) {
                <a class="playlist" [href]="p.url" target="_blank" rel="noopener">
                  @if (p.image) {
                    <img [src]="p.image" [alt]="p.name" width="120" height="120" loading="lazy" (error)="hideBroken($event)" />
                  }
                  <span class="p-name">{{ p.name }}</span>
                  <span class="mini">{{ p.tracks }} tracks</span>
                </a>
              }
            </div>
          }

          <p class="synced">
            snapshot from {{ d.fetchedAt.slice(0, 10) }} ·
            <a [href]="d.profile.url" target="_blank" rel="noopener">open in spotify →</a>
          </p>
        </div>
      </article>
    }
  `,
  styles: [`
    .profile {
      display: flex;
      gap: 12px;
      align-items: center;
    }
    .avatar {
      flex-shrink: 0;
      padding: 2px;
      border: 2px solid #1db954;
      border-radius: 50%;
      background: #000;
      line-height: 0;
      img { display: block; border-radius: 50%; object-fit: cover; }
    }
    .who {
      display: flex;
      flex-direction: column;
      gap: 2px;
      min-width: 0;
    }
    .label {
      font-family: var(--pixel);
      font-size: 7px;
      color: #1db954;
    }
    .name {
      font-family: var(--heading);
      font-size: 24px;
      color: #fff;
      text-decoration: none;
    }
    .meta { font-size: 11px; color: var(--text-muted); }
    .ranges {
      display: flex;
      flex-wrap: wrap;
      gap: 4px;
      margin-top: 14px;
      button {
        font-family: var(--pixel);
        font-size: 7px;
        color: var(--text);
        background: #1a0606;
        border: 1px solid var(--red-dark);
        padding: 5px 7px;
        cursor: pointer;
        &:hover { border-color: var(--red); }
        &.active { background: var(--red-dark); border-color: var(--red); color: #fff; }
      }
    }
    h3 {
      margin-top: 14px;
      font-size: 20px;
      color: var(--red);
    }
    ol, ul { list-style: none; }
    .cols {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
      gap: 0 16px;
    }
    .top li, .recent li {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 4px 0;
      border-bottom: 1px dotted var(--border);
      img {
        flex-shrink: 0;
        object-fit: cover;
        border: 1px solid var(--border);
      }
      img.round { border-radius: 50%; }
    }
    .rank {
      width: 18px;
      flex-shrink: 0;
      font-family: var(--pixel);
      font-size: 9px;
      color: var(--yellow);
      text-align: right;
    }
    .text {
      flex: 1;
      min-width: 0;
      display: flex;
      flex-direction: column;
      a, .mini {
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
    }
    .mini { font-size: 10px; color: var(--text-muted); }
    .when { white-space: nowrap; }
    .playlists {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(110px, 1fr));
      gap: 10px;
      margin-top: 6px;
    }
    .playlist {
      display: flex;
      flex-direction: column;
      gap: 2px;
      text-decoration: none;
      color: var(--text);
      padding: 4px;
      border: 1px solid transparent;
      img {
        width: 100%;
        height: auto;
        aspect-ratio: 1;
        object-fit: cover;
        border: 1px solid var(--border);
      }
      &:hover { border-color: var(--red-dark); background: #1a0606; }
    }
    .p-name {
      font-size: 12px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .synced {
      margin-top: 12px;
      font-size: 10px;
      color: var(--text-muted);
      text-align: right;
    }
  `],
})
export class SpotifyStatsComponent {
  readonly data = signal<SpotifyData | null>(null);
  readonly ranges: Range[] = ['short_term', 'medium_term', 'long_term'];
  readonly range = signal<Range>('short_term');
  readonly top = computed(() => this.data()?.top[this.range()]);

  constructor() {
    fetch('assets/spotify.json')
      .then((r) => (r.ok ? r.json() : null))
      .then((d: SpotifyData | null) => {
        this.data.set(d);
        // Open on the shortest range with both lists filled, else any with data.
        const first =
          this.ranges.find((r) => d?.top[r].artists.length && d?.top[r].tracks.length) ??
          this.ranges.find((r) => d?.top[r].artists.length || d?.top[r].tracks.length);
        if (first) this.range.set(first);
      })
      // No snapshot yet: the box simply doesn't render.
      .catch(() => {});
  }

  hideBroken(e: Event) {
    (e.target as HTMLImageElement).style.visibility = 'hidden';
  }
}
