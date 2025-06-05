const { Sequelize, DataTypes } = require('sequelize');
const { config } = require('dotenv');

const UsersModel = require('./models/authUsersModel');
const RevokedTokensModel = require('./models/revokedTokensModel');

config({path: '.env'});

const sequelize = new Sequelize(process.env.POSTGRES_URI, {
  logging: false,
});

const AuthUsers = UsersModel(sequelize, DataTypes);
const RevokedTokens = RevokedTokensModel(sequelize, DataTypes);

module.exports = {
  sequelize,
  AuthUsers,
  RevokedTokens,
};
