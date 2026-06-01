import { Outlet, NavLink } from 'react-router-dom'

function LayoutPrincipal() {
  return (
    <div className="min-vh-100 d-flex flex-column bg-light">
      {/* Encabezado con Diseño de Chips de Navegación */}
      <header className="bg-dark text-white py-4 mb-4 shadow-sm">
        <div className="container">
          <div className="d-flex flex-column flex-md-row justify-content-between align-items-center gap-3">
            <div>
              <h1 className="h3 mb-1">
                <i className="bi bi-speedometer2 me-2 text-warning"></i>
                Mi Garage
              </h1>
              <p className="mb-0 text-muted small">Gestión profesional de flotas y mantenimientos</p>
            </div>
            
            {/* Menú de navegación principal */}
            <nav className="d-flex gap-2">
              <NavLink 
                to="/" 
                end
                className={({ isActive }) => `btn btn-sm ${isActive ? 'btn-warning fw-bold' : 'btn-outline-light'}`}
                style={{ borderRadius: '20px', padding: '0.4rem 1rem' }}
              >
                <i className="bi bi-house-door me-1"></i> Inicio
              </NavLink>
              <NavLink 
                to="/nuevo" 
                className={({ isActive }) => `btn btn-sm ${isActive ? 'btn-warning fw-bold' : 'btn-outline-light'}`}
                style={{ borderRadius: '20px', padding: '0.4rem 1rem' }}
              >
                <i className="bi bi-plus-circle me-1"></i> Agregar Vehículo
              </NavLink>
            </nav>
          </div>
        </div>
      </header>

      {/* Espacio dinámico donde React Router inyectará las páginas */}
      <main className="container flex-grow-1">
        <Outlet />
      </main>

      {/* Pie de página estático */}
      <footer className="bg-white border-top py-3 mt-5 text-center text-muted small">
        <div className="container">
          &copy; {new Date().getFullYear()} Mi Garage - Desarrollado en React
        </div>
      </footer>
    </div>
  )
}

export default LayoutPrincipal