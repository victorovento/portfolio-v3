import { Component, signal } from '@angular/core';
import { PixelComponent } from '../pixel/pixel.component';
import { SpriteName } from '../pixel/sprites';

type Grade = 'platinum' | 'gold' | 'silver' | 'bronze';

interface Counts {
  platinum: number;
  gold: number;
  silver: number;
  bronze: number;
}

interface EarnedTrophy {
  name: string;
  detail: string;
  icon: string | null;
  type: Grade;
  game: string;
  earnedAt: string | null;
  rate: number | null;
}

// Shape of public/assets/psn.json, written by scripts/fetch-psn.mjs.
interface PsnData {
  fetchedAt: string;
  profile: { onlineId: string; avatar: string | null; plus: boolean; aboutMe: string | null; url: string };
  trophies: { level: number; progress: number; tier: number; grade: Grade; counts: Counts; total: number };
  games: { count: number; platinumed: number; completed: number };
  recent: {
    name: string;
    icon: string;
    platform: string;
    progress: number;
    earned: Counts;
    defined: Counts;
    lastPlayed: string;
  }[];
  latestTrophies: EarnedTrophy[];
  rarestTrophies: EarnedTrophy[];
}

const SPRITE: Record<Grade, SpriteName> = {
  platinum: 'trophyPlatinum',
  gold: 'trophyGold',
  silver: 'trophySilver',
  bronze: 'trophyBronze',
};

