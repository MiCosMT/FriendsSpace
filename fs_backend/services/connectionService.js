const sequelize = require("../config/sequelize.js");
const { initModels } = require("../src/models/init-models.js");
const models = initModels(sequelize);
const { Op, literal } = require("sequelize");

// Servicio para manejar las relaciones de conexión (amistades o investigaciones) en la base de datos
class ConnectionService {
  // Función auxiliar para limpiar la información de un mensaje (ocultar texto y url si está borrado)
  sanitizeLastMessage(message) {
    if (!message) return message;
    const msg = message && typeof message.toJSON === "function" ? message.toJSON() : message;
    if (msg.deleted) {
      return { ...msg, body: null, url: null };
    }
    return msg;
  }

  // Obtiene todas las conexiones de un usuario con sus respectivos participantes y su último mensaje de chat
  async getAllMyConnections(userId) {
    const misConexiones = await models.user_connection.findAll({
      where: { user_id: userId },
      attributes: ["connection_id"],
    });

    const idsDeConexiones = misConexiones.map((uc) => uc.connection_id);
    if (idsDeConexiones.length === 0) return [];

    const connections = await models.connection.findAll({
      where: {
        status: { [Op.in]: ["ACTIVE", "BLOCKED"] },
        id: idsDeConexiones,
      },
      include: [
        {
          model: models.user_connection,
          as: "user_connections",
          include: [
            {
              model: models.user,
              as: "user",
              attributes: ["id", "name", "url_image", "role", "banned"],
            },
          ],
        },
        {
          model: models.message,
          as: "messages",
          required: false,
          attributes: ["id", "body", "type", "url", "user_id", "createdAt", "deleted"],
          order: [["createdAt", "DESC"]],
          limit: 1,
          separate: true,
        },
      ],
    });

    return connections.map((connection) => {
      if (connection.messages?.length) {
        connection.messages = connection.messages.map((msg) => this.sanitizeLastMessage(msg));
      }
      return connection;
    });
  }

  // Obtiene la información básica de una conexión a partir de su ID
  async getConnectionById(connectionId) {
    return await models.connection.findOne({
      where: { id: connectionId },
      include: [
        {
          model: models.user_connection,
          as: "user_connections",
        },
      ],
    });
  }

  // Recupera la lista de usuarios (con sus roles) que forman parte de una conexión concreta
  async getConnectionUsers(connectionId) {
    const userConns = await models.user_connection.findAll({
      where: { connection_id: connectionId },
      include: [{ model: models.user, as: "user", attributes: ["id", "role"] }],
    });
    return userConns.map((uc) => ({ id: uc.user_id, role: uc.user?.role }));
  }

  // Cambia el estado de una conexión a "FINISHED" (Finalizada/Cerrada)
  async finishConnection(id) {
    return await models.connection.update(
      { status: "FINISHED" },
      { where: { id } },
    );
  }

  // Marca una conexión como "BLOCKED" e indica qué usuario ha ejercido el bloqueo
  async blockConnection(connectionId, userId) {
    const transaction = await sequelize.transaction();
    try {
      await models.connection.update(
        { status: "BLOCKED" },
        { where: { id: connectionId }, transaction },
      );
      await models.user_connection.update(
        { blocked_by: userId },
        {
          where: { connection_id: connectionId, user_id: userId },
          transaction,
        },
      );
      await transaction.commit();
      return true;
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }
  // Reactiva una conexión pasándola a estado "ACTIVE" y borrando el rastro de bloqueos
  async activateConnection(connectionId) {
    const transaction = await sequelize.transaction();
    try {
      await models.connection.update(
        { status: "ACTIVE" },
        { where: { id: connectionId }, transaction },
      );
      await models.user_connection.update(
        { blocked_by: null },
        { where: { connection_id: connectionId }, transaction },
      );
      await transaction.commit();
      return true;
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  // Busca si existe una conexión activa o bloqueada en común entre dos perfiles de usuario
  async findActiveConnection(myId, profileId) {
    const misConexiones = await models.user_connection.findAll({
      where: { user_id: myId },
      attributes: ["connection_id"],
    });

    const idsDeConexiones = misConexiones.map((uc) => uc.connection_id);
    if (idsDeConexiones.length === 0) return null;

    const conexionesDelPerfil = await models.user_connection.findAll({
      where: {
        user_id: profileId,
        connection_id: { [Op.in]: idsDeConexiones },
      },
      attributes: ["connection_id"],
    });

    const idsCompartidos = conexionesDelPerfil.map((uc) => uc.connection_id);
    if (idsCompartidos.length === 0) return null;

    return await models.connection.findOne({
      where: {
        id: { [Op.in]: idsCompartidos },
        status: { [Op.in]: ["ACTIVE", "BLOCKED"] },
      },
      include: [
        {
          model: models.user_connection,
          as: "user_connections",
          attributes: ["user_id", "connection_id", "blocked_by"],
        },
      ],
    });
  }

  // Verifica mediante consulta si un determinado usuario forma parte de una conexión
  async userBelongsToConnection(userId, connectionId) {
    const uc = await models.user_connection.findOne({
      where: { user_id: userId, connection_id: connectionId },
    });
    return !!uc;
  }

  // Obtiene el ID del otro participante de una conexión (útil en chats uno a uno)
  async getOtherUserInConnection(connectionId, myUserId) {
    const uc = await models.user_connection.findOne({
      where: {
        connection_id: connectionId,
        user_id: { [Op.ne]: myUserId },
      },
      attributes: ["user_id"],
    });
    return uc?.user_id || null;
  }
}

module.exports = new ConnectionService();
