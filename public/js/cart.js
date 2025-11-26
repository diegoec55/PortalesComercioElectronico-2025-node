let carrito = [
    { nombre: "Star Wars", precio: 599, cantidad: 1 },
    { nombre: "The Office", precio: 550, cantidad: 2 },
];

function render() {
    const div = document.getElementById("carrito");
    const total = document.getElementById("total");
    div.innerHTML = "";
    let suma = 0;

    carrito.forEach((p, i) => {
        suma += p.precio * p.cantidad;
        div.innerHTML += `
        <div class="item">
        <p>${p.nombre} - $${p.precio} x ${p.cantidad}</p>
        <button onclick="cambiar(${i},1)">+</button>
        <button onclick="cambiar(${i},-1)">-</button>
        </div>`;
    });

    total.textContent = suma.toFixed(2);
}

function cambiar(i, delta) {
    carrito[i].cantidad += delta;
    if (carrito[i].cantidad < 1) carrito[i].cantidad = 1;
    render();
}

render();