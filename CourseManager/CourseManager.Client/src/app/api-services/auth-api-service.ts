import { Injectable, signal } from '@angular/core';
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

  getAuthHeaders(): Record<string, string> {
    const token = this.getToken();
    return token ? { Authorization: `Bearer ${token}` } : {};
  }

  async login(username: string, password: string): Promise<{ success: boolean; message?: string }> {
    try {
      const response = await fetch(`${this.baseUrl}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        return { success: false, message: data.message ?? 'Login failed.' };
      }

      const data = await response.json();
      const user: AuthUser = {
        token: data.token,
        userId: data.userId,
        username: data.username,
        displayName: data.displayName,
      };

      this.saveToStorage(user);
      this.currentUser.set(user);
      this.isAuthenticated.set(true);

      return { success: true };
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, message: 'Network error. Please try again.' };
    }
  }

  async register(
    username: string,
    password: string,
    displayName: string,
  ): Promise<{ success: boolean; message?: string }> {
    try {
      const response = await fetch(`${this.baseUrl}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password, displayName }),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        return { success: false, message: data.message ?? 'Registration failed.' };
      }

      const data = await response.json();
      const user: AuthUser = {
        token: data.token,
        userId: data.userId,
        username: data.username,
        displayName: data.displayName,
      };

      this.saveToStorage(user);
      this.currentUser.set(user);
      this.isAuthenticated.set(true);

      return { success: true };
    } catch (error) {
      console.error('Registration error:', error);
      return { success: false, message: 'Network error. Please try again.' };
    }
  }

  logout(): void {
    this.clearStorage();
    this.currentUser.set(null);
    this.isAuthenticated.set(false);
  }
}
