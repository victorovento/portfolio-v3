import { Component, signal } from '@angular/core';
import { coolLinks } from '../config';
import { buttons } from '../layout/right-sidebar.component';

const MY_BUTTON_HTML =
  '<a href="https://victorvento.net"><img src="https://victorvento.net/assets/buttons/victorvento.svg" alt="Victor Vento" width="88" height="31"></a>';

@Component({
  selector: 'app-links-page',
  template: `
    <h2>Cool <span>Links</span></h2>
    <p class="intro">Corners of the internet worth visiting.</p>

    <section class="box">
      <div class="box-title">bookmarks.htm</div>
      <ul class="box-body links">
        @for (l of coolLinks; track l.url) {
          <li>
            <a [href]="l.url" target="_blank" rel="noopener">{{ l.name }}</a>
            <span> - {{ l.description }}</span>
          </li>
        }
      </ul>
    </section>

    <section class="box">
      <div class="box-title">link to me!</div>
      <div class="box-body">
        <p>Want to link to my site? Feel free to use my button:</p>
        <img class="mine" src="assets/buttons/victorvento.svg" alt="Victor Vento" width="88" height="31" />
        <textarea readonly rows="3" [value]="myButtonHtml" aria-label="HTML code for my button"></textarea>
        <button class="btn" type="button" (click)="copy()">{{ copied() ? '✓ copied!' : 'copy code' }}</button>
      </div>
    </section>

    <section class="box">
      <div class="box-title">button wall</div>
      <div class="box-body wall">
        @for (b of buttons; track b.src) {
          <img [src]="b.src" [alt]="b.alt" [title]="b.alt" width="88" height="31" />
        }
      </div>
    </section>
  `,
  styles: [`
    :host {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }
    .intro { color: var(--text-muted); }
    .links { list-style: none; }
    .links li {
      padding: 5px 0;
      border-bottom: 1px dotted var(--border);
    }
    .links li:last-child { border-bottom: 0; }
    .links li::before {
      content: '★ ';
      color: var(--yellow);
    }
    .links span { color: var(--text-muted); }
    .mine {
      display: block;
      margin: 10px 0;
      image-rendering: pixelated;
    }
    textarea {
      display: block;
      width: 100%;
      font-family: 'Courier New', monospace;
      font-size: 11px;
      color: #6f6;
      background: #000;
      border: 2px inset #444;
      padding: 6px;
      margin-bottom: 8px;
      resize: none;
    }
    .wall {
      display: flex;
      flex-wrap: wrap;
      gap: 4px;
    }
    .wall img { image-rendering: pixelated; }
  `],
})
export class LinksPage {
  readonly coolLinks = coolLinks;
  readonly buttons = buttons;
  readonly myButtonHtml = MY_BUTTON_HTML;
  readonly copied = signal(false);

  async copy() {
    try {
      await navigator.clipboard.writeText(MY_BUTTON_HTML);
      this.copied.set(true);
      setTimeout(() => this.copied.set(false), 2000);
    } catch {
      // Clipboard unavailable; the textarea is still selectable.
    }
  }
}
