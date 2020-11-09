import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomeComponent } from './home';
import { LoginComponent } from './login';
import { MyAdvertsComponent } from './my-adverts/my-adverts.component';
import { RegisterComponent } from './register/register.component';
import { AuthGuard } from './_helpers';
import { LoginGuard } from './login/login.guard';
import { RegistrationGuard } from './register/registration.guard';

const routes: Routes = [
    //{ path: '', component: HomeComponent, canActivate: [AuthGuard] },
    { path: '', component: HomeComponent },
    { path: 'home', component: HomeComponent },
    { path: 'login', component: LoginComponent, canActivate: [LoginGuard] },
    { path: 'register', component: RegisterComponent, canActivate: [RegistrationGuard]},
    { path: 'my-adverts', component: MyAdvertsComponent, canActivate: [AuthGuard] },
    

    // otherwise redirect to home
    { path: '**', redirectTo: '' }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})

export class AppRoutingModule { }