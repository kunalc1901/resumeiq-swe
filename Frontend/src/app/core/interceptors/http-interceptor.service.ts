import {
  HttpErrorResponse,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { from, throwError } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { AuthService } from '../services';

@Injectable()
export class HttpInterceptorService implements HttpInterceptor {
  constructor(
    private authService: AuthService,
    private router: Router,
  ) {}

  /**
   * Method to intercept the request and add Authorization header with access token
   * @param req The outgoing HTTP request
   * @param next The next interceptor in the chain
   * @returns An observable of the HTTP event stream
   */
  intercept(req: HttpRequest<any>, next: HttpHandler) {
    const token = this.authService.getToken();
    let requestClone = req;

    if (token) {
      requestClone = this.attachAuthHeaders(req, token);
    }

    return next.handle(requestClone).pipe(
      catchError((error: any) => {
        console.error(`Error occurred while intercepting the request, err:`, error);
        if (error instanceof HttpErrorResponse && error.status == 401) {
          this.authService.logout();
        }
        return throwError(() => error);
      }),
    );
  }

  /**
   * Method to clone the request and attach authorization headers
   * @param req The outgoing HTTP request
   * @param token The access token
   * @returns The cloned request
   */
  attachAuthHeaders(req: HttpRequest<any>, token: string): HttpRequest<any> {
    const headers = req.headers.set('Authorization', `Bearer ${token}`);
    return req.clone({ headers });
  }
}