import { Component, Input } from '@angular/core';
import { Location } from '../../models/location.model'
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-location-item',
  imports: [RouterLink],
  templateUrl: './location-item.component.html',
  styleUrl: './location-item.component.css'
})
export class LocationItemComponent {
  @Input() location!: Location;
}
