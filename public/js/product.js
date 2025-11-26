const productos = [
    { nombre: "Star Wars", categoria: "peliculas" },
    { nombre: "The Office", categoria: "series" },
    { nombre: "Rock Nacional", categoria: "musica" }
];

const contenedor = document.getElementById("productos");
const busqueda = document.getElementById("busqueda");
const categoria = document.getElementById("categoria");

function mostrarProductos(lista) {
    contenedor.innerHTML = "";
    lista.forEach(p => {
        const div = document.createElement("div");
        div.className = "card";
        div.textContent = p.nombre;
        contenedor.appendChild(div);
    });
}

busqueda.addEventListener("input", filtrar);
categoria.addEventListener("change", filtrar);

function filtrar() {
    const texto = busqueda.value.toLowerCase();
    const cat = categoria.value;
    const filtrados = productos.filter(p =>
        p.nombre.toLowerCase().includes(texto) &&
        (cat === "todas" || p.categoria === cat)
    );
    mostrarProductos(filtrados);
}

mostrarProductos(productos);
