const authService = require('../services/auth.service');

async function register(request, response) {
  const { name, email, password } = request.body || {};
  if (!name || !email || !password || password.length < 8) {
    return response.status(400).json({ error: 'Nombre, email y contraseña de 8 caracteres son obligatorios' });
  }

  try {
    const result = await authService.register({ name, email, password });
    response.cookie(authService.cookieName, result.token, authService.cookieOptions);
    return response.status(201).json({ user: result.user });
  } catch (error) {
    return response.status(error.status || 500).json({ error: error.status ? error.message : 'No se pudo registrar el usuario' });
  }
}

async function login(request, response) {
  const { email, password } = request.body || {};
  if (!email || !password) return response.status(400).json({ error: 'Email y contraseña son obligatorios' });

  try {
    const result = await authService.login({ email, password });
    response.cookie(authService.cookieName, result.token, authService.cookieOptions);
    return response.json({ user: result.user });
  } catch (error) {
    return response.status(error.status || 500).json({ error: error.status ? error.message : 'No se pudo iniciar sesión' });
  }
}

async function logout(request, response) {
  response.clearCookie(authService.cookieName, authService.cookieOptions);
  return response.status(204).send();
}

async function me(request, response) {
  try {
    const user = await authService.currentUser(request.cookies[authService.cookieName]);
    return response.json({ user });
  } catch {
    return response.status(401).json({ error: 'No autenticado' });
  }
}

module.exports = { register, login, logout, me };
