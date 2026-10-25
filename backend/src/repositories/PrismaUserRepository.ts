import type { PrismaClient } from '@prisma/client';
import type { IUserRepository, UserRecord } from './IUserRepository';

export class PrismaUserRepository implements IUserRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async findByEmail(email: string): Promise<UserRecord | null> {
    const row = await this.prisma.user.findUnique({ where: { email } });
    return row ? { ...row, role: row.role as UserRecord['role'] } : null;
  }

  async create(
    data: Omit<UserRecord, 'id' | 'createdAt'>,
  ): Promise<UserRecord> {
    const row = await this.prisma.user.create({ data });
    return { ...row, role: row.role as UserRecord['role'] };
  }
}
