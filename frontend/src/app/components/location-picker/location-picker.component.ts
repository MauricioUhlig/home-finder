import {
    Component,
    EventEmitter,
    Input,
    type OnChanges,
    type OnDestroy,
    type OnInit,
    Output,
    type SimpleChanges,
  } from "@angular/core"
  import { CommonModule } from "@angular/common"
  import * as L from "leaflet"
import { UtilService } from "../../services/util.service";
  
  @Component({
    selector: "app-location-picker",
    standalone: true,
    imports: [CommonModule],
    template: `<div id="location-picker" class="h-100 w-100"></div>`,
    styles: [`
        :host {
          display: block;
          height: 100%;
          width: 100%;
        }
      `]
  })
  export class LocationPickerComponent implements OnInit, OnDestroy {
    @Input() initialPosition?: L.LatLng | null;
    @Output() locationPick = new EventEmitter<{ lat: number; lng: number }>()
  
    private map?: L.Map
    private marker?: L.Marker

    constructor(private util: UtilService){}
  
    ngOnInit(): void {
        // Initialize map
        setTimeout(() => {
            this.initMap()
        })
    }
  

  
    ngOnDestroy(): void {
      if (this.map) {
        this.map.remove()
      }
    }
  
    createCustomMarker(): L.Icon {
      return L.icon({
        iconUrl: `images/point-blue.webp`, // Update with your icon path
        iconSize: [35, 35],
        iconAnchor: [10, 34],
        popupAnchor: [0, -34],
      });
    }

    private initMap(): void {
      console.log(this.util.initialLatLng)
      this.map = L.map("location-picker").setView(this.initialPosition??this.util.initialLatLng, 16)
  
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png").addTo(this.map)
  
      // Add initial marker
      if(this.initialPosition)
        this.marker = L.marker(this.initialPosition,{
          icon: this.createCustomMarker(),
        }).addTo(this.map)
  
      // Handle map click to update marker position
      this.map.on("click", (e: L.LeafletMouseEvent) => {
        const { lat, lng } = e.latlng
  
        console.log(lat,lng)
        if (this.marker) {
          this.marker.setLatLng([lat, lng])
        }
        else
        {
          this.marker = L.marker([lat, lng],{
            icon: this.createCustomMarker(),
          }).addTo(this.map!)
        }
  
        this.locationPick.emit({ lat, lng })
      })
    }
  }
  
  