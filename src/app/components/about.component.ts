import { Component } from '@angular/core';
import { personal } from '../config';
import { FadeInDirective } from '../directives/fade-in.directive';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [FadeInDirective],
  template: `
    <section id="about">
      <div class="container">
        <h2 class="section-title" [appFadeIn]="0">About <span>Me</span></h2>

        <div class="grid">
          <div class="text-col" [appFadeIn]="100">
            @for (paragraph of bio; track $index) {
              <p>{{ paragraph }}</p>
            }

            <dl class="facts">
              <div class="fact">
                <dt>Based in</dt>
                <dd>{{ location }}</dd>
              </div>
              <div class="fact">
                <dt>Available for</dt>
                <dd>{{ availability }}</dd>
              </div>
              <div class="fact">
                <dt>Email</dt>
                <dd><a [href]="'mailto:' + email">{{ email }}</a></dd>
              </div>
            </dl>
          </div>

          <div class="photo-col" [appFadeIn]="200">
            <div class="frame">
              <!-- Replace assets/photo.jpg with your actual photo -->
              <img
                src="assets/photo.jpg"
                alt="Victor Vento"
                (error)="onImgError($event)"
              />
              <div class="placeholder" [class.visible]="imgError">VV</div>
            </div>
          </div>
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

    /* ── Grid ── */
    .grid {
      display: grid;
      grid-template-columns: 1fr 300px;
      gap: 5rem;
      align-items: center;
    }

    /* ── Text ── */
    .text-col p {
      color: #808080;
      font-size: 1rem;
      line-height: 1.85;
      margin-bottom: 1.2rem;
    }

    .facts {
      margin-top: 2rem;
      display: flex;
      flex-direction: column;
      gap: 0.625rem;
    }

    .fact {
      display: flex;
      align-items: baseline;
      gap: 1rem;
    }

    dt {
      font-size: 0.8rem;
      font-weight: 600;
      color: #303030;
      min-width: 105px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    dd {
      font-size: 0.9rem;
      color: #c0c0c0;
      font-weight: 500;
    }

    dd a {
      color: #e53935;
      text-decoration: none;
    }

    dd a:hover { text-decoration: underline; }

    /* ── Photo ── */
    .photo-col {
      display: flex;
      justify-content: center;
    }

    .frame {
      position: relative;
      width: 280px;
      height: 340px;
      border-radius: 14px;
      overflow: hidden;
      border: 1px solid #1e1e1e;
    }

    .frame::before {
      content: '';
      position: absolute;
      inset: 0;
      background: linear-gradient(145deg, rgba(229, 57, 53, 0.12) 0%, transparent 55%);
      z-index: 1;
      pointer-events: none;
    }

    .frame img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      object-position: center top;
      display: block;
    }

    .placeholder {
      display: none;
      align-items: center;
      justify-content: center;
      position: absolute;
      inset: 0;
      background: #131313;
      font-size: 3.5rem;
      font-weight: 800;
      color: #e53935;
    }

    .placeholder.visible { display: flex; }

    @media (max-width: 900px) {
      .grid {
        grid-template-columns: 1fr;
        gap: 3rem;
      }

      .photo-col { order: -1; }

      .frame {
        width: 200px;
        height: 240px;
      }
    }
  `],
})
export class AboutComponent {
  bio          = personal.bio;
  location     = personal.location;
  availability = personal.availability;
  email        = personal.email;
  imgError     = false;

  onImgError(event: Event) {
    (event.target as HTMLImageElement).style.display = 'none';
    this.imgError = true;
  }
}
