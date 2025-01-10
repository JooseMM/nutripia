import { Routes } from '@angular/router';
import { HomePage } from './pages/home/home.component';
import { SchedulePage } from './pages/schedule/schedule.page';

export const routes: Routes = [
  { path: 'inicio', component: HomePage},
  { path: 'agenda', component: SchedulePage},
  { path: '', redirectTo: '/inicio', pathMatch: 'full'}
];
