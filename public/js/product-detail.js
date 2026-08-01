import {
    sendQuery,
    sendJsonData,
    currency,
    isAdmin,
    getCart,
    setCart
} from "./helpers.js";
import { initLayout, initMenu } from "./layout.js";

const params = new URLSearchParams(window.location.search);
const slug = params.get("slug");

const main = document.getElementById("detalleProducto");

//-------------------------------------------------------------
async function cargarProducto() {
    try {
        const producto = await sendQuery(`/api/productos/${slug}`);
        mostrarProducto(producto);
    } catch (error) {
        console.error(error);
        main.innerHTML = `<p>Error al cargar el producto.</p>`;
    }

}

//-------------------------------------------------------------
function mostrarProducto(producto) {
    main.innerHTML = `
        <article class="detalle">
            <img
                src="${producto.imagen_url ?? "./assets/no-image.png"}"
                alt="${producto.nombre}"
            >

            <h2>${producto.nombre}</h2>
            <p class="precio">${currency(producto.precio)}</p>
            <p>${producto.descripcion}</p>
            <p>
                <strong>Categoría:</strong>${producto.categorias?.nombre ?? "Sin categoría"}
            </p>
            <button id="agregarCarrito">Agregar al carrito</button>
            ${isAdmin() ? `<button id="eliminarProducto">Eliminar producto</button>` : ""}
        </article>
    `;
    document.getElementById("agregarCarrito").addEventListener("click", () => agregarCarrito(producto));

    if (isAdmin()) {
        document.getElementById("eliminarProducto").addEventListener("click", eliminarProducto);
    }
}

//-------------------------------------------------------------
function agregarCarrito() {
    let carrito = getCart();
    const existe = carrito.find(item => item.slug === slug);

    if (existe) {
        existe.cantidad++;
    } else {
        carrito.push({
            slug: producto.slug,
            nombre: producto.nombre,
            precio: producto.precio,
            imagen_url: producto.imagen_url,
            cantidad: 1
        });
    }
    setCart(carrito);
    alert("Producto agregado al carrito.");
}

//-------------------------------------------------------------
async function eliminarProducto() {

    if (!confirm("¿Eliminar el producto?")) {
        return;
    }

    try {
        const resultado = await sendJsonData(`/api/productos/${slug}`,"DELETE");

        if (resultado.error) {
            alert(resultado.message);
            return;
        }

        alert("Producto eliminado correctamente.");
        window.location.href = "product.html";

    } catch (error) {
        console.error(error);
        alert("No fue posible eliminar el producto.");
    }
}

document.addEventListener("DOMContentLoaded", async () => {
    
    // ---------------- Menú ----------------
    initLayout();
    initMenu();

    await cargarProducto();
});