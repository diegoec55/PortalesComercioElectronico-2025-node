let productos = [];
const contenedor = document.getElementById("productos");
const busqueda = document.getElementById("busqueda");
const categoria = document.getElementById("categoria");


async function cargarProductos() {
    const res = await fetch("http://localhost:3000/api/productos/");  
    productos = await res.json();

    console.log(JSON.stringify(productos,null,4));
    
    mostrarProductos(productos);
}

function mostrarProductos(lista) {
    contenedor.innerHTML = "";
    lista.forEach(p => {
        const link = document.createElement("a");

        link.href = `/product-detail.html?slug=${p.slug}`;  // BUSCAR slug
        link.className = "card";

        const img = document.createElement("img");
        img.src = p.imagen_url;

        const nombre = document.createElement("h3");
        nombre.textContent = p.nombre;

        const precio = document.createElement("p");
        precio.textContent = `$${p.precio}`;
        link.appendChild(img);
        link.appendChild(nombre);
        link.appendChild(precio);
        contenedor.appendChild(link);
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

cargarProductos()
