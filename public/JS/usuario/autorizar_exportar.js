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
      const id_departamento = usuario.id;
      if (!id_departamento) throw new Error("No se encontró id_departamento");

      const status =
        (document.getElementById("status-filter") || {}).value || "all";
      const searchInput = document.querySelector(".search-bar input");
      const q = (
        searchInput ? searchInput.value.trim() : window.filtroBusqueda || ""
      ).trim();

      const params = new URLSearchParams();
      if (q) params.append("q", q);
      if (status) params.append("status", status);

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

      const origin = "http://localhost:3000";
      const url = `${origin}/api/exportar-autorizar/${encodeURIComponent(
        id_departamento
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

      const columns = [
        "id_permiso",
        "prefijo",
        "tipo_permiso",
        "fecha",
        "hora_inicio",
        "tipo_actividad",
        "planta_lugar_trabajo",
        "descripcion_trabajo",
        "empresa",
        "nombre_solicitante",
        "sucursal",
        "contrato",
        "ot_numero",
        "equipo_intervenir",
        "tag",
        "responsable_area",
        "responsable_seguridad",
        "operador_responsable",
        "area",
        "estatus",
        "fecha_hora",
      ];

      const stamp = formatStamp();

      // Map incoming rows to the expected column keys
      const rowsForExport = (Array.isArray(data) ? data : []).map((r) => ({
        id_permiso: r.id_permiso ?? r.id ?? r.idPermiso ?? null,
        prefijo: r.prefijo ?? r.prefijo_permiso ?? null,
        tipo_permiso: r.tipo_permiso ?? r.tipo_perm ?? r.tipo ?? null,
        fecha:
          r.fecha ?? (r.fecha_hora ? String(r.fecha_hora).slice(0, 10) : null),
        hora_inicio: r.hora_inicio ?? r.hora ?? null,
        tipo_actividad: r.tipo_actividad ?? r.tipo_mantenimiento ?? null,
        planta_lugar_trabajo:
          r.planta_lugar_trabajo ?? r.planta ?? r.nombre_planta ?? null,
        descripcion_trabajo: r.descripcion_trabajo ?? r.descripcion ?? null,
        empresa: r.empresa ?? null,
        nombre_solicitante: r.nombre_solicitante ?? r.solicitante ?? null,
        sucursal: r.sucursal ?? null,
        contrato:
          r.contrato != null
            ? String(r.contrato)
            : r.contrato_df
            ? String(r.contrato_df)
            : "",
        ot_numero: r.ot_numero ?? r.ot_no ?? null,
        equipo_intervenir: r.equipo_intervenir ?? r.equipo_intervencion ?? null,
        tag: r.tag ?? null,
        responsable_area: r.responsable_area ?? r.responsable ?? null,
        responsable_seguridad: r.responsable_seguridad ?? null,
        operador_responsable: r.operador_responsable ?? r.operador_area ?? null,
        area: r.area ?? null,
        estatus: r.estatus ?? null,
        fecha_hora: r.fecha_hora ?? null,
      }));

      if (
        Array.isArray(rowsForExport) &&
        rowsForExport.length > 0 &&
        window.XLSX &&
        typeof window.XLSX.utils !== "undefined"
      ) {
        // Ensure each object has all keys in columns (so XLSX header order is consistent)
        const normalized = rowsForExport.map((r) => {
          const obj = {};
          columns.forEach((k) => {
            obj[k] = k in r ? r[k] : null;
          });
          return obj;
        });

        const worksheet = window.XLSX.utils.json_to_sheet(normalized, {
          header: columns,
        });
        const workbook = window.XLSX.utils.book_new();
        window.XLSX.utils.book_append_sheet(workbook, worksheet, "AutorizarPT");

        // Use same write flow as export_excel.js for compatibility
        const wbout = window.XLSX.write(workbook, {
          bookType: "xlsx",
          type: "array",
        });
        const blob = new Blob([wbout], { type: "application/octet-stream" });
        downloadBlob(blob, `autorizar-permisos-${stamp}.xlsx`);
        return;
      }

      // Fallback to CSV when XLSX isn't available or data empty
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
