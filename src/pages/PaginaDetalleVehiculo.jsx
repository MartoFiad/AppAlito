import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import Swal from 'sweetalert2'
import { vehiculosService } from '../services/vehiculosService.js'
import { calcularAlertasVehiculo } from '../utils/motorAlertas.js'

function PaginaDetalleVehiculo() {
  const { id } = useParams()
  const navigate = useNavigate()
  
  const [vehiculo, setVehiculo] = useState(null)
  const [tipoMtto, setTipoMtto] = useState('')
  const [fechaMtto, setFechaMtto] = useState('')
  const [kmMtto, setKmMtto] = useState('')

  useEffect(() => {
    const v = vehiculosService.obtenerPorId(id)
    if (!v) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'El vehículo solicitado no existe en el garage.',
        confirmButtonColor: '#212529'
      })
      navigate('/')
    } else {
      setVehiculo(v)
    }
  }, [id, navigate])

  if (!vehiculo) return <div className="text-center py-5">Cargando ficha técnica...</div>

  const alertasActivas = calcularAlertasVehiculo(vehiculo.historial, vehiculo)
  
  // 📈 OBTENER KM ACTUAL DESDE EL HISTORIAL:
  // Busca el número más alto registrado para mostrarlo en la tarjeta técnica
  const kmActualTotal = vehiculo.historial.length > 0 
    ? Math.max(...vehiculo.historial.map(h => Number(h.km)))
    : 0

  function manejarAgregarMantenimiento(e) {
    e.preventDefault()
    if (!tipoMtto || !fechaMtto || !kmMtto) {
      Swal.fire({
        icon: 'warning',
        title: 'Campos incompletos',
        text: 'Por favor, complete todos los campos antes de registrar la orden.',
        confirmButtonColor: '#212529'
      })
      return
    }

    if (Number(kmMtto) < kmActualTotal) {
      Swal.fire({
        icon: 'error',
        title: 'Kilometraje inconsistente',
        text: `El kilometraje no puede ser menor al actual registrado (${kmActualTotal.toLocaleString()} km).`,
        confirmButtonColor: '#212529'
      })
      return
    }

    const vehiculoActualizado = vehiculosService.agregarMantenimiento(vehiculo.id, {
      tipo: tipoMtto,
      fecha: fechaMtto,
      km: kmMtto
    })

    if (vehiculoActualizado) {
      setVehiculo(vehiculoActualizado)
      setTipoMtto('')
      setFechaMtto('')
      setKmMtto('')

      Swal.fire({
        icon: 'success',
        title: 'Servicio añadido',
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 2000
      })
    }
  }

  function manejarEliminarMantenimiento(mttoId) {
    Swal.fire({
      title: '¿Eliminar registro?',
      text: "Esta acción borrará el mantenimiento del historial de forma permanente.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#dc3545',
      cancelButtonColor: '#6c757d',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        const vehiculoActualizado = vehiculosService.eliminarMantenimiento(vehiculo.id, mttoId)
        if (vehiculoActualizado) {
          setVehiculo(vehiculoActualizado)
          Swal.fire({
            title: '¡Borrado!',
            text: 'El registro fue eliminado correctamente.',
            icon: 'success',
            confirmButtonColor: '#212529'
          })
        }
      }
    })
  }

  function manejarEditarMantenimiento(mttoId, tipoActual) {
    Swal.fire({
      title: 'Modificar mantenimiento',
      input: 'text',
      inputLabel: 'Descripción de la intervención técnica:',
      inputValue: tipoActual,
      showCancelButton: true,
      confirmButtonColor: '#212529',
      cancelButtonColor: '#6c757d',
      confirmButtonText: 'Guardar cambios',
      cancelButtonText: 'Cancelar',
      inputValidator: (value) => {
        if (!value || !value.trim()) {
          return '¡La descripción no puede estar vacía!'
        }
      }
    }).then((result) => {
      if (result.isConfirmed && result.value) {
        const vehiculoActualizado = vehiculosService.editarMantenimiento(vehiculo.id, mttoId, result.value)
        if (vehiculoActualizado) {
          setVehiculo(vehiculoActualizado)
          Swal.fire({
            icon: 'success',
            title: 'Registro actualizado',
            showConfirmButton: false,
            timer: 1500,
            toast: true,
            position: 'top-end'
          })
        }
      }
    })
  }

  return (
    <section className="mb-5">
      <Link to="/" className="btn btn-sm btn-secondary mb-4" style={{ borderRadius: '20px' }}>
        <i className="bi bi-arrow-left me-1"></i> Volver al Tablero
      </Link>

      <div className="row g-4">
        <div className="col-12 col-lg-5">
          <article className="card shadow-sm border-0 bg-white mb-4">
            {vehiculo.foto ? (
              <img src={vehiculo.foto} className="card-img-top" alt={vehiculo.nombre} style={{ height: '220px', objectFit: 'cover' }} />
            ) : (
              <div className="bg-dark d-flex flex-column align-items-center justify-content-center text-muted" style={{ height: '220px' }}>
                <i className={`bi ${vehiculo.tipo === 'moto' ? 'bi-bicycle' : 'bi-car-front'} display-3 text-warning`}></i>
              </div>
            )}
            <div className="card-body p-4">
              <span className="badge text-bg-warning text-uppercase font-monospace mb-2">{vehiculo.patente}</span>
              <h2 className="h3 card-title text-dark mb-1">{vehiculo.nombre}</h2>
              <p className="text-muted mb-3">{vehiculo.modelo} &bull; Modelo {vehiculo.anio}</p>
              
              <div className="d-flex flex-column gap-2 small font-monospace">
                <div className="p-2 bg-light rounded border text-uppercase">
                  <strong>Kilometraje:</strong> {kmActualTotal.toLocaleString()} km
                </div>
                <div className="p-2 bg-light rounded border text-uppercase">
                  <strong>Tipo:</strong> {vehiculo.tipo}
                </div>
                <div className="p-2 bg-light rounded border text-uppercase">
                  <strong>Distribución:</strong> {vehiculo.tipo === 'moto' ? 'Kit Arrastre (Cadena)' : vehiculo.distribucion || 'correa'}
                </div>
              </div>
            </div>
          </article>

          <div className="card p-4 shadow-sm border-0 bg-white">
            <h4 className="h6 mb-3 text-dark fw-bold uppercase tracking-wider font-monospace">
              <i className="bi bi-shield-check text-warning me-2"></i>Asistente de Diagnóstico
            </h4>
            <div className="d-flex flex-column gap-2">
              {alertasActivas.map((alerta, index) => (
                <div key={index} className={`alert alert-${alerta.tipo} p-3 mb-0 border-0 shadow-sm`} style={{ borderRadius: '8px' }}>
                  <div className="d-flex gap-2">
                    <i className={`bi ${alerta.tipo === 'danger' ? 'bi-exclamation-octagon-fill' : alerta.tipo === 'warning' ? 'bi-exclamation-triangle-fill' : 'bi-info-circle-fill'} fs-5`}></i>
                    <div>
                      <h5 className="alert-heading h6 fw-bold mb-1">{alerta.titulo}</h5>
                      <p className="small mb-0 opacity-90">{alerta.mensaje}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="col-12 col-lg-7">
          <div className="card p-4 shadow-sm border-0 bg-white mb-4">
            <h4 className="h5 mb-3 text-dark fw-bold">
              <i className="bi bi-file-earmark-plus text-warning me-2"></i>Registrar Mantenimiento
            </h4>
            <form onSubmit={manejarAgregarMantenimiento}>
              <div className="mb-3">
                <label className="form-label small fw-bold text-secondary">Descripción del trabajo</label>
                <input 
                  type="text" 
                  className="form-control form-control-sm" 
                  placeholder="Ej: Cambio de correa, Service de cadena, Pastillas de freno"
                  value={tipoMtto}
                  onChange={(e) => setTipoMtto(e.target.value)}
                />
              </div>
              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="form-label small fw-bold text-secondary">Fecha de intervención</label>
                  <input 
                    type="date" 
                    className="form-control form-control-sm"
                    value={fechaMtto}
                    onChange={(e) => setFechaMtto(e.target.value)}
                  />
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label small fw-bold text-secondary">Kilometraje actual (km)</label>
                  <input 
                    type="number" 
                    className="form-control form-control-sm" 
                    placeholder={`Mínimo: ${kmActualTotal}`}
                    value={kmMtto}
                    onChange={(e) => setKmMtto(e.target.value)}
                  />
                </div>
              </div>
              <button type="submit" className="btn btn-sm btn-dark w-100 fw-bold py-2 mt-1">
                <i className="bi bi-plus-lg me-1"></i> Cargar al Historial
              </button>
            </form>
          </div>

          <div className="card p-4 shadow-sm border-0 bg-white">
            <h4 className="h5 mb-3 text-dark fw-bold d-flex justify-content-between align-items-center">
              <span><i className="bi bi-journal-text text-warning me-2"></i>Historial Clínico</span>
              <span className="badge bg-secondary-subtle text-secondary fs-6">{vehiculo.historial.length} ítems</span>
            </h4>

            {vehiculo.historial.length === 0 ? (
              <div className="text-center py-4 bg-light rounded border border-dashed">
                <p className="text-muted small mb-0">No se registran órdenes de servicio ni mantenimientos preventivos todavía.</p>
              </div>
            ) : (
              <div className="d-flex flex-column gap-3">
                {vehiculo.historial.map((h) => (
                  <div className="p-3 border rounded bg-light d-flex justify-content-between align-items-center" key={h.id}>
                    <div>
                      <h5 className="h6 mb-1 text-dark fw-bold">{h.tipo}</h5>
                      <span className="text-muted small font-monospace">
                        <i className="bi bi-calendar3 me-1"></i>{h.fecha} &bull; 
                        <i className="bi bi-speedometer me-1 ms-2"></i>{h.km.toLocaleString()} km
                      </span>
                    </div>
                    <div className="d-flex gap-1">
                      <button 
                        className="btn btn-sm btn-outline-secondary border-0" 
                        onClick={() => manejarEditarMantenimiento(h.id, h.tipo)}
                      >
                        <i className="bi bi-pencil-square"></i>
                      </button>
                      <button 
                        className="btn btn-sm btn-outline-danger border-0" 
                        onClick={() => manejarEliminarMantenimiento(h.id)}
                      >
                        <i className="bi bi-trash3"></i>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

export default PaginaDetalleVehiculo