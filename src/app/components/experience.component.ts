import { Component } from '@angular/core';
import { experiences } from '../config';
import { FadeInDirective } from '../directives/fade-in.directive';

@Component({
  selector: 'app-experience',
  standalone: true,
  imports: [FadeInDirective],
  template: `
    <section id="experience">
      <div class="container">
        <h2 class="section-title" [appFadeIn]="0">Work <span>Experience</span></h2>

        <div class="timeline">
          @for (exp of items; track exp.company; let i = $index) {
            <div class="item" [appFadeIn]="i * 100">
              <div class="card">
                <div class="card-top">
                  <div class="left">
                    <h3 class="company">{{ exp.company }}</h3>
                    <p class="role">{{ exp.role }}</p>
                  </div>
                  <div class="right">
                    <span class="location">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75"><path stroke-linecap="round" stroke-linejoin="round" d="M12 2C8.134 2 5 5.134 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.866-3.134-7-7-7zm0 9.5a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5z"/></svg>
                      {{ exp.city }}
                    </span>
                    <span class="dates">{{ exp.startDate }} — {{ exp.endDate }}</span>
                  </div>
                </div>
                <p class="description">{{ exp.description }}</p>

                @if (exp.endDate === 'Present') {
                  <span class="badge">Current</span>
                }
              </div>
            </div>
          }
        </div>
      </div>
    </section>
  `,
  styles: [`
    section {
      padding: 110px 0;
      background: #0a0a0a;
    }

    .container {
      max-width: 1100px;
      margin: 0 auto;
      padding: 0 2rem;
    }

    /* ── Section Title ── */
    .section-title {
      font-size: 2rem;
      font-weight: 700;
      letter-spacing: -0.5px;
      margin-bottom: 3.5rem;
    }

    .section-title span { color: #e53935; }

    .section-title::after {
      content: '';
      display: block;
      width: 38px;
      height: 3px;
      background: #e53935;
      border-radius: 2px;
      margin-top: 0.75rem;
    }

    /* ── Timeline ── */
    .timeline {
      position: relative;
      border-left: 1px solid #1e1e1e;
      padding-left: 2.5rem;
    }

    .item {
      position: relative;
      margin-bottom: 2rem;
    }

    .item:last-child { margin-bottom: 0; }

    /* Dot on the timeline */
    .item::before {
      content: '';
      position: absolute;
      left: -2.5rem;
      top: 1.5rem;
      width: 10px;
      height: 10px;
      border-radius: 50%;
      background: #e53935;
      transform: translateX(-50%);
      box-shadow: 0 0 0 4px rgba(229, 57, 53, 0.15);
    }

    /* ── Card ── */
    .card {
      position: relative;
      background: #131313;
      border: 1px solid #1e1e1e;
      border-radius: 10px;
      padding: 1.75rem;
      transition: border-color 0.25s;
    }

    .card:hover { border-color: #2e2e2e; }

    .card-top {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      gap: 1.5rem;
      margin-bottom: 1rem;
    }

    .company {
      font-size: 1.05rem;
      font-weight: 700;
      color: #f0f0f0;
      margin-bottom: 0.3rem;
    }

    .role {
      font-size: 0.9rem;
      color: #e53935;
      font-weight: 500;
    }

    .right {
      display: flex;
      flex-direction: column;
      align-items: flex-end;
      gap: 0.375rem;
      flex-shrink: 0;
    }

    .location {
      display: flex;
      align-items: center;
      gap: 0.3rem;
      font-size: 0.8rem;
      color: #505050;
    }

    .location svg {
      width: 13px;
      height: 13px;
    }

    .dates {
      font-size: 0.8rem;
      color: #404040;
      font-weight: 500;
    }

    .description {
      font-size: 0.9rem;
      color: #707070;
      line-height: 1.75;
    }

    .badge {
      position: absolute;
      top: 1.25rem;
      right: 1.25rem;
      background: rgba(229, 57, 53, 0.1);
      color: #e53935;
      font-size: 0.7rem;
      font-weight: 700;
      letter-spacing: 0.8px;
      text-transform: uppercase;
      padding: 0.2rem 0.6rem;
      border-radius: 4px;
      border: 1px solid rgba(229, 57, 53, 0.25);
    }

    @media (max-width: 700px) {
      .card-top {
        flex-direction: column;
        gap: 0.75rem;
      }

      .right {
        align-items: flex-start;
      }
    }
  `],
})
export class ExperienceComponent {
  items = experiences;
}