@Component({
  selector: 'app-psn-stats',
  imports: [PixelComponent],
  template: `
    @if (data(); as d) {
      <article class="box">
        <div class="box-title">psn_trophies.exe <span class="controls"><span></span><span></span><span></span></span></div>
        <div class="box-body">
          <div class="profile">
            @if (d.profile.avatar) {
              <a [href]="d.profile.url" target="_blank" rel="noopener" class="avatar">
                <img [src]="d.profile.avatar" [alt]="d.profile.onlineId + ' PSN avatar'" width="72" height="72" (error)="hideBroken($event)" />
              </a>
            }
            <div class="who">
              <span class="name-row">
                <a [href]="d.profile.url" target="_blank" rel="noopener" class="name">{{ d.profile.onlineId }}</a>
                @if (d.profile.plus) {
                  <span class="plus" title="PlayStation Plus member">PS+</span>
                }
              </span>
              @if (d.profile.aboutMe) {
                <span class="meta about">"{{ d.profile.aboutMe }}"</span>
              }
              <span class="meta">{{ d.games.count }} games · {{ d.games.platinumed }} platinums · {{ d.games.completed }} at 100%</span>
              <span class="level-bar" [title]="d.trophies.progress + '% to level ' + (d.trophies.level + 1)">
                <span [style.width.%]="d.trophies.progress"></span>
              </span>
              <span class="meta">{{ d.trophies.progress }}% to level {{ d.trophies.level + 1 }}</span>
            </div>
            <div class="level" [class]="d.trophies.grade" [title]="'Trophy level ' + d.trophies.level">
              <span>lv</span>{{ d.trophies.level }}
            </div>
          </div>

          <dl class="lcd">
            @for (g of grades; track g) {
              <div>
                <dt><app-pixel [name]="sprite[g]" [scale]="1" /> {{ g }}</dt>
                <dd>{{ pad(d.trophies.counts[g]) }}</dd>
              </div>
            }
            <div><dt>total</dt><dd>{{ pad(d.trophies.total, 4) }}</dd></div>
          </dl>

          @if (d.recent.length) {
            <h3>recently played</h3>
            <ul class="recent">
              @for (g of d.recent; track g.name) {
                <li>
                  <img [src]="g.icon" [alt]="g.name" width="64" height="36" loading="lazy" (error)="hideBroken($event)" />
                  <div class="bar-wrap">
                    <span class="game">{{ g.name }} <span class="tag">{{ g.platform }}</span></span>
                    <span class="bar"><span [style.width.%]="g.progress"></span></span>
                    <span class="mini">
                      {{ earnedCount(g.earned) }}/{{ earnedCount(g.defined) }} trophies
                      @if (g.earned.platinum) { · <b class="plat">platinum!</b> }
                    </span>
                  </div>
                  <span class="pct">{{ g.progress }}%</span>
                </li>
              }
            </ul>
          }

          <div class="trophy-cols">
            @if (d.latestTrophies.length) {
              <section>
                <h3>latest trophies</h3>
                <ul class="trophies">
                  @for (t of d.latestTrophies; track $index) {
                    <li [title]="t.detail">
                      @if (t.icon) {
                        <img [src]="t.icon" alt="" width="36" height="36" loading="lazy" (error)="hideBroken($event)" />
                      } @else {
                        <app-pixel [name]="sprite[t.type]" [scale]="3" />
                      }
                      <div>
                        <span class="t-name"><app-pixel [name]="sprite[t.type]" [scale]="1" /> {{ t.name }}</span>
                        <span class="mini">{{ t.game }}{{ t.earnedAt ? ' · ' + t.earnedAt.slice(0, 10) : '' }}</span>
                      </div>
                    </li>
                  }
                </ul>
              </section>
            }
            @if (d.rarestTrophies.length) {
              <section>
                <h3>rarest trophies</h3>
                <ul class="trophies">
                  @for (t of d.rarestTrophies; track $index) {
                    <li [title]="t.detail">
                      @if (t.icon) {
                        <img [src]="t.icon" alt="" width="36" height="36" loading="lazy" (error)="hideBroken($event)" />
                      } @else {
                        <app-pixel [name]="sprite[t.type]" [scale]="3" />
                      }
                      <div>
                        <span class="t-name"><app-pixel [name]="sprite[t.type]" [scale]="1" /> {{ t.name }}</span>
                        <span class="mini">{{ t.game }} · <b class="rare">{{ t.rate }}% of players</b></span>
                      </div>
                    </li>
                  }
                </ul>
              </section>
            }
          </div>

          <p class="synced">
            snapshot from {{ d.fetchedAt.slice(0, 10) }} ·
            <a [href]="d.profile.url" target="_blank" rel="noopener">view trophies →</a>
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
      border: 2px solid #0070d1;
      background: #000;
      line-height: 0;
      img { display: block; }
    }
    .who {
      display: flex;
      flex-direction: column;
      gap: 2px;
      min-width: 0;
      flex: 1;
    }
    .name-row {
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .name {
      font-family: var(--heading);
      font-size: 24px;
      color: #fff;
      text-decoration: none;
    }
    .plus {
      font-family: var(--pixel);
      font-size: 7px;
      color: #0b0b0b;
      background: var(--yellow);
      padding: 3px 4px;
      border: 1px solid #fff;
    }
    .meta { font-size: 11px; color: var(--text-muted); }
    .about {
      font-style: italic;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .level-bar {
      height: 6px;
      max-width: 220px;
      margin-top: 4px;
      background: #06101a;
      border: 1px solid #0070d1;
      span {
        display: block;
        height: 100%;
        background: repeating-linear-gradient(90deg, #3b9cff 0 4px, #0070d1 4px 6px);
      }
    }
    .level {
      flex-shrink: 0;
      width: 52px;
      height: 52px;
      border: 3px solid #cd7f32;
      border-radius: 50%;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      font-family: var(--pixel);
      font-size: 11px;
      color: #fff;
      background: #06101a;
      span { font-size: 6px; color: #8ab8e6; }
      &.silver { border-color: #c0c0c0; }
      &.gold { border-color: #e6b422; }
      &.platinum { border-color: #b8d4e8; box-shadow: 0 0 8px #b8d4e8; }
    }
    h3 {
      margin-top: 14px;
      font-size: 20px;
      color: var(--red);
    }
    ul { list-style: none; }
    .recent li {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 5px 0;
      border-bottom: 1px dotted var(--border);
      img {
        display: block;
        width: 64px;
        height: 36px;
        object-fit: cover;
        border: 1px solid var(--border);
        flex-shrink: 0;
      }
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
      .tag { font-size: 9px; padding: 0 4px; margin-left: 4px; }
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
    .mini { font-size: 10px; color: var(--text-muted); }
    .pct {
      min-width: 40px;
      text-align: right;
      font-family: var(--pixel);
      font-size: 9px;
      color: var(--yellow);
    }
    .plat { color: #b8d4e8; }
    .rare { color: var(--pink); font-weight: normal; }
    .trophy-cols {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
      gap: 0 16px;
    }
    .trophies li {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 5px 0;
      border-bottom: 1px dotted var(--border);
      img {
        display: block;
        flex-shrink: 0;
        border: 1px solid var(--border);
      }
      > div {
        display: flex;
        flex-direction: column;
        min-width: 0;
      }
    }
    .t-name {
      display: flex;
      align-items: center;
      gap: 4px;
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
export class PsnStatsComponent {
  readonly data = signal<PsnData | null>(null);
  readonly grades: Grade[] = ['platinum', 'gold', 'silver', 'bronze'];
  readonly sprite = SPRITE;

  constructor() {
    fetch('assets/psn.json')
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => this.data.set(d))
      // No snapshot yet: the box simply doesn't render.
      .catch(() => {});
  }

  earnedCount(c: Counts) {
    return c.platinum + c.gold + c.silver + c.bronze;
  }

  pad(n: number, width = 3) {
    return String(n).padStart(width, '0');
  }

  hideBroken(e: Event) {
    (e.target as HTMLImageElement).style.visibility = 'hidden';
  }
}
