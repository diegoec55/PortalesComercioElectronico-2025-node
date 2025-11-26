import { Router } from "express";
import { access, save, profile } from "../controllers/usuario.controller.js";

const router = Router();

router.get("/:id", profile);
router.post("/", save);
router.post("/access", access);

export default router;