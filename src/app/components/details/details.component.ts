import { Component } from '@angular/core';
import { FullLocation, getEmptyFullLocation } from '../../models/full-location.model';
import { DataService } from '../../services/data.service';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { PhoneComponent } from '../phone/phone.component';
import { CommonModule } from '@angular/common';
import { MapComponent } from '../map/map.component';

@Component({
  selector: 'app-details',
  imports: [PhoneComponent, CommonModule, MapComponent, RouterLink],
  templateUrl: './details.component.html',
  styleUrl: './details.component.css'
})
export class DetailsComponent {
  location: FullLocation = getEmptyFullLocation();

  constructor(private route: ActivatedRoute, private dataService: DataService) { }

  async ngOnInit() {
    let locationId = this.route.snapshot.paramMap.get('id');
    await this.getLocation(locationId);

  }

  async getLocation(locationId: any) {
    if (locationId && Number(locationId)) {
      var resp = await this.dataService.getById(Number(locationId));
      if (resp !== undefined)
        this.location = resp
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

}
