const express = require("express");
const router = express.Router();

const {
    access,
    save,
    profile,
    remove
} = require("../controllers/usuario.controller");

router.get("/:id", profile);
router.post("/", save);
router.post("/access", access);
router.delete("/:id", remove);

module.exports = router;