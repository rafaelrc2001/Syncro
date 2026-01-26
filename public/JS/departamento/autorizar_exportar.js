// autorizar_exportar.js
// Exportador específico para la página Autorizar PT (usuarios).
// Llama a /api/exportar-autorizar/:id_departamento y genera un .xlsx

// IIFE to scope helper functions
(function () {
  function formatStamp() {
    const now = new Date();
    return now.toISOString().slice(0, 19).replace(/[:T]/g, "-");
  }

  function downloadBlob(blob, filename) {
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }

  function toCsvAndDownload(rows, columns, filename) {
    if (!rows || !rows.length) {
      alert("No hay registros para exportar.");
      return;
    }
    const keys = columns;
    const lines = [keys.join(",")];
    rows.forEach((r) => {
      const vals = keys.map((k) => {
        const v = r[k] == null ? "" : String(r[k]);
        return '"' + v.replace(/"/g, '""') + '"';
      });
      lines.push(vals.join(","));
    });
    const csv = lines.join("\r\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    downloadBlob(blob, filename.replace(/\.xlsx$|\.csv$/i, "") + ".csv");
  }

  async function exportAutorizar() {
    try {
      const usuario = JSON.parse(localStorage.getItem("usuario")) || {};
      // Usar id_usuario si existe, luego id_departamento, luego id
      const id_para_exportar = usuario.id_usuario || usuario.id_departamento || usuario.id;
      if (!id_para_exportar) throw new Error("No se encontró id_usuario, id_departamento ni id en el usuario");

      const status =
        (document.getElementById("status-filter") || {}).value || "all";
      const searchInput = document.querySelector(".search-bar input");
      const q = (
        searchInput ? searchInput.value.trim() : window.filtroBusqueda || ""
      ).trim();

      const params = new URLSearchParams();
      if (q) params.append("q", q);
      if (status) params.append("status", status);
      // Ask server to include permisos even if they don't yet have a pt_* row
      // (useful for newly created permisos that haven't populated type-specific tables)
      params.append("include_all", "1");

      // Collect client-side filtered ids (if available) and send as ids param
      let clientIds = [];
      if (typeof window.getPermisosFiltrados === "function") {
        try {
          const clientFiltered = window.getPermisosFiltrados() || [];
          clientIds = clientFiltered
            .map((r) => r.id_permiso ?? r.id ?? r.idPermiso)
            .filter((v) => v != null);
          if (clientIds.length > 0) params.append("ids", clientIds.join(","));
        } catch (err) {
          console.warn(
            "exportAutorizar: error getting client filtered ids",
            err
          );
        }
      }

      // Centraliza el origin según entorno
      const isRailway = window.location.origin.includes("railway") || window.location.hostname.endsWith("up.railway.app");
      const origin =
        window.location.hostname === "localhost"
          ? "http://localhost:3000"
          : "https://syncro-production-30a.up.railway.app";
      const url = `${origin}/api/exportar-autorizar/${encodeURIComponent(
        id_para_exportar
      )}?${params.toString()}`;
      console.debug("exportAutorizar: requesting", url);

      let data = [];
      try {
        const resp = await fetch(url);
        if (!resp.ok) throw new Error("Error en exportar-autorizar server");
        data = await resp.json();
        // If we sent clientIds, ensure we only keep those ids from server response
        if (clientIds && clientIds.length > 0 && Array.isArray(data)) {
          const idsSet = new Set(clientIds.map(String));
          data = data.filter((r) => {
            const id = r.id_permiso ?? r.id ?? r.idPermiso;
            return id != null && idsSet.has(String(id));
          });
        }
      } catch (err) {
        console.warn(
          "Fallo la exportación server-side, usando datos client-side:",
          err
        );
        if (typeof window.getPermisosFiltrados === "function") {
          data = window.getPermisosFiltrados() || [];
        } else {
          data = [];
        }
      }

      // Exportar todas las columnas devueltas por el endpoint, dividiendo fecha_hora en dos columnas
      if (!Array.isArray(data) || !data.length) {
        alert("No hay datos para exportar");
        return;
      }
      // Procesar los datos para dividir fecha_hora en fecha y hora
      const processed = data.map((row) => {
        if (row.fecha_hora) {
          let fecha = "";
          let hora = "";
          try {
            const d = new Date(row.fecha_hora);
            if (!isNaN(d.getTime())) {
              // Formato YYYY-MM-DD y HH:mm
              fecha = d.toISOString().slice(0, 10);
              hora = d.toTimeString().slice(0, 5);
            }
          } catch {}
          // Copiar el resto de los campos, pero quitar fecha_hora
          const { fecha_hora, ...rest } = row;
          return { ...rest, fecha, hora };
        }
        return row;
      });
      // Determinar columnas (sin fecha_hora, con fecha y hora al final)
      let columns = Object.keys(processed[0] || {});
      // Si existe fecha y hora, asegurarse que estén al final
      if (columns.includes("fecha") && columns.includes("hora")) {
        columns = columns.filter((c) => c !== "fecha" && c !== "hora");
        columns.push("fecha", "hora");
      }
      const rowsForExport = processed;
      const stamp = formatStamp();
      if (window.XLSX && typeof window.XLSX.utils !== "undefined") {
        try {
          const worksheet = window.XLSX.utils.json_to_sheet(rowsForExport, {
            header: columns,
          });
          const workbook = window.XLSX.utils.book_new();
          window.XLSX.utils.book_append_sheet(workbook, worksheet, "AutorizarPT");
          window.XLSX.writeFile(workbook, `autorizar-permisos-${stamp}.xlsx`);
          console.log(`Exportación exitosa: autorizar-permisos-${stamp}.xlsx`);
          return;
        } catch (err) {
          console.error("Error al generar Excel:", err);
        }
      }
      // Fallback to CSV
      toCsvAndDownload(
        rowsForExport,
        columns,
        `autorizar-permisos-${stamp}.xlsx`
      );
    } catch (err) {
      console.error("Error en exportAutorizar:", err);
      alert("No se pudo exportar. Revisa la consola para más detalles.");
    }
  }

  function attachExportButtons() {
    const attach = (el) => {
      if (!el) return;
      el.addEventListener("click", (e) => {
        e.preventDefault();
        exportAutorizar();
      });
    };

    attach(document.getElementById("export-excel"));
    attach(document.getElementById("export-excel-btn"));
    document.querySelectorAll(".export-excel").forEach(attach);
    document.querySelectorAll('[data-export="permisos"]').forEach(attach);
    const generic = document.querySelector(".actions-section .btn.secondary");
    attach(generic);
  }

  document.addEventListener("DOMContentLoaded", () => {
    attachExportButtons();
  });
})();
