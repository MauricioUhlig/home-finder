import { Component, Input } from '@angular/core';
import { Location } from '../../models/location.model'
import { RouterLink } from '@angular/router';
import { LocationDetailsService } from '../../services/location-details.service';

@Component({
  selector: 'app-location-item',
  imports: [RouterLink],
  templateUrl: './location-item.component.html',
  styleUrl: './location-item.component.css'
})
export class LocationItemComponent {
  @Input() location!: Location;

  constructor(private locationDetailsService: LocationDetailsService){}

  openDetails() {
    this.locationDetailsService.openDetailsMenu(this.location.Id ?? 0);
  }
}
