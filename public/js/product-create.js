import { sendFormData, sendQuery, isAdmin } from "./helpers.js";

if (!isAdmin()) {
    alert("No tiene permisos para acceder.");
    window.location.href = "index.html";
}

const formulario = document.getElementById("formProducto");
const categoriaSelect = document.getElementById("categoria");

const tituloFormulario = document.getElementById("tituloFormulario");
const btnGuardar = document.getElementById("btnGuardar");
const previewImagen = document.getElementById("previewImagen");

const params = new URLSearchParams(window.location.search);
const slug = params.get("slug");

// -------------------------------------------------
async function cargarCategorias() {
    try {
        const categorias = await sendQuery("/api/categorias");
        categoriaSelect.innerHTML = '<option value="">Seleccione una categoría</option>';
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

//-------------------------------------------------
async function cargarProducto() {
    if (!slug) return;

    try {
        const producto = await sendQuery(`/api/productos/${slug}`);
        tituloFormulario.textContent = "Editar Producto";
        btnGuardar.textContent = "Actualizar Producto";
        document.getElementById("nombre").value = producto.nombre;
        document.getElementById("slug").value = producto.slug;
        document.getElementById("slug").readOnly = true;
        document.getElementById("descripcion").value = producto.descripcion;
        document.getElementById("precio").value = producto.precio;

        if (producto.categorias) {
            categoriaSelect.value = producto.categorias.nombre;
        }
        document.getElementById("etiquetas").value =
            producto.etiquetas
                .map(e => e.nombre)
                .join(", ");

        if (previewImagen) {
            previewImagen.src =
                producto.imagen_url ?? "./assets/no-image.png";
        }

    } catch (error) {
        console.error(error);
        alert("No fue posible cargar el producto.");
    }
}

// -------------------------------------------------
document.getElementById("imagen").addEventListener("change", (e) => {
        const archivo = e.target.files[0];

        if (!archivo) return;
        previewImagen.src = URL.createObjectURL(archivo);
    });

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
        if (!categoriaSelect.value) {
            alert("Debe seleccionar una categoría.");
            return;
        }

        const data = {
            nombre: document.getElementById("nombre").value,
            slug: document.getElementById("slug").value,
            descripcion: document.getElementById("descripcion").value,
            precio: document.getElementById("precio").value,
            categoria: categoriaSelect.value,
            etiquetas,
            imagen: document.getElementById("imagen").files[0] ?? null
        };

        let resultado;
        if (slug) {
            resultado = await sendFormData(
                `/api/productos/${slug}`,
                "PUT",
                data
            );
        } else {
            resultado = await sendFormData(
                "/api/productos",
                "POST",
                data
            );
        }

        if (resultado.error) {
            alert(resultado.message);
            return;
        }

        alert(slug ? "Producto actualizado correctamente." : "Producto creado correctamente.");
        window.location.href = "product.html";

    } catch (error) {
        console.error(error);
        alert( slug ? "No fue posible actualizar el producto." : "No fue posible crear el producto.");
    }
});

// -------------------------------------------------
document.addEventListener("DOMContentLoaded", async () => {
    await cargarCategorias();
    await cargarProducto();
});