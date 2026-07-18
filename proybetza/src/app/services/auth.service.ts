import { Injectable, signal, computed, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs';
import type { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import type { User } from '../models/user.model';
import type { LoginPayload, RegisterPayload } from '../models/requests/auth.request';
import type { AuthResponse } from '../models/responses/auth.response';
import type { ApiResponse } from '../models/responses/api.response';

const TOKEN_KEY = 'cookbook_token';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);
  private readonly base = `${environment.apiUrl}/auth`;

  /** JWT token almacenado en localStorage */
  private readonly _token = signal<string | null>(localStorage.getItem(TOKEN_KEY));

  /** Usuario actual decodificado del token (o null) */
  private readonly _user = signal<User | null>(null);

  readonly token = this._token.asReadonly();
  readonly user = this._user.asReadonly();
  readonly isLoggedIn = computed(() => !!this._token());

  constructor() {
    // Si hay token guardado, cargamos el perfil del usuario
    if (this._token()) {
      this.fetchMe().subscribe({ error: () => this.clearSession() });
    }
  }
  registersda(request:RegisterPayload):Observable<ApiResponse<AuthResponse>>{
     return this.http.post<ApiResponse<AuthResponse>>(
      `${this.base}/register`,
      request
    ).pipe(
      tap(res => this.saveSession(res.data))
    );
  }






















  register(payload: RegisterPayload): Observable<ApiResponse<AuthResponse>> {
    return this.http.post<ApiResponse<AuthResponse>>(
      `${this.base}/register`,
      payload
    ).pipe(
      tap(res => this.saveSession(res.data))
    );
  }

  login(payload: LoginPayload): Observable<ApiResponse<AuthResponse>> {
    return this.http.post<ApiResponse<AuthResponse>>(
      `${this.base}/login`,
      payload
    ).pipe(
      tap(res => this.saveSession(res.data))
    );
  }

  fetchMe(): Observable<ApiResponse<User>> {
    return this.http.get<ApiResponse<User>>(`${this.base}/me`).pipe(
      tap(res => this._user.set(res.data))
    );
  }

  logout(): void {
    this.clearSession();
  }

  private saveSession(data: AuthResponse): void {
    localStorage.setItem(TOKEN_KEY, data.token);
    this._token.set(data.token);
    this._user.set(data.user);
  }

  private clearSession(): void {
    localStorage.removeItem(TOKEN_KEY);
    this._token.set(null);
    this._user.set(null);
  }
}
