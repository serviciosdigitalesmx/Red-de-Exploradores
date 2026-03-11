function onOpen() {
  var ui = SpreadsheetApp.getUi();
  ui.createMenu('Red Exploradores')
    .addItem('Calcular comisiones para proyectos nuevos', 'calcularComisionesPendientes')
    .addToUi();
}

function calcularComisionesPendientes() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheetProyectos = ss.getSheetByName("PROYECTOS");
  var sheetComisiones = ss.getSheetByName("COMISIONES");
  var proyectosData = sheetProyectos.getDataRange().getValues();
  
  // Obtener lista de proyectos ya comisionados
  var comisionesData = sheetComisiones.getDataRange().getValues();
  var proyectosComisionados = new Set();
  for (var i = 1; i < comisionesData.length; i++) {
    proyectosComisionados.add(comisionesData[i][1]); // ID_PROYECTO
  }
  
  // Recorrer proyectos y calcular si no están comisionados
  for (var i = 1; i < proyectosData.length; i++) {
    var idProyecto = proyectosData[i][0];
    if (!proyectosComisionados.has(idProyecto)) {
      calcularComisiones(i + 1); // +1 porque el índice empieza en 1 en la hoja
    }
  }
}