import { Request, Response, NextFunction } from 'express';
import { authService } from './auth.service';
import { RegisterDto, LoginDto } from './auth.schemas';

export class AuthController {
  async register(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await authService.register(req.body as RegisterDto);
      res.status(201).json({
        success: true,
        message: 'Usuario registrado exitosamente',
        data: result,
      });
    } catch (err) {
      next(err);
    }
  }

  async login(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await authService.login(req.body as LoginDto);
      res.status(200).json({
        success: true,
        message: 'Sesión iniciada exitosamente',
        data: result,
      });
    } catch (err) {
      next(err);
    }
  }

  async me(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.sub;
      const user = await authService.getMe(userId);
      res.status(200).json({
        success: true,
        data: user,
      });
    } catch (err) {
      next(err);
    }
  }
}

export const authController = new AuthController();
