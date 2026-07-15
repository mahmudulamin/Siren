import jwt from 'jsonwebtoken';

export const generateToken = (payload, expiresIn = process.env.JWT_EXPIRE || '7d') => {
  try {
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn
    });
    return token;
  } catch (error) {
    throw new Error('Token generation failed: ' + error.message);
  }
};

export const verifyToken = (token) => {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return decoded;
  } catch (error) {
    throw new Error('Invalid token: ' + error.message);
  }
};

export const decodeToken = (token) => {
  try {
    const decoded = jwt.decode(token);
    return decoded;
  } catch (error) {
    throw new Error('Token decode failed: ' + error.message);
  }
};
