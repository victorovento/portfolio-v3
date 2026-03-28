import { Component } from '@angular/core';
import { personal } from '../config';
import { FadeInDirective } from '../directives/fade-in.directive';

@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [FadeInDirective],
  template: `
    <section id="hero">
      <div class="glow"></div>
      <div class="container">
        <p class="greeting" [appFadeIn]="0">Hi there, I'm</p>
        <h1 [appFadeIn]="100">{{ name }}</h1>
        <p class="role" [appFadeIn]="200">{{ role }}</p>
        <p class="tagline" [appFadeIn]="300">{{ tagline }}</p>

        <div class="socials" [appFadeIn]="400">
          <a [href]="github" target="_blank" rel="noopener noreferrer" aria-label="GitHub">
            <!-- GitHub -->
            <svg viewBox="0 0 24 24"><path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0 1 12 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/></svg>
          </a>
          <a [href]="linkedin" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
            <!-- LinkedIn -->
            <svg viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
          </a>
          <a [href]="instagram" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
            <!-- Instagram -->
            <svg viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.74 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"/></svg>
          </a>
        </div>

        <div class="cta" [appFadeIn]="500">
          <a [href]="cvPath" download class="btn-primary">Download CV</a>
          <a href="#contact" (click)="scrollTo($event)" class="btn-outline">Get in Touch</a>
        </div>
      </div>

      <div class="scroll-hint">
        <div class="mouse"><div class="wheel"></div></div>
      </div>
    </section>
  `,
  styles: [`
    section {
      position: relative;
      min-height: 100vh;
      display: flex;
      align-items: center;
      padding: 80px 0 0;
      background: transparent;
      overflow: hidden;
    }

    .glow {
      position: absolute;
      top: -180px;
      right: -180px;
      width: 650px;
      height: 650px;
      background: radial-gradient(circle, rgba(229, 57, 53, 0.07) 0%, transparent 68%);
      pointer-events: none;
    }

    .container {
      max-width: 1100px;
      margin: 0 auto;
      padding: 0 2rem;
      position: relative;
      z-index: 1;
    }

    .greeting {
      font-size: 0.95rem;
      font-weight: 500;
      color: #e53935;
      letter-spacing: 2.5px;
      text-transform: uppercase;
      margin-bottom: 1.25rem;
      text-shadow: 0 0 12px rgba(229, 57, 53, 0.55), 0 0 30px rgba(229, 57, 53, 0.2);
    }

    h1 {
      font-size: clamp(3.25rem, 9vw, 6rem);
      font-weight: 800;
      line-height: 1;
      letter-spacing: -3px;
      color: #f0f0f0;
      margin-bottom: 0.75rem;
      text-shadow: 0 0 40px rgba(10,10,10,0.95), 0 0 80px rgba(10,10,10,0.8), 0 2px 24px rgba(240,240,240,0.07);
    }

    .role {
      font-size: clamp(1.5rem, 4vw, 2.75rem);
      font-weight: 300;
      color: #3a3a3a;
      letter-spacing: -1px;
      margin-bottom: 1.5rem;
      text-shadow: 0 0 20px rgba(10,10,10,0.9);
    }

    .tagline {
      font-size: 1.05rem;
      color: #505050;
      margin-bottom: 3rem;
      max-width: 460px;
      text-shadow: 0 0 16px rgba(10,10,10,0.9);
    }

    /* ── Social Icons ── */
    .socials {
      display: flex;
      gap: 0.75rem;
      margin-bottom: 2.5rem;
    }

    .socials a {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 42px;
      height: 42px;
      border: 1px solid #1e1e1e;
      border-radius: 8px;
      color: #505050;
      text-decoration: none;
      transition: color 0.2s, border-color 0.2s, background 0.2s;
    }

    .socials a:hover {
      color: #e53935;
      border-color: #e53935;
      background: rgba(229, 57, 53, 0.06);
    }

    .socials svg {
      width: 18px;
      height: 18px;
      fill: currentColor;
    }

    /* ── CTA ── */
    .cta {
      display: flex;
      gap: 1rem;
      flex-wrap: wrap;
    }

    .btn-primary {
      display: inline-block;
      padding: 0.8rem 2rem;
      background: #e53935;
      color: #fff;
      text-decoration: none;
      border-radius: 6px;
      font-size: 0.9rem;
      font-weight: 600;
      letter-spacing: 0.2px;
      transition: background 0.2s, transform 0.15s;
    }

    .btn-primary:hover {
      background: #ef5350;
      transform: translateY(-2px);
    }

    .btn-outline {
      display: inline-block;
      padding: 0.8rem 2rem;
      background: transparent;
      color: #f0f0f0;
      text-decoration: none;
      border: 1px solid #252525;
      border-radius: 6px;
      font-size: 0.9rem;
      font-weight: 600;
      letter-spacing: 0.2px;
      transition: border-color 0.2s, transform 0.15s;
    }

    .btn-outline:hover {
      border-color: #505050;
      transform: translateY(-2px);
    }

    /* ── Scroll hint ── */
    .scroll-hint {
      position: absolute;
      bottom: 2.5rem;
      left: 50%;
      transform: translateX(-50%);
    }

    .mouse {
      width: 23px;
      height: 36px;
      border: 1.5px solid #252525;
      border-radius: 12px;
      display: flex;
      justify-content: center;
      padding-top: 6px;
    }

    .wheel {
      width: 3px;
      height: 7px;
      background: #404040;
      border-radius: 2px;
      animation: scrollAnim 1.8s ease-in-out infinite;
    }

    @keyframes scrollAnim {
      0%   { opacity: 1; transform: translateY(0); }
      80%  { opacity: 0; transform: translateY(9px); }
      100% { opacity: 0; transform: translateY(9px); }
    }

    @media (max-width: 700px) {
      h1 { letter-spacing: -2px; }
      .role { letter-spacing: -0.5px; }
    }
  `],
})
export class HeroComponent {
  name     = personal.name;
  role     = personal.role;
  tagline  = personal.tagline;
  github   = personal.github;
  linkedin = personal.linkedin;
  instagram = personal.instagram;
  cvPath   = personal.cvPath;

  scrollTo(event: Event) {
    event.preventDefault();
    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
  }
}
