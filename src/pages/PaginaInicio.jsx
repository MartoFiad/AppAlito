import { Link } from 'react-router-dom'

function PaginaInicio({ vehiculos, onEliminarVehiculo }) {
  
  function manejarEliminar(id, e) {
    // Evitamos que el clic en el botón también active el clic de la tarjeta completa
    e.stopPropagation()
    e.preventDefault()
    
    if (window.confirm('¿Está seguro de que desea eliminar este vehículo del garage?')) {
      onEliminarVehiculo(id)
    }
  }

  return (
    <section className="mb-4">
      {/* Encabezado interno de la sección */}
      <div className="bg-white p-4 rounded shadow-sm mb-4 border-start border-warning border-4">
        <h2 className="h4 mb-1 font-monospace fw-bold text-dark">Vehículos en Garage</h2>
        <p className="text-muted small mb-0">
          Seleccione un vehículo para gestionar su historial de mantenimiento o añadir nuevos registros técnicos.
        </p>
      </div>

      {/* Validamos si el garage está vacío */}
      {vehiculos.length === 0 ? (
        <div className="text-center py-5 bg-white rounded shadow-sm border">
          <i className="bi bi-cone-striped text-warning display-4 mb-3 d-block"></i>
          <h3 className="h5 text-dark">No hay vehículos registrados</h3>
          <p className="text-muted small px-3">Tu garage está vacío por el momento. ¡Comenzá cargando tu primer auto o moto!</p>
          <Link to="/nuevo" className="btn btn-sm btn-warning fw-bold px-3 mt-2" style={{ borderRadius: '20px' }}>
            <i className="bi bi-plus-circle me-1"></i> Cargar Vehículo
          </Link>
        </div>
      ) : (
        /* Rejilla de tarjetas (Grid) de Bootstrap */
        <div className="row g-4">
          {vehiculos.map((v) => (
            <div className="col-12 col-md-6 col-lg-4" key={v.id}>
              {/* Al hacer clic en la tarjeta, navegamos al detalle usando su ID dinámico */}
              <Link to={`/vehiculo/${v.id}`} className="text-decoration-none text-reset">
                <article className="card h-100 shadow-sm border-0 position-relative transition-all hover-shadow">
                  
                  {/* Si el vehículo tiene foto la muestra, sino pone un fondo estético por defecto */}
                  {v.foto ? (
                    <img 
                      src={v.foto} 
                      className="card-img-top" 
                      alt={v.nombre}
                      style={{ height: '180px', objectFit: 'cover' }}
                    />
                  ) : (
                    <div className="bg-secondary-subtle d-flex flex-column align-items-center justify-content-center border-bottom text-muted" style={{ height: '180px' }}>
                      <i className={`bi ${v.tipo === 'moto' ? 'bi-bicycle' : 'bi-car-front'} display-5 mb-2`}></i>
                      <span className="small text-uppercase tracking-wider font-monospace">Sin Imagen Cargada</span>
                    </div>
                  )}

                  {/* Cuerpo de la Tarjeta */}
                  <div className="card-body p-4">
                    <div className="d-flex justify-content-between align-items-start mb-2">
                      <span className="badge text-bg-dark text-uppercase tracking-wider px-2 py-1 font-monospace small">
                        {v.tipo}
                      </span>
                      <span className="badge bg-warning-subtle text-warning border border-warning-subtle px-2 py-1 font-monospace small fw-bold">
                        {v.patente}
                      </span>
                    </div>

                    <h3 className="h5 card-title mb-1 text-dark text-truncate">{v.nombre}</h3>
                    <p className="text-muted small mb-3">{v.modelo} &bull; Año {v.anio}</p>
                    
                    <div className="d-flex justify-content-between align-items-center pt-2 border-top">
                      <span className="text-muted small">
                        <i className="bi bi-wrench-adjustable me-1 text-secondary"></i>
                        {v.historial.length} {v.historial.length === 1 ? 'mantenimiento' : 'mantenimientos'}
                      </span>
                    </div>
                  </div>

                  {/* Botón Flotante / Acceso rápido para eliminar */}
                  <button 
                    className="btn btn-outline-danger btn-sm border-0 position-absolute end-0 bottom-0 m-3"
                    onClick={(e) => manejarEliminar(v.id, e)}
                    title="Eliminar vehículo"
                  >
                    <i className="bi bi-trash3-fill"></i>
                  </button>
                </article>
              </Link>
            </div>
          ))}
        </div>
      )}
    </section>
  )
}

export default PaginaInicio