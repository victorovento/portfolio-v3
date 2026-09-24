import { Component, signal } from '@angular/core';

interface Part {
  type: 'text' | 'link';
  text: string;
  href?: string;
}

// Shape of public/assets/tweets.json, written by scripts/fetch-tweets.mjs.
interface TweetsData {
  fetchedAt: string;
  user: { id: string; name: string; username: string; avatar: string | null; followers: number | null };
  tweets: {
    id: string;
    url: string;
    createdAt: string;
    parts: Part[];
    images: { url: string; video: boolean }[];
    likes: number;
    reposts: number;
    replies: number;
  }[];
}

const HANDLE = 'victorovento';

/** Latest posts on X, from the build-time snapshot. */
@Component({
  selector: 'app-tweets',
  template: `
    <section class="box">
      <div class="box-title">tweets <span class="x">𝕏</span></div>
      <div class="box-body">
        @if (data(); as d) {
          <a class="who" [href]="profileUrl" target="_blank" rel="noopener">
            @if (d.user.avatar) {
              <img [src]="d.user.avatar" alt="" width="32" height="32" (error)="hideBroken($event)" />
            }
            <span>
              <b>{{ d.user.name }}</b>
              <span class="mini">&#64;{{ d.user.username }}</span>
            </span>
          </a>

          <ul class="tweets">
            @for (t of d.tweets; track t.id) {
              <li>
                <p class="text">
                  @for (p of t.parts; track $index) {
                    @if (p.type === 'link') {
                      <a [href]="p.href" target="_blank" rel="noopener">{{ p.text }}</a>
                    } @else {
                      {{ p.text }}
                    }
                  }
                </p>
                @for (img of t.images.slice(0, 1); track img.url) {
                  <a class="media" [href]="t.url" target="_blank" rel="noopener">
                    <img [src]="img.url" alt="Image attached to the post" loading="lazy" (error)="hideBroken($event)" />
                    @if (img.video) {
                      <span class="play">►</span>
                    }
                  </a>
                }
                <a class="meta" [href]="t.url" target="_blank" rel="noopener">
                  <time [attr.datetime]="t.createdAt">{{ date(t.createdAt) }}</time>
                  <span>♥ {{ t.likes }}</span>
                  <span>↻ {{ t.reposts }}</span>
                </a>
              </li>
            } @empty {
              <li class="mini">no posts yet.</li>
            }
          </ul>
        } @else {
          <p class="mini">my latest posts live on X. come say hi!</p>
        }
        <a class="btn follow" [href]="profileUrl" target="_blank" rel="noopener">follow &#64;{{ handle }}</a>
      </div>
    </section>
  `,
  styles: [`
    .x { font-family: var(--body); font-size: 11px; }
    .who {
      display: flex;
      align-items: center;
      gap: 8px;
      text-decoration: none;
      color: var(--text);
      margin-bottom: 8px;
      img { border-radius: 50%; border: 1px solid var(--red-dark); flex-shrink: 0; }
      > span { display: flex; flex-direction: column; min-width: 0; font-size: 11px; line-height: 1.3; }
      b, .mini { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
    }
    .tweets {
      list-style: none;
      max-height: 360px;
      overflow-y: auto;
      li {
        padding: 8px 0;
        border-top: 1px dotted var(--border);
      }
    }
    .text {
      font-size: 11px;
      line-height: 1.5;
      white-space: pre-line;
      overflow-wrap: anywhere;
    }
    .media {
      position: relative;
      display: block;
      margin-top: 6px;
      line-height: 0;
      img {
        width: 100%;
        max-height: 140px;
        object-fit: cover;
        border: 1px solid var(--border);
      }
    }
    .play {
      position: absolute;
      inset: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 18px;
      color: #fff;
      text-shadow: 0 0 4px #000;
    }
    .meta {
      display: flex;
      gap: 8px;
      margin-top: 4px;
      font-size: 10px;
      color: var(--text-muted) !important;
      text-decoration: none;
      time { color: var(--red); margin-right: auto; }
    }
    .mini { font-size: 10px; color: var(--text-muted); }
    .follow {
      margin-top: 10px;
      width: 100%;
      justify-content: center;
      font-size: 7px;
    }
  `],
})
export class TweetsComponent {
  readonly data = signal<TweetsData | null>(null);
  readonly handle = HANDLE;
  readonly profileUrl = `https://x.com/${HANDLE}`;

  constructor() {
    fetch('assets/tweets.json')
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => this.data.set(d))
      .catch(() => {});
  }

  date(iso: string) {
    return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  }

  hideBroken(e: Event) {
    (e.target as HTMLImageElement).style.visibility = 'hidden';
  }
}
