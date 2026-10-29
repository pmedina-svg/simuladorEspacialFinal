const url = "./db/data.json";

const registroSesion = document.querySelector("#intro");
const astronauta = document.querySelector("#intro input");
const inicioSession = document.querySelector("#intro form");
const nombreSesion = document.querySelector(".datos-perfil span");
const modalBienvenida = document.querySelector(".modalBienvenida");
const contenidoSimulador = document.querySelector("#contenidoSimulador");
const iniciarSimulador = document.querySelector("#iniciarSimulador");

inicioSession.addEventListener("submit", function (event) {
  event.preventDefault();
  const nombreAstronauta = astronauta.value;
  localStorage.setItem("Astronauta", nombreAstronauta);
  const nombreRegistrado = localStorage.getItem("Astronauta");
  nombreSesion.innerHTML = nombreRegistrado;
  nombreUsuario.innerHTML = nombreRegistrado;
  registroSesion.style.display = "none";

  mostrarBienvenida();
});

const nombreGuardado = localStorage.getItem("Astronauta");
const nombreUsuario = document.querySelector("#nombreUsuario");

if (nombreGuardado) {
  nombreSesion.innerHTML = nombreGuardado;
  nombreUsuario.innerHTML = nombreGuardado;
  registroSesion.style.display = "none";
  mostrarBienvenida();
}

function mostrarBienvenida() {

  try {
    const bienvenidaVista = localStorage.getItem("bienvenidaVista");

    if (!bienvenidaVista) {
      document.body.classList.add("mostrandoCarga");

      setTimeout(function () {
        modalBienvenida.style.display = "flex";
      }, 3000);
    } else {
      contenidoSimulador.style.display = "block";
      getViajesEspaciales();
    }
  } catch (e) {
    console.error("Error capturado por catch:", e);
    document.body.classList.remove("mostrandoCarga");
  } finally {
    console.log("Bienvenida Finalizada");
  }
}

iniciarSimulador.addEventListener("click", function () {
  modalBienvenida.style.display = "none";
  contenidoSimulador.style.display = "block";
  localStorage.setItem("bienvenidaVista", "bienvenidaCheck");
  localStorage.getItem("bienvenidaVista");

  getViajesEspaciales();
});

const verSesion = document.querySelector("#perfil");

