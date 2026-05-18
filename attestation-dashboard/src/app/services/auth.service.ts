import { Injectable, computed, signal } from '@angular/core';
import { Router } from '@angular/router';

export type UserRole = 'admin' | 'user';

export interface SessionUser {
  username: string;
  role: UserRole;
  lastLogin: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly key = 'attestation-session';
  private readonly session = signal<SessionUser | null>(this.readSession());

  readonly user = computed(() => this.session());
  readonly isAuthenticated = computed(() => !!this.session());

  constructor(private readonly router: Router) {}

  login(username: string, password: string): boolean {
    const role = username === 'admin' && password === 'admin' ? 'admin' : username === 'user' && password === 'user' ? 'user' : null;
    if (!role) {
      return false;
    }

    const session: SessionUser = {
      username,
      role,
      lastLogin: new Date().toISOString(),
    };
    localStorage.setItem(this.key, JSON.stringify(session));
    this.session.set(session);
    this.router.navigate([role === 'admin' ? '/admin/dashboard' : '/user/dashboard']);
    return true;
  }

  logout(): void {
    localStorage.removeItem(this.key);
    this.session.set(null);
    this.router.navigate(['/login']);
  }

  private readSession(): SessionUser | null {
    const value = localStorage.getItem(this.key);
    if (!value) {
      return null;
    }

    try {
      return JSON.parse(value) as SessionUser;
    } catch {
      localStorage.removeItem(this.key);
      return null;
    }
  }
}
