import { NavLink, Outlet } from 'react-router-dom';
import styles from './AppShell.module.css';

const navigation = [
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/pos', label: 'POS' },
  { to: '/products', label: 'Productos' },
  { to: '/customers', label: 'Clientes' },
  { to: '/invoices', label: 'Facturas' },
  { to: '/reports', label: 'Reportes' },
  { to: '/settings', label: 'Configuración' }
];

export function AppShell() {
  return (
    <div className={styles.layout}>
      <aside className={styles.sidebar}>
        <div className={styles.brand}>POS PyME</div>
        <nav className={styles.nav}>
          {navigation.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) => (isActive ? `${styles.link} ${styles.active}` : styles.link)}
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
      </aside>
      <main className={styles.main}>
        <header className={styles.header}>
          <h1>Panel POS</h1>
        </header>
        <section className={styles.content}>
          <Outlet />
        </section>
      </main>
    </div>
  );
}
