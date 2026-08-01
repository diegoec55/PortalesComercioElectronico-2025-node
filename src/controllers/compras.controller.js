const prisma = require("../config/prisma");

// ---------------------------------------------------------
async function list(req, res) {
    try {
        let page = req?.query?.page || 1;
        let limit = req?.query?.limit || 10;
        page = parseInt(page);
        limit = parseInt(limit);
        const offset = (page - 1) * limit;

        const ordenes = await prisma.ordenes.findMany({
            include: {
                items: {
                    include: {
                        producto: true,
                    },
                },
                usuario: true,
            },
            skip: offset,
            take: limit,
        });

        return res.status(200).json({ data: ordenes });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            error: true,
            message: "Error al obtener las compras",
        });
    }
}

// ---------------------------------------------------------
async function get(req, res) {
    try {
        const id = Number(req.params.id);

        if (isNaN(id)) {
            return res.status(400).json({
                error: true,
                message: "ID inválido",
            });
        }

        const orden = await prisma.ordenes.findUnique({
            where: { id },
            include: {
                items: {
                    include: {
                        producto: true,
                    },
                },
                usuario: true,
            },
        });

        if (!orden) {
            return res.status(404).json({
                error: true,
                message: "Compra no encontrada",
            });
        }

        return res.status(200).json({ data: orden });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            error: true,
            message: "Error al obtener la compra",
        });
    }
}

// ---------------------------------------------------------
async function create(req, res) {
    try {
        const data = req.body;

        if (!data.usuario || !data.items || data.items.length === 0) {
            return res.status(400).json({
                error: true,
                message: "Faltan datos obligatorios",
            });
        }

        const nuevaOrden = await prisma.$transaction(async (tx) => {

            // Verificar usuario
            const usuario = await tx.usuarios.findUnique({
                where: {
                    id: Number(data.usuario),
                },
            });

            if (!usuario) {
                throw new Error("Usuario no encontrado");
            }

            // Buscar productos
            let items = await Promise.all(
                data.items.map(async (item) => {
                    const producto = await tx.productos.findUnique({
                        where: { id: Number(item.producto_id) },
                    });

                    if (!producto) {
                        throw new Error(
                            `Producto ${item.producto_id} no encontrado`
                        );
                    }

                    return {
                        ...producto,
                        cantidad: Number(item.cantidad),
                    };
                })
            );

            // Calcular total
            const total = items.reduce(
                (acc, item) => acc + Number(item.precio) * item.cantidad, 0
            );

            // Crear orden
            const orden = await tx.ordenes.create({
                data: {
                    usuario_id: Number(data.usuario),
                    total,
                },
            });

            // Crear items
            for (const item of items) {
                await tx.items.create({
                    data: {
                        orden_id: orden.id,
                        producto_id: item.id,
                        cantidad: item.cantidad,
                        precio_unitario: Number(item.precio),
                    },
                });
            }

            return await tx.ordenes.findUnique({
                where: { id: orden.id, },
                include: {
                    items: {
                        include: {
                            producto: true,
                        },
                    },
                    usuario: true,
                },
            });
        });

        return res.status(201).json({ data: nuevaOrden, });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            error: true,
            message: error.message,
        });
    }
}

// ---------------------------------------------------------
async function update(req, res) {
    try {
        const id = Number(req.params.id);

        const existe = await prisma.ordenes.findUnique({
            where: { id },
        });

        if (!existe) {
            return res.status(404).json({
                error: true,
                message: "Compra no encontrada",
            });
        }

        const orden = await prisma.ordenes.update({
            where: { id },
            data: req.body,
            include: {
                items: {
                    include: {
                        producto: true,
                    },
                },
                usuario: true,
            },
        });

        return res.json({data: orden,});
        
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            error: true,
            message: "Error al actualizar la compra",
        });
    }
}

// ---------------------------------------------------------
async function remove(req, res) {
    try {
        const id = Number(req.params.id);

        const orden = await prisma.ordenes.findUnique({where: { id },});

        if (!orden) {
            return res.status(404).json({
                error: true,
                message: "Compra no encontrada",
            });
        }

        await prisma.$transaction(async (tx) => {
            // Primero eliminar los items
            await tx.items.deleteMany({where: {orden_id: id,},});

            // Luego eliminar la orden
            await tx.ordenes.delete({where: {id,},});
        });

        return res.json({deleted: true,});
        
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            error: true,
            message: "Error al eliminar la compra",
        });
    }
}

module.exports = { list, get, create, update, remove, };