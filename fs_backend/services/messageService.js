const sequelize = require("../config/sequelize.js");
const { initModels } = require("../src/models/init-models.js");
const { Op } = require("sequelize");
const models = initModels(sequelize);

const authorInclude = {
  model: models.user,
  as: "author",
  attributes: ["id", "name", "url_image"],
};

const replyInclude = {
  model: models.message,
  as: "parent_message",
  attributes: ["id", "body", "type", "url", "deleted"],
  include: [{ model: models.user, as: "author", attributes: ["id", "name"] }],
};

// Servicio responsable de la persistencia de mensajes y operaciones afines en la base de datos
class MessageService {
  // Función auxiliar para "sanitizar" o limpiar mensajes borrados y evitar enviar su texto o URL original
  sanitizeMessage(message) {
    const msg = message && typeof message.toJSON === "function" ? message.toJSON() : message;
    if (!msg) return msg;

    if (msg.deleted) {
      msg.body = null;
      msg.url = null;
    }

    if (msg.parent_message && msg.parent_message.deleted) {
      msg.parent_message.body = null;
      msg.parent_message.url = null;
    }

    return msg;
  }

  // Obtiene los mensajes paginados de una conexión específica, ordenados del más reciente al más antiguo
  async getMessages(connectionId, limit = 30, beforeId = null) {
    const where = { connection_id: connectionId };
    if (beforeId) where.id = { [Op.lt]: beforeId };
    const messages = await models.message.findAll({
      where,
      include: [authorInclude, replyInclude],
      order: [["id", "DESC"]],
      limit,
    });
    return messages.map((message) => this.sanitizeMessage(message));
  }

  // Guarda un nuevo mensaje en la base de datos y recupera sus datos extendidos (autor y mensaje respondido)
  async createMessage(data) {
    const newMessage = await models.message.create(data);
    return await models.message.findByPk(newMessage.id, {
      include: [authorInclude, replyInclude],
    });
  }

  // "Borra" un mensaje lógicamente marcando 'deleted = true', en lugar de eliminar el registro completo
  async deleteMessage(messageId, userId) {
    const msg = await models.message.findByPk(messageId);
    if (!msg) throw new Error("Mensaje no encontrado");
    if (msg.user_id !== userId) throw new Error("No tienes permiso para borrar este mensaje");
    return await models.message.update(
      { deleted: true },
      { where: { id: messageId } },
    );
  }

  // Permite la edición del texto de un mensaje siempre que cumpla ciertos criterios (no borrado, tipo texto, mismo autor)
  async editMessage(messageId, userId, newBody) {
    const msg = await models.message.findByPk(messageId);
    if (!msg) throw new Error("Mensaje no encontrado");
    if (msg.user_id !== userId) throw new Error("No tienes permiso para editar este mensaje");
    if (msg.type !== "TEXT") throw new Error("Solo se pueden editar mensajes de texto");
    if (msg.deleted) throw new Error("No se puede editar un mensaje borrado");
    await models.message.update({ body: newBody, is_edited: true }, { where: { id: messageId } });
    return await models.message.findByPk(messageId, { include: [authorInclude, replyInclude] });
  }

  // Obtiene un único mensaje por su ID, aplicando las reglas de sanitización
  async getMessageById(messageId) {
    const message = await models.message.findByPk(messageId, { include: [authorInclude, replyInclude] });
    return this.sanitizeMessage(message);
  }

  // Valida si un usuario pertenece a una conexión específica
  async userBelongsToConnection(userId, connectionId) {
    const uc = await models.user_connection.findOne({ where: { user_id: userId, connection_id: connectionId } });
    return !!uc;
  }

  // Marca todos los mensajes ajenos de un chat específico como leídos
  async markAsRead(connectionId, userId) {
    await models.message.update(
      { is_read: true },
      { where: { connection_id: connectionId, user_id: { [Op.ne]: userId }, is_read: false} },
    );
  }

  // Retorna el total de mensajes no leídos por el usuario dentro de una conversación
  async getUnreadCountByConnection(connectionId, userId) {
    return await models.message.count({
      where: { connection_id: connectionId, user_id: { [Op.ne]: userId }, is_read: false },
    });
  }

  // Retorna el conteo global de mensajes sin leer que tiene el usuario en todos sus chats
  async getUnreadCountTotal(userId) {
    const connections = await models.user_connection.findAll({
      where: { user_id: userId },
      attributes: ["connection_id"],
    });
    const connectionIds = connections.map((c) => c.connection_id);
    if (connectionIds.length === 0) return 0;
    return await models.message.count({
      where: { connection_id: { [Op.in]: connectionIds }, user_id: { [Op.ne]: userId }, is_read: false,  },
    });
  }
}

module.exports = new MessageService();
