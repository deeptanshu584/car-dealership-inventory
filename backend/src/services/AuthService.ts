import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { ConflictError, UnauthorizedError } from '../errors/AppError';
import type { IUserRepository, UserRecord } from '../repositories/IUserRepository';

export interface AuthInput { email: string; password: string; }
export interface RegisterInput extends AuthInput { name: string; }

function publicUser(user: UserRecord) {
  return { id: user.id, name: user.name, email: user.email, role: user.role, createdAt: user.createdAt };
}

export class AuthService {
  constructor(private readonly users: IUserRepository, private readonly secret: string) {}

  private issue(user: UserRecord) {
    return { token: jwt.sign({ role: user.role }, this.secret, { subject: user.id, expiresIn: '1h' }), user: publicUser(user) };
  }

  async register(input: RegisterInput) {
    const email = input.email.trim().toLowerCase();
    if (await this.users.findByEmail(email)) throw new ConflictError('Email already registered');
    const passwordHash = await bcrypt.hash(input.password, 10);
    const user = await this.users.create({ name: input.name.trim(), email, passwordHash, role: 'USER' });
    return this.issue(user);
  }

  async login(input: AuthInput) {
    const user = await this.users.findByEmail(input.email.trim().toLowerCase());
    if (!user || !(await bcrypt.compare(input.password, user.passwordHash))) throw new UnauthorizedError('Invalid credentials');
    return this.issue(user);
  }
}
