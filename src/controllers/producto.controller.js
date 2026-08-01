const prisma = require("../config/prisma");

// ---------------------------------------------------------
async function list(req, res) {
    try {
        let page = req?.query?.page || 1;
        let limit = req?.query?.limit || 10;
        page = parseInt(page);
        limit = parseInt(limit);

        const offset = (page - 1) * limit;

        const products = await prisma.productos.findMany({
            where: {
                OR: [
                    { nombre: { contains: req?.query?.search ?? "" } },
                    { descripcion: { contains: req?.query?.search ?? "" } },
                ],
            },
            include: {
                categorias: true,
                etiquetas: true,
            },
            skip: offset, // cuantos tomamos por pagina
            take: limit, // cuanto nos saltamos, del 0 a 5
        });
        return res.send(products); // el send lo pasa como un json

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            error: true,
            message: "Error al obtener los productos"
        });
    }
}

// ---------------------------------------------------------
async function get(req, res) {
    try {
        const { slug } = req.params;

        const product = await prisma.productos.findUnique({
            where: { slug: slug },
            include: {
                categorias: true,
                etiquetas: true,
            },
        });

        if (!product) {
            return res.status(404).send({ msg: "Producto no encontrado" });
        }

        return res.send(product); // el send lo pasa como un json

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            error: true,
            message: "Error al obtener el producto"
        });
    }
}

// ---------------------------------------------------------
async function create(req, res) {
    try {
        const data = req.body;
        const files = req.files;

        const newProduct = await prisma.$transaction(async (tx) => {
            
            // Buscar o crear la categoría
            let categoria = await tx.categorias.findFirst({
                where: { nombre: data.categoria },
            });

            if (!categoria) {
                categoria = await tx.categorias.create({
                    data: {
                        nombre: data.categoria,
                    },
                });
            }

            // Buscar o crear etiquetas
            const etiquetaIds = [];

            if (data.etiquetas && Array.isArray(data.etiquetas)) {
                for (const etiqueta of data.etiquetas) {
                    let tag = await tx.etiquetas.findUnique({
                        where: { nombre: etiqueta.trim() },
                    });

                    if (!tag) {
                        tag = await tx.etiquetas.create({
                            data: { nombre: etiqueta.trim() },
                        });
                    }

                    etiquetaIds.push({ id: tag.id });
                }
            }

            // Crear el producto
            return await tx.productos.create({

                data: {
                    nombre: data.nombre,
                    slug: data.slug,
                    descripcion: data.descripcion,
                    precio: parseFloat(data.precio),
                    categoria_id: categoria_id,
                    imagen_url: files?.length
                        ? `/uploads/${files[0].filename}`
                        : null,
                    etiquetas: { connect: etiquetaIds },
                    // etiquetas: { set: etiquetaIds || [] },
                },
                include: {
                    categorias: true,
                    etiquetas: true,
                },
            });
        });

        return res.send(newProduct);

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            error: true,
            message: "Error al crear el producto"
        });
    }
}

// ---------------------------------------------------------
async function update(req, res) {
    try {
        const { slug } = req.params;
        const data = req.body;
        const files = req.files;

        // Verificar que el producto exista
        const product = await prisma.productos.findUnique({
            where: { slug },
        });

        if (!product) {
            return res.status(404).json({
                error: true,
                message: "Producto no encontrado",
            });
        }

        const upProduct = await prisma.$transaction(async (tx) => {
            
            // Buscar o crear la categoría
            let categoria = await tx.categorias.findFirst({
                where: { nombre: data.categoria },
            });

            if (!categoria) {
                categoria = await tx.categorias.create({
                    data: {
                        nombre: data.categoria,
                    },
                });
            }

            // Buscar o crear etiquetas
            let etiquetaIds = [];

            if (data.etiquetas && Array.isArray(data.etiquetas)) {
                for (const etiqueta of data.etiquetas) {

                    let select = await tx.etiquetas.findUnique({
                        where: { nombre: etiqueta.trim() },
                    });

                    if (!select) {
                        select = await tx.etiquetas.create({
                            data: { nombre: etiqueta.trim() },
                        });
                    }

                    etiquetaIds.push({ id: select.id });
                }
            }

            return await tx.productos.update({
                where: { slug: slug },
                data: {
                    nombre: data.nombre || product.nombre,
                    slug: data.slug || product.slug,
                    descripcion: data.descripcion || product.descripcion,
                    precio: data.precio !== undefined
                        ? parseFloat(data.precio)
                        : product.precio,
                    categoria_id: categoria.id,
                    imagen_url: files?.length
                        ? `/uploads/${files[0].filename}`
                        : product.imagen_url,
                    etiquetas: { set: etiquetaIds },
                },
                include: {
                    categorias: true,
                    etiquetas: true,
                },
            });
        });
        res.send(upProduct);

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            error: true,
            message: "Error al actualizar el producto"
        });
    }
}

// ---------------------------------------------------------
async function remove(req, res) {
    try {
        const { slug } = req.params;

        const product = await prisma.productos.findUnique({
            where: { slug },
        });

        if (!product) {
            return res.status(404).json({
                error: true,
                message: "Producto no encontrado"
            });
        }

        await prisma.productos.delete({
            where: { slug },
        });

        res.send({ deleted: true });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            error: true,
            message: "Error al eliminar el producto"
        });
    }
}

module.exports = { list, get, create, update, remove, };