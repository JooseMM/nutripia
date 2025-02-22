import { Routes } from '@angular/router';
import { HomePage } from './pages/home/home.component';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { AdministrationComponent } from './pages/administration/administration.component';
import { adminGuard } from './guards/admin.guard';
import { unknowUserGuard } from './guards/unknow-user.guard';
import { ScheduleComponent } from './pages/schedule/schedule.component';
import { UserAdministrationComponent } from './pages/administration/components/user-administration/user-administration.component';
import { clientOrAdminGuard } from './guards/client-or-admin.guard';
import { EmailConfirmationPageComponent } from './pages/email-confirmation-page/email-confirmation-page.component';
import { BeforeConfirmationComponent } from './pages/before-confirmation/before-confirmation.component';

export const routes: Routes = [
  { path: 'inicio', component: HomePage },
  { path: 'login', component: LoginComponent, canActivate: [unknowUserGuard] },
  {
    path: 'subscripcion',
    component: RegisterComponent,
    canActivate: [unknowUserGuard],
  },
  {
    path: 'administracion',
    component: AdministrationComponent,
    canActivate: [clientOrAdminGuard],
    children: [
      {
        path: 'agenda',
        component: ScheduleComponent,
        canActivate: [clientOrAdminGuard],
      },
      {
        path: 'clientes',
        component: UserAdministrationComponent,
        canActivate: [adminGuard],
      },
    ],
  },
  {
    path: 'confirmacion/:userId/:token',
    component: EmailConfirmationPageComponent,
  },
  {
    path: 'pre-confirmacion',
    component: BeforeConfirmationComponent,
  },
  { path: '', redirectTo: '/inicio', pathMatch: 'full' },
];
