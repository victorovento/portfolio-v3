import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { PixelComponent } from '../pixel/pixel.component';

@Component({
  selector: 'app-not-found-page',
  imports: [RouterLink, PixelComponent],
  template: `
    <section class="box">
      <div class="box-title">error.exe</div>
      <div class="box-body center">
        <app-pixel name="catBlink" [scale]="6" />
        <h2>404 - <span>page not found</span></h2>
        <p>The cat knocked this page off the table. It is gone forever.</p>
        <p><a class="btn" routerLink="/">« take me home</a></p>
      </div>
    </section>
  `,
  styles: [`
    .center {
      text-align: center;
      padding: 30px 12px;
    }
    h2 { margin-top: 16px; }
    p { margin-top: 12px; }
  `],
})
export class NotFoundPage {}
