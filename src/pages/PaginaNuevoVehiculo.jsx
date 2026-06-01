import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import Swal from 'sweetalert2'
import { validarPatente, obtenerHintPatente } from '../utils/validadorPatente.js'

function PaginaNuevoVehiculo({ onAgregarVehiculo }) {
  const navigate = useNavigate()
  
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors }
  } = useForm({
    defaultValues: {
      nombre: '',
      modelo: '',
      tipo: 'auto',
      distribucion: 'correa',
      patente: '',
      anio: '',
      kmInicial: '', 
      formato2016: 'vieja',
      foto: ''
    }
  })

  const tipoActual = watch('tipo')
  const anioActual = watch('anio')
  const formato2016Actual = watch('formato2016')

  const textoAyudaPatente = obtenerHintPatente(tipoActual, anioActual, formato2016Actual)
  const mostrarSelector2016 = Number(anioActual) === 2016
  const esMoto = tipoActual === 'moto'

  function manejarCambioFoto(e) {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (event) => {
        setValue('foto', event.target.result)
      }
      reader.readAsDataURL(file)
    }
  }

  function alEnviar(datos) {
    const esValida = validarPatente(datos.tipo, datos.patente, datos.anio, datos.formato2016)
    
    if (!esValida) {
      Swal.fire({
        icon: 'error',
        title: 'Formato de patente inválido',
        text: 'La patente ingresada no coincide con el diseño reglamentario argentino para el tipo de vehículo y año seleccionado.',
        confirmButtonColor: '#ffc107',
        confirmButtonText: 'Revisar datos'
      })
      return
    }

    if (datos.tipo === 'moto') {
      datos.distribucion = 'cadena_moto'
    }

    // 🛠️ ACÁ ESTÁ EL ARREGLO: El auto ya nace con los kilómetros reales en su historial
    const nuevoVehiculo = {
      nombre: datos.nombre,
      modelo: datos.modelo,
      tipo: datos.tipo,
      distribucion: datos.distribucion,
      patente: datos.patente,
      anio: datos.anio,
      foto: datos.foto,
      historial: [
        {
          id: `${Date.now()}-init`, 
          tipo: "Kilometraje Inicial Registrado",
          fecha: new Date().toISOString().split('T')[0], 
          km: Number(datos.kmInicial) 
        }
      ]
    }

    onAgregarVehiculo(nuevoVehiculo)

    Swal.fire({
      icon: 'success',
      title: '¡Vehículo registrado!',
      showConfirmButton: false,
      timer: 1500,
      toast: true,
      position: 'top-end'
    })

    navigate('/')
  }

  return (
    <section className="mb-4" style={{ maxWidth: '700px', margin: '0 auto' }}>
      <div className="bg-white p-4 rounded shadow-sm mb-4 border-start border-warning border-4">
        <h2 className="h4 mb-1 font-monospace fw-bold text-dark">Agregar Nuevo Vehículo</h2>
        <p className="text-muted small mb-0">Complete la ficha técnica. El sistema validará automáticamente la patente ingresada.</p>
      </div>

      <form onSubmit={handleSubmit(alEnviar)} className="card p-4 shadow-sm border-0 bg-white">
        <div className="row">
          <div className="col-md-6 mb-3">
            <label className="form-label fw-bold small text-secondary">Nombre o Alias</label>
            <input
              type="text"
              className={`form-control ${errors.nombre ? 'is-invalid' : ''}`}
              placeholder="Ej: Mi Golcito, Camioneta"
              {...register('nombre', { required: 'El nombre es obligatorio' })}
            />
            {errors.nombre && <div className="invalid-feedback">{errors.nombre.message}</div>}
          </div>

          <div className="col-md-6 mb-3">
            <label className="form-label fw-bold small text-secondary">Marca / Modelo</label>
            <input
              type="text"
              className={`form-control ${errors.modelo ? 'is-invalid' : ''}`}
              placeholder="Ej: Volkswagen Gol Trend"
              {...register('modelo', { required: 'El modelo es obligatorio' })}
            />
            {errors.modelo && <div className="invalid-feedback">{errors.modelo.message}</div>}
          </div>
        </div>

        <div className="row">
          <div className="col-md-6 mb-3">
            <label className="form-label fw-bold small text-secondary">Tipo de Vehículo</label>
            <select className="form-select" {...register('tipo')}>
              <option value="auto">Auto</option>
              <option value="camioneta">Camioneta</option>
              <option value="moto">Moto</option>
            </select>
          </div>

          <div className="col-md-6 mb-3">
            <label className="form-label fw-bold small text-secondary">Año de Fabricación</label>
            <input
              type="number"
              className={`form-control ${errors.anio ? 'is-invalid' : ''}`}
              placeholder="Ej: 2017"
              {...register('anio', { 
                required: 'El año es obligatorio',
                min: { value: 1900, message: 'Año inválido' },
                max: { value: new Date().getFullYear() + 1, message: 'Año inválido' }
              })}
            />
            {errors.anio && <div className="invalid-feedback">{errors.anio.message}</div>}
          </div>
        </div>

        {/* Campo Kilometraje */}
        <div className="mb-3">
          <label className="form-label fw-bold small text-secondary">Kilometraje Actual (km)</label>
          <input
            type="number"
            className={`form-control ${errors.kmInicial ? 'is-invalid' : ''}`}
            placeholder="Ej: 85000"
            {...register('kmInicial', { 
              required: 'El kilometraje actual es obligatorio para el diagnóstico',
              min: { value: 0, message: 'El kilometraje no puede ser negativo' }
            })}
          />
          {errors.kmInicial && <div className="invalid-feedback">{errors.kmInicial.message}</div>}
        </div>

        {!esMoto && (
          <div className="mb-3 bg-light p-3 rounded border border-secondary-subtle">
            <label className="form-label fw-bold small text-dark">
              <i className="bi bi-gear-wide-connected me-1 text-warning"></i> Mecánica de Distribución
            </label>
            <select className="form-select form-select-sm" {...register('distribucion')}>
              <option value="correa">Motor con Correa de Distribución (Cambio cada 60.000 km)</option>
              <option value="cadena">Motor Cadenero (Revisión a los 150.000 km)</option>
            </select>
          </div>
        )}

        {mostrarSelector2016 && (
          <div className="mb-3 bg-light p-3 rounded border border-warning-subtle">
            <label className="form-label fw-bold small text-warning-emphasis">
              <i className="bi bi-info-circle-fill me-1"></i> Transición Patentamiento 2016
            </label>
            <p className="text-muted small mb-2">En 2016 convivieron los dos diseños en Argentina. Especifique cuál posee:</p>
            <select className="form-select form-select-sm" {...register('formato2016')}>
              <option value="vieja">Formato Viejo (Letras + Números)</option>
              <option value="nueva">Formato Nuevo Mercosur (Letras + Números + Letras)</option>
            </select>
          </div>
        )}

        <div className="mb-3">
          <label className="form-label fw-bold small text-secondary">Patente (Identificación Comercial)</label>
          <input
            type="text"
            className={`form-control font-monospace fw-bold text-uppercase ${errors.patente ? 'is-invalid' : ''}`}
            placeholder="ABC123 o AB123CD"
            {...register('patente', { 
              required: 'La patente es obligatoria',
              setValueAs: v => v.toUpperCase().replace(/\s+/g, '')
            })}
          />
          <div className="form-text text-muted small mt-1 font-monospace">
            <i className="bi bi-patch-question me-1"></i>
            {textoAyudaPatente}
          </div>
          {errors.patente && <div className="invalid-feedback">{errors.patente.message}</div>}
        </div>

        <div className="mb-4">
          <label className="form-label fw-bold small text-secondary">Foto del Vehículo (Opcional)</label>
          <input
            type="file"
            accept="image/*"
            className="form-control"
            onChange={manejarCambioFoto}
          />
        </div>

        <button type="submit" className="btn btn-warning fw-bold w-100 py-2" style={{ borderRadius: '8px' }}>
          <i className="bi bi-plus-circle me-2"></i> Registrar en el Garage
        </button>
      </form>
    </section>
  )
}

export default PaginaNuevoVehiculo