import { Routes } from '@angular/router';
import { HomePage } from './pages/home/home.component';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { AdministrationComponent } from './pages/administration/administration.component';
import { clientGuard } from './guards/client.guard';
import { adminGuard } from './guards/admin.guard';
import { unknowUserGuard } from './guards/unknow-user.guard';
import { ScheduleComponent } from './pages/schedule/schedule.component';

export const routes: Routes = [
  { path: 'inicio', component: HomePage },
  { path: 'agenda', component: ScheduleComponent, canActivate: [clientGuard] },
  { path: 'login', component: LoginComponent, canActivate: [unknowUserGuard] },
  {
    path: 'subscripcion',
    component: RegisterComponent,
    canActivate: [unknowUserGuard],
  },
  {
    path: 'administracion',
    component: AdministrationComponent,
    canActivate: [],
  },
  { path: '', redirectTo: '/inicio', pathMatch: 'full' },
];
