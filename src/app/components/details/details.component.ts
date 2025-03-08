import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FullLocation, getEmptyFullLocation } from '../../models/full-location.model';
import { DataService } from '../../services/data.service';
import { ActivatedRoute } from '@angular/router';
import { PhoneComponent } from '../phone/phone.component';
import { CommonModule } from '@angular/common';
import { MapComponent } from '../map/map.component';
import { LocationDetailsService } from '../../services/location-details.service'
import { UtilService } from '../../services/util.service';
import { SliderComponent } from '../slider/slider.component';
import { createEmptyLocationMetrics, getEmptyLocationMetrics, LocationMetrics } from '../../models/location-metrics.model';
import { CommentListComponent } from '../comment-list/comment-list.component';

@Component({
  selector: 'app-details',
  imports: [PhoneComponent, CommonModule, MapComponent, FormsModule, SliderComponent, CommentListComponent],
  templateUrl: './details.component.html',
  styleUrl: './details.component.css'
})
export class DetailsComponent implements OnInit {
  location: FullLocation = getEmptyFullLocation();
  metrics: LocationMetrics = getEmptyLocationMetrics();
  isOverlayMode = true;
  resize$: any;
  metricChanged: boolean = false;

  constructor(private route: ActivatedRoute, private dataService: DataService, private detailsService: LocationDetailsService, private util: UtilService) { }

  async ngOnInit() {
    this.resize$ = this.util.isSmallScreen().subscribe((small) => {
      this.isOverlayMode = !small;
    });
    this.route.children.forEach(childRoute => {
      childRoute.paramMap.subscribe(params => {
        let locationId = params.get('id') || '';
        this.getLocation(locationId);
      });
    });
  }

  metricsChange(){
    this.metricChanged = true;
    console.log(this.metrics)
  }

  updateMetrics(){
    this.metricChanged = false;
    this.dataService.saveMetric(this.metrics);
  }

  ngOnDestroy() {
    // Clean up window resize listener
    this.resize$.unsubscribe();
  }

  edit(): void {
    this.detailsService.openEditMenu(this.location.Id!)
  }

  closeMenu(): void {
    this.detailsService.closeDetailsMenu();
  }

  async getLocation(locationId: any) {
    if (locationId && Number(locationId)) {
      let resp = await this.dataService.getById(Number(locationId));
      if (resp !== undefined)
        this.location = resp

      let metrics = await this.dataService.getMetricsByLocationId(resp?.Id!);
      if (metrics !== undefined)
        this.metrics = metrics;
      else
        this.metrics = createEmptyLocationMetrics(resp?.Id!)
    }
  }

  computedAddress(): string {
    let address = this.concatWithComma(this.location.Address?.Street,
      this.location.Address?.District,
      this.location.Address?.City)

    return address;
  }

  concatWithComma(...values: (string | null | undefined)[]): string {
    return values.filter(value => value).join(', ');
  }

  get formatedPrice(): string {
    if (this.location.Price > 1000)
      return (this.location.Price / 1000) + 'K'

    return String(this.location.Price);
  }
}
