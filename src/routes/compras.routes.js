const express = require("express");
const router = express.Router();

const {
    list,
    get,
    create,
    update,
    remove,
} = require("../controllers/compras.controller");

const { isAdmin } = require("../middlewares/admin");

router.get("/", [isAdmin], list);
router.get("/:id", get);
router.post("/", create);
router.put("/:id", [isAdmin], update);
router.delete("/:id", [isAdmin], remove);

module.exports = router;