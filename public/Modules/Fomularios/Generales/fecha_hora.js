/**
 * Módulo para cargar y mostrar fechas de creación y autorización
 * Reutilizable en todos los archivos PT (PT1, PT2, PT3, etc.)
 */

class FechaHoraManager {
  constructor() {
    this.idPermiso = null;
    this.fechas = {
      creacion: null,
      area: null,
      supervisor: null,
    };
  }

  /**
   * Obtiene el ID del permiso desde sessionStorage o URL
   */
  obtenerIdPermiso() {
    const urlParams = new URLSearchParams(window.location.search);

    // Priorizar el ID de la URL (más específico) sobre sessionStorage
    this.idPermiso =
      urlParams.get("id") ||
      sessionStorage.getItem("id_permiso") ||
      sessionStorage.getItem("id_tipo_permiso");

    if (!this.idPermiso) {
      return false;
    }

    return true;
  }

  /**
   * Consulta las fechas desde el endpoint
   */
  async consultarFechas() {
    if (!this.obtenerIdPermiso()) {
      return false;
    }

    try {
      const url = `/api/fechas-autorizacion/${this.idPermiso}`;
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();

      if (data.success) {
        this.fechas = data.fechas;
        return true;
      } else {
        return false;
      }
    } catch (error) {
      return false;
    }
  }

  /**
   * Formatea una fecha para mostrar de forma legible
   */
  formatearFecha(fechaString) {
    if (!fechaString) return "Pendiente";

    try {
      const fecha = new Date(fechaString);

      if (isNaN(fecha.getTime())) {
        return "Fecha inválida";
      }

      const opciones = {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      };

      return fecha.toLocaleString("es-MX", opciones);
    } catch (error) {
      return "Error en fecha";
    }
  }

  /**
   * Actualiza los elementos HTML con las fechas
   */
  actualizarElementosHTML() {
    // 1. Actualizar hora de creación
    const elementoCreacion = document.querySelector("#hora-creacion-header h3");
    if (elementoCreacion) {
      const fechaCreacion = this.formatearFecha(this.fechas.creacion);
      elementoCreacion.innerHTML = `
                Hora de creación
                <br>
                <small style="font-size: 0.75em; color: #666; font-weight: normal;">
                    ${fechaCreacion}
                </small>
            `;
    }

    // 2. Actualizar hora de autorización del área (responsable)
    const elementoArea = document.querySelector("#hora-responsable-header h3");
    if (elementoArea) {
      const fechaArea = this.formatearFecha(this.fechas.area);
      elementoArea.innerHTML = `
                Hora de autorización
                <br>
                <small style="font-size: 0.75em; color: #666; font-weight: normal;">
                    ${fechaArea}
                </small>
            `;
    }

    // 3. Actualizar hora de autorización del supervisor
    const elementoSupervisor = document.querySelector(
      "#hora-supervisor-header h3"
    );
    if (elementoSupervisor) {
      const fechaSupervisor = this.formatearFecha(this.fechas.supervisor);
      elementoSupervisor.innerHTML = `
                Hora de autorización
                <br>
                <small style="font-size: 0.75em; color: #666; font-weight: normal;">
                    ${fechaSupervisor}
                </small>
            `;
    }
  }

  /**
   * Muestra mensajes de error en los elementos HTML
   */
  mostrarMensajeError() {
    const selectors = [
      "#hora-creacion-header h3",
      "#hora-responsable-header h3",
      "#hora-supervisor-header h3",
    ];

    const titulos = [
      "Hora de creación",
      "Hora de autorización",
      "Hora de autorización",
    ];

    selectors.forEach((selector, index) => {
      const elemento = document.querySelector(selector);
      if (elemento) {
        elemento.innerHTML = `
                    ${titulos[index]}
                    <br>
                    <small style="font-size: 0.75em; color: #999; font-weight: normal;">
                        No disponible
                    </small>
                `;
      }
    });
  }

  /**
   * Función principal que ejecuta todo el proceso
   */
  async inicializar() {
    // Verificar si existen elementos de fecha en la página
    const tieneElementos = document.querySelector(
      "#hora-creacion-header, #hora-responsable-header, #hora-supervisor-header"
    );

    if (!tieneElementos) {
      return;
    }

    const exito = await this.consultarFechas();

    if (exito) {
      this.actualizarElementosHTML();
    } else {
      this.mostrarMensajeError();
    }
  }

  /**
   * Método estático para uso fácil
   */
  static async cargarFechas() {
    const manager = new FechaHoraManager();
    await manager.inicializar();
    return manager;
  }
}

// Hacer disponible globalmente
window.FechaHoraManager = FechaHoraManager;

// Auto-inicialización cuando el DOM esté listo
document.addEventListener("DOMContentLoaded", () => {
  FechaHoraManager.cargarFechas();
});

// También inicializar si el DOM ya está cargado
if (document.readyState === "loading") {
  // El DOM aún se está cargando, esperar al evento
} else {
  // El DOM ya está cargado
  FechaHoraManager.cargarFechas();
}
