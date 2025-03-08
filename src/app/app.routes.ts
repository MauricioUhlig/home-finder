import { RouterModule, Routes } from '@angular/router';
import { HomeMapComponent } from './components/home-map/home-map.component';
import { FullFormComponent } from './components/full-form/full-form.component';
import { NgModule } from '@angular/core';
import { DetailsComponent } from './components/details/details.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { ReportComponent } from './components/report/report.component';
import { AuthGuard } from './guard/auth.guard';
import { LoginComponent } from './components/login/login.component';


export const routes: Routes = [

    { path: 'login', component: LoginComponent },
    {
        path: '', component: HomeMapComponent, children: [
            { path: 'location/:id', component: DetailsComponent },
            { path: 'location/:id/edit', component: FullFormComponent },
        ],
        canActivate: [AuthGuard]
    },

    { path: 'report', component: ReportComponent },
    { path: '**', component: PageNotFoundComponent },
];


@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }
