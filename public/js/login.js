const formulario = document.getElementById("loginForm");

formulario.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.getElementById("email").value.trim();
    const clave = document.getElementById("clave").value;

    try {
        const respuesta = await fetch("/api/usuarios/access", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                email,
                clave,
            }),
        });

        const resultado = await respuesta.json();

        if (!respuesta.ok) {
            alert(resultado.msg);
            return;
        }

        // Guardamos el usuario logueado
        localStorage.setItem(
            "usuario",
            JSON.stringify(resultado.data)
        );

        alert("Login exitoso");

        window.location.href = "index.html";

    } catch (error) {
        console.error(error);
        alert("Error al conectar con el servidor.");
    }
});