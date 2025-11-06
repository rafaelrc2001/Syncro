// Gráfica de Permisos por Categoría - Gráfica de Pastel
// grafica-categorias.js

// Estilos específicos para la gráfica de categorías
const categoriasChartStyles = `
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
        color: var(--verde-tecnico);
        font-size: 1.4rem;
    }

    #categorias-chart {
        width: 100%;
        height: 300px;
        flex-grow: 1;
    }

    .categorias-legend {
        display: flex;
        flex-wrap: wrap;
        gap: 15px;
        margin-top: 15px;
        padding-top: 15px;
        border-top: 1px solid var(--blanco-neutro);
        justify-content: center;
    }

    .categorias-legend-item {
        display: flex;
        align-items: center;
        gap: 5px;
        font-size: 0.8rem;
        color: var(--gris-acero);
    }

    .categorias-legend-dot {
        width: 8px;
        height: 8px;
        border-radius: 50%;
    }
`;

// Inyectar estilos en el documento
function injectCategoriasChartStyles() {
    const styleSheet = document.createElement('style');
    styleSheet.textContent = categoriasChartStyles;
    document.head.appendChild(styleSheet);
}

// Configuración de la gráfica de categorías
function initCategoriasChart() {
    // Inyectar estilos
    injectCategoriasChartStyles();

    // Datos de ejemplo para categorías
    const categoriasData = {
        categories: ['SAMP', 'APT', 'UREAS', 'AREA 6'],
        values: [120, 85, 60, 45],
        colors: ['#00BFA5', '#FF6F00', '#D32F2F', '#003B5C'],
        icons: ['🔧', '⚡', '🧪', '🏭']
    };

    // Inicializar gráfica
    const categoriasChart = echarts.init(document.getElementById('categorias-chart'));

    // Preparar datos para la gráfica de pastel
    const pieData = categoriasData.categories.map((category, index) => ({
        value: categoriasData.values[index],
        name: `${categoriasData.icons[index]} ${category}`,
        itemStyle: {
            color: categoriasData.colors[index]
        }
    }));

    // Configuración de la gráfica de pastel
    const categoriasOption = {
        tooltip: {
            trigger: 'item',
            formatter: function(params) {
                const total = categoriasData.values.reduce((a, b) => a + b, 0);
                const percentage = ((params.value / total) * 100).toFixed(1);
                return `
                    <div style="font-weight: 600; margin-bottom: 5px;">
                        ${params.name}
                    </div>
                    <div style="display: flex; align-items: center; gap: 5px; margin-bottom: 3px;">
                        <span style="display: inline-block; width: 10px; height: 10px; background: ${params.color}; border-radius: 50%;"></span>
                        Cantidad: <strong>${params.value}</strong>
                    </div>
                    <div style="color: #666; font-size: 11px;">
                        Porcentaje: ${percentage}%
                    </div>
                `;
            },
            backgroundColor: 'rgba(255, 255, 255, 0.95)',
            borderColor: '#00BFA5',
            borderWidth: 1,
            textStyle: {
                color: '#1C1C1C',
                fontSize: 12
            }
        },
        legend: {
            orient: 'horizontal',
            bottom: '0%',
            data: categoriasData.categories.map((category, index) => `${categoriasData.icons[index]} ${category}`),
            textStyle: {
                color: '#4A4A4A',
                fontSize: 11
            },
            itemGap: 15,
            itemWidth: 12,
            itemHeight: 12,
            formatter: function(name) {
                // Acortar nombres largos para la leyenda
                if (name.length > 15) {
                    return name.substring(0, 12) + '...';
                }
                return name;
            }
        },
        series: [
            {
                name: 'Categorías de Permisos',
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
                        const total = categoriasData.values.reduce((a, b) => a + b, 0);
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
    categoriasChart.setOption(categoriasOption);

    // Hacer responsive
    window.addEventListener('resize', function() {
        categoriasChart.resize();
    });

    // Función para actualizar datos
    function updateCategoriasChart(newData) {
        const updatedData = {
            categories: newData.categories || categoriasData.categories,
            values: newData.values || categoriasData.values,
            colors: newData.colors || categoriasData.colors,
            icons: newData.icons || categoriasData.icons
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
        categoriasChart.setOption(updatedOption);
    }

    // Retornar funciones públicas
    return {
        chart: categoriasChart,
        updateData: updateCategoriasChart,
        resize: () => categoriasChart.resize()
    };
}

// Auto-inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
    if (document.getElementById('categorias-chart')) {
        window.categoriasChartInstance = initCategoriasChart();
    }
});

// Exportar para uso global
window.initCategoriasChart = initCategoriasChart;