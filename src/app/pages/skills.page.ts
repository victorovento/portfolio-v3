import { Component } from '@angular/core';
import { skillGroups } from '../config';

@Component({
  selector: 'app-skills-page',
  template: `
    <h2>Skill <span>Inventory</span></h2>
    <p class="intro">Every item I've picked up on my adventure so far.</p>

    <div class="grid">
      @for (group of skillGroups; track group.category) {
        <section class="box">
          <div class="box-title">{{ group.category }} <span class="count">{{ group.skills.length }} items</span></div>
          <ul class="box-body">
            @for (skill of group.skills; track skill) {
              <li>{{ skill }}</li>
            }
          </ul>
        </section>
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
      grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
      gap: 14px;
    }
    .count {
      font-size: 7px;
      opacity: 0.8;
    }
    ul { list-style: none; }
    li {
      padding: 3px 0;
      border-bottom: 1px dotted var(--border);
    }
    li:last-child { border-bottom: 0; }
    li::before {
      content: '► ';
      color: var(--red);
      font-size: 10px;
    }
    li:hover {
      color: #fff;
      background: #1a0606;
    }
  `],
})
export class SkillsPage {
  readonly skillGroups = skillGroups;
}
