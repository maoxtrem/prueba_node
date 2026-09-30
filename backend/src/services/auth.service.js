const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User } = require('../models');

const cookieName = 'auth_token';
const jwtSecret = process.env.JWT_SECRET || 'dev-only-change-this-secret';
const cookieOptions = {
  httpOnly: true,
  secure: true,
  sameSite: 'lax',
  maxAge: 1000 * 60 * 60 * 24,
};

function publicUser(user) {
  return { id: user.id, name: user.name, email: user.email };
}

function createToken(user) {
  return jwt.sign({ sub: user.id, email: user.email }, jwtSecret, { expiresIn: '1d' });
}

async function register({ name, email, password }) {
  const normalizedEmail = email.trim().toLowerCase();
  const existingUser = await User.findOne({ where: { email: normalizedEmail } });
  if (existingUser) throw Object.assign(new Error('El email ya está registrado'), { status: 409 });

  const passwordHash = await bcrypt.hash(password, 12);
  const user = await User.create({ name: name.trim(), email: normalizedEmail, passwordHash });
  return { user: publicUser(user), token: createToken(user) };
}

async function login({ email, password }) {
  const user = await User.findOne({ where: { email: email.trim().toLowerCase() } });
  const validPassword = user && await bcrypt.compare(password, user.passwordHash);
  if (!validPassword) throw Object.assign(new Error('Email o contraseña incorrectos'), { status: 401 });
  return { user: publicUser(user), token: createToken(user) };
}

async function currentUser(token) {
  const payload = jwt.verify(token, jwtSecret);
  const user = await User.findByPk(payload.sub);
  if (!user) throw new Error('Sesión no válida');
  return publicUser(user);
}

module.exports = { cookieName, cookieOptions, register, login, currentUser };
