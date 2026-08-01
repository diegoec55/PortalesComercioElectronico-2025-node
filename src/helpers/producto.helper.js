const prisma = require("../config/prisma");

//---------------------------------------------------------
async function findOrCreateCategoria(db, nombre) {

    let categoria = await db.categorias.findFirst({
        where: {
            nombre,
        },
    });

    if (!categoria) {
        categoria = await db.categorias.create({
            data: {
                nombre,
            },
        });
    }
    return categoria.id;
}

//------------------------------------------------------
async function findOrCreateTags(db, tags) {

    const etiquetaIds = [];

    if (!tags || !Array.isArray(tags)) {
        return etiquetaIds;
    }

    for (const tag of tags) {
        let etiqueta = await db.etiquetas.findUnique({
            where: {
                nombre: tag.trim(),
            },
        });

        if (!etiqueta) {
            etiqueta = await db.etiquetas.create({
                data: {
                    nombre: tag.trim(),
                },
            });
        }
        etiquetaIds.push({
            id: etiqueta.id,
        });
    }
    return etiquetaIds;
}

module.exports = {findOrCreateCategoria,findOrCreateTags,};