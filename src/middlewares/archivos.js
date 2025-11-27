// Procesa los archivos subidos en las peticiones
import fs from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import multer from "multer";

// Configuración de Multer para almacenar los archivos en la carpeta 'uploads'
const storage = multer.diskStorage({ //guardamos en el alamcenamiento local
    destination: function (req, file, cb) {
        const path = join(
            dirname(fileURLToPath(import.meta.url)),
            "../../public/uploads"
        );
        // Crear la carpeta si no existe
        //Nos aseguramos que la carpeta va a estar, github borra carpetas vacias y con esto lo solucionamos
        fs.mkdirSync(path, { recursive: true });
        cb(null, path);
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        cb(null, uniqueSuffix + "-" + file.originalname);
    },
});

const upload = multer({ storage: storage });

export default upload;