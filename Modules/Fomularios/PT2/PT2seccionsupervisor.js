document.addEventListener("DOMContentLoaded", function () {
  const btnSalir = document.getElementById("btn-salir-nuevo");
  if (btnSalir) {
    btnSalir.addEventListener("click", function () {
      window.location.href = "../../supseguridad/supseguridad.html";
    });
  }
});
