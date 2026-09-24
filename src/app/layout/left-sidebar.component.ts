import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { personal, status } from '../config';
import { PixelComponent } from '../pixel/pixel.component';
import { SpriteName } from '../pixel/sprites';
import { MascotComponent } from '../components/mascot.component';
import { SocialsComponent } from '../components/socials.component';
import { GithubActivityComponent } from '../components/github-activity.component';
import { ChiptuneService } from '../services/chiptune.service';
import { LastfmService } from '../services/lastfm.service';

interface NavItem {
  path: string;
  label: string;
  icon: SpriteName;
}

@Component({
  selector: 'app-left-sidebar',
  imports: [RouterLink, RouterLinkActive, PixelComponent, MascotComponent, SocialsComponent, GithubActivityComponent],
  template: `
    <nav class="box" aria-label="Main">
      <div class="box-title">navigation <span class="controls"><span></span><span></span></span></div>
      <ul class="box-body nav">
        @for (item of nav; track item.path) {
          <li>
            <a
              [routerLink]="item.path"
              routerLinkActive="active"
              [routerLinkActiveOptions]="{ exact: item.path === '/' }"
            >
              <app-pixel [name]="item.icon" [scale]="2" />
              <span>{{ item.label }}</span>
            </a>
          </li>
        }
      </ul>
    </nav>

    <app-socials />

    <section class="box">
      <div class="box-title">status</div>
      <dl class="box-body status">
        <dt>feeling</dt><dd>{{ status.feeling }}</dd>
        <dt>listening to</dt>
        @if (fm.nowPlaying(); as t) {
          <dd><span class="live">♪</span> <a [href]="t.url" target="_blank" rel="noopener">{{ t.name }}</a> - {{ t.artist }}</dd>
        } @else {
          <dd>{{ status.listening }}</dd>
        }
        <dt>working on</dt><dd>{{ status.workingOn }}</dd>
        <dt>reading</dt><dd>{{ status.reading }}</dd>
        <dd class="updated">updated {{ status.updated }}</dd>
      </dl>
    </section>

    <app-github-activity />

    <section class="box">
      <div class="box-title">my cat</div>
      <div class="box-body"><app-mascot /></div>
    </section>

    <section class="box">
      <div class="box-title">now playing</div>
      <div class="box-body player">
        <app-pixel name="note" [scale]="2" [class.bounce]="music.playing()" />
        <div class="track">
          <div class="screen"><span [class.scroll]="music.playing()">{{ music.trackName }}</span></div>
          <button class="btn" type="button" (click)="music.toggle()" [attr.aria-pressed]="music.playing()">
            {{ music.playing() ? '■ stop' : '► play' }}
          </button>
        </div>
      </div>
    </section>

    <section class="box">
      <div class="box-title">resume</div>
      <div class="box-body center">
        <a class="btn" [href]="personal.cvPath" download>
          <app-pixel name="floppy" [scale]="1" /> download cv
        </a>
      </div>
    </section>
  `,
  styles: [`
    :host {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }
    .nav {
      list-style: none;
      display: flex;
      flex-direction: column;
      gap: 2px;
      padding: 8px;
    }
    .nav a {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 5px 6px;
      font-family: var(--heading);
      font-size: 20px;
      color: var(--text);
      text-decoration: none;
      border: 1px solid transparent;
    }
    .nav a:hover {
      background: #1a0606;
      border-color: var(--red-dark);
      color: #fff;
    }
    .nav a:hover span::before,
    .nav a.active span::before {
      content: '» ';
      color: var(--red);
    }
    .nav a.active {
      background: var(--red-dark);
      color: #fff;
      border-color: var(--red);
    }
    .status {
      font-size: 11px;
    }
    .status dt {
      color: var(--red);
      font-weight: bold;
    }
    .status dd { margin-bottom: 4px; }
    .status .live { color: var(--red); animation: blink 1.2s steps(1) infinite; }
    .status .updated {
      color: var(--text-muted);
      font-size: 10px;
      font-style: italic;
      margin-top: 6px;
    }
    .player {
      display: flex;
      gap: 10px;
      align-items: center;
    }
    .track {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 6px;
      min-width: 0;
    }
    .screen {
      background: #020;
      color: #6f6;
      font-family: var(--pixel);
      font-size: 7px;
      padding: 5px 4px;
      border: 2px inset #333;
      overflow: hidden;
      white-space: nowrap;
    }
    .screen span { display: inline-block; }
    .scroll { animation: ticker 5s linear infinite; }
    @keyframes ticker {
      from { transform: translateX(100%); }
      to { transform: translateX(-100%); }
    }
    .bounce { animation: bounce 0.45s steps(2) infinite; }
    @keyframes bounce { 50% { transform: translateY(-3px); } }
    .center { text-align: center; }
    /* On phones the host is display: contents; keep nav above the page content. */
    @media (max-width: 640px) {
      nav { order: 0; }
      section, app-socials, app-github-activity { order: 2; }
    }
  `],
})
export class LeftSidebarComponent {
  readonly music = inject(ChiptuneService);
  readonly fm = inject(LastfmService);
  readonly status = status;
  readonly personal = personal;

  readonly nav: NavItem[] = [
    { path: '/', label: 'home', icon: 'home' },
    { path: '/experience', label: 'experience', icon: 'briefcase' },
    { path: '/projects', label: 'projects', icon: 'folder' },
    { path: '/skills', label: 'skills', icon: 'star' },
    { path: '/links', label: 'cool links', icon: 'chain' },
    { path: '/contact', label: 'contact', icon: 'mail' },
  ];

  constructor() {
    // Live "listening to" from Last.fm on every page (no-op until configured).
    this.fm.start();
  }
}
