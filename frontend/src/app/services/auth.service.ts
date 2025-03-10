import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class AuthService {
    private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
    public isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

    private currentUserSubject = new BehaviorSubject<any>(null);
    public currentUser$ = this.currentUserSubject.asObservable();

    constructor(private http: HttpClient, private router: Router) {
        this.autoLogin();
    }

    // Login method
    login(username: string, password: string) {
        let response = this.loginApi(username, password);
        
        if (response) {
            this.isAuthenticatedSubject.next(true);
            this.currentUserSubject.next(response); // Store user data
            localStorage.setItem('currentUser', JSON.stringify(response)); // Persist user data
            this.router.navigate(['/']); // Redirect to home page
        }
        else
            alert('Falha de login');
        // return this.http.post<any>('https://your-api-url.com/login', { username, password }).subscribe({
        //   next: (response) => {
        //     if (response.userId) {
        //       this.isAuthenticatedSubject.next(true);
        //       this.currentUserSubject.next(response); // Store user data
        //       localStorage.setItem('currentUser', JSON.stringify(response)); // Persist user data
        //       this.router.navigate(['/']); // Redirect to home page
        //     }
        //   },
        //   error: (error) => {
        //     console.error('Login failed:', error);
        //   },
        // });
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
        return '';
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