verSesion.addEventListener("click", function () {
  const totalKm = misionesLanzadas.reduce(
    (total, mision) => total + mision.distancia,
    0,
  );
  const totalTiempo = misionesLanzadas.reduce(
    (total, mision) => total + mision.distancia / mision.velocidad,
    0,
  );
  const modalSesion = document.querySelector(".modalSesion");
  modalSesion.innerHTML = `<div class="modal">
                            <button>X</button>
                            <img src="./assets/avatar.webp" alt="imagen astronauta">
                            <div class="datos-perfil">
                            <h2>Astronauta: <span>${localStorage.getItem("Astronauta")}</span></h2>
                            <ul>
                                <li>Total Misiones: ${misionesLanzadas.length > 0 ? misionesLanzadas.length : 0}</li>
                                <li>Kilometros recorridos: ${totalKm > 0 ? totalKm : 0} km</li>
                                <li>Tiempo de viaje: ${totalTiempo > 0 ? convertirDuracion(totalTiempo) : 0}</li>
                            </ul>
                            <a><p>cerrar sesion</p></a>
                            </div>
                            </div>`;
  modalSesion.style.display = "flex";

  const cerrarModal = modalSesion.querySelector("button");
  cerrarModal.addEventListener("click", function () {
    modalSesion.style.display = "none";
  });

  const cerrarSesion = modalSesion.querySelector("a");
  const modalConfirmacion = document.querySelector(".modalConfirmacion");
  modalConfirmacion.innerHTML = `<div class="modal">
    <h3>¿Estás seguro de que quieres cerrar sesión?</h3>
    <p>Al cerrar sesión se borrará el historial de misiones guardadas en este navegador. Si vuelves a ingresar con el mismo nombre, el historial no se recuperará.</p>
    <div class="modal-opciones">
    <button class="confirmarCierre">Sí</button>
    <button class="cancelarCierre">Cancelar</button>
    </div>
    <p class="cierreAutomatico">Cancelación automatica en: <span>10</span>s</p>
    </div>`;

  const cancelarCierre = modalConfirmacion.querySelector(
    "button.cancelarCierre",
  );
  const confirmarCierre = modalConfirmacion.querySelector(".confirmarCierre");

  /* Contador de cuenta regresiva usando tiempos setInterval y setTimeout */

  cerrarSesion.addEventListener("click", function () {
    modalConfirmacion.style.display = "flex";

    const confirmacionCierre = new Promise((resolve, reject) => {
      let tiempoCierre = 10;
      const contador = modalConfirmacion.querySelector(
        ".cierreAutomatico span",
      );

      contador.textContent = tiempoCierre;

      const intervaloSegundos = setInterval(() => {
        tiempoCierre--;
        contador.textContent = tiempoCierre;
      }, 1000);

      const intervaloConfirmacion = setTimeout(() => {
        clearInterval(intervaloSegundos);
        modalConfirmacion.style.display = "none";
        resolve(false);
      }, 10000);

      function finalizarCierre(estadoConfirmacion) {
        clearTimeout(intervaloConfirmacion);
        clearInterval(intervaloSegundos);
        resolve(estadoConfirmacion);
      }

      cancelarCierre.addEventListener("click", function () {
        modalConfirmacion.style.display = "none";
        finalizarCierre(false);
      });

      confirmarCierre.addEventListener("click", function () {
        finalizarCierre(true);
      });
    });

    confirmacionCierre.then((data) => {
      if (data) {
        localStorage.clear();
        location.reload();
      }
    });
  });
});

/* Llamado a la DB */


let viajesEspaciales = [];

async function getViajesEspaciales() {

    Toastify({
        text: "Cargando destinos",
        duration: 2000,
        className: "info",
    }).showToast();

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error("Error en la carga de los destinos");
    }
    const data = await response.json();
    viajesEspaciales = data;

    mostrarDestinos(
      viajesEspaciales.filter((viaje) => viaje.categoria === "Planeta"),
    );
    
    Swal.fire({
        icon: "success",
        title: "¡Destinos listos!",
        text: "Los destinos espaciales se cargaron correctamente.",
        confirmButtonText: "Continuar",
        heightAuto: false,

    });

  } catch (e) {
    console.error("Hubo un error", e);
    
    Swal.fire({
        icon: "error",
        title: "Error de carga",
        text: "No se pudieron cargar los destinos",
        heightAuto: false,
    });

  }

  finally{
    console.log("Carga finalizada");
  }

}

// const misionesLanzadas = [];
let misionesLanzadas = JSON.parse(localStorage.getItem("misiones")) || [];

// // funcion para convertir el calculo de horas a años - dias - horas
function convertirDuracion(horasTotales) {
  const horasAnio = 365 * 24;
  const anios = parseInt(horasTotales / horasAnio);
  const horasRestantes = horasTotales % horasAnio;
  const dias = parseInt(horasRestantes / 24);
  const horas = parseInt(horasRestantes % 24);

  return anios + " años, " + dias + " días y " + horas + " horas";
}

const contenedorCategorias = document.querySelector("#listaCategorias");
const contenedorDestinos = document.querySelector("#listaDestinos");
const configuracion = document.querySelector(".configuracionDestino");
const controles = document.querySelector(".controlVelocidad");
const contadorMisiones = document.querySelector("tbody");
const modalMision = document.querySelector(".modalMision");

