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
    Toastify({
        text: "Bienvenida Finalizada",
        duration: 2000,
        className: "info",
    }).showToast();
  }
}


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
    Toastify({
        text: "Carga finalizada",
        duration: 2000,
        className: "info",
    }).showToast();
  }

}

function convertirDuracion(horasTotales) {
  const horasAnio = 365 * 24;
  const anios = parseInt(horasTotales / horasAnio);
  const horasRestantes = horasTotales % horasAnio;
  const dias = parseInt(horasRestantes / 24);
  const horas = parseInt(horasRestantes % 24);

  return anios + " años, " + dias + " días y " + horas + " horas";
}

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