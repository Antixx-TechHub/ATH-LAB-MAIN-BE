// ./lib/auth.js
const JWT_SECRET = process.env.JWT_SECRET || 'abcd1234';

async function signToken(payload) {
  const { SignJWT } = await import('jose');
  const secret = new TextEncoder().encode(JWT_SECRET);
  return new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime('1h')
    .sign(secret);
}

async function verifyToken(token) {
  const { jwtVerify } = await import('jose');
  const secret = new TextEncoder().encode(JWT_SECRET);
  try {
    const { payload } = await jwtVerify(token, secret);
    return payload;
  } catch (error) {
   // console.error('verifyToken Error:', error.message);
    throw error;
  }
}

module.exports = { signToken, verifyToken, generateToken: signToken  };