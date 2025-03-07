import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FullLocation, getEmptyFullLocation } from '../../models/full-location.model';
import { DataService } from '../../services/data.service';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { PhoneComponent } from '../phone/phone.component';
import { CommonModule } from '@angular/common';
import { MapComponent } from '../map/map.component';
import { LocationDetailsService } from '../../services/location-details.service'
import { UtilService } from '../../services/util.service';
import { SliderComponent } from '../slider/slider.component';

@Component({
  selector: 'app-details',
  imports: [PhoneComponent, CommonModule, MapComponent, RouterLink, FormsModule, SliderComponent],
  templateUrl: './details.component.html',
  styleUrl: './details.component.css'
})
export class DetailsComponent implements OnInit {
  location: FullLocation = getEmptyFullLocation();
  isOverlayMode = true;
  resize$: any;

  constructor(private route: ActivatedRoute, private dataService: DataService, private detailsService: LocationDetailsService, private util: UtilService) { }

  async ngOnInit() {
    this.resize$ = this.util.isSmallScreen().subscribe((small) => {
      this.isOverlayMode = !small;
    });
    this.route.children.forEach(childRoute => {
      childRoute.paramMap.subscribe(params => {
        let locationId = params.get('id') || '';
        console.log(locationId)
        this.getLocation(locationId);
      });
    });
  }



  ngOnDestroy() {
    // Clean up window resize listener
    this.resize$.unsubscribe();
  }

  closeMenu(): void {
    this.detailsService.closeDetailsMenu();
  }

  async getLocation(locationId: any) {
    if (locationId && Number(locationId)) {
      var resp = await this.dataService.getById(Number(locationId));
      if (resp !== undefined)
        this.location = resp
    }
    console.log(locationId, this.location)
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

}
