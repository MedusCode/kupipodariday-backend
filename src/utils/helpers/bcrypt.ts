import * as bcrypt from 'bcrypt';

const compare = (data: string, hash: string): Promise<boolean> => {
  return bcrypt.compare(data, hash);
};

const hash = (data: string, salt: number): Promise<string> => {
  return bcrypt.hash(data, salt);
};

export { compare, hash };
