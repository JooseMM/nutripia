import { Routes } from '@angular/router';
import { HomePage } from './pages/home/home.component';
import { SchedulePage } from './pages/schedule/schedule.page';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';

export const routes: Routes = [
  { path: 'inicio', component: HomePage },
  { path: 'agenda', component: SchedulePage },
  { path: 'login', component: LoginComponent },
  { path: 'subscripcion', component: RegisterComponent },
  { path: '', redirectTo: '/inicio', pathMatch: 'full' },
];
