import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import { LoginRequest, LoginResponse } from '../models/login.model';

@Injectable({
    providedIn: 'root',
})
export class AuthService {
    private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
    public isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

    private currentUserSubject = new BehaviorSubject<LoginResponse | null>(null);
    private apiUrl = '/api/login';
    public currentUser$ = this.currentUserSubject.asObservable();

    constructor(private http: HttpClient, private router: Router) {
        this.autoLogin();
    }

  // Login method
  async login(username: string, password: string) {
    const payload: LoginRequest = { username, password };
    try {
      this.http.post<any>(this.apiUrl, payload, { headers: { 'Content-Type': 'application/json' } })
      .subscribe({
        next: (data) => {
          if (data.userId) {
            // Handle successful login
            localStorage.setItem('currentUser', JSON.stringify(data)); // Store user data
            console.log('Login successful:', data);
            this.router.navigate(['/']); // Redirect to home page
          } else {
            throw new Error('Invalid response from server');
          }
        },
        error: (error) => {
          console.error(`HTTP error! Status: ${error.status}`, error);
        }
      });
    
      } catch (error) {
        console.error('Login failed:', error);
        // Handle error (e.g., show error message to the user)
      }
  }


    // Logout method
    logout() {
        this.isAuthenticatedSubject.next(false);
        this.currentUserSubject.next(null);
        localStorage.removeItem('currentUser'); // Clear user data
        this.router.navigate(['/login']); // Redirect to login page
    }

    // Check if user is authenticated
    isAuthenticated(): boolean {

        return this.isAuthenticatedSubject.value;
    }

    // Get current user ID
    getCurrentUser() {
        const user = this.currentUserSubject.value;
        return user ? user : null;
    }

    // Auto-login on app initialization
    autoLogin() {
        const localData = localStorage.getItem('currentUser');
        if (!localData)
            return;
        const user = JSON.parse(localData);
        console.log(user)
        if (user) {
            this.isAuthenticatedSubject.next(true);
            this.currentUserSubject.next(user);
        }
    }

    getToken(): string {
        return this.getCurrentUser()?.token ?? '';
    }
    /********* Temporário */
    private users = [
        {
            userId: 1,
            username: 'mauricio',
            password: '1234',
            token: 'asdf234v2'
        },
        {
            userId: 2,
            username: 'hillary',
            password: '1234',
            token: 'asddr234543f'
        },
    ]

    private loginApi(username: string, password: string) {
        console.log(username, password)
        return this.users.find(u => u.username == username && u.password == password);
    }
}