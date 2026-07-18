import { Injectable, inject, signal } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../environments/environment';
import type { Recipe, Category } from '../models/recipe.model';
import type { ApiResponse, PaginatedResponse } from '../models/responses/api.response';

@Injectable({ providedIn: 'root' })
export class RecipeService {
  private readonly base = `${environment.apiUrl}/recipes`;

  readonly allCategories: Category[] = ['dulce', 'salada', 'agridulce', 'postre', 'bebida'];

  /** Cache local de ingredientes para el selector de preferencias */
  private readonly _allIngredients = signal<string[]>([]);
  readonly allIngredients = this._allIngredients.asReadonly();

  constructor(private http: HttpClient) {
    // Carga los ingredientes al iniciar la app
    this.fetchAllIngredients().subscribe();
  }

  /** Lista todas las recetas con paginación y filtros opcionales */
  list(params?: {
    page?: number;
    limit?: number;
    category?: string;
    difficulty?: string;
  }): Observable<PaginatedResponse<Recipe>> {
    let httpParams = new HttpParams();
    if (params?.page)       httpParams = httpParams.set('page', params.page);
    if (params?.limit)      httpParams = httpParams.set('limit', params.limit);
    if (params?.category)   httpParams = httpParams.set('category', params.category);
    if (params?.difficulty) httpParams = httpParams.set('difficulty', params.difficulty);

    return this.http.get<PaginatedResponse<Recipe>>(this.base, { params: httpParams });
  }

  /** Receta individual por ID */
  getById(id: number): Observable<ApiResponse<Recipe>> {
    return this.http.get<ApiResponse<Recipe>>(`${this.base}/${id}`);
  }

  /** Recetas por categoría */
  getByCategory(slug: Category, page = 1, limit = 20): Observable<PaginatedResponse<Recipe>> {
    const params = new HttpParams().set('page', page).set('limit', limit);
    return this.http.get<PaginatedResponse<Recipe>>(
      `${this.base}/category/${slug}`, { params }
    );
  }

  /** Búsqueda por título o ingrediente */
  search(query: string, page = 1, limit = 20): Observable<PaginatedResponse<Recipe>> {
    const params = new HttpParams().set('q', query).set('page', page).set('limit', limit);
    return this.http.get<PaginatedResponse<Recipe>>(
      `${this.base}/search`, { params }
    );
  }

  /** Recetas recomendadas según preferencias del usuario (requiere auth) */
  getRecommended(): Observable<ApiResponse<Recipe[]>> {
    return this.http.get<ApiResponse<Recipe[]>>(`${this.base}/recommended`);
  }

  /** Obtiene todos los ingredientes para el selector de preferencias */
  fetchAllIngredients(): Observable<ApiResponse<string[]>> {
    return this.http.get<ApiResponse<string[]>>(`${this.base}/ingredients`).pipe(
      tap(res => this._allIngredients.set(res.data))
    );
  }
}