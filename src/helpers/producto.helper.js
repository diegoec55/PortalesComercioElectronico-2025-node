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

    if (!tags) {
        return etiquetaIds;
    }

    // Si viene una sola etiqueta, la convertimos en un array
    if (!Array.isArray(tags)) {
        tags = [tags];
    }

    for (const tag of tags) {
        const nombre = tag.trim();
        if (!nombre) continue;

        let etiqueta = await db.etiquetas.findUnique({
            where: {
                nombre,
            },
        });

        if (!etiqueta) {
            etiqueta = await db.etiquetas.create({
                data: {
                    nombre,
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