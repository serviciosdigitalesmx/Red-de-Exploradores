// Endpoint para obtener datos del dashboard (formato JSON)
function doGet() {
  return HtmlService.createTemplateFromFile('frontend')
    .evaluate()
    .setTitle('Red de Exploradores')
    .addMetaTag('viewport', 'width=device-width, initial-scale=1')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

// Función para servir archivos HTML parciales (CSS, JS)
function include(filename) {
  return HtmlService.createHtmlOutputFromFile(filename).getContent();
}

// Endpoints JSON para los datos
function getDashboardData() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  
  // Leer hojas
  var personas = ss.getSheetByName('PERSONAS').getDataRange().getValues();
  var negocios = ss.getSheetByName('NEGOCIOS').getDataRange().getValues();
  var proyectos = ss.getSheetByName('PROYECTOS').getDataRange().getValues();
  var comisiones = ss.getSheetByName('COMISIONES').getDataRange().getValues();
  var actividad = ss.getSheetByName('ACTIVIDAD').getDataRange().getValues();
  
  // Procesar indicadores principales
  var exploradoresActivos = personas.filter(function(row, i) {
    return i > 0 && row[5] === 'Activo'; // col F (índice 5)
  }).length;
  
  var totalPersonas = personas.length - 1;
  var negociosDetectados = negocios.length - 1;
  var clientesInstalados = proyectos.length - 1;
  
  var ingresoInstalaciones = 0;
  var ingresoMensual = 0;
  for (var i = 1; i < proyectos.length; i++) {
    ingresoInstalaciones += Number(proyectos[i][2]) || 0; // col C
    ingresoMensual += Number(proyectos[i][3]) || 0;      // col D
  }
  
  // Pipeline
  var pipeline = {
    detectados: 0,
    diagnostico: 0,
    propuesta: 0,
    cerrados: 0
  };
  for (var i = 1; i < negocios.length; i++) {
    var estado = negocios[i][8]; // col I (índice 8)
    if (estado === 'detectado') pipeline.detectados++;
    else if (estado === 'diagnóstico enviado') pipeline.diagnostico++;
    else if (estado === 'propuesta enviada') pipeline.propuesta++;
    else if (estado === 'cliente cerrado') pipeline.cerrados++;
  }
  
  // Top exploradores (proyectos por explorador)
  var exploradorCount = {};
  for (var i = 1; i < proyectos.length; i++) {
    var exp = proyectos[i][4]; // col E
    exploradorCount[exp] = (exploradorCount[exp] || 0) + 1;
  }
  var topExploradores = Object.keys(exploradorCount).map(function(key) {
    return { nombre: key, clientes: exploradorCount[key] };
  }).sort(function(a, b) { return b.clientes - a.clientes; }).slice(0, 5);
  
  // Ingresos por persona (desde comisiones)
  var ingresosPersona = {};
  for (var i = 1; i < comisiones.length; i++) {
    var persona = comisiones[i][2]; // col C
    var monto = Number(comisiones[i][5]) || 0; // col F
    ingresosPersona[persona] = (ingresosPersona[persona] || 0) + monto;
  }
  var topIngresos = Object.keys(ingresosPersona).map(function(key) {
    return { nombre: key, total: ingresosPersona[key] };
  }).sort(function(a, b) { return b.total - a.total; }).slice(0, 5);
  
  // Actividad reciente
  var actividadReciente = [];
  for (var i = Math.max(1, actividad.length - 10); i < actividad.length; i++) {
    actividadReciente.push({
      persona: actividad[i][1],
      tipo: actividad[i][2],
      fecha: actividad[i][3]
    });
  }
  actividadReciente.reverse(); // más reciente primero
  
  // Exploradores inactivos
  var inactivos = personas.filter(function(row, i) {
    return i > 0 && row[5] === 'Inactivo';
  }).length;
  
  return {
    exploradoresActivos: exploradoresActivos,
    totalPersonas: totalPersonas,
    negociosDetectados: negociosDetectados,
    clientesInstalados: clientesInstalados,
    ingresoInstalaciones: ingresoInstalaciones,
    ingresoMensual: ingresoMensual,
    pipeline: pipeline,
    topExploradores: topExploradores,
    topIngresos: topIngresos,
    actividadReciente: actividadReciente,
    inactivos: inactivos
  };
}

// Endpoint llamado desde el frontend (vía google.script.run)
function getData() {
  return getDashboardData();
}