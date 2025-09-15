/**
 * Компонент навигации
 * (отделён от App.jsx для переиспользования/кастомизации)
 */
import { Link, useLocation } from 'react-router-dom';

export default function Nav() {
    const loc = useLocation();
    const A = ({ to, children }) => (
        <Link className={loc.pathname === to ? 'active' : ''} to={to}>
            {children}
        </Link>
    );
    return (
        <nav>
            <A to="/">Servers</A>
            <A to="/rentals">Rentals</A>
            <A to="/logs">Logs</A>
            <A to="/settings">Settings</A>
        </nav>
    );
}
