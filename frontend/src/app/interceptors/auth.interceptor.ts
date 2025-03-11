import { Injectable } from '@angular/core';
import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    const authToken = this.authService.getToken();

    // Clone the request and add the Authorization header if a token exists
    let authReq = req;
    if (authToken) {
      authReq = req.clone({
        setHeaders: {
          Authorization: `Bearer ${authToken}`,
        },
      });
    }

    // Pass the request to the next handler and handle errors
    return next.handle(authReq).pipe(
      catchError((error: HttpErrorResponse) => {
        console.error('🚨 HTTP Error:', error);
        console.log('Request:',authReq)
        if(error.status == 401) {
          this.authService.logout()
        }
        return throwError(() => error); // Re-throw the error for further handling
      })
    );
  }
}