import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-full-form',
  templateUrl: './full-form.component.html',
  styleUrls: ['./full-form.component.css'],
  imports: [CommonModule,FormsModule]
})
export class FullFormComponent {
  @Output() submitEvent = new EventEmitter<any>();

  formData = {
    endereco: '',
    tipo: 'lote',
    telefones: [''],
    link: '',
    tamanho: '',
    dimensao: {
      frente: null,
      fundo: null,
    },
    descricao: '',
    comentarios: '',
    imagens: [] as { file: File; url: string }[],
  };

  // Add a new phone input
  addPhone() {
    this.formData.telefones.push('');
  }

  // Remove a phone input
  removePhone(index: number) {
    this.formData.telefones.splice(index, 1);
  }

  // Handle image upload
  handleImageUpload(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files) {
      const files = Array.from(input.files);
      for (let file of files) {
        const reader = new FileReader();
        reader.onload = (e: ProgressEvent<FileReader>) => {
          if (e.target?.result) {
            this.formData.imagens.push({ file, url: e.target.result as string });
          }
        };
        reader.readAsDataURL(file);
      }
    }
  }

  // Remove an image
  removeImage(index: number) {
    this.formData.imagens.splice(index, 1);
  }

  // Handle form submission
  handleSubmit() {
    console.log('Form Data:', this.formData);
    this.submitEvent.emit(this.formData);
  }
}