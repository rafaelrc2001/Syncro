# 🔍 Guía para Probar el Filtro Global

## ✅ Sistema Implementado

He implementado un sistema completo de filtro global que afecta **TODAS** las gráficas y la tabla simultáneamente.

## 📋 Cambios Realizados

### 1. **Endpoint de Tabla Actualizado**

- ✅ Agregado `pt.id_permiso` y `a.nombre AS Area`
- ✅ JOIN con tabla `areas` incluido

### 2. **Scripts Deshabilitados**

- ✅ `tabla-dash.js` - completamente comentado
- ✅ `grafica-areas.js` - carga automática deshabilitada
- ✅ `grafica-tipos.js` - carga automática deshabilitada
- ✅ `grafica-estatus.js` - carga automática deshabilitada

### 3. **Filtro Global Activo**

- ✅ `filtro-global.js` - controla TODO el dashboard
- ✅ `debug-filtro.js` - herramientas de diagnóstico

## 🧪 Cómo Probar

### En el Dashboard:

1. **Búsqueda por texto**: Escribe en el campo "Buscar por folio o nombre..."
2. **Filtro por estado**: Usa el dropdown de estados
3. **Combinación**: Usa ambos filtros juntos

### En la Consola del Navegador:

```javascript
// Verificar que todo esté funcionando
verificarFiltroGlobal();

// Probar un filtro específico
probarFiltro("345");

// Limpiar todos los filtros
limpiarFiltros();
```

## 🎯 Qué Debería Pasar

Cuando filtres por **"345"**:

- **Tabla**: Solo permisos que contengan "345"
- **Gráfica Áreas**: Solo áreas de esos permisos filtrados
- **Gráfica Tipos**: Solo tipos de esos permisos filtrados
- **Gráfica Estatus**: Solo estatus de esos permisos filtrados
- **Indicador**: "Mostrando X de Y registros (búsqueda: "345")"

## 🐛 Si No Funciona

1. **Abrir Consola del Navegador** (F12)
2. **Ejecutar**: `verificarFiltroGlobal()`
3. **Buscar errores** en la consola
4. **Revisar** que todos los elementos estén marcados con ✅

## 📊 Logs Disponibles

El sistema genera logs para ayudar con debugging:

- `✅ Datos cargados correctamente`
- `📋 Estructura de permisos`
- `🏢 Áreas recalculadas`
- `🔄 Actualizando gráfica de...`

## 🚨 Problemas Comunes

1. **Gráficas vacías**: Verifica que `window.areasChartInstance` exista
2. **Tabla no actualiza**: Revisa que el endpoint incluya `Area`
3. **Filtro no responde**: Confirma que `global-search` input esté en el DOM

## ✨ Funcionalidades

- 🔍 **Búsqueda instantánea** con debounce 300ms
- 📊 **Sincronización total** entre tabla y gráficas
- 🎨 **Indicador visual** de resultados filtrados
- 🔄 **Recálculo automático** de porcentajes
- 🧹 **Limpieza de filtros** funcional

¡El sistema está completamente implementado y listo para usar! 🎉
