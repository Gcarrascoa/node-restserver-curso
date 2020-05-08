// ==================
// Puerto
// ===================

process.env.PORT = process.env.PORT || 3000;

// ==================
// Entorno
// ===================

process.env.NODE_ENV = process.env.NODE_ENV || 'dev';
// ==================
// SEED
// ===================

process.env.SEED = process.env.SEED || 'este-es-el-seed-desarrollo';
// ==================
// FECHA DE CADUCIDAD
// ===================

process.env.FECHA_EXP = 60 * 60 * 24 * 30;

// ==================
// Base de datos
// ===================

let urlDB;
if (process.env.NODE_ENV === 'dev') {
    urlDB = 'mongodb://localhost:27017/cafe';
} else {
    urlDB = process.env.MONGO_URL; //variable creada en el servidor
}
process.env.URLDB = urlDB;