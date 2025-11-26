export function isAdmin() {
    let usuario = isLogged();
    return usuario && usuario?.es_admin;
}

export function isLogged() {
    let usuario = localStorage.getItem("usuario") ?? null;
    if (usuario) {
        usuario = JSON.parse(usuario);
    }
    return usuario;
}

export function getCart() {
    let carrito = localStorage.getItem("carrito") ?? null;
    if (carrito) {
        carrito = JSON.parse(carrito);
    }
    return carrito ? carrito : [];
}

export function setCart(data = []) {
    localStorage.setItem("carrito", JSON.stringify(data));
    return getCart();
}

export function currency(amount) {
    return new Intl.NumberFormat("es-AR", {
        style: "currency",
        currency: "ARS",
    }).format(amount);
}

export function formatDate(dateString) {
    const options = { year: "numeric", month: "long", day: "numeric" };
    const date = new Date(dateString);
    return date.toLocaleDateString("es-AR", options);
}

export async function sendFormData(url = "", method = "POST", data = {}) {
    let body = new FormData();
    for (const key in data) {
        body.append(key, data[key]);
    }
    const response = await fetch(url, {
        method,
        body,
    });
    return response.json();
}

export async function sendJsonData(url = "", method = "POST", data = {}) {
    let body = JSON.stringify(data);
    const response = await fetch(url, {
        method,
        headers: {
            "Content-Type": "application/json",
        },
        body,
    });
    return response.json();
}

export async function sendQuery(url = "", data = {}) {
    let params = data ? new URLSearchParams(data).toString() : null;
    const response = await fetch(`${url}${params ? `?${params}` : ""}`, {
        method: "GET",
    });
    return response.json();
}