const express = require("express");
const router = express.Router();

const {
    list,
    get,
    create,
    update,
    remove,
} = require("../controllers/producto.controller");

const upload = require("../middlewares/archivos");
const { isAdmin } = require("../middlewares/admin");

router.get("/", list);

router.get("/:slug", get);

router.post("/",isAdmin,upload.any(),create);

router.put("/:slug",isAdmin,upload.any(),update);

router.delete("/:slug",isAdmin,remove);

module.exports = router;