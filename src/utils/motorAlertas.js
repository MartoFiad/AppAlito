const REGLAS_BASE = [
  {
    clave: "aceite",
    nombre: "Cambio de Aceite y Filtros",
    intervaloKm: 10000,
    descripcion: "Se recomienda cada 10.000 km para proteger el motor."
  },
  {
    clave: "freno",
    nombre: "Revisión de Frenos (Pastillas/Discos)",
    intervaloKm: 20000,
    descripcion: "Se recomienda controlar el desgaste cada 20.000 km por seguridad."
  },
  {
    clave: "bujia",
    nombre: "Cambio de Bujías",
    intervaloKm: 30000,
    descripcion: "Optimiza el consumo de combustible cada 30.000 km."
  }
];

export function calcularAlertasVehiculo(historial, vehiculo) {
  if (!historial || historial.length === 0) {
    return [
      {
        tipo: "info",
        titulo: "Garage Inicial",
        mensaje: "Vehículo nuevo sin registros. Se recomienda realizar una inspección general inicial."
      }
    ];
  }

  const kmActual = Math.max(...historial.map((h) => Number(h.km)));
  const alertas = [];
  const reglasAdaptadas = [...REGLAS_BASE];

  const tipo = vehiculo.tipo ? vehiculo.tipo.toLowerCase() : "auto";
  const distribucion = vehiculo.distribucion ? vehiculo.distribucion.toLowerCase() : "correa";

  // Aplicamos la regla de distribución según lo que el usuario guardó en el formulario
  if (tipo === "moto") {
    reglasAdaptadas.push({
      clave: "distribucion", // Mantenemos la clave para el matcheo del historial
      nombre: "Kit de Transmisión (Cadena/Corona/Piñón)",
      intervaloKm: 20000,
      descripcion: "Se recomienda revisar tensión, lubricación y desgaste del kit de arrastre cada 20.000 km."
    });
  } else {
    if (distribucion === "cadena") {
      reglasAdaptadas.push({
        clave: "distribucion",
        nombre: "Inspección de Cadena de Distribución",
        intervaloKm: 150000,
        descripcion: "Los motores cadeneros son muy robustos. Se recomienda inspeccionar guías y tensores a los 150.000 km."
      });
    } else {
      reglasAdaptadas.push({
        clave: "distribucion",
        nombre: "Cambio de Correa de Distribución",
        intervaloKm: 60000,
        descripcion: "Componente crítico. Cambiar estrictamente cada 60.000 km para evitar roturas graves."
      });
    }
  }

  // Procesamiento de las alertas
  reglasAdaptadas.forEach((regla) => {
    // Matchea si el usuario escribe "distribucion", "correa", "cadena" o "transmision" en el tipo de mantenimiento
    const registrosFiltrados = historial.filter((h) =>
      h.tipo.toLowerCase().includes(regla.clave) || 
      h.tipo.toLowerCase().includes("correa") || 
      h.tipo.toLowerCase().includes("cadena") ||
      h.tipo.toLowerCase().includes("transmisión") ||
      h.tipo.toLowerCase().includes("transmision")
    );

    if (registrosFiltrados.length === 0) {
      alertas.push({
        tipo: "warning",
        titulo: regla.nombre,
        mensaje: `No se registran intervenciones. ${regla.descripcion}`
      });
    } else {
      const kmsDeIntervenciones = registrosFiltrados.map((r) => Number(r.km));
      const ultimoKmServicio = Math.max(...kmsDeIntervenciones);
      
      const kmTranscurridos = kmActual - ultimoKmServicio;
      const kmRestantes = regla.intervaloKm - kmTranscurridos;

      if (kmRestantes <= 0) {
        alertas.push({
          tipo: "danger",
          titulo: `¡VENCIDO! ${regla.nombre}`,
          textClave: regla.clave,
          mensaje: `Se realizó hace ${kmTranscurridos.toLocaleString()} km (Límite: ${regla.intervaloKm.toLocaleString()} km). ¡Requiere atención urgente!`
        });
      } else if (kmRestantes <= 2000) {
        alertas.push({
          tipo: "warning",
          titulo: `Próximo: ${regla.nombre}`,
          mensaje: `Faltan aproximadamente ${kmRestantes.toLocaleString()} km para el próximo servicio.`
        });
      }
    }
  });

  return alertas;
}