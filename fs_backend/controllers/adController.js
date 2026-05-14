const adService = require("../services/adService");

// Controlador encargado de gestionar todas las operaciones relacionadas con los anuncios (Ads)
class AdController {
  // Obtiene una lista paginada de todos los anuncios, con opción de filtrado por término de búsqueda
  async getAllAds(req, res) {
    try {
      const page = parseInt(req.query.page) || 1;
      const search = req.query.search || "";
      const result = await adService.getAllAds({ page, search });
      res.status(200).json({ ok: true, ...result });
    } catch (err) {
      console.error("ERROR getAllAds:", err.message, err.stack);
      res.status(500).json({ ok: false, mensaje: "Error al obtener anuncios" });
    }
  }

  // Crea un nuevo anuncio asignado al usuario autenticado e incluye sus intereses asociados
  async createAd(req, res) {
    try {
      const { title, body, interests } = req.body;
      const newAd = await adService.createAd(
        { title, body, user_id: req.user.id },
        interests,
      );
      res.status(201).json({ ok: true, datos: newAd });
    } catch (err) {
      res.status(500).json({ ok: false, mensaje: "Error al crear anuncio" });
    }
  }

  // Actualiza los datos de un anuncio existente, verificando primero que el usuario tenga permisos (dueño, ADMIN o DEVELOPER)
  async updateAd(req, res) {
    try {
      const { id } = req.params;
      const { title, body, interests } = req.body;

      const ad = await adService.getAdById(id);
      if (!ad)
        return res.status(404).json({ ok: false, mensaje: "No encontrado" });

      if (
        ad.user_id !== req.user.id &&
        req.user.role !== "ADMIN" &&
        req.user.role !== "DEVELOPER"
      )
        return res
          .status(403)
          .json({
            ok: false,
            mensaje: "No tienes permiso para editar este anuncio",
          });

      const updated = await adService.updateAd(id, { title, body }, interests);
      res.status(200).json({ ok: true, datos: updated });
    } catch (err) {
      res.status(500).json({ ok: false, mensaje: "Error al actualizar" });
    }
  }

  // Elimina un anuncio por su ID, siempre y cuando el usuario sea el creador o tenga permisos superiores
  async deleteAd(req, res) {
    try {
      const { id } = req.params;
      const ad = await adService.getAdById(id);

      if (!ad)
        return res.status(404).json({ ok: false, mensaje: "No encontrado" });

      if (
        ad.user_id !== req.user.id &&
        req.user.role !== "ADMIN" &&
        req.user.role !== "DEVELOPER"
      )
        return res
          .status(403)
          .json({
            ok: false,
            mensaje: "No tienes permiso para borrar este anuncio",
          });

      await adService.deleteAd(id);
      res.status(200).json({ ok: true, mensaje: "Anuncio eliminado" });
    } catch (err) {
      res.status(500).json({ ok: false, mensaje: "Error al borrar" });
    }
  }

  // Realiza una búsqueda de anuncios cuya información contenga una palabra clave específica
  async getAdsByWord(req, res) {
    try {
      const { word } = req.params;
      const ads = await adService.getAdsByWord(word);
      res.status(200).json({ ok: true, datos: ads });
    } catch (err) {
      res.status(500).json({ ok: false, mensaje: "Error en la busqueda" });
    }
  }

  // Obtiene toda la información detallada de un anuncio específico mediante su ID
  async getAdById(req, res) {
    try {
      const { id } = req.params;
      const ad = await adService.getAdById(id);
      res.status(200).json({ ok: true, datos: ad });
    } catch (err) {
      res.status(500).json({ ok: false, mensaje: "Error en la busqueda" });
    }
  }
}

module.exports = new AdController();
