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
    const body = new FormData();
    for (const key in data) {
        if (Array.isArray(data[key])) {
            data[key].forEach(valor => {
                body.append(key, valor);
            });
        } else if (data[key] !== null && data[key] !== undefined) {
            body.append(key, data[key]);
        }
    }
    const usuario = isLogged();
    const options = {
        method,
        body,
    };
    if (usuario) {
        options.headers = {
            Authorization: usuario.id,
        };
    }

    const response = await fetch(url, options);
    return response.json();
}

export async function sendJsonData(url = "", method = "POST", data = null) {
    const usuario = isLogged();
    const options = {
        method,
        headers: {
            "Content-Type": "application/json",
        }
    };
    
    if (usuario) {
        options.headers.Authorization = usuario.id;
    }

    if (data) {
        options.body = JSON.stringify(data);
    }
    const response = await fetch(url, options);
    return response.json();
}

export async function sendQuery(url = "", params = null) {
    const query = params ? new URLSearchParams(params).toString() : null;
    const response = await fetch(`${url}${query ? `?${query}` : ""}`, {
        method: "GET",
    });
    return response.json();
}