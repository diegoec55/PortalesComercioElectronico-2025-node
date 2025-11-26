// import bcrypt from "bcryptjs";
import { PrismaClient } from "../generated/prisma/client.js";
const prisma = new PrismaClient();

// ---------------------------------------------------------
export async function access(req, res) {
    const data = req.body;
    if (!data.email || !data.clave) {
        return res
            .status(400)
            .send({ msg: "Faltan datos obligatorios", error: true });
    }
    const user = await prisma.usuarios.findUnique({
        where: { email: data.email },
    });
    if (!user) {
        return res.status(404).send({ msg: "Usuario no encontrado", error: true });
    }
    const isPasswordValid = await bcrypt.compare(data.clave, user.clave);
    if (!isPasswordValid) {
        return res.status(401).send({ msg: "Clave incorrecta", error: true });
    }
    return res.status(200).send({ data: user });
}

// ---------------------------------------------------------
export async function profile(req, res) {
    const id = req.params.id;
    const user = await prisma.usuarios.findUnique({
        where: { id: Number(id) },
        include: {
            ordenes: {
                include: {
                    items: true,
                },
            },
        },
    });
    if (!user) {
        return res.status(404).send({ msg: "Usuario no encontrado", error: true });
    }
    return res.status(200).send({ data: user });
}

// ---------------------------------------------------------
export async function save(req, res) {
    const data = req.body;
    if (!data.nombre || !data.email || !data.clave) {
        return res
            .status(400)
            .send({ msg: "Faltan datos obligatorios", error: true });
    }
    const regxEmail = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!regxEmail.test(data.email)) {
        return res.status(400).send({ msg: "Email no válido", error: true });
    }
    // Validar que la clave tenga al menos una letra mayúscula, una minúscula , un número y un carácter especial
    const regexClave =
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!regexClave.test(data.clave)) {
        return res.status(400).send({ msg: "Clave no válida", error: true });
    }
    // Validar si el email ya existe
    const existingUser = await prisma.usuarios.findUnique({
        where: { email: data.email },
    });
    if (existingUser) {
        return res
            .status(400)
            .send({ msg: "El email ya está registrado", error: true });
    }
    const newUser = await prisma.usuarios.create({
        data: {
            nombre: data.nombre,
            email: data.email,
            clave: await bcrypt.hash(data.clave, 10),
            es_admin: data.email.includes("@admin.com") ? true : false,
        },
    });
    return res.status(200).send({ data: newUser });
}
