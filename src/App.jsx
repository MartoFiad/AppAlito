import { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'

// Importamos el Layout de diseño
import LayoutPrincipal from './layouts/LayoutPrincipal.jsx'

// Importamos nuestras tres pantallas independientes
import PaginaInicio from './pages/PaginaInicio.jsx'
import PaginaNuevoVehiculo from './pages/PaginaNuevoVehiculo.jsx'
import PaginaDetalleVehiculo from './pages/PaginaDetalleVehiculo.jsx'
import PaginaNoEncontrada from './pages/PaginaNoEncontrada.jsx' // Por si escriben una URL rota

// Importamos la capa de abstracción de servicios
import { vehiculosService } from './services/vehiculosService.js'

function App() {
  // Estado reactivo centralizado con la lista de vehículos
  const [vehiculos, setVehiculos] = useState([])

  // Efecto inicial: Carga los vehículos desde el servicio al montar la app
  useEffect(() => {
    const datosIniciales = vehiculosService.obtenerTodos()
    setVehiculos(datosIniciales)
  }, [])

  // --- MANEJADORES DE ACCIONES (CONTROLADORES) ---

  function manejarAgregarVehiculo(datosFormulario) {
    // 1. Guardamos físicamente en el repositorio/localStorage a través del servicio
    vehiculosService.crear(datosFormulario)
    
    // 2. Volvemos a leer la base de datos actualizada para refrescar el estado de React
    const actualizados = vehiculosService.obtenerTodos()
    setVehiculos(actualizados)
  }

  function manejarEliminarVehiculo(id) {
    // 1. Solicitamos la baja al servicio
    vehiculosService.eliminar(id)
    
    // 2. Refrescamos el estado visual
    const actualizados = vehiculosService.obtenerTodos()
    setVehiculos(actualizados)
  }

  return (
    <BrowserRouter>
      <Routes>
        {/* Definimos el Layout Principal como contenedor común de las rutas */}
        <Route path="/" element={<LayoutPrincipal />}>
          
          {/* Ruta Raíz: Muestra el tablero con el listado de tarjetas */}
          <Route 
            index 
            element={
              <PaginaInicio 
                vehiculos={vehiculos} 
                onEliminarVehiculo={manejarEliminarVehiculo} 
              />
            } 
          />
          
          {/* Ruta de Alta: Renderiza el formulario con React Hook Form */}
          <Route 
            path="nuevo" 
            element={
              <PaginaNuevoVehiculo 
                onAgregarVehiculo={manejarAgregarVehiculo} 
              />
            } 
          />
          
          {/* Ruta de Detalle Dinámica: El ":id" cambia por el ID de cada vehículo */}
          <Route 
            path="vehiculo/:id" 
            element={<PaginaDetalleVehiculo />} 
          />
          
          {/* Ruta Comodín (404): Captura cualquier dirección inválida */}
          <Route path="*" element={<PaginaNoEncontrada />} />
          
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App