import { useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';

const iconProps = {
  width: 18,
  height: 18,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 2,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
};

const navItems = [
  {
    grupo: 'Operación',
    items: [
      {
        to: '/dashboard',
        label: 'Dashboard',
        icon: (
          <svg {...iconProps}>
            <rect x="3" y="3" width="7" height="9" />
            <rect x="14" y="3" width="7" height="5" />
            <rect x="14" y="12" width="7" height="9" />
            <rect x="3" y="16" width="7" height="5" />
          </svg>
        ),
      },
      {
        to: '/importar',
        label: 'Importar Excel',
        icon: (
          <svg {...iconProps}>
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="17 8 12 3 7 8" />
            <line x1="12" y1="3" x2="12" y2="15" />
          </svg>
        ),
      },
      {
        to: '/registro',
        label: 'Registro manual',
        icon: (
          <svg {...iconProps}>
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
            <path d="M18.5 2.5a2.12 2.12 0 0 1 3 3L12 15l-4 1 1-4Z" />
          </svg>
        ),
      },
      {
        to: '/reporte',
        label: 'Reporte del periodo',
        icon: (
          <svg {...iconProps}>
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z" />
            <polyline points="14 2 14 8 20 8" />
            <line x1="8" y1="13" x2="16" y2="13" />
            <line x1="8" y1="17" x2="13" y2="17" />
          </svg>
        ),
      },
    ],
  },
  {
    grupo: 'Administración',
    items: [
      {
        to: '/empleados',
        label: 'Empleados',
        icon: (
          <svg {...iconProps}>
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
            <path d="M16 3.13a4 4 0 0 1 0 7.75" />
          </svg>
        ),
      },
      {
        to: '/periodos',
        label: 'Periodos',
        icon: (
          <svg {...iconProps}>
            <rect x="3" y="4" width="18" height="18" rx="2" />
            <line x1="16" y1="2" x2="16" y2="6" />
            <line x1="8" y1="2" x2="8" y2="6" />
            <line x1="3" y1="10" x2="21" y2="10" />
          </svg>
        ),
      },
      {
        to: '/configuracion',
        label: 'Configuración',
        icon: (
          <svg {...iconProps}>
            <circle cx="12" cy="12" r="3" />
            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1Z" />
          </svg>
        ),
      },
      {
        to: '/auditoria',
        label: 'Auditoría',
        icon: (
          <svg {...iconProps}>
            <path d="M9 11l3 3L22 4" />
            <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
          </svg>
        ),
      },
    ],
  },
];

const iconoNomina = (
  <svg {...iconProps}>
    <rect x="2" y="6" width="20" height="12" rx="2" />
    <circle cx="12" cy="12" r="2" />
    <path d="M6 12h.01M18 12h.01" />
  </svg>
);

function NavItemProximamente({ label, icono }: { label: string; icono: React.ReactNode }) {
  const btnRef = useRef<HTMLButtonElement>(null);
  const [pos, setPos] = useState<{ top: number; left: number } | null>(null);
  const [rebote, setRebote] = useState(0);

  function onClick() {
    const rect = btnRef.current?.getBoundingClientRect();
    if (rect) setPos({ top: rect.top + rect.height / 2, left: rect.right + 10 });
    setRebote((n) => n + 1);
    window.setTimeout(() => setPos(null), 2600);
  }

  return (
    <div style={{ position: 'relative' }}>
      <button ref={btnRef} type="button" className="hx-navitem-soon" onClick={onClick}>
        <span key={rebote} className={`hx-navitem-soon-icon${rebote > 0 ? ' bounce' : ''}`}>{icono}</span>
        {label}
        <span className="hx-pill-pronto">Pronto</span>
      </button>
      {pos && createPortal(
        <div className="hx-soon-pop" role="status" style={{ top: pos.top, left: pos.left }}>
          <span className="hx-soon-pop-emoji" aria-hidden>🚀</span>
          <div>
            <div className="hx-soon-pop-title">¡Próximamente!</div>
            <div className="hx-soon-pop-sub">Le estamos dando los últimos toques.</div>
          </div>
        </div>,
        document.body,
      )}
    </div>
  );
}

function iniciales(nombre: string): string {
  return nombre
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((parte) => parte[0]?.toUpperCase())
    .join('');
}

export function Sidebar() {
  const { usuario, salir } = useAuth();

  return (
    <aside className="hx-aside">
      <div className="hx-aside-head">
        <div className="hx-logo">H</div>
        <div style={{ minWidth: 0 }}>
          <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 16, lineHeight: 1, letterSpacing: '-.02em' }}>
            Hartemanía
          </div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9.5, letterSpacing: '.11em', textTransform: 'uppercase', color: 'rgba(255,255,255,.5)', marginTop: 5 }}>
            Horas Extras
          </div>
        </div>
      </div>

      <nav className="hx-nav">
        {navItems.map((grupo) => (
          <div key={grupo.grupo}>
            <div className="hx-nav-group">{grupo.grupo}</div>
            {grupo.items.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) => `hx-navitem${isActive ? ' active' : ''}`}
              >
                {item.icon}
                {item.label}
              </NavLink>
            ))}
            {grupo.grupo === 'Operación' && <NavItemProximamente label="Nómina" icono={iconoNomina} />}
          </div>
        ))}
      </nav>

      <div className="hx-aside-foot">
        <div style={{ display: 'flex', alignItems: 'center', gap: 11, padding: 8, borderRadius: 12 }}>
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: '50%',
              background: 'var(--c-sea-600)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 700,
              fontSize: 14,
              color: 'var(--text-on-brand)',
              flex: 'none',
            }}
          >
            {usuario ? iniciales(usuario.nombre) : ''}
          </div>
          <div style={{ minWidth: 0, flex: 1 }}>
            <div style={{ fontSize: 13, fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {usuario?.nombre}
            </div>
            <div style={{ fontSize: 11, color: 'rgba(255,255,255,.5)' }}>
              {usuario?.rol === 'ADMIN' ? 'Administrador' : 'RRHH / Digitador'}
            </div>
          </div>
          <button
            type="button"
            onClick={salir}
            title="Cerrar sesión"
            style={{ cursor: 'pointer', color: 'rgba(255,255,255,.5)', display: 'flex', padding: 6, background: 'none', border: 'none' }}
          >
            <svg {...iconProps} width={17} height={17}>
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
          </button>
        </div>
      </div>
    </aside>
  );
}
