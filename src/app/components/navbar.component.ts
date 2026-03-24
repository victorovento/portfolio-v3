import { Component, HostListener, signal } from '@angular/core';

@Component({
  selector: 'app-navbar',
  standalone: true,
  template: `
    <nav [class.scrolled]="scrolled()">
      <div class="inner">
        <a class="logo" href="#hero" (click)="scrollTo('hero', $event)">VV</a>

        <button
          class="hamburger"
          [class.open]="menuOpen()"
          (click)="toggleMenu()"
          aria-label="Toggle navigation menu"
        >
          <span></span><span></span><span></span>
        </button>

        <ul class="links" [class.open]="menuOpen()">
          @for (link of links; track link.id) {
            <li>
              <a
                [class.active]="active() === link.id"
                [href]="'#' + link.id"
                (click)="scrollTo(link.id, $event)"
              >{{ link.label }}</a>
            </li>
          }
        </ul>
      </div>
    </nav>
  `,
  styles: [`
    nav {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      z-index: 100;
      padding: 1.375rem 0;
      transition: background 0.35s, box-shadow 0.35s;
    }

    nav.scrolled {
      background: rgba(10, 10, 10, 0.88);
      backdrop-filter: blur(14px);
      -webkit-backdrop-filter: blur(14px);
      box-shadow: 0 1px 0 rgba(255, 255, 255, 0.05);
    }

    .inner {
      max-width: 1100px;
      margin: 0 auto;
      padding: 0 2rem;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .logo {
      font-size: 1.35rem;
      font-weight: 800;
      color: #e53935;
      text-decoration: none;
      letter-spacing: -0.5px;
      user-select: none;
    }

    .links {
      display: flex;
      gap: 2.75rem;
      list-style: none;
    }

    .links a {
      color: #606060;
      text-decoration: none;
      font-size: 0.875rem;
      font-weight: 500;
      letter-spacing: 0.2px;
      transition: color 0.2s;
    }

    .links a:hover  { color: #f0f0f0; }
    .links a.active { color: #e53935; }

    /* ── Hamburger ── */
    .hamburger {
      display: none;
      flex-direction: column;
      gap: 5px;
      background: none;
      border: none;
      cursor: pointer;
      padding: 4px;
    }

    .hamburger span {
      display: block;
      width: 22px;
      height: 2px;
      background: #f0f0f0;
      border-radius: 2px;
      transition: transform 0.28s ease, opacity 0.28s ease;
    }

    .hamburger.open span:nth-child(1) { transform: translateY(7px) rotate(45deg); }
    .hamburger.open span:nth-child(2) { opacity: 0; transform: scaleX(0); }
    .hamburger.open span:nth-child(3) { transform: translateY(-7px) rotate(-45deg); }

    @media (max-width: 700px) {
      .hamburger { display: flex; }

      .links {
        display: none;
        position: fixed;
        inset: 0;
        background: rgba(10, 10, 10, 0.97);
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 2.75rem;
      }

      .links.open { display: flex; }

      .links a {
        font-size: 1.5rem;
        font-weight: 600;
      }
    }
  `],
})
export class NavbarComponent {
  scrolled = signal(false);
  menuOpen = signal(false);
  active = signal('hero');

  links = [
    { id: 'about',      label: 'About' },
    { id: 'experience', label: 'Experience' },
    { id: 'skills',     label: 'Skills' },
    { id: 'contact',    label: 'Contact' },
  ];

  @HostListener('window:scroll')
  onScroll() {
    this.scrolled.set(window.scrollY > 60);
    this.updateActive();
  }

  scrollTo(id: string, event: Event) {
    event.preventDefault();
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    this.menuOpen.set(false);
  }

  toggleMenu() {
    this.menuOpen.update((v) => !v);
  }

  private updateActive() {
    const ids = ['contact', 'skills', 'experience', 'about', 'hero'];
    for (const id of ids) {
      const el = document.getElementById(id);
      if (el && window.scrollY >= el.offsetTop - 130) {
        this.active.set(id);
        return;
      }
    }
  }
}
