// Test del endpoint de tabla
fetch("/api/tabla-permisos/1")
  .then((response) => response.json())
  .then((data) => {
    console.log("🧪 Test del endpoint de tabla:");
    console.log("📊 Total de permisos:", data.permisos.length);

    if (data.permisos.length > 0) {
      const sample = data.permisos[0];
      console.log("📋 Primer permiso:", sample);
      console.log("🔍 Campos disponibles:", Object.keys(sample));
      console.log("🏢 Campo Area:", sample.Area);
      console.log("🏢 Campo area:", sample.area);

      // Verificar todos los nombres de área únicos
      const areas = [
        ...new Set(data.permisos.map((p) => p.Area || p.area || "Sin área")),
      ];
      console.log("🏢 Áreas únicas encontradas:", areas);
    }
  })
  .catch((error) => {
    console.error("❌ Error en test:", error);
  });
