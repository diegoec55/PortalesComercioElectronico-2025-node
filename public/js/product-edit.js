let productos = [];

const form = document.getElementById("formProducto");
const lista = document.getElementById("lista");

form.addEventListener("submit", e => {
    e.preventDefault();
    const nombre = document.getElementById("nombre").value;
    const precio = document.getElementById("precio").value;
    productos.push({ nombre, precio });
    form.reset();
    render();
});

function eliminar(i) {
    productos.splice(i, 1);
    render();
}

function render() {
    lista.innerHTML = "";
    productos.forEach((p, i) => {
        lista.innerHTML += `<li>${p.nombre} - $${p.precio}
        <button onclick="eliminar(${i})">Eliminar</button></li>`;
    });
}