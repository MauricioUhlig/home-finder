import { RouterModule, Routes } from '@angular/router';
import { HomeMapComponent } from './components/home-map/home-map.component';
import { FullFormComponent } from './components/full-form/full-form.component';
import { NgModule } from '@angular/core';

export const routes: Routes = [
    { path: '', component: HomeMapComponent },
    { path: 'edit/:id', component: FullFormComponent },
    // { path: '**', component: PageNotFoundComponent }
];


@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
  })
  export class AppRoutingModule { }
  