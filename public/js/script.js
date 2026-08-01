console.log("index cargado correctamente");

const usuario = JSON.parse(localStorage.getItem("usuario"));
const loginLink = document.getElementById("loginLink");
const registerLink = document.getElementById("registerLink");
const logoutLink = document.getElementById("logoutLink");

const nav = document.getElementById("nav")
const abrir = document.getElementById("abrir")
const cerrar = document.getElementById("cerrar")

if (usuario) {
    loginLink.textContent = usuario.nombre;
    loginLink.href = "#";

    registerLink.hidden = true;
    logoutLink.hidden = false;
}

if (usuario && loginLink) {
    loginLink.textContent = usuario.nombre;
    loginLink.href = "profile.html";
}

logoutLink.addEventListener("click", (e) => {
    e.preventDefault();
    localStorage.removeItem("usuario");
    window.location.reload();
});

abrir.addEventListener("click", () => {
    nav.classList.add("visible");
    abrir.setAttribute("aria-expanded", "true");
})

cerrar.addEventListener("click", () => {
    nav.classList.remove("visible");
    abrir.setAttribute("aria-expanded", "false");
})
