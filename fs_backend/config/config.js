// Archivo central para exponer variables de entorno críticas para la seguridad de la app
const SECRET_JWT_KEY = process.env.JWT_SECRET;

module.exports = {
  SECRET_JWT_KEY
};
