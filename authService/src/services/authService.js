const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { AuthUsers, RevokedTokens } = require('../database/sequelize');
const catchAsync = require('../utils/catchAsync');
require('dotenv').config();
const publishLog = require('../queue/publisher/logPublisher');
const jwt_secret = process.env.JWT_SECRET;

const Login = catchAsync(async (call, callback) => {
    const { email, password } = call.request;

    if (!email?.trim() || !password?.trim()) {
      return callback(new Error('Faltan campos requeridos'));
    }

    const user = await AuthUsers.findOne({ email });

    if (!user || !user.active) {
      return callback(new Error('Credenciales inválidas o usuario eliminado'));
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return callback(new Error('Contraseña ingresada incorrecta'));
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      jwt_secret,
      { expiresIn: '1h' }
    );

    await publishLog('action', {
      userId: user._id,
      email: user.email,
      method: 'Login',
      url: '/auth/login',
      action: 'INICIAR SESIÓN',
      date: new Date().toISOString()
    });

    callback(null, {
      token,
      id: user.id,
      name: user.name,
      lastName: user.lastName,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt.toISOString(),
    });
});

const UpdatePassword = catchAsync(async (call, callback) => {
    const { userId, userRole, userIdChange, password, newPassword, confirmPassword } = call.request;

    if (!userId) {
        return callback(new Error('Debes estar autenticado para actualizar la contraseña'));
    }

    if (!password?.trim() || !newPassword?.trim() || !confirmPassword?.trim()) {
      return callback(new Error('Faltan campos requeridos'));
    }

    const userChange = await AuthUsers.findByPk(userIdChange);

    if (!userChange) return callback(new Error('Credenciales inválidas'));

    if (userIdChange !== userId && userRole !== 'Administrador') {
      return callback(new Error('No tienes permiso para actualizar esta contraseña'));
    }

    const isPasswordValid = await bcrypt.compare(password, userChange.password);
    if (!isPasswordValid) {
      return callback(new Error('Contraseña ingresada incorrecta'));
    }

    if (newPassword !== confirmPassword) {
      return callback(new Error('Las contraseñas ingresadas no coinciden'));
    }

    userChange.password = await bcrypt.hash(newPassword, 10);

    await publishLog('action', {
      userId: userId,
      email: null,
      method: 'UpdatePassword',
      url: `/auth/usuarios/${id}`,
      action: 'ACTUALIZAR CONTRASEÑA',
      date: new Date().toISOString()
    });

    callback(null, {});
  }
);

const Logout = catchAsync(async (call, callback) => {
  const { userId, token } = call.request;

  if (!userId) {
    return callback(new Error('El usuario debe haber iniciado sesión'));
  }

  if (!token) {
    return callback(new Error('Token requerido'));
  }

  const exists = await RevokedTokens.findOne({ where: { token } });
  if (exists) {
    return callback(null, { message: 'Sesión actualmente cerrada' });
  }

  await RevokedTokens.create({ token });

  await publishLog('action', {
    userId: userId,
    email: null,
    method: 'LOGOUT',
    url: '/auth/logout',
    action: 'CERRAR SESIÓN',
    date: new Date().toISOString()
  });

  callback(null, { message: 'Se ha cerrado la sesión correctamente' });
});

const AuthsService = {
  Login,
  UpdatePassword,
  Logout
};

module.exports = AuthsService;
