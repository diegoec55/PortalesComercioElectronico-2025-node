// Verifica si el usuario tiene rol de administrador
import { PrismaClient } from "../generated/prisma/client.js";

export async function isAdmin(req, res, next) {
    const auth = req.headers["Authorization"] || req.headers["authorization"];
    if (!auth) return res.status(401).send({ error: "No autorizado" });

    const prisma = new PrismaClient();
    const user = await prisma.usuarios.findUnique({
        where: { id: Number(auth) },
    });

    if (!user) return res.status(401).send({ error: "Usuario no encontrado" });
    
    if (!user.es_admin) {
        return res.status(403).send({ error: "Acceso denegado" });
    }

    return next();
}
