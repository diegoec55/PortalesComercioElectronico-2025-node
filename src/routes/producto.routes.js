import { Router } from "express";
import {
    list,
    get,
    create,
    update,
    remove,
} from "../controllers/producto.controller.js";
import upload from "../middlewares/archivos.js";
import { isAdmin } from "../middlewares/admin.js";

const router = Router();

router.get("/", list);
router.get("/:slug", get);
router.post("/",
    upload.any(),
    create);
router.put("/:slug",
    [isAdmin, upload.any()],
    update);
router.delete("/:slug",
    
    remove);

export default router;