import {
    isLogged,
    sendQuery,
    currency
} from "./helpers.js";
import { initLayout, initMenu } from "./layout.js";

const datosUsuario = document.getElementById("datosUsuario");
const compras = document.getElementById("compras");

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
        div.innerHTML = `<h3>Compra #${compra.id}</h3>
            <p>Fecha: ${new Date(compra.created_at).toLocaleDateString("es-AR")}</p>
            <p>Total: ${currency(Number(compra.total))}</p>
            <h4>Productos:</h4>

            <ul>
                ${compra.items.map(item => `
                        <li>
                            ${item.producto.nombre}
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
document.addEventListener("DOMContentLoaded", async () => {
        initLayout();
        initMenu();
        await cargarPerfil();
    }
);