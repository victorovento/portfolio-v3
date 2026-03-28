import { Component } from '@angular/core';
import { NavbarComponent }    from './components/navbar.component';
import { HeroComponent }      from './components/hero.component';
import { AboutComponent }     from './components/about.component';
import { ExperienceComponent } from './components/experience.component';
import { SkillsComponent }    from './components/skills.component';
import { ContactComponent }   from './components/contact.component';
import { ParticleBgComponent } from './components/particle-bg.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    NavbarComponent,
    HeroComponent,
    AboutComponent,
    ExperienceComponent,
    SkillsComponent,
    ContactComponent,
    ParticleBgComponent,
  ],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {}
