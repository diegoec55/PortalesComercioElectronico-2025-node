import {
    sendQuery,
    sendJsonData,
    currency,
    isAdmin,
    getCart,
    setCart
} from "./helpers.js";

const params = new URLSearchParams(window.location.search);
const slug = params.get("slug");

const main = document.getElementById("detalleProducto");

async function cargarProducto() {
    try {
        const producto = await sendQuery(`/api/productos/${slug}`);
        mostrarProducto(producto);
    } catch (error) {
        console.error(error);
        main.innerHTML = `<p>Error al cargar el producto.</p>`;
    }

}

function mostrarProducto(producto) {
    main.innerHTML = `
        <article class="detalle">
            <img
                src="${producto.imagen_url || "./assets/no-image.png"}"
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
    document.getElementById("agregarCarrito").addEventListener("click", agregarCarrito);

    if (isAdmin()) {
        document.getElementById("eliminarProducto").addEventListener("click", eliminarProducto);
    }
}

function agregarCarrito() {
    let carrito = getCart();
    const existe = carrito.find(item => item.slug === slug);

    if (existe) {
        existe.cantidad++;
    } else {
        carrito.push({
            slug,
            cantidad: 1
        });
    }
    setCart(carrito);
    alert("Producto agregado al carrito.");
}

async function eliminarProducto() {

    if (!confirm("¿Eliminar el producto?")) {
        return;
    }

    try {
        await sendJsonData(`/api/productos/${slug}`,"DELETE");
        alert("Producto eliminado.");
        location.href = "product.html";

    } catch (error) {
        console.error(error);
        alert("No fue posible eliminar el producto.");
    }
}

// ---------------- Menú ----------------
const nav = document.getElementById("nav");

document.getElementById("abrir").addEventListener("click", () => {
        nav.classList.add("visible");
    });

document.getElementById("cerrar").addEventListener("click", () => {
        nav.classList.remove("visible");
    });

cargarProducto();