import { useState } from 'react';
import { Navigate, Outlet, Link } from 'react-router-dom';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../features/auth/authSlice';

const MainLayout = () => {
    const [isSalesOpen, setIsSalesOpen] = useState(true);
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
                    <div>
                        <button 
                            onClick={() => setIsSalesOpen(!isSalesOpen)}
                            className="w-full flex items-center justify-between p-2 hover:bg-slate-700 rounded text-gray-400 font-bold uppercase text-sm mt-4 mb-1"
                        >
                            <span>Sales</span>
                            {isSalesOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                        </button>
                        
                        {isSalesOpen && (
                            <div className="space-y-1 pl-2">
                                <Link to="/sales/create" className="block p-2 text-sm hover:bg-slate-700 rounded">Create Invoice</Link>
                                <Link to="/sales/estimates" className="block p-2 text-sm hover:bg-slate-700 rounded">Estimates / Quotation</Link>
                                <Link to="/sales/proforma" className="block p-2 text-sm hover:bg-slate-700 rounded">Proforma Invoice</Link>
                                <Link to="/sales/payment-in" className="block p-2 text-sm hover:bg-slate-700 rounded">Payment In</Link>
                                <Link to="/sales/orders" className="block p-2 text-sm hover:bg-slate-700 rounded">Sale Order</Link>
                                <Link to="/sales/delivery-challan" className="block p-2 text-sm hover:bg-slate-700 rounded">Delivery Challan</Link>
                                <Link to="/sales/return" className="block p-2 text-sm hover:bg-slate-700 rounded">Sale Return</Link>
                                <Link to="/pos" className="block p-2 text-sm hover:bg-slate-700 rounded text-yellow-300 font-bold">POS</Link>
                                <Link to="/sales" className="block p-2 text-sm hover:bg-slate-700 rounded text-gray-400 italic">View All Invoices</Link>
                            </div>
                        )}
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
