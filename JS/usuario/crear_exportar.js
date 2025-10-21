// crear_exportar.js
// Exportador para la página Crear PT. Llama a /api/exportar-crear/:id_departamento
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

  async function exportCrear() {
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
          console.warn("exportCrear: error getting client filtered ids", err);
        }
      }

      // include_all optional: set to 1 if you want ALL permisos (even sin pt_* rows)
      // Example: params.append('include_all', '1');

      // Prefer an explicit API origin when available (set window.API_ORIGIN in your page)
      // Otherwise default to the backend at http://localhost:3000 which runs the /api routes
      const apiOrigin = window.API_ORIGIN || "http://localhost:3000";
      const url = `${apiOrigin}/api/exportar-crear/${encodeURIComponent(
        id_departamento
      )}?${params.toString()}`;
      console.debug("exportCrear: requesting", url, "(apiOrigin used)");

      let data = [];
      try {
        const resp = await fetch(url);
        if (!resp.ok) throw new Error("Error en exportar-crear server");
        data = await resp.json();
        // Debug: show raw server data (sample)
        try {
          const rawSample = Array.isArray(data) ? data.slice(0, 10) : data;
          console.debug(
            "exportCrear: server response rows=",
            Array.isArray(data) ? data.length : 1
          );
          console.debug("exportCrear: raw server data sample=", rawSample);
        } catch (e) {
          console.debug("exportCrear: unable to print raw server data", e);
        }
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

      // Normalize and filter server data before export
      const rawRows = Array.isArray(data) ? data : [];
      const rowsForExport = rawRows.map((r) => {
        const id = r.id_permiso ?? r.id ?? r.idPermiso ?? null;
        // Parse ISO fecha or fallback to fecha_hora
        let fechaVal = null;
        if (r.fecha) {
          // Accept YYYY-MM-DD or full ISO
          try {
            const d = new Date(r.fecha);
            if (!isNaN(d)) fechaVal = d.toISOString().slice(0, 10);
          } catch (e) {
            fechaVal = String(r.fecha).slice(0, 10);
          }
        } else if (r.fecha_hora) {
          try {
            const d2 = new Date(r.fecha_hora);
            if (!isNaN(d2)) fechaVal = d2.toISOString().slice(0, 10);
          } catch (e) {
            fechaVal = String(r.fecha_hora).slice(0, 10);
          }
        }

        // Normalize hora_inicio to HH:MM (if provided as text or time)
        let hora = r.hora_inicio ?? r.hora ?? null;
        if (hora) {
          // If it's ISO-like, extract time
          if (typeof hora === "string" && hora.includes("T")) {
            try {
              hora = new Date(hora).toISOString().slice(11, 16);
            } catch (e) {
              hora = hora.slice(0, 5);
            }
          } else if (typeof hora === "string") {
            hora = hora.trim().slice(0, 5);
          }
        }

        return {
          id_permiso: id,
          prefijo: r.prefijo ?? r.prefijo_permiso ?? null,
          tipo_permiso: r.tipo_permiso ?? r.tipo_perm ?? r.tipo ?? null,
          fecha: fechaVal,
          hora_inicio: hora ?? null,
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
          equipo_intervenir:
            r.equipo_intervenir ?? r.equipo_intervencion ?? null,
          tag: r.tag ?? null,
          responsable_area: r.responsable_area ?? r.responsable ?? null,
          responsable_seguridad: r.responsable_seguridad ?? null,
          operador_responsable:
            r.operador_responsable ?? r.operador_area ?? null,
          area: r.area ?? null,
          estatus: r.estatus ?? null,
          fecha_hora: r.fecha_hora ?? null,
          _raw: r,
        };
      });
      // Keep all normalized rows, even if some fields are empty
      // Debug: inspect mapped rows and missing columns before export
      try {
        console.debug(
          "exportCrear: mapped rowsForExport sample=",
          rowsForExport.slice(0, 10)
        );
        const missing = rowsForExport
          .map((r) => {
            const missingCols = columns.filter(
              (k) => r[k] === null || r[k] === undefined || r[k] === ""
            );
            return { id: r.id_permiso, missing: missingCols };
          })
          .filter((x) => x.missing.length > 0);
        console.debug(
          "exportCrear: rows with missing cols (sample up to 20)=",
          missing.slice(0, 20)
        );
      } catch (e) {
        console.debug("exportCrear: error while logging mapped rows", e);
      }
      if (
        Array.isArray(rowsForExport) &&
        rowsForExport.length > 0 &&
        window.XLSX &&
        typeof window.XLSX.utils !== "undefined"
      ) {
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
        window.XLSX.utils.book_append_sheet(workbook, worksheet, "CrearPT");

        const wbout = window.XLSX.write(workbook, {
          bookType: "xlsx",
          type: "array",
        });
        const blob = new Blob([wbout], { type: "application/octet-stream" });
        downloadBlob(blob, `crear-permisos-${stamp}.xlsx`);
        return;
      }

      toCsvAndDownload(rowsForExport, columns, `crear-permisos-${stamp}.xlsx`);
    } catch (err) {
      console.error("Error en exportCrear:", err);
      alert("No se pudo exportar. Revisa la consola para más detalles.");
    }
  }

  function attachExportButtons() {
    const attach = (el) => {
      if (!el) return;
      el.addEventListener("click", (e) => {
        e.preventDefault();
        exportCrear();
      });
    };

    attach(document.getElementById("export-excel-crear"));
    attach(document.getElementById("export-excel-crear-btn"));
    document.querySelectorAll(".export-excel-crear").forEach(attach);
  }

  document.addEventListener("DOMContentLoaded", () => {
    attachExportButtons();
  });
})();
