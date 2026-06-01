import { Link } from 'react-router-dom'

function PaginaNoEncontrada() {
  return (
    <div className="text-center py-5 bg-white rounded shadow-sm border mt-4">
      <i className="bi bi-exclamation-triangle text-danger display-1 mb-3 d-block"></i>
      <h2 className="h4 text-dark fw-bold">404 - Pantalla No Encontrada</h2>
      <p className="text-muted small px-3">La dirección que ingresaste no existe en el sistema de gestión del garage.</p>
      <Link to="/" className="btn btn-sm btn-dark fw-bold px-3 mt-2" style={{ borderRadius: '20px' }}>
        <i className="bi bi-house-door me-1"></i> Volver al Tablero Inicial
      </Link>
    </div>
  )
}

export default PaginaNoEncontrada