import express from "express";
import cors from "cors";
import morgan from "morgan";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const app = express();

// Configuraciones de puerto y middleware instalados
app.set("port", process.env.PORT || 3000);
app.use(cors()); // Habilita CORS para todas las rutas
app.use(morgan("dev")); // Registra las peticiones HTTP en la consola
app.use(express.json()); // Parsea peticiones con body application/json
app.use(express.urlencoded({ extended: false })); // Parsea peticiones con body y query

// Archivos estáticos de la carpera public disponible para todos
app.use(express.static(join(dirname(fileURLToPath(import.meta.url)), "../public")));

// Rutas
import productoRoutes from "./routes/producto.routes.js";
import usuarioRoutes from "./routes/usuario.routes.js";
import comprasRoutes from "./routes/compras.routes.js";

app.use("/api/productos", productoRoutes);
app.use("/api/usuarios", usuarioRoutes);
app.use("/api/compras", comprasRoutes);

app.listen(app.get("port"), () => {
    console.log(
        `Servidor iniciado en http://localhost:${app.get("port")}`
    );
});