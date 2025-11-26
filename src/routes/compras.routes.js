import { Router } from "express";
import {
    list,
    get,
    create,
    update,
    remove,
} from "../controllers/compras.controller.js";
import { isAdmin } from "../middlewares/admin.js";

const router = Router();

router.get("/", [isAdmin], list);
router.get("/:id", get);
router.post("/", create);
router.put("/:id", [isAdmin], update);
router.delete("/:id", [isAdmin], remove);

export default router;