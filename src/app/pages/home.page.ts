import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { personal } from '../config';
import { PixelComponent } from '../pixel/pixel.component';
import { SteamStatsComponent } from '../components/steam-stats.component';

@Component({
  selector: 'app-home-page',
  imports: [RouterLink, PixelComponent, SteamStatsComponent],
  template: `
    <article class="box">
      <div class="box-title">welcome.txt <span class="controls"><span></span><span></span><span></span></span></div>
      <div class="box-body welcome">
        <h2>Welcome to my corner of the <span>internet</span>!</h2>
        <p>
          Hi, I'm <b>{{ personal.name }}</b>, a {{ personal.role.toLowerCase() }} from {{ personal.location }}.
          This is my little home on the web, built by hand the way websites used to be:
          no templates, no tracking, just HTML, CSS, a bit too much TypeScript and a lot of coffee.
        </p>
        <p>
          Take a look around! You can read about my <a routerLink="/experience">work experience</a>,
          check out some <a routerLink="/projects">projects</a>, or browse my <a routerLink="/links">cool links</a>.
          Don't forget to pet the cat. <app-pixel name="heart" [scale]="1" />
        </p>
      </div>
    </article>

    <article class="box">
      <div class="box-title">about_me.exe</div>
      <div class="box-body about">
        <figure class="photo">
          <img src="assets/photo.jpg" [alt]="'Photo of ' + personal.name" width="160" height="200" />
          <figcaption>that's me!</figcaption>
        </figure>
        <div class="bio">
          @for (paragraph of personal.bio; track $index) {
            <p>{{ paragraph }}</p>
          }
        </div>
      </div>
    </article>

    <article class="box">
      <div class="box-title">quick facts</div>
      <div class="box-body">
        <table class="facts">
          <tr><th>name</th><td>{{ personal.name }}</td></tr>
          <tr><th>job</th><td>{{ personal.role }}</td></tr>
          <tr><th>based in</th><td>{{ personal.location }}</td></tr>
          <tr><th>available for</th><td>{{ personal.availability }}</td></tr>
          <tr><th>email</th><td><a [href]="'mailto:' + personal.email">{{ personal.email }}</a></td></tr>
          <tr><th>fuel</th><td>coffee <app-pixel name="coffee" [scale]="1" /></td></tr>
        </table>
      </div>
    </article>

    <app-steam-stats />

    <div class="construction" aria-hidden="true">
      <span>⚠ this site is forever under construction ⚠</span>
    </div>
  `,
  styles: [`
    :host {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }
    .welcome h2 { font-size: 32px; }
    .about {
      display: flex;
      gap: 16px;
      align-items: flex-start;
    }
    .photo {
      flex-shrink: 0;
      padding: 6px 6px 4px;
      background: #f0f0f0;
      transform: rotate(-2deg);
      box-shadow: 4px 4px 0 var(--red-dark);
    }
    .photo img {
      display: block;
      width: 160px;
      height: 200px;
      object-fit: cover;
    }
    .photo figcaption {
      font-family: var(--heading);
      color: #0b0b0b;
      text-align: center;
      font-size: 18px;
      margin-top: 2px;
    }
    .facts {
      border-collapse: collapse;
      width: 100%;
    }
    .facts th, .facts td {
      text-align: left;
      padding: 4px 8px;
      border: 1px dotted var(--border);
    }
    .facts th {
      width: 130px;
      color: var(--red);
      font-weight: bold;
      background: #0f0303;
    }
    .construction {
      font-family: var(--pixel);
      font-size: 8px;
      text-align: center;
      padding: 8px;
      color: #fff;
      background: repeating-linear-gradient(-45deg, var(--red) 0 10px, #0b0b0b 10px 20px);
      border: 2px solid var(--border);
    }
    .construction span {
      background: #0b0b0b;
      padding: 4px 8px;
    }
    @media (max-width: 560px) {
      .about { flex-direction: column; align-items: center; }
    }
  `],
})
export class HomePage {
  readonly personal = personal;
}
