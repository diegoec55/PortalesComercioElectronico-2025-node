document.getElementById("formProducto").addEventListener("submit", async (e) => {
    e.preventDefault();

    const form = new FormData();

    form.append("nombre", document.getElementById("nombre").value);
    form.append("slug", document.getElementById("slug").value);
    form.append("descripcion", document.getElementById("descripcion").value);
    form.append("precio", document.getElementById("precio").value);

    const file = document.getElementById("imagen").files[0];
    if (file) form.append("imagen", file);

    const resp = await fetch("/api/productos", {
        method: "POST",
        body: form
    });

    if (resp.ok) {
        alert("Producto creado exitosamente");
        window.location.href = "index.html";
    } else {
        alert("Error al crear el producto");
    }
});
