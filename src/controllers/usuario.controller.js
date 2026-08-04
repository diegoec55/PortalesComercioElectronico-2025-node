const bcrypt = require("bcryptjs");
const prisma = require("../config/prisma");

// ---------------------------------------------------------
async function access(req, res) {
    try {
        const data = req.body;

        if (!data.email || !data.clave) {
            return res.status(400).json({
                error: true,
                message: "Faltan datos obligatorios",
            });
        }

        const user = await prisma.usuarios.findUnique({
            where: { email: data.email },
        });

        if (!user) {
            return res.status(404).json({
                error: true,
                message: "Usuario no encontrado",
            });
        }

        const isPasswordValid = await bcrypt.compare(data.clave, user.clave);

        if (!isPasswordValid) {
            return res.status(401).json({
                error: true,
                message: "Clave incorrecta",
            });
        }

        return res.status(200).send({
            data: {
                id: user.id,
                nombre: user.nombre,
                email: user.email,
                es_admin: user.es_admin,
            },
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            error: true,
            message: "Error al iniciar sesión",
        });
    }
}

// ---------------------------------------------------------
async function profile(req, res) {
    try {
        const id = Number(req.params.id);

        if (isNaN(id)) {
            return res.status(400).json({
                error: true,
                message: "ID inválido",
            });
        }

        const user = await prisma.usuarios.findUnique({
            where: { id },
            include: {
                ordenes: {
                    include: {
                        items: {
                            include: {
                                producto: true,
                            },
                        },
                    },
                },
            },
        });

        if (!user) {
            return res.status(404).json({
                error: true,
                message: "Usuario no encontrado",
            });
        }
        delete user.clave;
        return res.status(200).json({ data: user });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            error: true,
            message: "Error al obtener el usuario",
        });
    }
}

// ---------------------------------------------------------
async function save(req, res) {
    try {
        const data = req.body;

        if (!data.nombre || !data.email || !data.clave) {
            return res.status(400).json({
                error: true,
                message: "Faltan datos obligatorios",
            });
        }

        const regxEmail =
            /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

        if (!regxEmail.test(data.email)) {
            return res.status(400).json({
                error: true,
                message: "Email no válido",
            });
        }

        // Validar que la clave tenga al menos una letra mayúscula, una minúscula, un número y un carácter especial
        const regexClave =
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

        if (!regexClave.test(data.clave)) {
            return res.status(400).json({
                error: true,
                message: "La contraseña debe tener al menos 8 caracteres, una mayúscula, una minúscula, un número y un carácter especial.",
            });
        }

        // Validar si el email ya existe
        const existingUser = await prisma.usuarios.findUnique({
            where: { email: data.email },
        });

        if (existingUser) {
            return res.status(400).json({
                error: true,
                message: "El email ya está registrado",
            });
        }

        const newUser = await prisma.usuarios.create({
            data: {
                nombre: data.nombre,
                email: data.email,
                clave: await bcrypt.hash(data.clave, 10),
                es_admin: data.email.endsWith("@admin.com"),
            },
        });

        delete newUser.clave;

        return res.status(201).json({ data: newUser });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            error: true,
            message: "Error al crear el usuario",
        });
    }
}

// ---------------------------------------------------------
async function update(req, res) {
    try {
        const id = Number(req.params.id);
        const authId = Number(req.headers.authorization);
        const data = req.body;

        if (isNaN(id)) {
            return res.status(400).json({
                error: true,
                message: "ID inválido",
            });
        }

        // Verificar que exista un usuario autenticado
        if (!authId || isNaN(authId)) {
            return res.status(401).json({
                error: true,
                message: "No autorizado",
            });
        }

        // El usuario solo puede editar su propia cuenta
        if (authId !== id) {
            return res.status(403).json({
                error: true,
                message: "No tiene permiso para editar esta cuenta",
            });
        }

        const usuario = await prisma.usuarios.findUnique({
            where: { id },
        });

        if (!usuario) {
            return res.status(404).json({
                error: true,
                message: "Usuario no encontrado",
            });
        }

        if (!data.nombre || !data.email) {
            return res.status(400).json({
                error: true,
                message: "Nombre y email son obligatorios",
            });
        }

        const regxEmail =
            /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

        if (!regxEmail.test(data.email)) {
            return res.status(400).json({
                error: true,
                message: "Email no válido",
            });
        }

        const emailNormalizado = data.email.trim().toLowerCase();

        // Verificar si el nuevo email pertenece a otro usuario
        const existingUser = await prisma.usuarios.findUnique({
            where: {
                email: emailNormalizado,
            },
        });

        if (existingUser && existingUser.id !== id) {
            return res.status(400).json({
                error: true,
                message: "El email ya está registrado",
            });
        }

        const updateData = {
            nombre: data.nombre.trim(),
            email: emailNormalizado,
        };

        // La contraseña es opcional al editar
        if (data.clave) {
            const regexClave =
                /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

            if (!regexClave.test(data.clave)) {
                return res.status(400).json({
                    error: true,
                    message:
                        "La contraseña debe tener al menos 8 caracteres, una mayúscula, una minúscula, un número y un carácter especial.",
                });
            }

            updateData.clave = await bcrypt.hash(data.clave, 10);
        }

        const updatedUser = await prisma.usuarios.update({
            where: { id },
            data: updateData,
        });

        delete updatedUser.clave;

        return res.status(200).json({
            error: false,
            message: "Perfil actualizado correctamente",
            data: updatedUser,
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            error: true,
            message: "Error al actualizar el perfil",
        });
    }
}

// ---------------------------------------------------------
async function remove(req, res) {
    try {
        const id = Number(req.params.id);

        if (isNaN(id)) {
            return res.status(400).json({
                error: true,
                message: "ID inválido",
            });
        }
        const usuario = await prisma.usuarios.findUnique({
            where: { id }
        });

        if (!usuario) {
            return res.status(404).json({
                error: true,
                message: "Usuario no encontrado",
            });
        }

        await prisma.$transaction(async (tx) => {
            // Obtener las órdenes del usuario
            const ordenes = await tx.ordenes.findMany({
                where: {
                    usuario_id: id,
                },
                select: {
                    id: true,
                },
            });

            const ordenIds = ordenes.map(o => o.id);

            if (ordenIds.length > 0) {
                await tx.items.deleteMany({
                    where: {
                        orden_id: {
                            in: ordenIds,
                        },
                    },
                });
                await tx.ordenes.deleteMany({
                    where: {
                        usuario_id: id,
                    },
                });
            }
            await tx.usuarios.delete({
                where: {
                    id,
                },
            });
        });

        return res.json({
            error: false,
            message: "Cuenta eliminada correctamente."
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            error: true,
            message: "No fue posible eliminar la cuenta."
        });
    }
}

module.exports = { access, profile, save, update, remove };