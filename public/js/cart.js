import {
    getCart,
    setCart,
    currency,
    sendJsonData,
    isLogged,
} from "./helpers.js";
import { initLayout, initMenu } from "./layout.js";

const contenedor = document.getElementById("carrito");
const total = document.getElementById("total");
const btnComprar = document.getElementById("comprar");

//--------------------------------------------------------
function render() {
    const carrito = getCart();
    contenedor.innerHTML = "";

    if (carrito.length === 0) {
        contenedor.innerHTML = `
            <p>El carrito está vacío.</p>
        `;
        total.textContent = currency(0);
        btnComprar.disabled = true;
        return;
    }

    btnComprar.disabled = false;
    let suma = 0;

    carrito.forEach((producto, index) => {
        suma += producto.precio * producto.cantidad;
        const item = document.createElement("div");
        item.className = "item";
        item.innerHTML = `
            <img
                src="${producto.imagen_url ?? "./assets/no-image.png"}"
                width="120"
                alt="${producto.nombre}"
            >
            <h3>${producto.nombre}</h3>
            <p class="precio">${currency(producto.precio)}</p>
            <div>
                <button class="menos">−</button>
                <span>${producto.cantidad}</span>
                <button class="mas">+</button>
            </div>
        `;

        item.querySelector(".mas").addEventListener("click", () => cambiarCantidad(index, 1));
        item.querySelector(".menos").addEventListener("click", () => cambiarCantidad(index, -1));
        contenedor.appendChild(item);
    });
    total.textContent = currency(suma);
}

//--------------------------------------------------------
function cambiarCantidad(index, delta) {
    const carrito = getCart();
    carrito[index].cantidad += delta;

    if (carrito[index].cantidad <= 0) {
        carrito.splice(index, 1);
    }

    setCart(carrito);
    render();
}

//--------------------------------------------------------
async function finalizarCompra() {
    const usuario = isLogged();

    if (!usuario) {
        alert("Debe iniciar sesión para comprar.");
        location.href = "login.html";
        return;
    }

    const carrito = getCart();

    if (carrito.length === 0) {
        return;
    }

    const items = carrito.map(item => ({
        producto_id: item.id,
        cantidad: item.cantidad,
    }));

    try {
        const resultado = await sendJsonData(
            "/api/compras",
            "POST",
            {
                usuario: usuario.id,
                items,
            }
        );

        if (resultado.error) {
            alert(resultado.message);
            return;
        }

        setCart([]);
        alert("Compra realizada correctamente.");
        location.href = "index.html";

    } catch (error) {
        console.error(error);
        alert("No fue posible realizar la compra.");
    }
}
btnComprar.addEventListener("click", finalizarCompra);

//--------------------------------------------------------
document.addEventListener("DOMContentLoaded", () => {
    initLayout();
    initMenu();
    render();
});