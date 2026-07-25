import { HttpInterceptorFn } from '@angular/common/http';

/**
 * Interceptor funcional que agrega el header Authorization con el JWT
 * a todas las peticiones que van al backend (si el usuario está logueado).
 */
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const token = localStorage.getItem('cookbook_token');

  if (token) {
    const cloned = req.clone({
      setHeaders: { Authorization: `Bearer ${token}` },
    });
    return next(cloned);
  }

  return next(req);
};
