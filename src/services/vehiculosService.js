import { mockDatabase } from '../data/mockDatabase.js';

export const vehiculosService = {
  obtenerTodos() {
    return mockDatabase.vehiculosRepository.findAll();
  },
  obtenerPorId(id) {
    return mockDatabase.vehiculosRepository.findById(id);
  },
  crear(datosVehiculo) {
    return mockDatabase.vehiculosRepository.save(datosVehiculo);
  },
  eliminar(id) {
    return mockDatabase.vehiculosRepository.deleteById(id);
  },
  agregarMantenimiento(vehiculoId, mtto) {
    return mockDatabase.vehiculosRepository.agregarMantenimiento(vehiculoId, mtto);
  },
  eliminarMantenimiento(vehiculoId, mttoId) {
    return mockDatabase.vehiculosRepository.eliminarMantenimiento(vehiculoId, mttoId);
  },
  editarMantenimiento(vehiculoId, mttoId, nuevoTipo) {
    return mockDatabase.vehiculosRepository.editarMantenimiento(vehiculoId, mttoId, nuevoTipo);
  }
};