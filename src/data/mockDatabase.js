// Cargamos datos iniciales si existen en el navegador, sino empezamos vacío
let vehiculos = JSON.parse(localStorage.getItem("garage_vehiculos")) || [
  {
    id: 1,
    nombre: "Gol Trend",
    modelo: "Volkswagen",
    tipo: "auto",
    patente: "AA123BB",
    anio: 2017,
    foto: "",
    historial: [
      { id: 101, tipo: "Cambio de aceite y filtros", fecha: "2026-03-15", km: 45000 }
    ]
  }
];

function guardarEnStorage() {
  localStorage.setItem("garage_vehiculos", JSON.stringify(vehiculos));
}

function clonar(obj) {
  return JSON.parse(JSON.stringify(obj));
}

export const mockDatabase = {
  vehiculosRepository: {
    findAll() {
      return vehiculos.map(clonar);
    },
    findById(id) {
      const v = vehiculos.find(item => item.id === Number(id));
      return v ? clonar(v) : null;
    },
    save(datos) {
      const nuevo = {
        id: vehiculos.length > 0 ? Math.max(...vehiculos.map(v => v.id)) + 1 : 1,
        nombre: datos.nombre.trim(),
        modelo: datos.modelo.trim(),
        tipo: datos.tipo,
        patente: datos.patente.toUpperCase().trim(),
        anio: Number(datos.anio),
        foto: datos.foto || "",
        historial: []
      };
      vehiculos.push(nuevo);
      guardarEnStorage();
      return clonar(nuevo);
    },
    deleteById(id) {
      const index = vehiculos.findIndex(v => v.id === Number(id));
      if (index === -1) return false;
      vehiculos.splice(index, 1);
      guardarEnStorage();
      return true;
    },
    agregarMantenimiento(vehiculoId, mtto) {
      const v = vehiculos.find(item => item.id === Number(vehiculoId));
      if (!v) return null;
      
      const nuevoMtto = {
        id: v.historial.length > 0 ? Math.max(...v.historial.map(h => h.id)) + 1 : 1,
        tipo: mtto.tipo.trim(),
        fecha: mtto.fecha,
        km: Number(mtto.km)
      };
      
      v.historial.push(nuevoMtto);
      v.historial.sort((a, b) => a.km - b.km); // Ordenado por kilometraje
      guardarEnStorage();
      return clonar(v);
    },
    eliminarMantenimiento(vehiculoId, mttoId) {
      const v = vehiculos.find(item => item.id === Number(vehiculoId));
      if (!v) return null;
      v.historial = v.historial.filter(h => h.id !== Number(mttoId));
      guardarEnStorage();
      return clonar(v);
    },
    editarMantenimiento(vehiculoId, mttoId, nuevoTipo) {
      const v = vehiculos.find(item => item.id === Number(vehiculoId));
      if (!v) return null;
      const h = v.historial.find(item => item.id === Number(mttoId));
      if (h) h.tipo = nuevoTipo.trim();
      guardarEnStorage();
      return clonar(v);
    }
  }
};