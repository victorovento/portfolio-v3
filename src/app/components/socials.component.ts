import { Component, signal } from '@angular/core';
import { socials, Social } from '../config';
import { PixelComponent } from '../pixel/pixel.component';

/** Pixel-icon links to social profiles; Discord copies the username. */
@Component({
  selector: 'app-socials',
  imports: [PixelComponent],
  template: `
    <section class="box">
      <div class="box-title">find me on</div>
      <ul class="box-body">
        @for (s of socials; track s.name) {
          <li>
            @if (s.url) {
              <a [href]="s.url" target="_blank" rel="noopener me" [title]="s.name + ': ' + s.handle">
                <app-pixel [name]="s.icon" [scale]="2" />
                <span class="text"><b>{{ s.name }}</b><span class="handle">{{ s.handle }}</span></span>
              </a>
            } @else {
              <button type="button" (click)="copy(s)" [title]="'Copy ' + s.name + ' username'">
                <app-pixel [name]="s.icon" [scale]="2" />
                <span class="text">
                  <b>{{ s.name }}</b>
                  <span class="handle">{{ copied() === s.name ? '✓ copied!' : s.handle }}</span>
                </span>
              </button>
            }
          </li>
        }
      </ul>
    </section>
  `,
  styles: [`
    ul {
      list-style: none;
      display: flex;
      flex-direction: column;
      gap: 2px;
      padding: 8px;
    }
    a, button {
      display: flex;
      align-items: center;
      gap: 8px;
      width: 100%;
      padding: 4px 6px;
      font: inherit;
      text-align: left;
      color: var(--text) !important;
      text-decoration: none;
      background: none;
      border: 1px solid transparent;
      cursor: pointer;
      &:hover {
        background: #1a0606;
        border-color: var(--red-dark);
        app-pixel { transform: translateY(-1px); }
      }
    }
    .text {
      display: flex;
      flex-direction: column;
      min-width: 0;
      line-height: 1.25;
      b { font-size: 11px; }
    }
    .handle {
      font-size: 10px;
      color: var(--text-muted);
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  `],
})
export class SocialsComponent {
  readonly socials = socials;
  readonly copied = signal<string | null>(null);

  async copy(s: Social) {
    try {
      await navigator.clipboard.writeText(s.handle);
      this.copied.set(s.name);
      setTimeout(() => this.copied.set(null), 2000);
    } catch {
      // Clipboard blocked; the handle is still visible to copy by hand.
    }
  }
}
