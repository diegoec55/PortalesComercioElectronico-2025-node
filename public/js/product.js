import { sendQuery, currency, isLogged, isAdmin } from "./helpers.js";
import { initLayout, initMenu } from "./layout.js";

initLayout();

const contenedor = document.getElementById("productos");
const busqueda = document.getElementById("busqueda");
const categoria = document.getElementById("categoria");

let productos = [];

// ----------------------------------------------
async function cargarProductos() {
    try {
        productos = await sendQuery("/api/productos");
        mostrarProductos(productos);

    } catch (error) {
        console.error(error);
        contenedor.innerHTML = `<p>No fue posible cargar los productos.</p>`;
    }
}

// ----------------------------------------------
function mostrarProductos(lista) {
    contenedor.innerHTML = "";

    if (lista.length === 0) {
        contenedor.innerHTML = `<p>No se encontraron productos.</p>`;
        return;
    }

    lista.forEach(producto => {
        const card = document.createElement("a");
        card.className = "card";
        card.href = `product-detail.html?slug=${producto.slug}`;  // BUSCAR slug

        card.innerHTML = `
            <img
                src="${producto.imagen_url || "./assets/no-image.png"}"
                alt="${producto.nombre}"
            >
            <h3>${producto.nombre}</h3>
            <p class="precio">${currency(producto.precio)}</p>
            <small>
                ${producto.categorias?.nombre ?? "Sin categoría"}
            </small>
        `;

        contenedor.appendChild(card);
    });
}

// ----------------------------------------------
function filtrar() {
    const texto = busqueda.value.toLowerCase();
    const cat = categoria.value;

    const filtrados = productos.filter(producto => {
        const coincideNombre = producto.nombre.toLowerCase().includes(texto);
        const coincideCategoria = cat === "todas" || producto.categorias?.nombre === cat;
        return coincideNombre && coincideCategoria;
    });
    mostrarProductos(filtrados);
}

busqueda.addEventListener("input", filtrar);
categoria.addEventListener("change", filtrar);

//-------------------menuHambur
initMenu();

//-------------------cargaCateg
async function cargarCategorias() {
    try {
        const categorias = await sendQuery("/api/categorias");
    
        categorias.forEach(cat => {
            const option = document.createElement("option");
            option.value = cat.nombre;
            option.textContent = cat.nombre;

            categoria.appendChild(option);
        });
        
    } catch (error) {
        console.error(error);
    }
}

document.addEventListener("DOMContentLoaded", async () => {
    await cargarCategorias();
    await cargarProductos();
});