const express = require("express");
const router = express.Router();

const {
    access,
    save,
    profile
} = require("../controllers/usuario.controller");

router.get("/:id", profile);
router.post("/", save);
router.post("/access", access);

module.exports = router;