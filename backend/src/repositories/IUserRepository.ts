export type UserRole = 'USER' | 'ADMIN';
export interface UserRecord { id: string; name: string; email: string; passwordHash: string; role: UserRole; createdAt: Date; }
export interface IUserRepository {
  findByEmail(email: string): Promise<UserRecord | null>;
  create(data: Omit<UserRecord, 'id' | 'createdAt'>): Promise<UserRecord>;
}
