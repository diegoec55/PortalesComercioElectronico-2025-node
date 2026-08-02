import { isLogged, isAdmin } from "./helpers.js";

//----------------------------------------------------
export function initLayout() {
    const usuario = isLogged();
    const login = document.getElementById("loginLink");
    const registro = document.getElementById("registerLink");
    const logout = document.getElementById("logoutLink");

    const adminMenu = document.getElementById("adminMenu");

    if (!login || !registro || !logout) return;

    if (usuario) {
        login.textContent = usuario.nombre;
        login.href = "profile.html";
        registro.hidden = true;
        logout.hidden = false;
    } else {
        login.textContent = "Login";
        login.href = "login.html";
        registro.hidden = false;
        logout.hidden = true;
    }

    // Mostrar opciones de administrador
    if (isAdmin()) {
        if (adminProduct) adminProduct.hidden = false;
        if (adminUsers) adminUsers.hidden = false;
    }

    logout.addEventListener("click", e => {
        e.preventDefault();
        localStorage.removeItem("usuario");
        location.href = "index.html";
    });
}

//----------------------------------------------------
export function initMenu() {
    const nav = document.getElementById("nav");
    const abrir = document.getElementById("abrir");
    const cerrar = document.getElementById("cerrar");

    if (!nav || !abrir || !cerrar) return;

    abrir.addEventListener("click", () => {
        nav.classList.add("visible");
        abrir.setAttribute("aria-expanded", "true");
    });

    cerrar.addEventListener("click", () => {
        nav.classList.remove("visible");
        abrir.setAttribute("aria-expanded", "false");
    });
}