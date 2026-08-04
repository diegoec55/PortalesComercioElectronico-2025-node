import {isLogged, sendQuery, sendJsonData} from "./helpers.js";

const formulario = document.getElementById("registroForm");

const tituloFormulario = document.getElementById("tituloFormulario");
const botonGuardar = document.getElementById("btnGuardar");
const volverLink = document.getElementById("volverLink");
const ayudaClave = document.getElementById("ayudaClave");

const nombreInput = document.getElementById("nombre");
const emailInput = document.getElementById("email");
const claveInput = document.getElementById("clave");

const params = new URLSearchParams(window.location.search);
const modoEdicion = params.get("editar") === "true";

// ---------------------------------------------------------
async function prepararFormulario() {

    if (!modoEdicion) {
        claveInput.required = true;
        claveInput.setAttribute("aria-required", "true");
        claveInput.autocomplete = "new-password";
        return;
    }

    const usuario = isLogged();

    if (!usuario) {
        alert("Debe iniciar sesión para editar su perfil.");
        window.location.href = "login.html";
        return;
    }

    tituloFormulario.textContent = "Editar perfil";
    botonGuardar.textContent = "Guardar cambios";

    volverLink.textContent = "Volver a mi perfil";
    volverLink.href = "profile.html";

    claveInput.required = false;
    claveInput.setAttribute("aria-required", "false");
    claveInput.autocomplete = "new-password";
    claveInput.placeholder = "Dejar vacío para mantener la contraseña";

    if (ayudaClave) {
        ayudaClave.textContent =
            "Complete este campo solamente si desea cambiar su contraseña.";
    }

    try {
        const respuesta = await sendQuery(
            `/api/usuarios/${usuario.id}`
        );

        if (respuesta.error) {
            alert(respuesta.message);
            return;
        }

        nombreInput.value = respuesta.data.nombre;
        emailInput.value = respuesta.data.email;

    } catch (error) {
        console.error(error);
        alert("No fue posible cargar los datos del perfil.");
    }
}

// ---------------------------------------------------------
formulario.addEventListener("submit", async (e) => {

    e.preventDefault();

    const nombre = nombreInput.value.trim();
    const email = emailInput.value.trim();
    const clave = claveInput.value;

    if (!nombre || !email) {
        alert("Nombre y email son obligatorios.");
        return;
    }

    if (!modoEdicion && !clave) {
        alert("Complete todos los campos.");
        return;
    }

    try {

        if (modoEdicion) {
            await actualizarPerfil(nombre, email, clave);
        } else {
            await registrarUsuario(nombre, email, clave);
        }

    } catch (error) {
        console.error(error);

        alert(
            modoEdicion
                ? "No fue posible actualizar el perfil."
                : "No fue posible registrar el usuario."
        );
    }
});

// ---------------------------------------------------------
async function registrarUsuario(nombre, email, clave) {

    const respuesta = await fetch("/api/usuarios", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            nombre,
            email,
            clave
        })
    });

    const resultado = await respuesta.json();

    if (!respuesta.ok || resultado.error) {
        alert(
            resultado.message ||
            resultado.msg ||
            "No fue posible registrar el usuario."
        );
        return;
    }

    alert("Usuario registrado correctamente.");
    window.location.href = "login.html";
}

// ---------------------------------------------------------
async function actualizarPerfil(nombre, email, clave) {

    const usuario = isLogged();

    if (!usuario) {
        alert("Debe iniciar sesión.");
        window.location.href = "login.html";
        return;
    }

    const data = {
        nombre,
        email
    };

    // La contraseña solamente se envía si el usuario escribió una nueva
    if (clave) {
        data.clave = clave;
    }

    const resultado = await sendJsonData(
        `/api/usuarios/${usuario.id}`,
        "PUT",
        data
    );

    if (resultado.error) {
        alert(resultado.message);
        return;
    }

    // Actualizamos los datos del usuario almacenados en el navegador
    localStorage.setItem(
        "usuario",
        JSON.stringify({
            id: resultado.data.id,
            nombre: resultado.data.nombre,
            email: resultado.data.email,
            es_admin: resultado.data.es_admin
        })
    );

    alert("Perfil actualizado correctamente.");
    window.location.href = "profile.html";
}

// ---------------------------------------------------------
document.addEventListener("DOMContentLoaded", async () => {
    await prepararFormulario();
});