// task-manager-ui/src/app/services/auth.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { Router } from '@angular/router'; // Import Router

// Define interfaces for DTOs matching backend (can be moved to a models file)
export interface SignUpDto {
  username?: string; // Make optional if not always needed or for partial updates
  password?: string;
}

export interface LoginDto {
  username?: string;
  password?: string;
}

export interface JwtResponseDto {
  token: string;
  type?: string; // Usually 'Bearer'
  id: string;
  username: string;
  // roles?: string[]; // If roles are part of your JWT response
}

const TOKEN_KEY = 'auth-token';
const USER_KEY = 'auth-user'; // To store user info (id, username)

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:8080/api/auth'; // Backend Auth API URL

  // BehaviorSubject to emit login status changes
  // Initially, check if user data exists in localStorage
  private currentUserSubject: BehaviorSubject<JwtResponseDto | null>;
  public currentUser: Observable<JwtResponseDto | null>;

  constructor(private http: HttpClient, private router: Router) {
    const user = this.getUser();
    this.currentUserSubject = new BehaviorSubject<JwtResponseDto | null>(user);
    this.currentUser = this.currentUserSubject.asObservable();
  }

  public get currentUserValue(): JwtResponseDto | null {
    return this.currentUserSubject.value;
  }

  private getHttpHeaders(): HttpHeaders {
    return new HttpHeaders({ 'Content-Type': 'application/json' });
  }

  login(credentials: LoginDto): Observable<JwtResponseDto> {
    return this.http.post<JwtResponseDto>(`${this.apiUrl}/login`, credentials, { headers: this.getHttpHeaders() })
      .pipe(
        tap(response => {
          this.saveToken(response.token);
          // Save user details (id, username) from response
          const userData = { id: response.id, username: response.username, token: response.token };
          this.saveUser(userData);
          this.currentUserSubject.next(userData as JwtResponseDto); // Notify subscribers
        }),
        catchError(this.handleError)
      );
  }

  signUp(userInfo: SignUpDto): Observable<any> {
    return this.http.post(`${this.apiUrl}/signup`, userInfo, { headers: this.getHttpHeaders(), responseType: 'text' })
      .pipe(
        catchError(this.handleError)
      );
  }

  logout(): void {
    window.localStorage.removeItem(TOKEN_KEY);
    window.localStorage.removeItem(USER_KEY);
    this.currentUserSubject.next(null); // Notify subscribers
    this.router.navigate(['/login']); // Redirect to login page after logout
  }

  public saveToken(token: string): void {
    window.localStorage.removeItem(TOKEN_KEY);
    window.localStorage.setItem(TOKEN_KEY, token);
  }

  public getToken(): string | null {
    return window.localStorage.getItem(TOKEN_KEY);
  }

  public saveUser(user: any): void { // user should match JwtResponseDto structure for consistency
    window.localStorage.removeItem(USER_KEY);
    window.localStorage.setItem(USER_KEY, JSON.stringify(user));
  }

  public getUser(): JwtResponseDto | null {
    const user = window.localStorage.getItem(USER_KEY);
    if (user) {
      return JSON.parse(user) as JwtResponseDto;
    }
    return null;
  }

  public isLoggedIn(): boolean {
    return !!this.getToken(); // More robust check might involve token validation/expiry
  }

  private handleError(error: any) {
    let errorMessage = 'An unknown error occurred!';
    // Add more specific error handling if needed
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Error: ${error.error.message}`;
    } else if (error.status) {
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message || error.error}`;
    }
    console.error(error); // Log to console
    return throwError(() => new Error(errorMessage));
  }
}
