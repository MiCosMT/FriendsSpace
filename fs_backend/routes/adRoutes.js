const express = require("express");
const router = express.Router();

// Definición de las rutas relacionadas con los anuncios (Ads) de la plataforma
// Gestiona el enrutamiento para listar, crear, modificar y eliminar anuncios.
const adController = require("../controllers/adController");
const { validarToken } = require("../middlewares/validarToken");

// Rutas publicas de lectura
router.get("/", adController.getAllAds);
router.get("/search/:word", adController.getAdsByWord);
router.get("/:id", adController.getAdById);

// Rutas privadas de gestion
router.post("/", validarToken, adController.createAd);
router.put("/:id", validarToken, adController.updateAd);
router.delete("/:id", validarToken, adController.deleteAd);

module.exports = router;