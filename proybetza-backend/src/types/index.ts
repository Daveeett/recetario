import { JwtPayload } from '../modules/auth/auth.types';

// ─── Pagination ──────────────────────────────────────────────────────────────

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: PaginationMeta;
}

// ─── Express augmentation ────────────────────────────────────────────────────

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}
