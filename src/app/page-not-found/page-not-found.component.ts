import { Component } from '@angular/core';
import { FullFormComponent } from '../components/full-form/full-form.component';

@Component({
  selector: 'app-page-not-found',
  imports: [FullFormComponent,],
  templateUrl: './page-not-found.component.html',
  styleUrl: './page-not-found.component.css'
})
export class PageNotFoundComponent {
handleFormSubmit($event: Event) {
throw new Error('Method not implemented.');
}

}
