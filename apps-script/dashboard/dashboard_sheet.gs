function crearDashboard() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  
  // Verificar que existen las hojas necesarias
  var hojasNecesarias = ["PERSONAS", "NEGOCIOS", "PROYECTOS", "COMISIONES", "ACTIVIDAD"];
  for (var i = 0; i < hojasNecesarias.length; i++) {
    if (!ss.getSheetByName(hojasNecesarias[i])) {
      SpreadsheetApp.getUi().alert("Falta la hoja: " + hojasNecesarias[i]);
      return;
    }
  }
  
  // Crear o limpiar hoja DASHBOARD
  var dashboard = ss.getSheetByName("DASHBOARD");
  if (dashboard) ss.deleteSheet(dashboard);
  dashboard = ss.insertSheet("DASHBOARD");
  
  // Encabezado principal
  dashboard.getRange("A1:F1").merge();
  dashboard.getRange("A1").setValue("🔥 RED DE EXPLORADORES 🔥")
    .setFontSize(16).setFontWeight("bold").setHorizontalAlignment("center");
  
  // Indicadores principales
  var indicadores = [
    ["Exploradores activos", "=CONTAR.SI(PERSONAS!F:F,\"Activo\")"],
    ["Total personas en red", "=CONTARA(PERSONAS!A:A)-1"],
    ["Negocios detectados", "=CONTARA(NEGOCIOS!A:A)-1"],
    ["Clientes instalados", "=CONTARA(PROYECTOS!A:A)-1"],
    ["Ingreso instalaciones", "=SUMA(PROYECTOS!C:C)"],
    ["Ingreso mensual", "=SUMA(PROYECTOS!D:D)"]
  ];
  
  dashboard.getRange("A3:B3").setValues([["📊 MÉTRICA", "VALOR"]]).setFontWeight("bold");
  for (var i = 0; i < indicadores.length; i++) {
    dashboard.getRange(i+4, 1).setValue(indicadores[i][0]);
    dashboard.getRange(i+4, 2).setFormula(indicadores[i][1]);
  }
  
  // Pipeline de negocios
  dashboard.getRange("D3:E3").setValues([["📈 PIPELINE", "CANTIDAD"]]).setFontWeight("bold");
  var pipeline = [
    ["Detectados", "=CONTAR.SI(NEGOCIOS!I:I,\"detectado\")"],
    ["Diagnóstico enviado", "=CONTAR.SI(NEGOCIOS!I:I,\"diagnóstico enviado\")"],
    ["Propuesta enviada", "=CONTAR.SI(NEGOCIOS!I:I,\"propuesta enviada\")"],
    ["Clientes cerrados", "=CONTAR.SI(NEGOCIOS!I:I,\"cliente cerrado\")"]
  ];
  for (var i = 0; i < pipeline.length; i++) {
    dashboard.getRange(i+4, 4).setValue(pipeline[i][0]);
    dashboard.getRange(i+4, 5).setFormula(pipeline[i][1]);
  }
  
  // Top exploradores (usando QUERY)
  dashboard.getRange("A10:C10").merge();
  dashboard.getRange("A10").setValue("🏆 TOP EXPLORADORES").setFontWeight("bold").setFontSize(12);
  dashboard.getRange("A11").setFormula(
    "=QUERY(PROYECTOS!A:E,\"select E, count(A) where E is not null group by E order by count(A) desc limit 5 label count(A) 'Clientes'\",1)"
  );
  
  // Ingresos por persona
  dashboard.getRange("D10:F10").merge();
  dashboard.getRange("D10").setValue("💰 INGRESOS POR PERSONA").setFontWeight("bold").setFontSize(12);
  dashboard.getRange("D11").setFormula(
    "=QUERY(COMISIONES!A:G,\"select C, sum(F) where C is not null group by C order by sum(F) desc limit 5 label sum(F) 'Total'\",1)"
  );
  
  // Actividad reciente
  dashboard.getRange("A17:C17").merge();
  dashboard.getRange("A17").setValue("⏱️ ACTIVIDAD RECIENTE").setFontWeight("bold").setFontSize(12);
  dashboard.getRange("A18").setFormula(
    "=QUERY(ACTIVIDAD!A:E,\"select B, C, D where B is not null order by D desc limit 10\",1)"
  );
  
  // Exploradores inactivos
  dashboard.getRange("E17:F17").merge();
  dashboard.getRange("E17").setValue("⚠️ EXPLORADORES INACTIVOS").setFontWeight("bold").setFontSize(12);
  dashboard.getRange("E18").setValue("=CONTAR.SI(PERSONAS!F:F,\"Inactivo\")");
  
  // Ajustar formato
  dashboard.setColumnWidth(1, 200);
  dashboard.setColumnWidth(2, 150);
  dashboard.setColumnWidth(3, 20);
  dashboard.setColumnWidth(4, 200);
  dashboard.setColumnWidth(5, 150);
  dashboard.getRange("A:F").setVerticalAlignment("middle");
  
  SpreadsheetApp.getUi().alert("✅ Dashboard creado exitosamente en la hoja 'DASHBOARD'");
}