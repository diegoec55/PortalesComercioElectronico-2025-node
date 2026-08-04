import {
    isLogged,
    sendQuery,
    sendJsonData,
    currency
} from "./helpers.js";
import { initLayout, initMenu } from "./layout.js";

const datosUsuario = document.getElementById("datosUsuario");
const compras = document.getElementById("compras");
const botonEliminar = document.getElementById("eliminarCuenta");

//---------------------------------------------------------
async function cargarPerfil() {
    const usuario = isLogged();

    if (!usuario) {
        alert("Debe iniciar sesión para ver su perfil.");
        window.location.href = "login.html";
        return;
    }

    try {
        const respuesta = await sendQuery(
            `/api/usuarios/${usuario.id}`
        );
        mostrarUsuario(respuesta.data);
        mostrarCompras(respuesta.data.ordenes);

    } catch (error) {
        console.error(error);
        datosUsuario.innerHTML = `
            <p>No fue posible cargar el perfil.</p>
        `;
    }
}

//---------------------------------------------------------
function mostrarUsuario(usuario) {
    datosUsuario.innerHTML = `
        <article class="perfil">
            <h2>Mi Perfil</h2>
            <p>
                <strong>Nombre:</strong>${usuario.nombre}
            </p>

            <p>
                <strong>Email:</strong>${usuario.email}
            </p>

            <p>
                <strong>Rol:</strong>${usuario.es_admin ? "Administrador" : "Cliente"}
            </p>
        </article>
    `;
}

//---------------------------------------------------------
function mostrarCompras(lista) {
    compras.innerHTML = "";

    if (!lista || lista.length === 0) {
        compras.innerHTML = `<p>Todavía no realizaste compras.</p>`;
        return;
    }

    lista.forEach(compra => {
        const div = document.createElement("article");
        div.className = "compra";
        div.innerHTML = `
            <p><strong>Fecha:</strong> ${compra.created_at
                ? new Date(compra.created_at).toLocaleDateString("es-AR")
                : "Sin fecha"}</p>
            <p><strong>Total:</strong> ${currency(Number(compra.total))}</p>
            <h3>Productos:</h3>

            <ul>
                ${compra.items.map(item => `
                        <li>
                            ${item.producto.nombre ?? "Producto no disponible"}
                            -
                            ${item.cantidad} unidad/es
                            -
                            ${currency(
                    Number(item.precio_unitario) *
                    item.cantidad
                )}
                        </li>
                    `).join("")
            }
            </ul>
        `;
        compras.appendChild(div);
    });
}

//---------------------------------------------------------
botonEliminar.addEventListener("click", async () => {
    const usuario = isLogged();

    if (!usuario) {
        alert("Debe iniciar sesión.");
        window.location.href = "login.html";
        return;
    }

    const confirmacion = confirm(
        "¿Seguro que desea eliminar su cuenta? Esta acción no puede deshacerse."
    );

    if (!confirmacion) {
        return;
    }

    try {
        const resultado = await sendJsonData(
            `/api/usuarios/${usuario.id}`,
            "DELETE"
        );

        if (resultado.error) {
            alert(resultado.message);
            return;
        }

        localStorage.removeItem("usuario");
        localStorage.removeItem("carrito");

        alert("Su cuenta fue eliminada.");
        window.location.href = "index.html";

    } catch (error) {
        console.error(error);
        alert("No fue posible eliminar la cuenta.");
    }
});

//---------------------------------------------------------
document.addEventListener("DOMContentLoaded", async () => {
    initLayout();
    initMenu();
    await cargarPerfil();
}
);