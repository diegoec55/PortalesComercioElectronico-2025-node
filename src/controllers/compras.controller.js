import { PrismaClient } from "../generated/prisma/client.js";
const prisma = new PrismaClient();

// ---------------------------------------------------------
export async function list(req, res) {
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
    return res.status(200).send({ data: ordenes });
}

// ---------------------------------------------------------
export async function get(req, res) {
    const { id } = req.params;
    const orden = await prisma.ordenes.findUnique({
        where: { id: Number(id) },
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
        return res.status(404).send({ msg: "Compra no encontrada", error: true });
    }
    return res.status(200).send({ data: orden });
}

// ---------------------------------------------------------
export async function create(req, res) {
    const data = req.body;

    if (!data.usuario || !data.items || data.items.length === 0) {
        return res
            .status(400)
            .send({ msg: "Faltan datos obligatorios", error: true });
    }

    let items = await Promise.all(
        data.items.map(async (item) => {
            const producto = await prisma.productos.findUnique({
                where: { id: item.producto_id },
            });
            return { ...producto, cantidad: item.cantidad };
        })
    );

    let total = items
        .map((item) => Number(item.precio) * item.cantidad)
        .reduce((a, c) => (a += c), 0);

    const newOrder = await prisma.ordenes.create({
        data: {
            usuario_id: data.usuario,
            total: total,
        },
    });

    for await (let item of items) {
        await prisma.items.create({
            data: {
                orden_id: newOrder.id,
                producto_id: item.id,
                cantidad: item.cantidad,
                precio_unitario: Number(item.precio),
            },
        });
    }

    const selectOrder = await prisma.ordenes.findUnique({
        where: { id: newOrder.id },
        include: {
            items: {
                include: {
                    producto: true,
                },
            },
            usuario: true,
        },
    });

    res.send({ selectOrder });
}

// ---------------------------------------------------------
export async function update(req, res) {
    const { id } = req.params;
    const data = req.body;
    const update = await prisma.ordenes.update({
        where: { id: Number(id) },
        data,
        include: {
            items: {
                include: {
                    producto: true,
                },
            },
            usuario: true,
        },
    });
    res.send({ update });
}

// ---------------------------------------------------------
export async function remove(req, res) {
    const { id } = req.params;
    await prisma.ordenes.delete({
        where: { id: Number(id) },
    });
    return res.send({ deleted: true });
}
