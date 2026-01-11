// Función para mostrar responsables en la tabla desde el endpoint de detalle de autorizaciones
async function cargarResponsablesAutorizacion(id_permiso) {
	try {
		       const response = await fetch(`/api/autorizaciones/detalle/${id_permiso}`);
		       const data = await response.json();
		       console.log('[DEBUG] Respuesta endpoint detalle autorizaciones:', data);
			       const contenedor = document.getElementById('contenedor-responsables');
			       if (!contenedor) return;
				   let html = `<div class="section-header"><i class="ri-team-line"></i><h3>Responsables</h3></div>`;
				   html += `<div class="ast-summary"><table class="ast-table ast-table-responsables"><thead><tr><th>Nombre</th><th>Cargo</th><th>Firma Digital</th><th>Firma</th></tr></thead><tbody>`;
				   if (!data.success || !data.data) {
					   html += `<tr><td colspan="4" style="color:#c0392b;font-weight:600;text-align:center;">No se encontraron datos</td></tr>`;
				   } else {
					   const info = data.data;
					   function mostrarCampo(valor, label) {
						   if (valor === null || valor === undefined) {
							   return `<span style='color:#c0392b;font-weight:600;'>Sin dato</span>`;
						   }
						   if (typeof valor === 'string' && valor.trim() === '') {
							   return `<span style='color:#c0392b;font-weight:600;'>Sin dato</span>`;
						   }
						   return valor;
					   }
					   function getFirmaImg(src, label) {
						   if (!src) {
							   return `<span style='color:#c0392b;font-weight:600;'>Sin firma</span>`;
						   }
						   if (src.startsWith("data:image")) {
							   return `<img src='${src}' alt='Firma' style='max-width:120px;max-height:60px;'>`;
						   }
						   return `<img src='data:image/png;base64,${src}' alt='Firma' style='max-width:120px;max-height:60px;'>`;
					   }

					   // Fila 0: Solicitante
					   html += `<tr>`;
					   html += `<td>${mostrarCampo(info.nombre_solicitante, 'nombre_solicitante')}</td>`;
					   html += `<td>Solicitante</td>`;
					   html += `<td style='vertical-align:middle;padding:6px 8px;'>` +
								   `<div style='font-size:5px;line-height:1.3;'>` +
								`${ info.usuario_usuario ? info.usuario_usuario: '<span style=\'color:#c0392b\'>Sin dato</span>;'};` +
								   `Fecha:${ info.fecha_hora ? info.fecha_hora: '<span style=\'color:#c0392b\'>Sin dato</span> '};` + `<br>` +

								   `${(() => {
  let val = info.dispositivo_creacion;
  if (!val) return "<span style='color:#c0392b'>Sin dato</span>";
  if (typeof val === "string") {
    try { val = JSON.parse(val); } catch { return info.dispositivo_creacion; }
  }
  if (typeof val === "object" && val !== null) {
    let out = [];
    if (val.so) out.push(`so:${val.so}`);
    if (val.dispositivo) out.push(`dispositivo:${val.dispositivo}`);
    if (val.modelo !== undefined && val.modelo !== null && val.modelo !== "") out.push(val.modelo);
    return out.join(",");
  }
  return info.dispositivo_creacion;
})()};` +
								  `GPS: ${info.localizacion_creacion ? info.localizacion_creacion : '<span style=\'color:#c0392b\'>Sin dato</span>;'}` +
								    `IP: ${info.ip_creacion ? info.ip_creacion : '<span style=\'color:#c0392b\'>Sin dato</span>;'}`+  
								   `</div>` +
							   `</td>`;
						   
						   `</div>` +
					   `</td>`;
					   html += `<td>${getFirmaImg(info.firma_creacion, 'firma_creacion')}</td>`;
					   html += `</tr>`;

					   // Debug: mostrar valores crudos en consola
							   console.log('RESPONSABLE AREA:', info.responsable_area, 'fecha_hora_area:', info.fecha_hora_area, 'ip_area:', info.ip_area);
							   console.log('OPERADOR AREA:', info.operador_area, 'fecha_hora_area:', info.fecha_hora_area, 'ip_area:', info.ip_area);
					   console.log('SUPERVISOR:', info.supervisor, 'fecha_hora_supervisor:', info.fecha_hora_supervisor, 'ip_supervisor:', info.ip_supervisor);

					   // Fila 1: Responsable del área
							  
                       
                        html += `<tr>`;
					   html += `<td>${mostrarCampo(info.responsable_area, 'nombre_solicitante')}</td>`;
					   html += `<td>Responsable area</td>`;
                       html += `<td style='vertical-align:middle;padding:6px 8px;'>` +
								    `<div style='font-size:5px;line-height:1.3;'>` +
									`${info.responsable_area ? info.responsable_area: '<span style=\'color:#c0392b\'>Sin dato</span>' };` +
								    `Fecha: ${info.fecha_hora_area ? info.fecha_hora_area : '<span style=\'color:#c0392b\'>Sin dato</span>'};` + `<br>` +
																		`${(() => {
  let val = info.dispositivo_area;
  if (!val) return "<span style='color:#c0392b'>Sin dato</span>";
  if (typeof val === "string") {
    try { val = JSON.parse(val); } catch { return info.dispositivo_area; }
  }
  if (typeof val === "object" && val !== null) {
    let out = [];
    if (val.so) out.push(`so:${val.so}`);
    if (val.dispositivo) out.push(`dispositivo:${val.dispositivo}`);
    if (val.modelo !== undefined && val.modelo !== null && val.modelo !== "") out.push(val.modelo);
    return out.join(",");
  }
  return info.dispositivo_area;
})()};` +  
								    `GPS: ${info.localizacion_area ? info.localizacion_area : '<span style=\'color:#c0392b\'>Sin dato</span>'};` +
								    `IP: ${info.ip_area ? info.ip_area : '<span style=\'color:#c0392b\'>Sin dato</span>'};`+  
								    `</div>` +
							   `</td>`;
						   `<strong>IP:</strong> ${info.ip_area ? info.ip_area : '<span style=\'color:#c0392b\'>Sin dato</span>'};` +
						   `</div>` +
					   `</td>`;
					   html += `<td>${getFirmaImg(info.firma, 'firma')}</td>`;
					   html += `</tr>`;

					   // Fila 2: Operador del área


					   const operador = (info.operador_area || '').toString().trim();
						if (operador && operador.toLowerCase() !== 'sin dato') {
                        html += `<tr>`;
					   html += `<td>${mostrarCampo(info.operador_area, 'Operador_area')}</td>`;
					   html += `<td>Operador area</td>`;
							   html += `<td style='vertical-align:middle;padding:6px 8px;'>` +
								   `<div style='font-size:5px;line-height:1.3;'>` +
								   	`${info.nombre_usuario_departamento ? info.nombre_usuario_departamento: '<span style=\'color:#c0392b\'>Sin dato</span>'};` +
								   `Fecha: ${info.fecha_hora_area ? info.fecha_hora_area : '<span style=\'color:#c0392b\'>Sin dato</span>'};` + `<br>` +
								 	 `${(() => {
  let val = info.dispositivo_area;
  if (!val) return "<span style='color:#c0392b'>Sin dato</span>";
  if (typeof val === "string") {
    try { val = JSON.parse(val); } catch { return info.dispositivo_area; }
  }
  if (typeof val === "object" && val !== null) {
    let out = [];
    if (val.so) out.push(`so:${val.so}`);
    if (val.dispositivo) out.push(`dispositivo:${val.dispositivo}`);
    if (val.modelo !== undefined && val.modelo !== null && val.modelo !== "") out.push(val.modelo);
    return out.join(",");
  }
  return info.dispositivo_area;
})()};` +  

								   `GPS: ${info.localizacion_area ? info.localizacion_area : '<span style=\'color:#c0392b\'>Sin dato</span>'};` +
								   `IP: ${info.ip_area ? info.ip_area : '<span style=\'color:#c0392b\'>Sin dato</span>'};` +
								

								   `</div>` +
							   `</td>`;
						   `<strong>IP:</strong> ${info.ip_area ? info.ip_area : '<span style=\'color:#c0392b\'>Sin dato</span>;'}` +
						   `</div>` +
					   `</td>`;
					   html += `<td>${getFirmaImg(info.firma_operador_area, 'firma_operador_area')}</td>`;
					   html += `</tr>`;
						}




					   // Fila 3: Supervisor
					   html += `<tr>`;
					   html += `<td>${mostrarCampo(info.supervisor, 'supervisor')}</td>`;
					   html += `<td>Supervisor</td>`;
					   html += `<td style='vertical-align:middle;padding:6px 8px;'>` +
						   `<div style='font-size:5px;line-height:1.3;'>` +
						`${info.supervisor ? info.supervisor: '<span style=\'color:#c0392b\'>Sin dato</span>'};` +
								
						   `Fecha: ${info.fecha_hora_supervisor ? info.fecha_hora_supervisor : '<span style=\'color:#c0392b\'>Sin dato</span>'};` + `<br>` +
						   `${(() => {
							let val = info.dispositivo_supervisor;
							if (!val) return "<span style='color:#c0392b'>Sin dato</span>";
							if (typeof val === "string") {
								try { val = JSON.parse(val); } catch { return info.dispositivo_supervisor; }
							}
							if (typeof val === "object" && val !== null) {
								let out = [];
								if (val.so) out.push(`so:${val.so}`);
								if (val.dispositivo) out.push(`dispositivo:${val.dispositivo}`);
								if (val.modelo !== undefined && val.modelo !== null && val.modelo !== "") out.push(val.modelo);
								return out.join(",");
							}
							return info.dispositivo_supervisor;
							})()};`+
						   `GPS:${info.localizacion_supervisor ? info.localizacion_supervisor : '<span style=\'color:#c0392b\'>Sin dato</span>'};` + `<br>` +
						   `IP: ${info.ip_supervisor ? info.ip_supervisor : '<span style=\'color:#c0392b\'>Sin dato</span>'};` +
						    	   `</div>` +
					   `</td>`;
					   html += `<td>${getFirmaImg(info.firma_supervisor, 'firma_supervisor')}</td>`;
					   html += `</tr>`;
				   }
				   html += `</tbody></table></div>`;
				   contenedor.innerHTML = html;
	} catch (error) {
		document.getElementById("modal-ast-responsable-body").innerHTML = `<tr><td colspan='4'>Error al cargar responsables</td></tr>`;
		console.error("Error al cargar responsables:", error);
	}
}

// Llama a la función con el id_permiso que desees mostrar
// Ejemplo: cargarResponsablesAutorizacion(537);
