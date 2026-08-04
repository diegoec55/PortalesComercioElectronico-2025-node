const express = require("express");
const router = express.Router();

const {
    access,
    save,
    profile,
    update,
    remove
} = require("../controllers/usuario.controller");

// Iniciar sesión
router.post("/access", access);

// Registrar usuario
router.post("/", save);

// Obtener perfil
router.get("/:id", profile);

// Actualizar perfil
router.put("/:id", update);

// Eliminar cuenta
router.delete("/:id", remove);

module.exports = router;