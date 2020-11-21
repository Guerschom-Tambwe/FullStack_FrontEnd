import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomeComponent } from './home';
import { LoginComponent } from './login';
import { MyAdvertsComponent } from './my-adverts/my-adverts.component';
import { RegisterComponent } from './register/register.component';
import { AuthGuard } from './_helpers';
import { LoginGuard } from './login/login.guard';
import { RegistrationGuard } from './register/registration.guard';
import { AdvertsEditComponent } from './adverts-edit/adverts-edit.component';
import { AdvertDeleteComponent } from './advert-delete/advert-delete.component';
import { AdvertHideComponent } from './advert-hide/advert-hide.component';
import { HomesForSaleComponent } from './homes-for-sale/homes-for-sale.component';

const routes: Routes = [
    //{ path: '', component: HomeComponent, canActivate: [AuthGuard] },
    { path: '', component: HomeComponent },
    { path: 'home', component: HomeComponent },
    { path: 'login', component: LoginComponent, canActivate: [LoginGuard] },
    { path: 'register', component: RegisterComponent, canActivate: [RegistrationGuard]},
    { path: 'my-adverts', component: MyAdvertsComponent, canActivate: [AuthGuard] },
    { path: 'adverts/:id/edit', component: AdvertsEditComponent, canActivate: [AuthGuard] },
    { path: 'adverts/:id/delete', component: AdvertDeleteComponent, canActivate: [AuthGuard] },
    { path: 'adverts/:id/hideorshow', component: AdvertHideComponent, canActivate: [AuthGuard] },
    { path: 'homes-for-sale', component: HomesForSaleComponent, canActivate: [AuthGuard] },
    // AdvertHideComponent
  
    // otherwise redirect to home
    { path: '**', redirectTo: '' }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})

export class AppRoutingModule { }