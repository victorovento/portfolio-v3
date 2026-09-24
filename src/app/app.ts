import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { personal } from './config';
import { LeftSidebarComponent } from './layout/left-sidebar.component';
import { RightSidebarComponent } from './layout/right-sidebar.component';
import { SparklesComponent } from './components/sparkles.component';
import { RainComponent } from './components/rain.component';
import { EasterEggComponent } from './components/easter-egg.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, LeftSidebarComponent, RightSidebarComponent, RainComponent, SparklesComponent, EasterEggComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  readonly personal = personal;
  readonly year = new Date().getFullYear();

  readonly marquee = [
    'welcome to victorvento.net!',
    'software developer from melbourne, fl',
    'now with 100% more pixels',
    'sign up for nothing, there are no cookies here',
    'the cat is friendly, go pet it',
  ];

  constructor() {
    console.log(
      '%c hey there, fellow dev! 👾 %c\nPoking around the source? Say hi: ' + personal.email + '\n(psst: ↑ ↑ ↓ ↓ ← → ← → B A)',
      'background:#e53935;color:#fff;font:bold 14px monospace;padding:4px',
      'color:#e53935;font:12px monospace',
    );
  }

  // The router uses hash URLs, so a plain #main link would navigate away.
  skipToContent(e: Event) {
    e.preventDefault();
    document.getElementById('main')?.focus();
  }
}
