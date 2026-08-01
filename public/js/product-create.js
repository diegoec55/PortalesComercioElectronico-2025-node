import {sendFormData, sendQuery, isAdmin} from "./helpers.js";

if (!isAdmin()) {
    alert("No tiene permisos para acceder.");
    window.location.href = "index.html";
}

const formulario = document.getElementById("formProducto");
const categoriaSelect = document.getElementById("categoria");

// -------------------------------------------------
async function cargarCategorias() {
    try {
        const categorias = await sendQuery("/api/categorias");
        categorias.forEach(categoria => {
            const option = document.createElement("option");
            option.value = categoria.nombre;
            option.textContent = categoria.nombre;
            categoriaSelect.appendChild(option);
        });

    } catch (error) {
        console.error(error);
        alert("No fue posible cargar las categorías.");
    }

}

// -------------------------------------------------
formulario.addEventListener("submit", async (e) => {
    e.preventDefault();

    const etiquetas = document
        .getElementById("etiquetas")
        .value
        .split(",")
        .map(tag => tag.trim())
        .filter(tag => tag !== "");

    try {
        const data = {
            nombre: document.getElementById("nombre").value,
            slug: document.getElementById("slug").value,
            descripcion: document.getElementById("descripcion").value,
            precio: document.getElementById("precio").value,
            categoria: categoriaSelect.value,
            etiquetas,
            imagen: document.getElementById("imagen").files[0] ?? null
        };

        if (!categoriaSelect.value) {
            alert("Debe seleccionar una categoría.");
            return;
        }

        const resultado = await sendFormData(
            "/api/productos",
            "POST",
            data
        );

        if (resultado.error) {
            alert(resultado.message);
            return;
        }

        alert("Producto creado correctamente.");
        window.location.href = "product.html";

    } catch (error) {
        console.error(error);
        alert("No fue posible crear el producto.");
    }
});

// -------------------------------------------------
document.addEventListener("DOMContentLoaded", async () => {
    await cargarCategorias();
});