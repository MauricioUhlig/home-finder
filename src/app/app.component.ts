import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HomeMapComponent } from './components/home-map/home-map.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  imports: [RouterOutlet, HomeMapComponent],
})
export class AppComponent {
}