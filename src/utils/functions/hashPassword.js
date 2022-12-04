import bcrypt from 'bcryptjs';

export const hashPassword = (password) => {
  const salt = bcrypt.genSaltSync(10);

  const hashedPassword = bcrypt.hashSync(password, salt);

  return hashedPassword;
};
