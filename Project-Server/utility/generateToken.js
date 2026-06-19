import jwt from 'jsonwebtoken';

export const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "1d" });
};

export const generateResetToken = (id) => {
  return jwt.sign({ id, purpose: "reset" }, process.env.JWT_SECRET, { expiresIn: "15m" });
};
