const params = new URLSearchParams(window.location.search);
const slug = params.get("slug");

fetch(`/api/productos/${slug}`)
    .then(res => res.json())
    .then(producto => {
        document.querySelector("main").innerHTML = `
            <img src="${producto.imagen_url}" alt="${producto.nombre}">
            <h2>${producto.nombre}</h2>
            <p><strong>Precio:</strong> $${producto.precio}</p>
            <p><strong>Descripción:</strong> ${producto.descripcion}</p>

            <button id="eliminar">Eliminar producto</button>
        `;

        const btnEliminar = document.getElementById("eliminar");
        btnEliminar.addEventListener("click", async () => {
            if (!confirm("¿Seguro deseas eliminar este producto?")) return;

            const resp = await fetch(`/api/productos/${slug}`, {
                method: "DELETE"
            });

            if (resp.ok) {
                alert("Producto eliminado correctamente");
                window.location.href = "product.html";
            } else {
                alert("Error al eliminar el producto");
            }
        });

    })
    .catch(err => {
        document.querySelector("main").innerHTML = "<p>Error al cargar el producto</p>";
        console.error(err);
    });
