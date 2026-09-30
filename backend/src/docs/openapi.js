module.exports = {
  openapi: '3.0.3',
  info: {
    title: 'Prueba Node API',
    version: '1.0.0',
    description: 'API de autenticación y trabajos asíncronos.',
  },
  servers: [
    { url: 'https://api-dev.localhost', description: 'Desarrollo' },
    { url: 'https://api.localhost', description: 'Producción local' },
  ],
  tags: [
    { name: 'Auth', description: 'Registro y autenticación' },
    { name: 'Jobs', description: 'Trabajos procesados por Redis y workers' },
  ],
  components: {
    securitySchemes: {
      authCookie: { type: 'apiKey', in: 'cookie', name: 'auth_token' },
    },
    schemas: {
      User: {
        type: 'object',
        properties: {
          id: { type: 'integer' },
          name: { type: 'string' },
          email: { type: 'string', format: 'email' },
        },
      },
      Credentials: {
        type: 'object',
        required: ['email', 'password'],
        properties: {
          email: { type: 'string', format: 'email' },
          password: { type: 'string', format: 'password', minLength: 8 },
        },
      },
      Register: {
        allOf: [
          { $ref: '#/components/schemas/Credentials' },
          { type: 'object', required: ['name'], properties: { name: { type: 'string' } } },
        ],
      },
    },
  },
  paths: {
    '/health': {
      get: {
        summary: 'Comprobar estado de la API',
        responses: { 200: { description: 'API disponible' } },
      },
    },
    '/auth/register': {
      post: {
        tags: ['Auth'],
        summary: 'Registrar usuario',
        requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/Register' } } } },
        responses: { 201: { description: 'Usuario registrado' }, 409: { description: 'Email ya registrado' } },
      },
    },
    '/auth/login': {
      post: {
        tags: ['Auth'],
        summary: 'Iniciar sesión',
        requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/Credentials' } } } },
        responses: { 200: { description: 'Sesión iniciada' }, 401: { description: 'Credenciales inválidas' } },
      },
    },
    '/auth/logout': {
      post: { tags: ['Auth'], summary: 'Cerrar sesión', responses: { 204: { description: 'Sesión cerrada' } } },
    },
    '/auth/me': {
      get: {
        tags: ['Auth'],
        summary: 'Obtener usuario autenticado',
        security: [{ authCookie: [] }],
        responses: { 200: { description: 'Usuario actual' }, 401: { description: 'No autenticado' } },
      },
    },
    '/jobs': {
      post: {
        tags: ['Jobs'],
        summary: 'Crear trabajo',
        requestBody: { content: { 'application/json': { schema: { type: 'object', additionalProperties: true } } } },
        responses: { 202: { description: 'Trabajo encolado' } },
      },
    },
    '/jobs/{id}': {
      get: {
        tags: ['Jobs'],
        summary: 'Consultar trabajo',
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
        responses: { 200: { description: 'Trabajo encontrado' }, 404: { description: 'Trabajo no encontrado' } },
      },
    },
  },
};
