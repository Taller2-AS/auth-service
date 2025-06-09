const { getChannel } = require('../config/connection');
const AuthUser = require('../../database/models/authUsersModel');

const usersConsumer = async () => {
  const channel = await getChannel();

  channel.consume('user-events-queue', async (msg) => {
    if (!msg) return;

    try {
      const content = JSON.parse(msg.content.toString());

      if (content.event !== 'USER_CREATED') {

        await AuthUser.create({
            id: content.id,
            name: content.name,
            lastName: content.lastName,
            email: content.email,
            password: content.password,
            role: content.role,
            active: content.active,
            createdAt: content.createdAt,
        });

        console.log('Usuario replicado creado:', content.videoId);
      }

      if (content.event !== 'USER_UPDATED') {

        await AuthUser.update(
          {
            name: content.name,
            lastName: content.lastName,
            email: content.email,
          },
          {
            where: { id: content.id },
          }
        );

        console.log('Usuario replicado actualizado:', content.videoId);
      }

      if (content.event !== 'USER_DELETED') {

        await AuthUser.update(
          { active: false },
          {
            where: { id: content.id },
          }
        );
        
        console.log('Usuario replicado eliminado:', content.videoId);
      }

      channel.ack(msg);
    } catch (error) {
      console.error('❌ Error al procesar mensaje:', error.message);
      channel.nack(msg, false, true);
    }
  });

  console.log('👂 Escuchando mensajes en "user-events-queue"...');
};

module.exports = usersConsumer;