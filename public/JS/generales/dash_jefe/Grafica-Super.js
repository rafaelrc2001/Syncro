// Gráfica de Supervisores de Seguridad - Barras Horizontales
// grafica-supervisores.js

// Configuración de la gráfica de supervisores
function initSupervisoresChart() {
    // Datos de ejemplo para supervisores de seguridad
    const supervisoresData = {
        categories: ['Carlos Mendoza', 'Ana Rodríguez', 'Luis Torres', 'María González', 'Javier López'],
        values: [45, 38, 32, 28, 22],
        colors: ['#D32F2F', '#FF6F00', '#FFC107', '#003B5C', '#00BFA5'],
        experiencia: ['10+ años', '8+ años', '5+ años', '3+ años', '2+ años']
    };

    // Inicializar gráfica
    const supervisoresChart = echarts.init(document.getElementById('supervisores-chart'));

    // Configuración de la gráfica
    const supervisoresOption = {
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
                const experiencia = supervisoresData.experiencia[data.dataIndex];
                
                return `
                    <div style="font-weight: 600; margin-bottom: 3px; font-size: 11px;">${data.name}</div>
                    <div style="display: flex; align-items: center; gap: 5px; font-size: 11px; margin-bottom: 3px;">
                        <span style="display: inline-block; width: 8px; height: 8px; background: ${data.color}; border-radius: 50%;"></span>
                        Permisos autorizados: <strong>${data.value}</strong>
                    </div>
                    <div style="font-size: 10px;">
                        Experiencia: <span style="color: ${data.color}; font-weight: 600;">${experiencia}</span>
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
            data: supervisoresData.categories,
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
            data: supervisoresData.values.map((value, index) => ({
                value: value,
                itemStyle: {
                    color: new echarts.graphic.LinearGradient(1, 0, 0, 0, [
                        {offset: 0, color: supervisoresData.colors[index]},
                        {offset: 1, color: supervisoresData.colors[index] + '80'}
                    ]),
                    borderRadius: [0, 4, 4, 0],
                    shadowColor: supervisoresData.colors[index] + '30',
                    shadowBlur: 4,
                    shadowOffsetX: 2
                },
                emphasis: {
                    itemStyle: {
                        color: supervisoresData.colors[index],
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
    supervisoresChart.setOption(supervisoresOption);

    // Hacer responsive
    window.addEventListener('resize', function() {
        supervisoresChart.resize();
    });

    // Función para actualizar datos
    function updateSupervisoresChart(newData) {
        const updatedData = {
            categories: newData.categories || supervisoresData.categories,
            values: newData.values || supervisoresData.values,
            colors: newData.colors || supervisoresData.colors,
            experiencia: newData.experiencia || supervisoresData.experiencia
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
        supervisoresChart.setOption(updatedOption);
    }

    // Retornar funciones públicas
    return {
        chart: supervisoresChart,
        updateData: updateSupervisoresChart,
        resize: () => supervisoresChart.resize(),
        data: supervisoresData
    };
}

// Auto-inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
    if (document.getElementById('supervisores-chart')) {
        window.supervisoresChartInstance = initSupervisoresChart();
    }
});