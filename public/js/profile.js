let usuarios = [];

const formU = document.getElementById("formUsuario");
const listaU = document.getElementById("listaUsuarios");

formU.addEventListener("submit", (e) => {
    e.preventDefault();
    const usuario = document.getElementById("usuario").value;
    const correo = document.getElementById("correo").value;
    usuarios.push({ usuario, correo });
    formU.reset();
    render();
});

function eliminarUsuario(i) {
    usuarios.splice(i, 1);
    render();
}

function render() {
    listaU.innerHTML = "";
    usuarios.forEach((u, i) => {
        listaU.innerHTML += `<li>${u.usuario} - ${u.correo}
        <button onclick="eliminarUsuario(${i})">Eliminar</button></li>`;
    });
}
