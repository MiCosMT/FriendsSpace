const sequelize = require("../config/sequelize");
const { initModels } = require("../src/models/init-models");
const { request, user, connection, user_connection } = initModels(sequelize);
const { Op } = require("sequelize");

// Servicio que gestiona las peticiones en la base de datos: solicitudes de amistad y reportes de moderación
class RequestService {
  // Crea una nueva solicitud en base de datos e incluye la información del emisor y receptor
  async createRequest(data) {
    const nuevaReq = await request.create({ ...data, created_at: new Date() });
    return await request.findByPk(nuevaReq.id, {
      include: [
        { model: user, as: "sender", attributes: ["id", "name", "url_image"] },
        {
          model: user,
          as: "receiver",
          attributes: ["id", "name", "url_image"],
        },
      ],
    });
  }

  // Obtiene una solicitud específica mediante su ID
  async getRequestById(id) {
    return await request.findByPk(id);
  }

  // Obtiene una solicitud junto a los datos completos de los usuarios involucrados
  async getRequestByIdWithUsers(id) {
    return await request.findByPk(id, {
      include: [
        { model: user, as: "sender", attributes: ["id", "name", "url_image"] },
        {
          model: user,
          as: "receiver",
          attributes: ["id", "name", "url_image"],
        },
      ],
    });
  }

  // Analiza si ya hay una solicitud pendiente o una amistad activa entre dos usuarios
  async findExistingRelationship(userId1, userId2) {
    const pending = await request.findOne({
      where: {
        [Op.or]: [
          { sender_id: userId1, receiver_id: userId2, status: "PENDING" },
          { sender_id: userId2, receiver_id: userId1, status: "PENDING" },
        ],
      },
    });

    const conexionesUser1 = await user_connection.findAll({
      where: { user_id: userId1 },
      attributes: ["connection_id"],
    });

    const ids1 = conexionesUser1.map((uc) => uc.connection_id);

    let activeFriendship = null;
    if (ids1.length > 0) {
      const coincidencia = await user_connection.findOne({
        where: { user_id: userId2, connection_id: { [Op.in]: ids1 } },
        attributes: ["connection_id"],
      });
      if (coincidencia) {
        activeFriendship = await connection.findOne({
          where: { id: coincidencia.connection_id, status: "ACTIVE" },
        });
      }
    }

    return { pending, activeFriendship };
  }

  // Acepta una solicitud, creando la conexión correspondiente y marcando la solicitud como ACCEPTED (usando una transacción)
  async acceptRequest(requestId, receiverId, senderId, isReport = false) {
    const t = await sequelize.transaction();
    try {
      const newConn = await connection.create(
        { status: "ACTIVE" },
        { transaction: t },
      );
      await user_connection.create(
        { user_id: senderId, connection_id: newConn.id },
        { transaction: t },
      );
      await user_connection.create(
        { user_id: receiverId, connection_id: newConn.id },
        { transaction: t },
      );

      await request.update(
        {
          status: "ACCEPTED",
          connection_id: newConn.id,
          visible_sender: true,
          visible_receiver: true,
          is_read_receiver: true,
          is_read_sender: false,
          updated_at: new Date(),
        },
        { where: { id: requestId }, transaction: t },
      );

      await t.commit();
      return newConn.id;
    } catch (error) {
      await t.rollback();
      throw error;
    }
  }

  // Actualiza los campos específicos de una petición (estado, visibilidad, etc.)
  async updateRequest(requestId, data) {
    return await request.update(data, { where: { id: requestId } });
  }

  // Calcula el número total de notificaciones que el usuario tiene pendientes de visualizar o leer
  async getUnreadCount(userId) {
    return await request.count({
      where: {
        [Op.or]: [
          {
            receiver_id: userId,
            visible_receiver: true,
            is_read_receiver: false,
          },
          { sender_id: userId, visible_sender: true, is_read_sender: false },
        ],
      },
    });
  }

  // Actualiza todas las solicitudes y notificaciones visibles de un usuario marcándolas como leídas
  async markAllAsRead(userId) {
    await request.update(
      { is_read_receiver: true },
      {
        where: {
          receiver_id: userId,
          visible_receiver: true,
          is_read_receiver: false,
        },
      },
    );
    await request.update(
      { is_read_sender: true },
      {
        where: {
          sender_id: userId,
          visible_sender: true,
          is_read_sender: false,
        },
      },
    );
  }

