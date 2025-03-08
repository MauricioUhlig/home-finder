import { Component, Input } from '@angular/core';
import { Location } from '../../models/location.model'
import { LocationDetailsService } from '../../services/location-details.service';

@Component({
  selector: 'app-location-item',
  templateUrl: './location-item.component.html',
  styleUrl: './location-item.component.css'
})
export class LocationItemComponent {
  @Input() location!: Location;

  constructor(private locationDetailsService: LocationDetailsService) { }

  openDetails() {
    this.locationDetailsService.openDetailsMenu(this.location.Id ?? 0);
  }

  get shortDescription(): string {
    const maxSize: number = 80;
    if (this.location.Description.length > maxSize)
      return this.location.Description.substring(0, maxSize) + '...';

    return this.location.Description;
  }
}
