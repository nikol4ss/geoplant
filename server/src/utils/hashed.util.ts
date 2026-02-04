import bcrypt from 'bcryptjs';

export async function hashPassword(password: string): Promise<string> {
  const saltRounds = 10;
  return await bcrypt.hash(password, saltRounds);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return await bcrypt.compare(password, hash);
}

export async function comparePassword(plain: string, hash: string) {
  return bcrypt.compare(plain, hash);
}
