// Configuración de porcentajes
const PORC_EXPLORADOR = 30;
const PORC_RECLUTADOR = 10;
const PORC_FUENTE = 5;
const PORC_INVITADOR_EXPLORADOR = 5; // opcional, para incentivar reclutamiento
const PORC_SISTEMA = 100 - (PORC_EXPLORADOR + PORC_RECLUTADOR + PORC_FUENTE + PORC_INVITADOR_EXPLORADOR); // lo que queda para ti

function onEdit(e) {
  // Detectar si se editó la hoja PROYECTOS (por ejemplo, al añadir un proyecto nuevo)
  var sheet = e.source.getActiveSheet();
  if (sheet.getName() !== "PROYECTOS") return;
  var range = e.range;
  var row = range.getRow();
  var col = range.getColumn();
  // Si se editó la columna de ID_NEGOCIO (columna 2) o cualquier otra, podemos ejecutar
  // Para evitar ejecutar muchas veces, podemos comprobar que la fila tiene datos nuevos.
  // Alternativa: crear un menú con "Calcular comisiones para proyectos nuevos"
}

// Función principal: calcular comisiones para un proyecto específico
function calcularComisiones(proyectoRow) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheetProyectos = ss.getSheetByName("PROYECTOS");
  var sheetPersonas = ss.getSheetByName("PERSONAS");
  var sheetComisiones = ss.getSheetByName("COMISIONES");
  var sheetActividad = ss.getSheetByName("ACTIVIDAD");
  
  // Leer datos del proyecto
  var idProyecto = sheetProyectos.getRange(proyectoRow, 1).getValue();
  var idNegocio = sheetProyectos.getRange(proyectoRow, 2).getValue();
  var valorInstalacion = sheetProyectos.getRange(proyectoRow, 3).getValue();
  var exploradorId = sheetProyectos.getRange(proyectoRow, 5).getValue();
  
  // Obtener datos del explorador
  var exploradorData = buscarPersonaPorId(exploradorId, sheetPersonas);
  if (!exploradorData) return;
  
  // Comisión del explorador
  crearComision(idProyecto, exploradorId, "Explorador", PORC_EXPLORADOR, valorInstalacion, sheetComisiones);
  
  // Registrar actividad de "cliente cerrado" para el explorador
  registrarActividad(exploradorId, "cliente cerrado", idProyecto, sheetActividad);
  
  // Buscar reclutador (quién invitó al explorador)
  var reclutadorId = exploradorData.invitadoPor;
  if (reclutadorId) {
    crearComision(idProyecto, reclutadorId, "Reclutador", PORC_RECLUTADOR, valorInstalacion, sheetComisiones);
    
    // Buscar fuente (quién invitó al reclutador)
    var reclutadorData = buscarPersonaPorId(reclutadorId, sheetPersonas);
    if (reclutadorData && reclutadorData.invitadoPor) {
      var fuenteId = reclutadorData.invitadoPor;
      crearComision(idProyecto, fuenteId, "Fuente", PORC_FUENTE, valorInstalacion, sheetComisiones);
      
      // Bonus: invitador del explorador (si aplica)
      // Podría ser la misma fuente si el reclutador invitó al explorador, pero en tu estructura la fuente es Samuel y el reclutador es Luis.
      // Aquí puedes definir lógica adicional.
    }
  }
  
  // Comisión del sistema (Jesús) - Puede ser una persona fija (ID_PERSONA de Jesús)
  var jesusId = "P001"; // Ajusta según tu hoja
  crearComision(idProyecto, jesusId, "Sistema", PORC_SISTEMA, valorInstalacion, sheetComisiones);
}

function buscarPersonaPorId(id, sheetPersonas) {
  var data = sheetPersonas.getDataRange().getValues();
  for (var i = 1; i < data.length; i++) {
    if (data[i][0] == id) {
      return {
        id: data[i][0],
        nombre: data[i][1],
        rol: data[i][3],
        invitadoPor: data[i][4]
      };
    }
  }
  return null;
}

function crearComision(idProyecto, personaId, tipo, porcentaje, valorInstalacion, sheetComisiones) {
  var monto = valorInstalacion * porcentaje / 100;
  var ultimaFila = sheetComisiones.getLastRow();
  var newRow = ultimaFila + 1;
  var idComision = "C" + ("000" + newRow).slice(-3); // C001, C002...
  
  sheetComisiones.getRange(newRow, 1).setValue(idComision);
  sheetComisiones.getRange(newRow, 2).setValue(idProyecto);
  sheetComisiones.getRange(newRow, 3).setValue(personaId);
  sheetComisiones.getRange(newRow, 4).setValue(tipo);
  sheetComisiones.getRange(newRow, 5).setValue(porcentaje);
  sheetComisiones.getRange(newRow, 6).setValue(monto);
  sheetComisiones.getRange(newRow, 7).setValue("No");
}

function registrarActividad(personaId, tipo, detalle, sheetActividad) {
  var ultimaFila = sheetActividad.getLastRow();
  var newRow = ultimaFila + 1;
  var idActividad = "A" + ("000" + newRow).slice(-3);
  var fecha = new Date();
  
  sheetActividad.getRange(newRow, 1).setValue(idActividad);
  sheetActividad.getRange(newRow, 2).setValue(personaId);
  sheetActividad.getRange(newRow, 3).setValue(tipo);
  sheetActividad.getRange(newRow, 4).setValue(fecha);
  sheetActividad.getRange(newRow, 5).setValue(detalle);
}