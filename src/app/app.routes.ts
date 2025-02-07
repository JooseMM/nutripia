import { Routes } from '@angular/router';
import { HomePage } from './pages/home/home.component';
import { SchedulePage } from './pages/schedule/schedule.page';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { AdministrationComponent } from './pages/administration/administration.component';
import { clientGuard } from './guards/client.guard';
import { adminGuard } from './guards/admin.guard';
import { unknowUserGuard } from './guards/unknow-user.guard';

export const routes: Routes = [
  { path: 'inicio', component: HomePage },
  { path: 'agenda', component: SchedulePage, canActivate: [] },
  { path: 'login', component: LoginComponent, canActivate: [unknowUserGuard] },
  {
    path: 'subscripcion',
    component: RegisterComponent,
    canActivate: [unknowUserGuard],
  },
  {
    path: 'administracion',
    component: AdministrationComponent,
    canActivate: [adminGuard],
  },
  { path: '', redirectTo: '/agenda', pathMatch: 'full' },
];
