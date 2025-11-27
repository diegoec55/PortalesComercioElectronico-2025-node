import { PrismaClient } from "../generated/prisma/client.js";
const prisma = new PrismaClient();

// ---------------------------------------------------------
export async function list(req, res) {
    let page = req?.query?.page || 1;
    let limit = req?.query?.limit || 10;
    page = parseInt(page);
    limit = parseInt(limit);
    const offset = (page - 1) * limit;
    const products = await prisma.productos.findMany({
        where: {
            AND: [
                { nombre: { contains: req?.query?.search ?? "" } },
                { descripcion: { contains: req?.query?.search ?? "" } },
            ],
        },
        include: {
            categorias: true,
            etiquetas: true,
        },
        skip: offset, //cuantos tomamos por pagina
        take: limit, //cuanto nos saltamos, del 0 a 5
    });
    return res.send(products); //el send lo pasa como un json
}

// ---------------------------------------------------------
export async function get(req, res) {
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
    return res.send(product); //el send lo pasa como un json
}

// ---------------------------------------------------------
export async function create(req, res) {
    const data = req.body;
    const files = req.files;

    // Buscar o crear la categoría

    const categoria = await prisma.categorias.findFirst({
        where: { nombre: data.categoria },
    });

    let categoria_id = categoria ? categoria.id : null;

    if (!categoria) {
        const nuevaCategoria = await prisma.categorias.create({
            data: {
                nombre: data.categoria,
            },
        });
        categoria_id = nuevaCategoria.id;
    }

    // Asignar etiquetas si se proporcionan

    let etiquetaIds = [];
    if (data["etiquetas"] && Array.isArray(data["etiquetas"])) {
        for (const etiqueta of data["etiquetas"]) {
            let select = await prisma.etiquetas.findUnique({
                where: { nombre: etiqueta.trim() },
            });
            if (!select) {
                select = await prisma.etiquetas.create({
                    data: { nombre: etiqueta.trim() },
                });
            }
            etiquetaIds.push({ id: select.id });
        }
    }

    // Crear el producto
    const newProduct = await prisma.productos.create({
        data: {
            nombre: data.nombre,
            slug: data.slug,
            descripcion: data.descripcion,
            precio: parseFloat(data.precio),
            categoria_id: parseInt(categoria_id),
            imagen_url: files ? `/uploads/${files[0].filename}` : null,
            etiquetas: {connect: etiquetaIds}
            // etiquetas: { set: etiquetaIds || [] },
        },
        include: {
            categorias: true,
            etiquetas: true,
        },
    });

    res.send(newProduct);
}

// ---------------------------------------------------------
export async function update(req, res) {
    const { slug } = req.params;
    const data = req.body;
    const files = req.files;

    // Buscar o crear la categoría

    const categoria = await prisma.categorias.findFirst({
        where: { nombre: data.categoria },
    });

    let categoria_id = categoria ? categoria.id : null;

    if (!categoria) {
        const nuevaCategoria = await prisma.categorias.create({
            data: {
                nombre: data.categoria,
            },
        });
        categoria_id = nuevaCategoria.id;
    }

    // Asignar etiquetas si se proporcionan

    let etiquetaIds = [];
    if (data["etiquetas"] && Array.isArray(data["etiquetas"])) {
        for (const etiqueta of data["etiquetas"]) {
            let select = await prisma.etiquetas.findUnique({
                where: { nombre: etiqueta.trim() },
            });
            if (!select) {
                select = await prisma.etiquetas.create({
                    data: { nombre: etiqueta.trim() },
                });
            }
            etiquetaIds.push({ id: select.id });
        }
    }

    // Crear el producto

    const product = await prisma.productos.findUnique({
        where: { slug: slug },
    });

    const upProduct = await prisma.productos.update({
        where: { slug: slug },
        data: {
            nombre: data.nombre || product.nombre,
            slug: data.slug || product.slug,
            descripcion: data.descripcion || product.descripcion,
            precio: parseFloat(data.precio) || product.precio,
            categoria_id: parseInt(categoria_id) || product.categoria_id,
            imagen_url: files ? `/uploads/${files[0].filename}` : product.imagen_url,
            etiquetas: { set: etiquetaIds || [] },
        },
        include: {
            categorias: true,
            etiquetas: true,
        },
    });
    res.send(upProduct);
}

// ---------------------------------------------------------
export async function remove(req, res) {
    const { slug } = req.params;
    await prisma.productos.delete({
        where: { slug: slug },
    });
    res.send({ deleted: true });
}
