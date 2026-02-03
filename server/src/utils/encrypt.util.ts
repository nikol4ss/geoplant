import bcrypt from 'bcrypt';

export async function comparePassword(plain: string, hash: string) {
  return bcrypt.compare(plain, hash);
}