  // Obtiene todo el historial de solicitudes y notificaciones que aún son visibles para el usuario
  async getAllVisibleRequests(userId) {
    return await request.findAll({
      where: {
        [Op.or]: [
          { receiver_id: userId, visible_receiver: true },
          { sender_id: userId, visible_sender: true },
        ],
      },
      include: [
        { model: user, as: "sender", attributes: ["id", "name", "url_image"] },
        {
          model: user,
          as: "receiver",
          attributes: ["id", "name", "url_image"],
        },
      ],
      order: [["updated_at", "DESC"]],
    });
  }

  // Devuelve la petición pendiente (si la hay) entre dos usuarios específicos
  async getPendingRequestBetweenUsers(userId1, userId2) {
    return await request.findOne({
      where: {
        status: "PENDING",
        [Op.or]: [
          { sender_id: userId1, receiver_id: userId2 },
          { sender_id: userId2, receiver_id: userId1 },
        ],
      },
    });
  }

  // Retorna las notificaciones/solicitudes de un usuario que se mantienen en estado 'no leídas'
  async getRequestsWithoutRead(userId) {
    return await request.findAll({
      where: {
        [Op.or]: [
          { sender_id: userId, is_read_sender: false, visible_sender: true },
          {
            receiver_id: userId,
            is_read_receiver: false,
            visible_receiver: true,
          },
        ],
      },
    });
  }

  // Asigna dinámicamente un nuevo reporte al administrador con menor carga de trabajo (menos reportes y chats activos)
  async findAdminWithLeastWorkload() {
    const admins = await user.findAll({
      where: { role: "ADMIN", banned: false },
      attributes: ["id", "name"],
    });

    if (admins.length === 0)
      throw new Error("No hay administradores disponibles");

    let adminConMenosCarga = null;
    let menorCarga = Infinity;

    for (const admin of admins) {
      // Reportes pendientes asignados a este admin
      const reportesPendientes = await request.count({
        where: { receiver_id: admin.id, is_report: true, status: "PENDING" },
      });

      // Conexiones activas con usuarios de role USER
      // Primero obtenemos los connection_ids del admin
      const ucsAdmin = await user_connection.findAll({
        where: { user_id: admin.id },
        attributes: ["connection_id"],
      });
      const connIds = ucsAdmin.map((uc) => uc.connection_id);

      let conexionesActivas = 0;
      if (connIds.length > 0) {
        // Contamos cuántas de esas conexiones están ACTIVE y tienen un USER al otro lado
        const ucsUser = await user_connection.findAll({
          where: {
            connection_id: { [Op.in]: connIds },
            user_id: { [Op.ne]: admin.id },
          },
          include: [
            {
              model: user,
              as: "user",
              where: { role: "USER" },
              required: true,
              attributes: [],
            },
          ],
          attributes: ["connection_id"],
        });

        const connIdsConUser = ucsUser.map((uc) => uc.connection_id);
        if (connIdsConUser.length > 0) {
          conexionesActivas = await connection.count({
            where: {
              id: { [Op.in]: connIdsConUser },
              status: "ACTIVE",
            },
          });
        }
      }

      const cargaTotal = reportesPendientes + conexionesActivas;
      if (cargaTotal < menorCarga) {
        menorCarga = cargaTotal;
        adminConMenosCarga = admin;
      }
    }

    return adminConMenosCarga;
  }

  // Crea un reporte sobre algún usuario u objeto, buscándole y asignándole automáticamente un administrador disponible
  async createReport(senderId, body, infoReport) {
    const adminAsignado = await this.findAdminWithLeastWorkload();

    const nuevoReporte = await request.create({
      sender_id: senderId,
      receiver_id: adminAsignado.id,
      body,
      is_report: true,
      info_report: JSON.stringify(infoReport),
      status: "PENDING",
      is_read_sender: true,
      is_read_receiver: false,
      visible_sender: true,
      visible_receiver: true,
      created_at: new Date(),
      updated_at: new Date(),
    });

    return await request.findByPk(nuevoReporte.id, {
      include: [
        { model: user, as: "sender", attributes: ["id", "name", "url_image"] },
        {
          model: user,
          as: "receiver",
          attributes: ["id", "name", "url_image"],
        },
      ],
    });
  }
}

module.exports = new RequestService();