import { Component } from '@angular/core';
import { projects } from '../config';
import { PixelComponent } from '../pixel/pixel.component';

@Component({
  selector: 'app-projects-page',
  imports: [PixelComponent],
  template: `
    <h2>My <span>Projects</span></h2>
    <p class="intro">Stuff I've made, am making, or will definitely finish someday.</p>

    <div class="grid">
      @for (p of projects; track p.name) {
        <article class="box">
          <div class="box-title">
            <span><app-pixel name="folder" [scale]="1" /> {{ p.name }}</span>
            <span class="status" [class]="p.status">{{ p.status }}</span>
          </div>
          <div class="box-body">
            <p>{{ p.description }}</p>
            <div class="tags">
              @for (t of p.tech; track t) {
                <span class="tag">{{ t }}</span>
              }
            </div>
            @if (p.url || p.repo) {
              <p class="links">
                @if (p.url) { <a [href]="p.url" target="_blank" rel="noopener">[visit]</a> }
                @if (p.repo) { <a [href]="p.repo" target="_blank" rel="noopener">[source]</a> }
              </p>
            }
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
    .grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
      gap: 14px;
    }
    .box-title > span:first-child {
      display: inline-flex;
      align-items: center;
      gap: 6px;
    }
    .status {
      font-size: 7px;
      padding: 2px 4px;
      background: #0b0b0b;
      border: 1px solid #fff;
    }
    .status.live { color: #6f6; }
    .status.wip { color: var(--yellow); }
    .status.archived { color: var(--text-muted); }
    .tags {
      display: flex;
      flex-wrap: wrap;
      gap: 4px;
      margin-top: 10px;
    }
    .links {
      margin-top: 10px;
      display: flex;
      gap: 10px;
    }
  `],
})
export class ProjectsPage {
  readonly projects = projects;
}
