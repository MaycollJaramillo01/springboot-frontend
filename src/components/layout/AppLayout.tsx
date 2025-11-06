import { NavLink, Outlet } from 'react-router-dom';
import { PropsWithChildren } from 'react';
import logo from '../../assets/logo.svg';
import '../../styles/layout.css';

const NAV_LINKS = [
  { to: '/', label: 'POS' },
  { to: '/products', label: 'Productos' },
  { to: '/categories', label: 'Categorías' },
  { to: '/customers', label: 'Clientes' },
  { to: '/invoices', label: 'Facturas' }
];

const AppLayout = ({ children }: PropsWithChildren) => {
  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <img src={logo} alt="POS Touch" className="brand-logo" />
          <span>POS Touch</span>
        </div>
        <nav className="nav">
          {NAV_LINKS.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `nav-link ${isActive ? 'nav-link--active' : ''}`
              }
              end={link.to === '/'}
            >
              {link.label}
            </NavLink>
          ))}
        </nav>
      </aside>
      <main className="workspace">
        {children ?? <Outlet />}
      </main>
    </div>
  );
};

export default AppLayout;
