const prisma = require('../../lib/prisma');
const bcrypt = require('bcryptjs');
const { generateToken } = require('../../lib/auth');

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { username, password, firstname, lastname, role = ['user'] } = req.body;

  if (!username || !password || !firstname || !lastname) {
    return res.status(400).json({ error: 'All fields (username, password, firstname, lastname) are required' });
  }

  try {
    const existingUser = await prisma.users.findUnique({ where: { username } });
    if (existingUser) {
      return res.status(400).json({ error: 'Username already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.users.create({
      data: {
        username,
        password: hashedPassword,
        firstname,
        lastname,
        role,
      },
    });

    const token = generateToken(user);
    res.status(201).json({ token, user: { id: user.id.toString(), username: user.username, role: user.role } });
  } catch (error) {
    console.error('Signup Error:', error);
    res.status(500).json({ error: 'Internal server error', details: error.message });
  }
}