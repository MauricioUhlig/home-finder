import { Component, Input } from '@angular/core';
import { Location } from '../../models/location.model'

@Component({
  selector: 'app-location-item',
  imports: [],
  templateUrl: './location-item.component.html',
  styleUrl: './location-item.component.css'
})
export class LocationItemComponent {
  @Input() location!: Location;
}
