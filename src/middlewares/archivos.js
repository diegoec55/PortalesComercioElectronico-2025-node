// Procesa los archivos subidos en las peticiones
const fs = require("fs");
const { join } = require("path");
const multer = require("multer");

// Configuración de Multer para almacenar los archivos en la carpeta 'uploads'
const storage = multer.diskStorage({
    // guardamos en el almacenamiento local
    destination: function (req, file, cb) {
        const path = join(__dirname, "../../public/uploads");

        // Crear la carpeta si no existe
        // Nos aseguramos que la carpeta va a estar, github borra carpetas vacías y con esto lo solucionamos
        fs.mkdirSync(path, { recursive: true });

        cb(null, path);
    },

    filename: function (req, file, cb) {
        const uniqueSuffix =
            Date.now() + "-" + Math.round(Math.random() * 1e9);

        cb(null, uniqueSuffix + "-" + file.originalname);
    },
});

const upload = multer({ storage: storage });

module.exports = upload;