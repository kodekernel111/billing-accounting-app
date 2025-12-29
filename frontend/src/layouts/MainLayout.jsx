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
                    <Link to="/items" className="block p-2 hover:bg-slate-700 rounded">Items</Link>
                    
                    {/* Sales Section */}
                    <div className="space-y-1">
                        <div className="block p-2 text-gray-400 text-sm font-bold uppercase mt-4 mb-1">Sales</div>
                        <Link to="/sales/create" className="block p-2 pl-4 text-sm hover:bg-slate-700 rounded">1. Create Invoice</Link>
                        <Link to="/sales/estimates" className="block p-2 pl-4 text-sm hover:bg-slate-700 rounded">2. Estimates / Quotation</Link>
                        <Link to="/sales/proforma" className="block p-2 pl-4 text-sm hover:bg-slate-700 rounded">3. Proforma Invoice</Link>
                        <Link to="/sales/payment-in" className="block p-2 pl-4 text-sm hover:bg-slate-700 rounded">4. Payment In</Link>
                        <Link to="/sales/orders" className="block p-2 pl-4 text-sm hover:bg-slate-700 rounded">5. Sale Order</Link>
                        <Link to="/sales/delivery-challan" className="block p-2 pl-4 text-sm hover:bg-slate-700 rounded">6. Delivery Challan</Link>
                        <Link to="/sales/return" className="block p-2 pl-4 text-sm hover:bg-slate-700 rounded">7. Sale Return</Link>
                        <Link to="/pos" className="block p-2 pl-4 text-sm hover:bg-slate-700 rounded text-yellow-300 font-bold">8. POS</Link>
                        <Link to="/sales" className="block p-2 pl-4 text-sm hover:bg-slate-700 rounded text-gray-400 italic">View All Invoices</Link>
                    </div>

                    <Link to="/purchases" className="block p-2 hover:bg-slate-700 rounded mt-4">Purchases</Link>
                    <Link to="/ledgers" className="block p-2 hover:bg-slate-700 rounded">Ledgers</Link>
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
