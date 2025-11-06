// Gráfica de Permisos por Sucursal - Gráfica de Pastel
// grafica-sucursales.js

// Estilos específicos para la gráfica de sucursales
const sucursalesChartStyles = `
    .pie-chart {
        background: white;
        border-radius: 12px;
        box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
        padding: 25px;
        display: flex;
        flex-direction: column;
        height: 400px;
    }

    .pie-chart .chart-title {
        font-size: 1.3rem;
        color: var(--negro-carbon);
        margin-bottom: 20px;
        display: flex;
        align-items: center;
        gap: 10px;
        font-family: 'Montserrat', sans-serif;
        font-weight: 600;
    }

    .pie-chart .chart-title i {
        color: var(--naranja-seguridad);
        font-size: 1.4rem;
    }

    #sucursales-chart {
        width: 100%;
        height: 300px;
        flex-grow: 1;
    }

    .sucursales-legend {
        display: flex;
        flex-wrap: wrap;
        gap: 15px;
        margin-top: 15px;
        padding-top: 15px;
        border-top: 1px solid var(--blanco-neutro);
        justify-content: center;
    }

    .sucursales-legend-item {
        display: flex;
        align-items: center;
        gap: 5px;
        font-size: 0.8rem;
        color: var(--gris-acero);
    }

    .sucursales-legend-dot {
        width: 8px;
        height: 8px;
        border-radius: 50%;
    }
`;

// Inyectar estilos en el documento
function injectSucursalesChartStyles() {
    const styleSheet = document.createElement('style');
    styleSheet.textContent = sucursalesChartStyles;
    document.head.appendChild(styleSheet);
}

// Configuración de la gráfica de sucursales
function initSucursalesChart() {
    // Inyectar estilos
    injectSucursalesChartStyles();

    // Datos de ejemplo para sucursales
    const sucursalesData = {
        categories: ['Pajaritos', 'Area 6'],
        values: [180, 130],
        colors: ['#003B5C', '#FF6F00'],
        icons: ['🏭', '🔧'],
        detalles: {
            'Pajaritos': {
                activos: 45,
                pendientes: 25,
                completados: 110
            },
            'Area 6': {
                activos: 30,
                pendientes: 20,
                completados: 80
            }
        }
    };

    // Inicializar gráfica
    const sucursalesChart = echarts.init(document.getElementById('sucursales-chart'));

    // Preparar datos para la gráfica de pastel
    const pieData = sucursalesData.categories.map((category, index) => ({
        value: sucursalesData.values[index],
        name: `${sucursalesData.icons[index]} ${category}`,
        itemStyle: {
            color: sucursalesData.colors[index]
        }
    }));

    // Configuración de la gráfica de pastel
    const sucursalesOption = {
        tooltip: {
            trigger: 'item',
            formatter: function(params) {
                const total = sucursalesData.values.reduce((a, b) => a + b, 0);
                const percentage = ((params.value / total) * 100).toFixed(1);
                const detalles = sucursalesData.detalles[params.name.replace(/^[^ ]+ /, '')];
                
                return `
                    <div style="font-weight: 600; margin-bottom: 5px;">
                        ${params.name}
                    </div>
                    <div style="display: flex; align-items: center; gap: 5px; margin-bottom: 3px;">
                        <span style="display: inline-block; width: 10px; height: 10px; background: ${params.color}; border-radius: 50%;"></span>
                        Total permisos: <strong>${params.value}</strong>
                    </div>
                    <div style="color: #666; font-size: 11px;">
                        Porcentaje: ${percentage}%
                    </div>
                    <div style="margin-top: 5px; padding-top: 5px; border-top: 1px solid #eee; font-size: 10px;">
                        <div>Activos: ${detalles.activos}</div>
                        <div>Pendientes: ${detalles.pendientes}</div>
                        <div>Completados: ${detalles.completados}</div>
                    </div>
                `;
            },
            backgroundColor: 'rgba(255, 255, 255, 0.95)',
            borderColor: '#FF6F00',
            borderWidth: 1,
            textStyle: {
                color: '#1C1C1C',
                fontSize: 12
            }
        },
        legend: {
            orient: 'horizontal',
            bottom: '0%',
            data: sucursalesData.categories.map((category, index) => `${sucursalesData.icons[index]} ${category}`),
            textStyle: {
                color: '#4A4A4A',
                fontSize: 11
            },
            itemGap: 20,
            itemWidth: 12,
            itemHeight: 12
        },
        series: [
            {
                name: 'Sucursales',
                type: 'pie',
                radius: ['40%', '70%'],
                center: ['50%', '45%'],
                avoidLabelOverlap: false,
                itemStyle: {
                    borderRadius: 10,
                    borderColor: '#fff',
                    borderWidth: 2
                },
                label: {
                    show: true,
                    formatter: function(params) {
                        const total = sucursalesData.values.reduce((a, b) => a + b, 0);
                        const percentage = ((params.value / total) * 100).toFixed(1);
                        return `${params.name}: ${percentage}%`;
                    },
                    fontSize: 11,
                    color: '#4A4A4A'
                },
                emphasis: {
                    label: {
                        show: true,
                        fontSize: 12,
                        fontWeight: 'bold'
                    },
                    itemStyle: {
                        shadowBlur: 10,
                        shadowOffsetX: 0,
                        shadowColor: 'rgba(0, 0, 0, 0.5)'
                    }
                },
                labelLine: {
                    show: true,
                    length: 10,
                    length2: 5
                },
                data: pieData,
                animationType: 'scale',
                animationEasing: 'elasticOut',
                animationDelay: function (idx) {
                    return idx * 150;
                }
            }
        ]
    };

    // Aplicar configuración
    sucursalesChart.setOption(sucursalesOption);

    // Hacer responsive
    window.addEventListener('resize', function() {
        sucursalesChart.resize();
    });

    // Función para actualizar datos
    function updateSucursalesChart(newData) {
        const updatedData = {
            categories: newData.categories || sucursalesData.categories,
            values: newData.values || sucursalesData.values,
            colors: newData.colors || sucursalesData.colors,
            icons: newData.icons || sucursalesData.icons,
            detalles: newData.detalles || sucursalesData.detalles
        };

        const updatedPieData = updatedData.categories.map((category, index) => ({
            value: updatedData.values[index],
            name: `${updatedData.icons[index]} ${category}`,
            itemStyle: {
                color: updatedData.colors[index]
            }
        }));

        const updatedOption = {
            legend: {
                data: updatedData.categories.map((category, index) => `${updatedData.icons[index]} ${category}`)
            },
            series: [{
                data: updatedPieData
            }]
        };
        sucursalesChart.setOption(updatedOption);
    }

    // Retornar funciones públicas
    return {
        chart: sucursalesChart,
        updateData: updateSucursalesChart,
        resize: () => sucursalesChart.resize()
    };
}

// Auto-inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
    if (document.getElementById('sucursales-chart')) {
        window.sucursalesChartInstance = initSucursalesChart();
    }
});

// Exportar para uso global
window.initSucursalesChart = initSucursalesChart;