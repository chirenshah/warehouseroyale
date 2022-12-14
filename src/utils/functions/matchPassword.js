import bcrypt from 'bcryptjs';

export const matchPassword = (password, hashedPassword) => {
  return bcrypt.compareSync(password, hashedPassword);
};
