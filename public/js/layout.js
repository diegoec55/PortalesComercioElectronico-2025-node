import { isLogged } from "./helpers.js";

export function initLayout() {
    const usuario = isLogged();
    const login = document.getElementById("loginLink");
    const registro = document.getElementById("registerLink");
    const logout = document.getElementById("logoutLink");

    if (usuario) {
        login.textContent = usuario.nombre;
        login.href = "#";
        registro.hidden = true;
        logout.hidden = false;
    }

    logout.addEventListener("click", e => {
        e.preventDefault();
        localStorage.removeItem("usuario");
        location.href = "index.html";
    });
}

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