// en function mostrarMision presenté muchas dificultades: 1. al eliminar o me eliminaba el último desde cualquier button, o dejaban de funcionar los botones en todos los TR menos en el último. solución: crear id, pero, eso no fue suficiente, ya que para que al eliminar no borrara el ultimo tuve que no incluir en tr.mision-id dentro del innerHTML sino que por separado. 2. repetición de IDS: una vez logrado el eliminar por id ocurrio lo siguiente, teniendo id=1, 2, 3, 4, eliminaba ids 2 y 4, refrescaba, volvia a lanzar misiones y se me repetian id 3 (que ya existia porque no habia eliminado anteriormente). Solución: tras varios intentos investigué y encontré Date.now() que genera id unicos con fecha y hora (milisegundos).

function mostrarMision({ id, destino, velocidad, distancia, duracion }) {
  const historialMisiones = document.createElement("tr");
  historialMisiones.className = `mision-${id}`;
  historialMisiones.innerHTML = `<td>${destino}</td>
                                   <td>${velocidad}</td>
                                   <td>${distancia}</td>
                                   <td>${duracion}</td>
                                   <td><button class="btn-eliminar"><img src="./assets/trash-can.png"></button></td>`;

  contadorMisiones.appendChild(historialMisiones);

  const botonEliminar = historialMisiones.querySelector(".btn-eliminar");

  botonEliminar.addEventListener("click", function () {
    misionesLanzadas = misionesLanzadas.filter((mision) => mision.id !== id);
    localStorage.setItem("misiones", JSON.stringify(misionesLanzadas));

    historialMisiones.remove();
    Toastify({
        text: "Misión eliminada ❌",
        duration: 2000,
        className: "info",
    }).showToast();

  });
}

misionesLanzadas.forEach((nuevaMision) => {
  mostrarMision(nuevaMision);
});

contenedorCategorias.innerHTML = `<button class="activo">Planeta</button>
                                <button>Planeta Enano</button>
                                <button>Satelite</button>
                                <button>Estrella</button>`;

const botonesCategorias = contenedorCategorias.querySelectorAll("button");

botonesCategorias.forEach((boton) => {
  boton.addEventListener("click", function () {
    botonesCategorias.forEach((boton) => boton.classList.remove("activo"));
    boton.classList.add("activo");

    const categoriaSeleccionada = boton.textContent.toLowerCase();
    const destinosFiltrados = viajesEspaciales.filter(
      (viaje) => viaje.categoria.toLowerCase() === categoriaSeleccionada,
    );

    mostrarDestinos(destinosFiltrados);
  });
});

