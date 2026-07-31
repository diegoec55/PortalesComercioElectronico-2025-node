require("dotenv").config();
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const { join } = require("path");

const app = express();

// Configuraciones de puerto y middleware instalados
app.set("port", process.env.PORT || 3000);
app.use(cors()); // Habilita CORS para todas las rutas
app.use(morgan("dev")); // Registra las peticiones HTTP en la consola
app.use(express.json()); // Parsea peticiones con body application/json
app.use(express.urlencoded({ extended: false })); // Parsea peticiones con body y query

// Archivos estáticos de la carpera public disponible para todos
app.use(express.static(join(__dirname, "../public")));

// Rutas
const productoRoutes = require("./routes/producto.routes");
const usuarioRoutes = require("./routes/usuario.routes");
const comprasRoutes = require("./routes/compras.routes");

app.use("/api/productos", productoRoutes);
app.use("/api/usuarios", usuarioRoutes);
app.use("/api/compras", comprasRoutes);

app.listen(app.get("port"), () => {
    console.log(
        `Servidor iniciado en http://localhost:${app.get("port")}`
    );
});