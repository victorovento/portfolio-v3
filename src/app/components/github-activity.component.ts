import { Component, computed, signal } from '@angular/core';

interface Day {
  date: string;
  level: number;
  count: number;
}

// Shape of public/assets/github.json, written by scripts/fetch-github.mjs.
interface GithubData {
  fetchedAt: string;
  user: { login: string; name: string; avatar: string; url: string; repos: number; followers: number };
  totalLastYear: number;
  days: Day[];
  recentRepos: { name: string; url: string; language: string | null; description: string | null; pushedAt: string }[];
}

// Weeks shown in the grid; 24 columns fit the 200px sidebar.
const WEEKS = 24;

/** Contribution grid + latest repos, from the build-time snapshot. */
@Component({
  selector: 'app-github-activity',
  template: `
    @if (data(); as d) {
      <section class="box">
        <div class="box-title">github</div>
        <div class="box-body">
          <a class="who" [href]="d.user.url" target="_blank" rel="noopener me">
            <b>{{ d.user.login }}</b>
            <span class="mini">{{ d.user.repos }} repos</span>
          </a>

          <div class="grid" role="img" [attr.aria-label]="d.totalLastYear + ' contributions in the last year'">
            @for (week of weeks(); track $index) {
              <div class="week">
                @for (day of week; track day.date) {
                  <span class="cell" [attr.data-level]="day.level" [title]="label(day)"></span>
                }
              </div>
            }
          </div>
          <p class="mini total">
            <b>{{ d.totalLastYear }}</b> contributions this year
            <span class="legend" aria-hidden="true">
              less
              @for (l of [0, 1, 2, 3, 4]; track l) {
                <span class="cell" [attr.data-level]="l"></span>
              }
              more
            </span>
          </p>

          @if (d.recentRepos.length) {
            <h4>recently worked on</h4>
            <ul class="repos">
              @for (r of d.recentRepos; track r.url) {
                <li>
                  <a [href]="r.url" target="_blank" rel="noopener">{{ r.name }}</a>
                  <span class="mini">
                    @if (r.language) { <span class="lang">{{ r.language }}</span> · }
                    {{ r.pushedAt.slice(0, 10) }}
                  </span>
                </li>
              }
            </ul>
          }
        </div>
      </section>
    }
  `,
  styles: [`
    .who {
      display: flex;
      justify-content: space-between;
      align-items: baseline;
      text-decoration: none;
      color: #fff !important;
      margin-bottom: 8px;
      b { font-size: 12px; }
    }
    .grid {
      display: flex;
      gap: 1px;
      justify-content: flex-end;
    }
    .week {
      display: flex;
      flex-direction: column;
      gap: 1px;
    }
    .cell {
      display: block;
      width: 6px;
      height: 6px;
      background: #1a1a1a;
      &[data-level='1'] { background: #5c1210; }
      &[data-level='2'] { background: #8e1b18; }
      &[data-level='3'] { background: #c62828; }
      &[data-level='4'] { background: #ff5a52; }
    }
    .total {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      gap: 3px;
      margin-top: 6px;
      b { color: var(--yellow); }
    }
    .legend {
      display: inline-flex;
      align-items: center;
      gap: 1px;
      font-size: 8px;
      .cell { width: 5px; height: 5px; }
    }
    h4 {
      font-family: var(--heading);
      font-weight: 400;
      font-size: 16px;
      color: var(--red);
      margin-top: 10px;
    }
    .repos {
      list-style: none;
      li {
        display: flex;
        flex-direction: column;
        padding: 3px 0;
        border-bottom: 1px dotted var(--border);
        a { font-size: 11px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
      }
    }
    .lang { color: var(--pink); }
    .mini { font-size: 10px; color: var(--text-muted); }
  `],
})
export class GithubActivityComponent {
  readonly data = signal<GithubData | null>(null);

  /** Last WEEKS weeks as Sunday-first columns, like GitHub's own graph. */
  readonly weeks = computed(() => {
    const days = this.data()?.days ?? [];
    const cols: Day[][] = [];
    for (const day of days) {
      const weekday = new Date(day.date + 'T00:00:00Z').getUTCDay();
      if (weekday === 0 || !cols.length) cols.push([]);
      cols[cols.length - 1].push(day);
    }
    return cols.slice(-WEEKS);
  });

  constructor() {
    fetch('assets/github.json')
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => this.data.set(d))
      .catch(() => {});
  }

  label(d: Day) {
    const when = new Date(d.date + 'T00:00:00Z').toLocaleDateString('en-US', { month: 'short', day: 'numeric', timeZone: 'UTC' });
    return `${d.count || 'No'} contribution${d.count === 1 ? '' : 's'} on ${when}`;
  }
}
