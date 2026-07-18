import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { pool } from '../../config/database';
import { env } from '../../config/env';
import { AppError } from '../../errors/app-error';
import { DbUser, JwtPayload, UserDTO } from './auth.types';
import { RegisterDto, LoginDto } from './auth.schemas';

const SALT_ROUNDS = 12;

export class AuthService {
  /** Registra un nuevo usuario */
  async register(dto: RegisterDto): Promise<{ user: UserDTO; token: string }> {
    // Verificar si el email o username ya existen
    const existing = await pool.query(
      'SELECT id FROM users WHERE email = $1 OR username = $2',
      [dto.email, dto.username]
    );
    if (existing.rows.length > 0) {
      throw new AppError('El email o nombre de usuario ya está registrado', 409, 'ALREADY_EXISTS');
    }

    const passwordHash = await bcrypt.hash(dto.password, SALT_ROUNDS);

    const { rows } = await pool.query<DbUser>(
      `INSERT INTO users (username, email, password_hash)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [dto.username, dto.email, passwordHash]
    );
    const user = rows[0];

    // Crear preferencias vacías para el usuario nuevo
    await pool.query(
      'INSERT INTO user_preferences (user_id) VALUES ($1)',
      [user.id]
    );

    const token = this.signToken(user);
    return { user: this.toDTO(user), token };
  }

  /** Autentifica un usuario y retorna JWT */
  async login(dto: LoginDto): Promise<{ user: UserDTO; token: string }> {
    const { rows } = await pool.query<DbUser>(
      'SELECT * FROM users WHERE email = $1',
      [dto.email]
    );
    const user = rows[0];

    if (!user) {
      // Mensaje genérico para no revelar si el email existe
      throw new AppError('Credenciales incorrectas', 401, 'INVALID_CREDENTIALS');
    }

    const passwordMatch = await bcrypt.compare(dto.password, user.password_hash);
    if (!passwordMatch) {
      throw new AppError('Credenciales incorrectas', 401, 'INVALID_CREDENTIALS');
    }

    const token = this.signToken(user);
    return { user: this.toDTO(user), token };
  }

  /** Retorna el perfil del usuario autenticado */
  async getMe(userId: number): Promise<UserDTO> {
    const { rows } = await pool.query<DbUser>(
      'SELECT * FROM users WHERE id = $1',
      [userId]
    );
    if (!rows[0]) {
      throw new AppError('Usuario no encontrado', 404, 'USER_NOT_FOUND');
    }
    return this.toDTO(rows[0]);
  }

  private signToken(user: DbUser): string {
    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };
    return jwt.sign(payload, env.JWT_SECRET, { expiresIn: env.JWT_EXPIRES_IN } as jwt.SignOptions);
  }

  private toDTO(user: DbUser): UserDTO {
    return {
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
      createdAt: user.created_at,
    };
  }
}

export const authService = new AuthService();
