import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import Servers from '@/pages/Servers';
import Rentals from '@/pages/Rentals';
import Settings from '@/pages/Settings';
import Logs from '@/pages/Logs';

/**
 * Навигация между страницами
 */
function Nav() {
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

/**
 * Корневой компонент приложения
 */
export default function App() {
    return (
        <BrowserRouter>
            <Nav />
            <Routes>
                <Route path="/" element={<Servers />} />
                <Route path="/rentals" element={<Rentals />} />
                <Route path="/logs" element={<Logs />} />
                <Route path="/settings" element={<Settings />} />
            </Routes>
        </BrowserRouter>
    );
}