import { Injectable, inject, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs';
import type { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { AuthService } from './auth.service';
import type { UserPreferences } from '../models/preferences.model';
import type { ApiResponse } from '../models/responses/api.response';

@Injectable({ providedIn: 'root' })
export class PreferencesService {
  private http = inject(HttpClient);
  private auth = inject(AuthService);
  private readonly base = `${environment.apiUrl}/preferences`;

  /** Estado local sincronizado con el backend */
  private readonly _prefs = signal<UserPreferences>({
    favoriteIngredients: [],
    allergens: [],
    intolerances: [],
    preferredCategories: [],
    preferredDifficulty: null,
  });

  readonly favoriteIngredients = computed(() => this._prefs().favoriteIngredients);
  readonly allergens = computed(() => this._prefs().allergens);
  readonly intolerances = computed(() => this._prefs().intolerances || []);
  readonly preferredCategories = computed(() => this._prefs().preferredCategories);
  readonly preferredDifficulty = computed(() => this._prefs().preferredDifficulty);

  constructor() {
    // Carga preferencias desde backend si el usuario está logueado
    if (this.auth.isLoggedIn()) {
      this.loadFromBackend();
    }
  }

  /** Carga las preferencias desde el backend */
  loadFromBackend(): void {
    this.getPreferences().subscribe({ error: () => {} });
  }

  getPreferences(): Observable<ApiResponse<UserPreferences>> {
    return this.http.get<ApiResponse<UserPreferences>>(this.base).pipe(
      tap(res => this._prefs.set(res.data))
    );
  }

  toggleFavorite(ingredient: string): void {
    if (!this.auth.isLoggedIn()) return;
    this.http.post<ApiResponse<UserPreferences>>(
      `${this.base}/favorites/toggle`,
      { ingredient }
    ).pipe(tap(res => this._prefs.set(res.data))).subscribe();
  }

  toggleAllergen(ingredient: string): void {
    if (!this.auth.isLoggedIn()) return;
    this.http.post<ApiResponse<UserPreferences>>(
      `${this.base}/allergens/toggle`,
      { ingredient }
    ).pipe(tap(res => this._prefs.set(res.data))).subscribe();
  }

  toggleIntolerance(intolerance: string): void {
    if (!this.auth.isLoggedIn()) return;
    this.http.post<ApiResponse<UserPreferences>>(
      `${this.base}/intolerances/toggle`,
      { intolerance }
    ).pipe(tap(res => this._prefs.set(res.data))).subscribe();
  }

  isFavorite(ingredient: string): boolean {
    return this._prefs().favoriteIngredients.includes(ingredient);
  }

  isAllergen(ingredient: string): boolean {
    return this._prefs().allergens.includes(ingredient);
  }

  isIntolerance(intolerance: string): boolean {
    return (this._prefs().intolerances || []).includes(intolerance);
  }
}