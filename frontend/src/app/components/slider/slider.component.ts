import { Component, EventEmitter, Input, Output, SimpleChanges } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-slider',
  imports: [FormsModule],
  templateUrl: './slider.component.html',
  styleUrl: './slider.component.css'
})
export class SliderComponent {
  @Input() value: number = 0;
  @Output() valueChange = new EventEmitter<number>();

  ngOnInit() {
    this.updateSlider();
  }
  ngOnChanges(changes: SimpleChanges) {
    if (changes['value']) {
      this.updateSlider();
    }
  }

  sliderBackground: string = '';

  updateSlider() {
    const percentage = ((this.value ?? 0) / 10) * 100;

    let color = '#0d6efd'; // Azul por padrao

    if (percentage <= 30) {
      color = '#dc3545'; // Vermelho
    } else if (percentage <= 70) {
      color = '#ffc107'; // Amarelo
    } else if (percentage <= 90) {
      color = '#28a745'
    }
    this.sliderBackground = `linear-gradient(to right, ${color} ${percentage}%, #ddd ${percentage}%)`;
    this.valueChange.emit(this.value);
  }
}
