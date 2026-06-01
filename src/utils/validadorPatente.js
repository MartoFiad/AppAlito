export function esViejaPorAnio(anio, formato2016) {
  if (anio < 2016) return true;
  if (anio > 2016) return false;
  return formato2016 === "vieja";
}

function validarAutoCamioneta(patente, esVieja) {
  const vieja = /^[A-Z]{3}\d{3}$/; // ABC123
  const nueva = /^[A-Z]{2}\d{3}[A-Z]{2}$/; // AB123CD
  return esVieja ? vieja.test(patente) : nueva.test(patente);
}

function validarMoto(patente, esVieja) {
  const vieja = /^\d{3}[A-Z]{3}$/; // 123ABC
  const nueva = /^[A-Z]\d{3}[A-Z]{3}$/; // A123ABC
  return esVieja ? vieja.test(patente) : nueva.test(patente);
}

export function validarPatente(tipo, patente, anio, formato2016) {
  if (!anio || !patente) return false;
  
  const esVieja = esViejaPorAnio(Number(anio), formato2016);
  const patenteUpper = patente.toUpperCase().trim();

  if (tipo === "auto" || tipo === "camioneta") {
    return validarAutoCamioneta(patenteUpper, esVieja);
  } else if (tipo === "moto") {
    return validarMoto(patenteUpper, esVieja);
  }
  return false;
}

export function obtenerHintPatente(tipo, anio, formato2016) {
  if (!anio) return "Ingrese año para ver formato";
  const esVieja = esViejaPorAnio(Number(anio), formato2016);

  if (tipo === "auto" || tipo === "camioneta") {
    return esVieja ? "Formato requerido: ABC123" : "Formato requerido: AB123CD";
  } else {
    return esVieja ? "Formato requerido: 123ABC" : "Formato requerido: A123ABC";
  }
}