function mostrarDestinos(destinos) {
  contenedorDestinos.innerHTML = "";

  destinos.forEach((viaje) => {
    let contenedor = document.createElement("div");
    contenedor.className = "card";
    contenedor.innerHTML += `<img src="${viaje.url}" alt="${viaje.destino}">
        <h3>${viaje.destino}</h3>
        <p>${viaje.categoria}</p>
        <p><span>${viaje.distancia} km</span></p>
        <button>Seleccionar</button>
        `;

    let boton = contenedor.querySelector("button");

    boton.addEventListener("click", function () {
      const duracionConvertido = convertirDuracion(
        viaje.distancia / viaje.velocidad,
      );

      configuracion.innerHTML = `<h4>Destino Seleccionado: ${viaje.destino}</h4>
            <div class="info-destino">
                <div class="col-destino">
                <img src="${viaje.url}" alt="${viaje.destino}">
                </div>
                <div class="col-destino">
                    <h3>${viaje.destino}</h3>
                    <p>${viaje.categoria}</p>
                    <p>Distancia desde la tierra: ${viaje.distancia} km</p>
                    <p>Velocidad actual: <span class="velocidad">${viaje.velocidad}</span> km/h</p>
                    <p>Duración del viaje: <span class="duracion">${duracionConvertido}</span></p>
                </div>
            </div>`;

      controles.innerHTML = `<p>Velocidad de la nave (km/h)</p>
                                    <input type="number" value="${viaje.velocidad}">
                                    <span class="error"></span>
                                    <div class="opcionesBotones">
                                    <button>🚀 Lanzar misión</button>
                                    </div>`;

      const inputVelocidad = controles.querySelector("input");
      const botonLanzar = controles.querySelector("button");
      const cuentaRegresivaModal = document.querySelector(
        ".modalCuentaRegresiva",
      );

      function validarVelocidad() {
        const nuevaVelocidad = parseInt(inputVelocidad.value);
        const mensajeError = controles.querySelector(".error");

        if (
          inputVelocidad.value === "" ||
          isNaN(nuevaVelocidad) ||
          nuevaVelocidad <= 0
        ) {
          mensajeError.textContent = "ingresa una velocidad mayor a 0";
          return false;
        }

        mensajeError.textContent = "";
        viaje.velocidad = nuevaVelocidad;
        return true;
      }

      cuentaRegresivaModal.innerHTML = `<div class="modal">
                                           <p>Preparando lanzamiento...</p>
                                           <img src="./assets/preparados.gif" alt="Preparando Lanzamiento" >
                                           <p class="conteoAutomatico">Lanzamiento en: <span>5</span>s</p>
                                           <div class="modal-opciones">
                                           <button class="cancelarCierre">Cancelar lanzamiento</button>
                                           </div>
                                           </div>`;

      botonLanzar.addEventListener("click", async function () {
        if (!validarVelocidad()) {
          return;
        }

        cuentaRegresivaModal.style.display = "flex";

        const lanzamientoConfirmado = await new Promise((resolve) => {
          let contadorSegundos = 5;

          const contador = cuentaRegresivaModal.querySelector(
            ".conteoAutomatico span",
          );
          const cancelarLanzamiento =
            cuentaRegresivaModal.querySelector(".cancelarCierre");

          contador.textContent = contadorSegundos;

          const intervaloSegundos = setInterval(() => {
            contadorSegundos--;
            contador.textContent = contadorSegundos;
          }, 1000);

          const tiempoLanzamiento = setTimeout(() => {
            clearInterval(intervaloSegundos);
            cuentaRegresivaModal.style.display = "none";
            resolve(true);
          }, 5000);

          cancelarLanzamiento.addEventListener("click", () => {
            clearTimeout(tiempoLanzamiento);
            clearInterval(intervaloSegundos);
            cuentaRegresivaModal.style.display = "none";
            resolve(false);
          });
        });

        if (!lanzamientoConfirmado) return;

        const nuevaMision = {
          id: Date.now(),
          destino: viaje.destino,
          velocidad: viaje.velocidad,
          distancia: viaje.distancia,
          duracion: convertirDuracion(viaje.distancia / viaje.velocidad),
        };

        misionesLanzadas.push(nuevaMision);
        localStorage.setItem("misiones", JSON.stringify(misionesLanzadas));

        mostrarMision(nuevaMision);

        modalMision.innerHTML = `<div class="modal">
                            <img src="./assets/lanzamiento.gif" alt="lanzamiento ${nuevaMision.destino}" >
                            <h3>misión lanzada con éxito</h3>
                            <ul>
                                <li>Destino: ${nuevaMision.destino}</li>
                                <li>Velocidad: ${nuevaMision.velocidad} </li>
                                <li>Tiempo de viaje: ${nuevaMision.duracion}</li>
                            </ul>
                            <p><strong>Torre de control dice:</strong> "${viaje.mensaje}"</p>
                            <button>Volver al centro de control</button>
                        </div>`;
        modalMision.style.display = "flex";

        const btnVolver = modalMision.querySelector("button");

        btnVolver.addEventListener("click", function () {
          modalMision.style.display = "none";
        });
      });

      inputVelocidad.addEventListener("keyup", function () {
        if (!validarVelocidad()) {
          return;
        }

        const duracion = configuracion.querySelector(".duracion");
        const velocidad = configuracion.querySelector(".velocidad");

        duracion.textContent = convertirDuracion(
          viaje.distancia / viaje.velocidad,
        );
        velocidad.textContent = viaje.velocidad;
      });
    });

    contenedorDestinos.appendChild(contenedor);
  });
}
