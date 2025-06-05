module.exports = (sequelize, DataTypes) => {
  const RevokedToken = sequelize.define('RevokedToken', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    token: {
      type: DataTypes.TEXT,
      allowNull: false,
      unique: true,
    },
    revokedAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  }, {
    tableName: 'revoked_tokens',
    timestamps: false,
  });

  return RevokedToken;
};
