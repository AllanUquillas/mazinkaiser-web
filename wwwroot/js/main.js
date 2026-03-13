/* SPA */
function showSection(id) {
  document.querySelectorAll(".section").forEach(sec => {
    sec.style.display = "none";
  });
  document.getElementById(id).style.display = "block";
}

/*Mostrar los episodios*/
function toggleEpisodeList() {
  const lista = document.getElementById("lista-episodios");

  if (lista.style.display === "none") {
    lista.style.display = "block";
    lista.scrollIntoView({ behavior: "smooth" });
  } else {
    lista.style.display = "none";
  }
}

/* Reproducir episodio */
function playEpisode(src, title, epId) {
  const video = document.getElementById("videoPlayer");
  document.getElementById("episode-title").textContent = title;
  video.src = src;
  video.play();

  localStorage.setItem(epId, "visto");
  actualizarEstado(epId);
  localStorage.setItem("lastEpisode", src);
}

/* Estado visto */
function actualizarEstado(epId) {
  const badge = document.getElementById("status-" + epId);
  badge.textContent = "Visto";
  badge.classList.add("visto");
}

/* Buscar episodios */
function filterEpisodes() {
  const value = document.getElementById("searchEp").value.toLowerCase();
  document.querySelectorAll(".episode-list button").forEach(btn => {
    btn.style.display = btn.textContent.toLowerCase().includes(value)
      ? "block"
      : "none";
  });
}

/* Cargar progreso */
window.onload = () => {
  document.querySelectorAll(".status-badge").forEach(badge => {
    const epId = badge.id.replace("status-", "");
    if (localStorage.getItem(epId) === "visto") {
      actualizarEstado(epId);
    }
  });

  const last = localStorage.getItem("lastEpisode");
  if (last) {
    document.getElementById("videoPlayer").src = last;
  }
};

/* Efecto slider de la portada de Mazinkaiser*/
const slides = document.querySelectorAll(".slide");
let index = 0;

setInterval(() => {
  slides[index].classList.remove("active");
  index = (index + 1) % slides.length;
  slides[index].classList.add("active");
}, 6000);

/*sipnosis efecto scroll*/
 const reveals = document.querySelectorAll(".reveal");

  function revealOnScroll() {
    const windowHeight = window.innerHeight;
    reveals.forEach(el => {
      const elementTop = el.getBoundingClientRect().top;
      if (elementTop < windowHeight - 100) {
        el.classList.add("active");
      }
    });
  }

  window.addEventListener("scroll", revealOnScroll);
  revealOnScroll();
/* =====================================================
   ABRIR PELÍCULA EN MODO CINE
   - Muestra el overlay
   - Reproduce la película
===================================================== */
function openMovieCinema() {

  // Contenedor del modo cine
  const cinema = document.getElementById("movieCinema");

  // Video de la película
  const video = document.getElementById("movieVideo");

  // Mostrar el modo cine
  cinema.style.display = "flex";

  // Reiniciar el video desde el inicio
  video.currentTime = 0;

  // Intentar reproducir
  video.play().catch(() => {
    console.log("El navegador bloqueó el autoplay");
  });
}

/* =====================================================
   CERRAR MODO CINE
   - Pausa el video
   - Oculta el overlay
===================================================== */
function closeMovieCinema() {

  const cinema = document.getElementById("movieCinema");
  const video = document.getElementById("movieVideo");

  // Pausar el video
  video.pause();

  // Ocultar el modo cine
  cinema.style.display = "none";
}
/*efectos de los audios del reproductor*/
/* VIBRACIÓN SEGÚN AUDIO */
let audioCtx, analyser, source, dataArray;
const video = document.getElementById("animeVideo");
const bars = document.querySelectorAll(".speaker span");

function startAnime() {
  video.play();

  audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  analyser = audioCtx.createAnalyser();
  analyser.fftSize = 256;

  source = audioCtx.createMediaElementSource(video);
  source.connect(analyser);
  analyser.connect(audioCtx.destination);

  dataArray = new Uint8Array(analyser.frequencyBinCount);
  animateSpeakers();
}

