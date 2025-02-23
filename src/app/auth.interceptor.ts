import { HttpEvent, HttpHandlerFn, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AUTH_TOKEN_NAME } from './constants/app-constants';

export function authenticationInterceptor(
  req: HttpRequest<unknown>,
  next: HttpHandlerFn,
): Observable<HttpEvent<unknown>> {
  const token = localStorage.getItem(AUTH_TOKEN_NAME);
  if (!token) {
    return next(req);
  }
  const requestWithToken = req.clone({
    headers: req.headers.set('Authorization', `Bearer ${token}`),
  });
  return next(requestWithToken);
}
