const formulario = document.getElementById("registroForm");

formulario.addEventListener("submit", async (e) => {

    e.preventDefault();

    const nombre = document.getElementById("nombre").value.trim();
    const email = document.getElementById("email").value.trim();
    const clave = document.getElementById("clave").value;

    try {
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

        if (!respuesta.ok) {
            alert(resultado.msg);
            return;
        }

        alert("Usuario registrado correctamente.");
        window.location.href = "login.html";

    } catch (error) {
        console.error(error);
        alert("No fue posible registrar el usuario.");
    }
});