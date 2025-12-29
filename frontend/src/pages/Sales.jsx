import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchInvoices } from '../features/sales/salesSlice';
import { Link } from 'react-router-dom';

const Sales = () => {
    const dispatch = useDispatch();
    const { invoices, loading } = useSelector((state) => state.sales);
    const { activeCompany } = useSelector((state) => state.company);

    useEffect(() => {
        if (activeCompany) {
            dispatch(fetchInvoices(activeCompany.id));
        }
    }, [dispatch, activeCompany]);

    if (!activeCompany) return <div className="p-4">Please select a company from Dashboard first.</div>;

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">Sales Invoices</h1>
                <Link 
                  to="/sales/create" 
                  className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                >
                  + Create Invoice
                </Link>
            </div>

            {loading && <p>Loading invoices...</p>}

            <div className="overflow-x-auto bg-white rounded shadow">
                <table className="min-w-full">
                    <thead className="bg-gray-100 border-b">
                        <tr>
                            <th className="p-4 text-left">Date</th>
                            <th className="p-4 text-left">Invoice #</th>
                            <th className="p-4 text-left">Customer</th>
                            <th className="p-4 text-left">Items</th>
                            <th className="p-4 text-right">Tax</th>
                            <th className="p-4 text-right">Total Amount</th>
                        </tr>
                    </thead>
                    <tbody>
                        {invoices.map((inv) => (
                            <tr key={inv.id} className="border-b hover:bg-gray-50">
                                <td className="p-4">{inv.date}</td>
                                <td className="p-4 font-bold text-blue-600">{inv.invoiceNumber}</td>
                                <td className="p-4">{inv.party?.name}</td>
                                <td className="p-4 text-sm text-gray-600">
                                    {inv.items?.length} items
                                </td>
                                <td className="p-4 text-right">₹{inv.totalTax}</td>
                                <td className="p-4 text-right font-bold">₹{inv.totalAmount}</td>
                            </tr>
                        ))}
                         {invoices.length === 0 && (
                            <tr><td colSpan="6" className="p-4 text-center text-gray-500">No invoices found.</td></tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Sales;
