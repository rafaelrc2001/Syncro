// Gráfica de Solicitantes de Permisos - Barras Horizontales
// grafica-solicitantes.js

// Configuración de la gráfica de solicitantes
function initSolicitantesChart() {
    // Datos de ejemplo para solicitantes de permisos
    const solicitantesData = {
        categories: ['Roberto Silva', 'Laura Martínez', 'Fernando Castro', 'Patricia Herrera', 'Miguel Ángel Díaz'],
        values: [52, 47, 41, 36, 29],
        colors: ['#003B5C', '#00BFA5', '#FF6F00', '#D32F2F', '#FFC107'],
        departamentos: ['Mantenimiento', 'Operaciones', 'Seguridad', 'Calidad', 'Logística']
    };

    // Inicializar gráfica
    const solicitantesChart = echarts.init(document.getElementById('solicitantes-chart'));

    // Configuración de la gráfica
    const solicitantesOption = {
        title: {
            show: false
        },
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'shadow'
            },
            formatter: function(params) {
                const data = params[0];
                const departamento = solicitantesData.departamentos[data.dataIndex];
                
                return `
                    <div style="font-weight: 600; margin-bottom: 3px; font-size: 11px;">${data.name}</div>
                    <div style="display: flex; align-items: center; gap: 5px; font-size: 11px; margin-bottom: 3px;">
                        <span style="display: inline-block; width: 8px; height: 8px; background: ${data.color}; border-radius: 50%;"></span>
                        Permisos solicitados: <strong>${data.value}</strong>
                    </div>
                    <div style="font-size: 10px;">
                        Departamento: <span style="color: ${data.color}; font-weight: 600;">${departamento}</span>
                    </div>
                `;
            },
            backgroundColor: 'rgba(255, 255, 255, 0.95)',
            borderColor: '#003B5C',
            borderWidth: 1,
            textStyle: {
                color: '#1C1C1C',
                fontSize: 11
            },
            padding: [5, 8]
        },
        grid: {
            left: '30%',
            right: '3%',
            bottom: '3%',
            top: '5%',
            containLabel: false
        },
        xAxis: {
            type: 'value',
            name: 'Cantidad',
            nameTextStyle: {
                color: '#4A4A4A',
                fontSize: 10,
                fontWeight: 500,
                padding: [0, 0, 0, 20]
            },
            axisLabel: {
                color: '#4A4A4A',
                fontSize: 10
            },
            axisLine: {
                show: false
            },
            axisTick: {
                show: false
            },
            splitLine: {
                lineStyle: {
                    color: '#F5F5F5',
                    width: 1,
                    type: 'solid'
                }
            },
            splitNumber: 4
        },
        yAxis: {
            type: 'category',
            data: solicitantesData.categories,
            axisLabel: {
                color: '#4A4A4A',
                fontSize: 10,
                fontWeight: 500,
                interval: 0,
                margin: 8
            },
            axisLine: {
                lineStyle: {
                    color: '#B0BEC5',
                    width: 1
                }
            },
            axisTick: {
                show: false
            }
        },
        series: [{
            name: 'Permisos',
            type: 'bar',
            data: solicitantesData.values.map((value, index) => ({
                value: value,
                itemStyle: {
                    color: new echarts.graphic.LinearGradient(1, 0, 0, 0, [
                        {offset: 0, color: solicitantesData.colors[index]},
                        {offset: 1, color: solicitantesData.colors[index] + '80'}
                    ]),
                    borderRadius: [0, 4, 4, 0],
                    shadowColor: solicitantesData.colors[index] + '30',
                    shadowBlur: 4,
                    shadowOffsetX: 2
                },
                emphasis: {
                    itemStyle: {
                        color: solicitantesData.colors[index],
                        shadowBlur: 6,
                        shadowOffsetX: 3
                    }
                },
                // Agregar etiqueta con el valor
                label: {
                    show: true,
                    position: 'right',
                    distance: 5,
                    formatter: '{c}',
                    fontSize: 10,
                    fontWeight: 'bold',
                    color: '#4A4A4A'
                }
            })),
            barWidth: '55%',
            animationDelay: function (idx) {
                return idx * 80;
            }
        }],
        animationEasing: 'elasticOut',
        animationDelayUpdate: function (idx) {
            return idx * 40;
        }
    };

    // Aplicar configuración
    solicitantesChart.setOption(solicitantesOption);

    // Hacer responsive
    window.addEventListener('resize', function() {
        solicitantesChart.resize();
    });

    // Función para actualizar datos
    function updateSolicitantesChart(newData) {
        const updatedData = {
            categories: newData.categories || solicitantesData.categories,
            values: newData.values || solicitantesData.values,
            colors: newData.colors || solicitantesData.colors,
            departamentos: newData.departamentos || solicitantesData.departamentos
        };

        const updatedOption = {
            yAxis: {
                data: updatedData.categories
            },
            series: [{
                data: updatedData.values.map((value, index) => ({
                    value: value,
                    itemStyle: {
                        color: new echarts.graphic.LinearGradient(1, 0, 0, 0, [
                            {offset: 0, color: updatedData.colors[index]},
                            {offset: 1, color: updatedData.colors[index] + '80'}
                        ]),
                        borderRadius: [0, 4, 4, 0],
                        shadowColor: updatedData.colors[index] + '30',
                        shadowBlur: 4,
                        shadowOffsetX: 2
                    },
                    // Mantener las etiquetas al actualizar
                    label: {
                        show: true,
                        position: 'right',
                        distance: 5,
                        formatter: '{c}',
                        fontSize: 10,
                        fontWeight: 'bold',
                        color: '#4A4A4A'
                    }
                }))
            }]
        };
        solicitantesChart.setOption(updatedOption);
    }

    // Retornar funciones públicas
    return {
        chart: solicitantesChart,
        updateData: updateSolicitantesChart,
        resize: () => solicitantesChart.resize(),
        data: solicitantesData
    };
}

// Auto-inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
    if (document.getElementById('solicitantes-chart')) {
        window.solicitantesChartInstance = initSolicitantesChart();
    }
});