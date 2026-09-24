import { Component } from '@angular/core';
import { personal, projects } from '../config';
import { PixelComponent } from '../pixel/pixel.component';

@Component({
  selector: 'app-projects-page',
  imports: [PixelComponent],
  template: `
    <h2>My <span>Projects</span></h2>
    <p class="intro">
      Things I've built, from production websites to the university projects where it all started.
      All of them are open source on <a [href]="github" target="_blank" rel="noopener">GitHub</a>.
    </p>

    <div class="list">
      @for (p of projects; track p.name) {
        <article class="box">
          <div class="box-title">
            <span><app-pixel name="folder" [scale]="1" /> {{ p.name }}</span>
            <span class="meta">
              @if (p.year) { <span class="year">{{ p.year }}</span> }
              <span class="status" [class]="p.status">{{ p.status }}</span>
            </span>
          </div>
          <div class="box-body">
            <p>{{ p.description }}</p>
            @if (p.highlights?.length) {
              <ul class="highlights">
                @for (h of p.highlights; track h) {
                  <li>{{ h }}</li>
                }
              </ul>
            }
            <div class="footer">
              <div class="tags">
                @for (t of p.tech; track t) {
                  <span class="tag">{{ t }}</span>
                }
              </div>
              <div class="links">
                @if (p.url) {
                  <a class="btn" [href]="p.url" target="_blank" rel="noopener">► visit</a>
                }
                @if (p.repo) {
                  <a class="btn" [href]="p.repo" target="_blank" rel="noopener">&lt;/&gt; source</a>
                }
              </div>
            </div>
          </div>
        </article>
      }
    </div>
  `,
  styles: [`
    .intro {
      color: var(--text-muted);
      margin-bottom: 14px;
    }
    .list {
      display: flex;
      flex-direction: column;
      gap: 14px;
    }
    .box-title > span:first-child {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      min-width: 0;
    }
    .meta {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      flex-shrink: 0;
    }
    .year { font-size: 8px; opacity: 0.85; }
    .status {
      font-size: 7px;
      padding: 2px 4px;
      background: #0b0b0b;
      border: 1px solid #fff;
    }
    .status.live { color: #6f6; }
    .status.wip { color: var(--yellow); }
    .status.archived { color: var(--text-muted); }
    .highlights {
      list-style: none;
      margin-top: 10px;
      li {
        position: relative;
        padding-left: 16px;
        margin-bottom: 4px;
        font-size: 12px;
      }
      li::before {
        content: '►';
        position: absolute;
        left: 0;
        top: 1px;
        font-size: 9px;
        color: var(--red);
      }
    }
    .footer {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      justify-content: space-between;
      gap: 10px;
      margin-top: 12px;
      padding-top: 10px;
      border-top: 1px dotted var(--border);
    }
    .tags {
      display: flex;
      flex-wrap: wrap;
      gap: 4px;
    }
    .links {
      display: flex;
      gap: 6px;
      flex-shrink: 0;
    }
  `],
})
export class ProjectsPage {
  readonly projects = projects;
  readonly github = personal.github;
}
