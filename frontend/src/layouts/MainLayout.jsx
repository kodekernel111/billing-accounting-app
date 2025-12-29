import { Navigate, Outlet, Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../features/auth/authSlice';

const MainLayout = () => {
    const { isAuthenticated, user } = useSelector((state) => state.auth);
    const dispatch = useDispatch();

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    const handleLogout = () => {
        dispatch(logout());
    };

    return (
        <div className="flex h-screen bg-gray-50">
            {/* Sidebar */}
            <aside className="w-64 bg-slate-800 text-white flex flex-col">
                <div className="p-4 text-2xl font-bold border-b border-gray-700">KodeBilling</div>
                <nav className="flex-1 p-4 space-y-2">
                    <Link to="/dashboard" className="block p-2 hover:bg-slate-700 rounded">Dashboard</Link>
                    <Link to="/parties" className="block p-2 hover:bg-slate-700 rounded">Parties</Link>
                    <Link to="/ledgers" className="block p-2 hover:bg-slate-700 rounded">Ledgers</Link>
                    <Link to="/items" className="block p-2 hover:bg-slate-700 rounded">Inventory (Items)</Link>
                    <Link to="/sales" className="block p-2 hover:bg-slate-700 rounded">Sales</Link>
                    <Link to="/purchases" className="block p-2 hover:bg-slate-700 rounded">Purchases</Link>
                    <Link to="/transactions" className="block p-2 hover:bg-slate-700 rounded">Day Book</Link>
                    <Link to="/reports" className="block p-2 hover:bg-slate-700 rounded">Reports</Link>
                </nav>
                <div className="p-4 border-t border-gray-700">
                     <div className="mb-2 text-sm text-gray-400">Logged in as: {user?.username}</div>
                     <button onClick={handleLogout} className="w-full text-left p-2 hover:bg-red-600 rounded">Logout</button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-auto p-8">
                <Outlet />
            </main>
        </div>
    );
};

export default MainLayout;
