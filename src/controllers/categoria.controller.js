const prisma = require("../config/prisma");

async function list(req, res) {

    try {
        const categorias = await prisma.categorias.findMany({
            orderBy: {
                nombre: "asc",
            },
        });

        return res.json(categorias);

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            error: true,
            message: "Error al obtener categorías",
        });
    }
}

module.exports = {list,};