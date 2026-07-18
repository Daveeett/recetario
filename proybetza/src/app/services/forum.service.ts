import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import type { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import type { ForumPost } from '../models/forum.model';
import type { CreatePostPayload } from '../models/requests/create-forum.request';
import type { ApiResponse, PaginatedResponse } from '../models/responses/api.response';
import { UpdatePostPayload } from '../models/requests/update-forum-request';

@Injectable({ providedIn: 'root' })
export class ForumService {
  private readonly base = `${environment.apiUrl}/forum`;

  constructor(private http:HttpClient) {}

  list(params?: {
    page?: number;
    limit?: number;
    type?: 'review' | 'request' | 'all';
    sort?: 'newest' | 'popular';
  }): Observable<PaginatedResponse<ForumPost>> {
    let httpParams = new HttpParams();
    if (params?.page)  httpParams = httpParams.set('page', params.page);
    if (params?.limit) httpParams = httpParams.set('limit', params.limit);
    if (params?.type)  httpParams = httpParams.set('type', params.type);
    if (params?.sort)  httpParams = httpParams.set('sort', params.sort);

    return this.http.get<PaginatedResponse<ForumPost>>(this.base, { params: httpParams });
  }


  getById(id: number): Observable<ApiResponse<ForumPost>> {
    return this.http.get<ApiResponse<ForumPost>>(`${this.base}/${id}`);
  }

  create(payload: CreatePostPayload): Observable<ApiResponse<ForumPost>> {
    return this.http.post<ApiResponse<ForumPost>>(this.base, payload);
  }

  update(id: number, payload: UpdatePostPayload): Observable<ApiResponse<ForumPost>> {
    return this.http.put<ApiResponse<ForumPost>>(`${this.base}/${id}`, payload);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.base}/${id}`);
  }

  toggleLike(id: number): Observable<ApiResponse<{ liked: boolean; likesCount: number }>> {
    return this.http.post<ApiResponse<{ liked: boolean; likesCount: number }>>(
      `${this.base}/${id}/like`,
      {}
    );
  }
}
