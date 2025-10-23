console.log('Script LogicaImprimir.js cargado correctamente');

document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM completamente cargado en LogicaImprimir');
    
    // Asegurarse de que el modal esté oculto al cargar la página
    const modal = document.getElementById('modalImprimir');
    if (modal) {
        modal.style.display = 'none';
    }
    
    // Función optimizada para impresión directa
    function printModalContent() {
        console.log('Preparando impresión...');
        
        // Obtener el modal y su contenido
        const modal = document.getElementById('modalImprimir');
        if (!modal) {
            console.error('Modal de impresión no encontrado');
            return;
        }
        
        // Crear un iframe para la impresión
        const iframe = document.createElement('iframe');
        iframe.style.position = 'absolute';
        iframe.style.width = '0';
        iframe.style.height = '0';
        iframe.style.border = '0';
        
        // Añadir el iframe al documento
        document.body.appendChild(iframe);
        
        // Esperar a que el iframe cargue
        iframe.onload = function() {
            const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
            
            // Clonar solo el contenido del modal-body
            const modalBody = modal.querySelector('.modal-body');
            if (!modalBody) {
                console.error('No se encontró el contenido del modal');
                document.body.removeChild(iframe);
                return;
            }
            
            const contentClone = modalBody.cloneNode(true);
            
            // Formatear la sección de firmas
            const firmasContainer = document.createElement('div');
            firmasContainer.className = 'firmas-container';
            
            // Crear las tres secciones de firma
            const firmas = [
                { titulo: 'Nombre y firma del solicitante', nombre: 'Ing. Juan Pérez Martínez' },
                { titulo: 'Nombre y firma del supervisor', nombre: 'Ing. Carlos Rodríguez' },
                { titulo: 'Nombre y firma del ejecutor', nombre: 'Téc. Luis González' }
            ];
            
            firmas.forEach(firmaData => {
                const firmaDiv = document.createElement('div');
                firmaDiv.className = 'firma';
                firmaDiv.innerHTML = `
                    <div class="firma-contenido">
                        <p class="titulo-firma">${firmaData.titulo}</p>
                        <div class="linea-firma"></div>
                        <p class="nombre">${firmaData.nombre}</p>
                    </div>
                `;
                firmasContainer.appendChild(firmaDiv);
            });
            
            // Reemplazar la sección de firmas existente con la nueva
            const oldFirmas = contentClone.querySelector('.firmas-container, .firmas');
            if (oldFirmas) {
                oldFirmas.replaceWith(firmasContainer);
            } else {
                contentClone.appendChild(firmasContainer);
            }
            
            // Eliminar elementos no deseados
            const noPrintElements = contentClone.querySelectorAll('.no-print, .print-actions, .modal-header, .modal-footer');
            noPrintElements.forEach(el => el.remove());
            
            // Crear el contenido HTML completo
            const html = `
            <!DOCTYPE html>
            <html>
            <head>
                <title>Permiso de Trabajo</title>
                <style>
                    @page {
                        size: A4;
                        margin: 1.5cm;
                    }
                    body {
                        font-family: Arial, sans-serif;
                        margin: 0;
                        padding: 20px;
                    }
                    .modal-body {
                        width: 100%;
                        max-width: 100%;
                    }
                    .modal-body > div {
                        margin-bottom: 15px;
                    }
                    .modal-body h2 {
                        text-align: center;
                        color: #003B5C;
                        margin-bottom: 20px;
                    }
                    .modal-body h3 {
                        color: #003B5C;
                        border-bottom: 1px solid #ddd;
                        padding-bottom: 5px;
                        margin-top: 30px;
                    }
                    /* Estilos profesionales para la sección de firmas */
                    .firmas-container {
                        display: flex;
                        justify-content: space-between;
                        margin: 100px 0 60px;
                        page-break-inside: avoid;
                    }
                    .firma {
                        text-align: center;
                        width: 30%;
                        margin: 0 15px;
                        position: relative;
                        padding: 25px 15px;
                        background: #f9f9f9;
                        border-radius: 8px;
                        box-shadow: 0 2px 4px rgba(0,0,0,0.05);
                    }
                    .firma:not(:last-child)::after {
                        content: '';
                        position: absolute;
                        right: -15px;
                        top: 50%;
                        transform: translateY(-50%);
                        width: 1px;
                        height: 70%;
                        background: linear-gradient(to bottom, transparent, #e0e0e0, transparent);
                    }
                    .firma-contenido {
                        position: relative;
                        padding: 20px 0;
                    }
                    .linea-firma {
                        border-top: 1px solid #003B5C;
                        margin: 50px auto 20px;
                        width: 90%;
                        position: relative;
                    }
                    .linea-firma::before {
                        content: 'Firma';
                        position: absolute;
                        top: -10px;
                        left: 50%;
                        transform: translateX(-50%);
                        background: #f9f9f9;
                        padding: 0 15px;
                        color: #666;
                        font-size: 11px;
                        letter-spacing: 0.5px;
                        text-transform: uppercase;
                    }
                    .firma p {
                        margin: 8px 0;
                        color: #444;
                        font-size: 13px;
                        line-height: 1.5;
                    }
                    .firma p.titulo-firma {
                        font-weight: 600;
                        color: #003B5C;
                        font-size: 12px;
                        letter-spacing: 0.5px;
                        text-transform: uppercase;
                        margin-bottom: 5px;
                        padding-bottom: 5px;
                        border-bottom: 1px dashed #e0e0e0;
                        display: inline-block;
                    }
                    .firma p.nombre {
                        font-weight: 500;
                        color: #222;
                        font-size: 14px;
                        margin-top: 15px;
                        letter-spacing: 0.3px;
                    }
                    .firma p.cargo {
                        color: #666;
                        font-size: 12px;
                        font-style: italic;
                        margin-top: 3px;
                    }
                </style>
            </head>
            <body>
                ${contentClone.outerHTML}
            </body>
            </html>`;
            
            // Escribir el contenido en el iframe
            iframeDoc.open();
            iframeDoc.write(html);
            iframeDoc.close();
            
            // Esperar a que los estilos se apliquen
            setTimeout(() => {
                // Imprimir el iframe
                iframe.contentWindow.focus();
                iframe.contentWindow.print();
                
                // Limpiar después de imprimir
                setTimeout(() => {
                    document.body.removeChild(iframe);
                }, 1000);
            }, 500);
        };
        
        // Iniciar la carga del iframe
        iframe.src = 'about:blank';
        
        // Añadir al documento
        document.head.appendChild(style);
        document.body.appendChild(printContainer);
        
        // Forzar un redibujado
        printContainer.offsetHeight;
        
        // Disparar impresión
        window.onafterprint = function() {
            // Limpiar después de imprimir
            if (document.head.contains(style)) {
                document.head.removeChild(style);
            }
            if (document.body.contains(printContainer)) {
                document.body.removeChild(printContainer);
            }
            window.onafterprint = null;
        };
        
        // Pequeño retraso para asegurar que los estilos se apliquen
        setTimeout(() => {
            window.print();
        }, 100);
    }

    // Configurar botones de imprimir
    const printButtons = document.querySelectorAll('#btnImprimir, .print-button');
    if (printButtons.length > 0) {
        console.log(`Se encontraron ${printButtons.length} botones de imprimir`);
        
        printButtons.forEach(btn => {
            btn.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                console.log('Botón de imprimir clickeado');
                printModalContent();
            });
        });
    } else {
        console.warn('No se encontraron botones de imprimir');
    }

    // Cerrar modal al hacer clic en la X o botón de cerrar
    const closeButtons = document.querySelectorAll('.close-print');
    closeButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const modal = document.getElementById('modalImprimir');
            if (modal) {
                modal.style.display = 'none';
                document.body.style.overflow = 'auto';
            }
        });
    });

    // Cerrar modal al hacer clic fuera del contenido
    window.addEventListener('click', function(e) {
        const modal = document.getElementById('modalImprimir');
        if (modal && e.target === modal) {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    });
});