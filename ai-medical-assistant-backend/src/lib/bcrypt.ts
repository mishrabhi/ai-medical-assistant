import bcrypt from "bcrypt";

//salt rounds
const SALT_ROUNDS = 12;

//hash password
export const hashPassword = async (
  password: string
): Promise<string> => {
  return bcrypt.hash(password, SALT_ROUNDS);
};

//compare password  
export const comparePassword = async (
  password: string,
  hash: string
): Promise<boolean> => {
  return bcrypt.compare(password, hash);
};