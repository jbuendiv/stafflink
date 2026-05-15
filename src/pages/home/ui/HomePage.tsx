const domainAreas = [
  'Empleados y perfil profesional',
  'Oficinas y calendario laboral mensual',
  'Asignaciones mensuales y planificadas',
  'Proyectos, oportunidades y staffing',
  'Vacaciones y disponibilidad',
]

const stackLayers = [
  {
    title: 'app',
    tag: 'Bootstrap',
    text: 'Configura providers, estilos globales y el arranque de la aplicación sin mezclar lógica de negocio.',
  },
  {
    title: 'pages',
    tag: 'Rutas',
    text: 'Orquesta pantallas completas y sirve como punto de composición de widgets y features.',
  },
  {
    title: 'widgets',
    tag: 'Composición',
    text: 'Agrupa bloques de interfaz más ricos que una entidad aislada pero sin depender de una pantalla única.',
  },
  {
    title: 'features',
    tag: 'Casos de uso',
    text: 'Reservado para flujos de usuario como aprobar vacaciones, buscar perfiles o asignar capacidad.',
  },
  {
    title: 'entities',
    tag: 'Dominio',
    text: 'Contendrá las piezas nucleares de StaffLink: empleado, oficina, asignación, proyecto, oportunidad o petición.',
  },
  {
    title: 'shared',
    tag: 'Base común',
    text: 'Reúne configuración, utilidades y componentes genéricos que no pertenecen a un caso de uso concreto.',
  },
]

export function HomePage() {
  return (
    <>
      <section className="panel hero-panel">
        <p className="app-shell__eyebrow">Arquitectura inicial</p>
        <h2 className="hero-panel__title">Base limpia y preparada para escalar StaffLink.</h2>
        <p className="hero-panel__text">
          El proyecto ya está organizado para crecer alrededor del dominio real:
          empleados, disponibilidad, asignaciones mensuales, vacaciones y staffing.
          Aún no hay lógica funcional implementada; esta fase deja únicamente la
          estructura técnica necesaria para empezar bien.
        </p>
      </section>

      <section className="panel">
        <h3 className="stack-card__title">Áreas de dominio previstas</h3>
        <p className="stack-card__text">
          La migración no debería girar solo alrededor de clientes y proyectos. La
          capacidad disponible del empleado en el tiempo es el eje principal del
          sistema.
        </p>
        <div className="pill-list" aria-label="Áreas del dominio">
          {domainAreas.map((area) => (
            <div key={area} className="pill">
              {area}
            </div>
          ))}
        </div>
      </section>

      <section className="stack-grid" aria-label="Capas de la arquitectura">
        {stackLayers.map((layer) => (
          <article key={layer.title} className="panel stack-card">
            <span className="stack-card__tag">{layer.tag}</span>
            <h3 className="stack-card__title">{layer.title}</h3>
            <p className="stack-card__text">{layer.text}</p>
          </article>
        ))}
      </section>
    </>
  )
}
