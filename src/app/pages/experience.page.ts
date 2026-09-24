import { Component } from '@angular/core';
import { experiences } from '../config';

@Component({
  selector: 'app-experience-page',
  template: `
    <h2>Work <span>Experience</span></h2>
    <p class="intro">Places I've worked and things I've built there. Newest first.</p>

    <ol class="timeline">
      @for (job of experiences; track job.company) {
        <li class="box">
          <div class="box-title">
            <span>{{ slug(job.company) }}.exe</span>
            <span class="controls"><span></span><span></span><span></span></span>
          </div>
          <div class="box-body">
            <h3>{{ job.role }}</h3>
            <p class="meta">
              <b>{{ job.company }}</b> · {{ job.city }} ·
              <span class="dates">{{ job.startDate }} → {{ job.endDate }}</span>
            </p>
            <p>{{ job.description }}</p>
          </div>
        </li>
      }
    </ol>
  `,
  styles: [`
    .intro {
      color: var(--text-muted);
      margin-bottom: 14px;
    }
    .timeline {
      list-style: none;
      display: flex;
      flex-direction: column;
      gap: 16px;
      padding-left: 22px;
      border-left: 2px dashed var(--red-dark);
    }
    .timeline li { position: relative; }
    .timeline li::before {
      content: '';
      position: absolute;
      left: -31px;
      top: 8px;
      width: 12px;
      height: 12px;
      background: var(--red);
      border: 2px solid #0b0b0b;
      box-shadow: 0 0 0 2px var(--red-dark);
    }
    .meta {
      font-size: 11px;
      color: var(--text-muted);
      margin-bottom: 8px;
    }
    .dates { color: var(--yellow); }
  `],
})
export class ExperiencePage {
  readonly experiences = experiences;

  slug(s: string) {
    return s.toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_|_$/g, '');
  }
}
