import bcrypt from 'bcrypt';

export const generateOTP = async () => {
  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  const salt = await bcrypt.genSalt(10);
  const hashedOTP = await bcrypt.hash(otp,salt);
  return {otp,hashedOTP};
};