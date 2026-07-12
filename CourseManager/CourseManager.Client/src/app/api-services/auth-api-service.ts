import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

export interface AuthUser {
  token: string;
  userId: number;
  username: string;
  displayName: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthApiService {
  private baseUrl = `${environment.apiUrl}/auth`;
  private readonly http = inject(HttpClient);

  private readonly STORAGE_KEY = 'course_manager_auth';

  currentUser = signal<AuthUser | null>(this.loadFromStorage());

  isAuthenticated = signal<boolean>(this.currentUser() !== null);

  private loadFromStorage(): AuthUser | null {
    try {
      const raw = localStorage.getItem(this.STORAGE_KEY);
      if (!raw) return null;
      return JSON.parse(raw) as AuthUser;
    } catch {
      return null;
    }
  }

  private saveToStorage(user: AuthUser): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(user));
  }

  private clearStorage(): void {
    localStorage.removeItem(this.STORAGE_KEY);
  }

  getToken(): string | null {
    return this.currentUser()?.token ?? null;
  }

  async login(username: string, password: string): Promise<{ success: boolean; message?: string }> {
    try {
      const data = await this.http
        .post<AuthUser>(`${this.baseUrl}/login`, { username, password })
        .toPromise();

      const user: AuthUser = {
        token: data!.token,
        userId: data!.userId,
        username: data!.username,
        displayName: data!.displayName,
      };

      this.saveToStorage(user);
      this.currentUser.set(user);
      this.isAuthenticated.set(true);

      return { success: true };
    } catch (error: any) {
      console.error('Login error:', error);
      return { success: false, message: error.error?.message ?? 'Login failed.' };
    }
  }

  async register(
    username: string,
    password: string,
    displayName: string,
  ): Promise<{ success: boolean; message?: string }> {
    try {
      const data = await this.http
        .post<AuthUser>(`${this.baseUrl}/register`, { username, password, displayName })
        .toPromise();

      const user: AuthUser = {
        token: data!.token,
        userId: data!.userId,
        username: data!.username,
        displayName: data!.displayName,
      };

      this.saveToStorage(user);
      this.currentUser.set(user);
      this.isAuthenticated.set(true);

      return { success: true };
    } catch (error: any) {
      console.error('Registration error:', error);
      return { success: false, message: error.error?.message ?? 'Registration failed.' };
    }
  }

  logout(): void {
    this.clearStorage();
    this.currentUser.set(null);
    this.isAuthenticated.set(false);
  }
}
