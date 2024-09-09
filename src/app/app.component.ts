import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { WebBuilderComponent } from './web-builder/web-builder.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, WebBuilderComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'grapesjs-tutorial';
}
