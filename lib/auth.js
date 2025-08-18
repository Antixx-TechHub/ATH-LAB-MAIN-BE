const jwt = require('jsonwebtoken');
require('dotenv').config();

const JWT_SECRET = process.env.JWT_SECRET || 'abcd1234'; // Ensure this is set in .env

const generateToken = (user) => {
  return jwt.sign(
    { id: user.id.toString(), username: user.username, role: user.role }, // Convert BigInt to string
    JWT_SECRET,
    { expiresIn: '1h' }
  );
};

const verifyToken = (token) => {
  try {
    console.log('Verifying token:', token);
    const decoded = jwt.verify(token, JWT_SECRET);
    console.log('Token verified:', decoded);
    return decoded;
  } catch (error) {
    console.error('Token verification error:', error.message);
    return null;
  }
};

module.exports = { generateToken, verifyToken };