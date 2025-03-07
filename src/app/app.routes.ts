import { RouterModule, Routes } from '@angular/router';
import { HomeMapComponent } from './components/home-map/home-map.component';
import { FullFormComponent } from './components/full-form/full-form.component';
import { NgModule } from '@angular/core';
import { DetailsComponent } from './components/details/details.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { ReportComponent } from './components/report/report.component';


export const routes: Routes = [
    {
        path: '', component: HomeMapComponent, children: [
            { path: 'location/:id', component: DetailsComponent },
            { path: 'location/:id/edit', component: FullFormComponent },
        ]
    },

    { path: 'report', component: ReportComponent },
    { path: '**', component: PageNotFoundComponent },
];


@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }
