import { Component } from '@angular/core';
import { skillGroups } from '../config';
import { FadeInDirective } from '../directives/fade-in.directive';

@Component({
  selector: 'app-skills',
  standalone: true,
  imports: [FadeInDirective],
  template: `
    <section id="skills">
      <div class="container">
        <h2 class="section-title" [appFadeIn]="0">My <span>Skills</span></h2>

        <div class="groups">
          @for (group of groups; track group.category; let i = $index) {
            <div class="group" [appFadeIn]="i * 80">
              <h3 class="category">{{ group.category }}</h3>
              <div class="chips">
                @for (skill of group.skills; track skill) {
                  <span class="chip">{{ skill }}</span>
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
      background: transparent;
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

    /* ── Groups ── */
    .groups {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
      gap: 2rem;
    }

    .group {
      background: #131313;
      border: 1px solid #1e1e1e;
      border-radius: 10px;
      padding: 1.5rem;
      transition: border-color 0.25s;
    }

    .group:hover { border-color: #2e2e2e; }

    .category {
      font-size: 0.75rem;
      font-weight: 700;
      color: #e53935;
      text-transform: uppercase;
      letter-spacing: 1.5px;
      margin-bottom: 1.125rem;
    }

    .chips {
      display: flex;
      flex-wrap: wrap;
      gap: 0.5rem;
    }

    .chip {
      background: #1a1a1a;
      color: #a0a0a0;
      border: 1px solid #252525;
      border-radius: 6px;
      font-size: 0.8rem;
      font-weight: 500;
      padding: 0.3rem 0.75rem;
      transition: color 0.2s, border-color 0.2s, background 0.2s;
      cursor: default;
    }

    .chip:hover {
      color: #f0f0f0;
      border-color: #404040;
      background: #222;
    }
  `],
})
export class SkillsComponent {
  groups = skillGroups;
}
