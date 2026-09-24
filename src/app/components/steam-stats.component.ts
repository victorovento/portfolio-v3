import { Component, computed, signal } from '@angular/core';

// Shape of public/assets/steam.json, written by scripts/fetch-steam.mjs.
interface SteamGame {
  appid: number | null;
  name: string;
  hours: number;
}

interface SteamData {
  fetchedAt: string;
  source: 'api' | 'xml';
  profile: {
    name: string;
    avatar: string;
    url: string;
    status: string;
    inGame: string | null;
    memberSince: string | null;
    country: string | null;
    level: number | null;
  };
  library: { gameCount: number; totalHours: number; hours2Weeks: number } | null;
  badges: { count: number; xp: number } | null;
  topGames: (SteamGame & { image: string })[];
  recent: (SteamGame & { hours2Weeks: number; icon: string | null })[];
}

@Component({
  selector: 'app-steam-stats',
  template: `
    @if (data(); as d) {
      <article class="box">
        <div class="box-title">steam_stats.exe <span class="controls"><span></span><span></span><span></span></span></div>
        <div class="box-body">
          <div class="profile">
            <a [href]="d.profile.url" target="_blank" rel="noopener" class="avatar" [class]="statusClass()">
              <img [src]="d.profile.avatar" [alt]="d.profile.name + ' Steam avatar'" width="72" height="72" />
            </a>
            <div class="who">
              <a [href]="d.profile.url" target="_blank" rel="noopener" class="name">{{ d.profile.name }}</a>
              <span class="status" [class]="statusClass()">
                ● {{ d.profile.inGame ? 'in-game: ' + d.profile.inGame : d.profile.status }}
              </span>
              @if (d.profile.memberSince) {
                <span class="meta">member since {{ d.profile.memberSince.slice(0, 4) }} ({{ years() }} yrs)</span>
              }
              @if (d.profile.country) {
                <span class="meta">{{ d.profile.country }}</span>
              }
            </div>
            @if (d.profile.level !== null) {
              <div class="level" [title]="'Steam level ' + d.profile.level">
                <span>lv</span>{{ d.profile.level }}
              </div>
            }
          </div>

          @if (d.library) {
            <dl class="lcd">
              <div><dt>games</dt><dd>{{ pad(d.library.gameCount) }}</dd></div>
              <div><dt>hours</dt><dd>{{ pad(round(d.library.totalHours)) }}</dd></div>
              <div><dt>last 2 wks</dt><dd>{{ d.library.hours2Weeks }}h</dd></div>
              @if (d.badges) {
                <div><dt>badges</dt><dd>{{ pad(d.badges.count, 3) }}</dd></div>
              }
            </dl>
          }

          @if (d.topGames.length) {
            <h3>most played</h3>
            <ol class="top">
              @for (g of d.topGames; track g.appid) {
                <li>
                  <a [href]="storeUrl(g.appid)" target="_blank" rel="noopener">
                    <img [src]="g.image" [alt]="g.name" width="92" height="35" loading="lazy" (error)="hideBroken($event)" />
                  </a>
                  <div class="bar-wrap">
                    <span class="game">{{ g.name }}</span>
                    <span class="bar"><span [style.width.%]="(g.hours / maxHours()) * 100"></span></span>
                  </div>
                  <span class="hrs">{{ g.hours }}h</span>
                </li>
              }
            </ol>
          }

          <h3>recently played</h3>
          @if (d.recent.length) {
            <ul class="recent">
              @for (g of d.recent; track g.appid) {
                <li>
                  @if (g.icon) {
                    <img [src]="g.icon" alt="" width="24" height="24" loading="lazy" (error)="hideBroken($event)" />
                  }
                  <a [href]="storeUrl(g.appid)" target="_blank" rel="noopener">{{ g.name }}</a>
                  <span class="hrs">{{ g.hours2Weeks }}h past 2 wks · {{ g.hours }}h total</span>
                </li>
              }
            </ul>
          } @else {
            <p class="meta">nothing in the last 2 weeks... touching grass, probably.</p>
          }

          <p class="synced">
            snapshot from {{ d.fetchedAt.slice(0, 10) }} ·
            <a [href]="d.profile.url" target="_blank" rel="noopener">view profile on steam →</a>
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
      border: 2px solid #6a6a6a;
      background: #000;
      line-height: 0;
    }
    .avatar.online { border-color: #57cbde; }
    .avatar.ingame { border-color: #90ba3c; }
    .avatar img { display: block; }
    .who {
      display: flex;
      flex-direction: column;
      gap: 2px;
      min-width: 0;
      flex: 1;
    }
    .name {
      font-family: var(--heading);
      font-size: 24px;
      color: #fff;
      text-decoration: none;
    }
    .status { font-size: 11px; color: #8a8a8a; }
    .status.online { color: #57cbde; }
    .status.ingame { color: #90ba3c; }
    .meta { font-size: 11px; color: var(--text-muted); }
    .level {
      flex-shrink: 0;
      width: 48px;
      height: 48px;
      border: 3px solid var(--red);
      border-radius: 50%;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      font-family: var(--pixel);
      font-size: 12px;
      color: #fff;
      background: #1a0606;
      span { font-size: 6px; color: var(--pink); }
    }
    h3 {
      margin-top: 14px;
      font-size: 20px;
      color: var(--red);
    }
    .top, .recent { list-style: none; }
    .top li {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 4px 0;
      border-bottom: 1px dotted var(--border);
    }
    .top img {
      display: block;
      width: 92px;
      height: 35px;
      object-fit: cover;
      border: 1px solid var(--border);
    }
    .bar-wrap {
      flex: 1;
      min-width: 0;
      display: flex;
      flex-direction: column;
      gap: 3px;
    }
    .game {
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .bar {
      height: 6px;
      background: #1a0606;
      border: 1px solid var(--red-dark);
      span {
        display: block;
        height: 100%;
        background: repeating-linear-gradient(90deg, var(--red) 0 4px, var(--red-dark) 4px 6px);
      }
    }
    .hrs {
      font-size: 11px;
      color: var(--yellow);
      white-space: nowrap;
    }
    .top .hrs {
      min-width: 52px;
      text-align: right;
    }
    .recent li {
      display: flex;
      align-items: center;
      flex-wrap: wrap;
      gap: 4px 8px;
      padding: 4px 0;
      border-bottom: 1px dotted var(--border);
    }
    .recent img { image-rendering: auto; }
    .recent .hrs { margin-left: auto; color: var(--text-muted); }
    .synced {
      margin-top: 12px;
      font-size: 10px;
      color: var(--text-muted);
      text-align: right;
    }
  `],
})
export class SteamStatsComponent {
  readonly data = signal<SteamData | null>(null);

  readonly statusClass = computed(() => {
    const p = this.data()?.profile;
    if (!p) return '';
    return p.inGame ? 'ingame' : p.status === 'offline' ? 'offline' : 'online';
  });

  readonly years = computed(() => {
    const since = this.data()?.profile.memberSince;
    return since ? Math.floor((Date.now() - Date.parse(since)) / (365.25 * 864e5)) : 0;
  });

  readonly maxHours = computed(() => Math.max(1, ...(this.data()?.topGames.map((g) => g.hours) ?? [])));

  constructor() {
    fetch('assets/steam.json')
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => this.data.set(d))
      // No snapshot yet: the box simply doesn't render.
      .catch(() => {});
  }

  // Steam art occasionally 404s; hide it rather than show a broken image.
  hideBroken(e: Event) {
    (e.target as HTMLImageElement).style.visibility = 'hidden';
  }

  pad(n: number, width = 4) {
    return String(n).padStart(width, '0');
  }

  round(n: number) {
    return Math.round(n);
  }

  storeUrl(appid: number | null) {
    return appid ? `https://store.steampowered.com/app/${appid}/` : this.data()?.profile.url;
  }
}
