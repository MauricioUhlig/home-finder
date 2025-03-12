import { Component, Input } from '@angular/core';
import { Image } from '../../models/image.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-image-slider',
  templateUrl: './image-slider.component.html',
  styleUrls: ['./image-slider.component.css'],
  imports: [CommonModule]
})
export class ImageSliderComponent {
  @Input() images: Image[] = []; // Input for image URLs
  selectedImage: Image | null = null; // Track the currently selected/zoomed image

  // Open the image in zoomed view
  openImage(image: Image): void {
    this.selectedImage = image;
  }

  // Close the zoomed view
  closeImage(): void {
    this.selectedImage = null;
  }

  // Handle click outside the image to close
  onBackdropClick(event: MouseEvent): void {
    if ((event.target as HTMLElement).classList.contains('modal-backdrop')) {
      this.closeImage();
    }
  }
}