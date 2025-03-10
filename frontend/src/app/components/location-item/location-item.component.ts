import { Component, Input } from '@angular/core';
import { Location } from '../../models/location.model'
import { LocationDetailsService } from '../../services/location-details.service';
import { getEmptyLocationMetrics, LocationMetrics } from '../../models/location-metrics.model';
import { DataService } from '../../services/data.service';

@Component({
  selector: 'app-location-item',
  templateUrl: './location-item.component.html',
  styleUrl: './location-item.component.css'
})
export class LocationItemComponent {
  @Input() location!: Location;

  metrics: LocationMetrics = getEmptyLocationMetrics();

  constructor(private locationDetailsService: LocationDetailsService, private dataService: DataService) { }

  async ngOnInit() {
    this.metrics = await this.dataService.getMetricsByLocationId(this.location.Id!) ?? getEmptyLocationMetrics();
  }

  openDetails() {
    this.locationDetailsService.openDetailsMenu(this.location.Id ?? 0);
  }

  get formatedPrice(): string {
    if (this.location.Price > 1000)
      return (this.location.Price / 1000) + 'K'

    return String(this.location.Price);
  }
  get shortDescription(): string {
    const maxSize: number = 80;
    if (this.location.Description.length > maxSize)
      return this.location.Description.substring(0, maxSize) + '...';

    return this.location.Description;
  }
}
