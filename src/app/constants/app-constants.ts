import { ViewportScroller } from '@angular/common';
import { NavigationEnd, Router } from '@angular/router';
import { Subscription, filter } from 'rxjs';
import AuthenticationState from 'src/models/IAuthenticationState';

export const API_URL =
  'https://nutripia-api-e5aec4dudbdnb9a2.brazilsouth-01.azurewebsites.net/api';
export const ADMIN_ROLE = 'admin_user';
export const CLIENT_ROLE = 'client_user';
export const NOT_AUTHENTICATED = '';
export const letterSpaceAndSymbols = new RegExp(/^[a-zA-Z ,.\-_]*$/);
export const letterSpaceSymbolsAndNumbers = new RegExp(/^[a-zA-Z ,.\-_0-9]*$/);
export const letterAndSpacesPattern = new RegExp(/^[a-zA-Z ]*$/);
export const AUTH_TOKEN_NAME = 'authToken';
export const chileanRutValidator = new RegExp(
  /^(\d{1,2}\.\d{3}\.\d{3}-[\dkK])$/,
);
export const PRIMARY_HEX = '#8878A5';
export const undefinedAuthenticationState: AuthenticationState = {
  id: '',
  email: '',
  fullName: '',
  isEmailVerified: false,
  role: '',
  error: null,
};
export const SINGLE_LETTER_WEEK_DAY = ['L', 'M', 'M', 'J', 'V', 'S', 'D'];
export const THREE_LETTER_WEEKDAY = [
  'Lun',
  'Mar',
  'Mie',
  'Jue',
  'Vie',
  'Sab',
  'Dom',
];
export const MONTH_NAMES = [
  'Enero',
  'Febrero',
  'Marzo',
  'Abril',
  'Mayo',
  'Junio',
  'Julio',
  'Agosto',
  'Septiembre',
  'Octubre',
  'Noviembre',
  'Diciembre',
];
export const WORK_START_HOUR = 8;
export const WORK_END_HOUR = 19;

export function getHoursToString(date: Date): string {
  return date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function navigateAndScrollTo(
  url: string,
  anchor: string,
  router: Router,
  scrollApi: ViewportScroller,
) {
  router.navigate([url]).then((ok) => {
    if (ok) {
      if (!anchor) {
        scrollApi.scrollToPosition([0, 0]);
      } else {
        scrollApi.scrollToAnchor(anchor);
      }
    }
  });
}
