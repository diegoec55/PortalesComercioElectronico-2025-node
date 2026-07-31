console.log("index cargado correctamente");

const nav = document.getElementById("nav")
const abrir = document.getElementById("abrir")
const cerrar = document.getElementById("cerrar")

abrir.addEventListener("click", () => {
    nav.classList.add("visible");
})

cerrar.addEventListener("click", () => {
    nav.classList.remove("visible");
})


const images = [
    "assets/s01.png",
    "assets/s02.png",
    "assets/s03.png",
    "assets/s04.png",
    "assets/s05.png",
    "assets/s06.png",
    "assets/s07.png",
    "assets/s10.png",
    "assets/s11.png",
    "assets/s12.png",
    "assets/s13.png",
    "assets/s14.png",
    "assets/s29.png",
    "assets/s27.png",
];

function changeHeroImage() {
    const img = document.getElementById("hero-img");
    const img2 = document.getElementById("hero-img2");
    const random = Math.floor(Math.random() * images.length);
    const random2 = random + 1;
    img.src = images[random];
    img2.src = images[random2];
    console.log(random);
}

// inicial
changeHeroImage();

// cambia cada 5s
setInterval(changeHeroImage, 5000);