function animateSpeakers() {
  analyser.getByteFrequencyData(dataArray);

  bars.forEach((bar, i) => {
    let value = dataArray[i * 3] / 255;
    bar.style.transform = `scaleY(${1 + value * 2})`;
  });

  requestAnimationFrame(animateSpeakers);
}
/*Sugerencia para la pagina web de Mazinkaiser*/
function sendFeedback() {
  alert("¡Gracias por la sugerencia!");
}

/* =====================================================
   EFECTO SCROLL A LA SECCIÓN DE LA PELÍCULA
   - Ajusta el margen superior al hacer scroll
===================================================== */
function goToMovie() {
  showSection("mazinkaiser-pelicula");
  setTimeout(() => {
    document.getElementById("mazinkaiser-pelicula").scrollIntoView({
      behavior: "smooth"
    });
  }, 100);
}

// ================================
// COMENTARIOS MAZINKAISER
// ================================

// ================================
// USUARIO DEL SISTEMA
// ================================
let usuarioActual = JSON.parse(localStorage.getItem("usuario"));


// ================================
// LOGIN
// ================================
function login(){

let email = document.getElementById("loginEmail").value;
let password = document.getElementById("loginPassword").value;

fetch("/api/auth/login",{
method:"POST",
headers:{ 
"Content-Type":"application/json"
},
body: JSON.stringify({
email:email,
password:password
})
})
.then(res => res.json())
.then(data => {

usuarioActual = data;

localStorage.setItem("usuario",JSON.stringify(data));

document.getElementById("loginModal").style.display="none";

alert("Bienvenido piloto "+data.nombre);

});

}


// ================================
// REGISTRO
// ================================
function registro(){

const email=document.getElementById("loginEmail").value;
const password=document.getElementById("loginPassword").value;

fetch("/api/auth/registro",{
method:"POST",
headers:{
"Content-Type":"application/json"
},
body:JSON.stringify({
nombre:email,
email:email,
password:password
})
})
.then(res=>res.json())
.then(()=>alert("Usuario registrado"));

}
// ================================
// ENVIAR COMENTARIO
// ================================
function enviarComentario(){

if(usuarioActual == null){

document.getElementById("loginModal").style.display="flex";

return;

}

let mensaje = document.getElementById("mensaje").value;

if(mensaje.trim() === ""){
alert("Escribe un comentario");
return;
}

fetch("/api/comentarios",{
method:"POST",
headers:{
"Content-Type":"application/json"
},
body: JSON.stringify({
usuario:usuarioActual.nombre,
mensaje:mensaje
})
})
.then(res => res.json())
.then(data => {

document.getElementById("mensaje").value="";

mostrarComentarios(data);

});

}

// ================================
// MOSTRAR COMENTARIOS
// ================================
function mostrarComentarios(comentarios){

let contenedor = document.getElementById("listaComentarios");

contenedor.innerHTML="";

comentarios.forEach((c,index)=>{

contenedor.innerHTML += `

<div class="comentario">

<h3>CODIGO: ${c.usuario ?? c.codigoPiloto ?? "Piloto"}</h3>

<p class="fecha">
${c.fecha ? new Date(c.fecha).toLocaleString() : "Ahora"}
</p>

<p class="mensaje-texto">
${c.mensaje}
</p>

<div class="acciones">
<span onclick="darLike(${index})">
👍 ${c.likes ?? 0}
</span>
</div>

</div>

`;

});

}


// ================================
// CARGAR COMENTARIOS
// ================================
function cargarComentarios(){

fetch("/api/comentarios")
.then(res=>res.json())
.then(data=>{
mostrarComentarios(data)
})

}


// ================================
// REACCIONES
// ================================
function darLike(index){

fetch("/api/like/"+index,{
method:"POST"
})
.then(res=>res.json())
.then(data=>{
mostrarComentarios(data)
})

}


// ================================
// INICIO DE PAGINA
// ================================
window.onload = function(){

cargarComentarios();

let usuarioGuardado = localStorage.getItem("usuario");

if(usuarioGuardado){

usuarioActual = JSON.parse(usuarioGuardado);

}

}