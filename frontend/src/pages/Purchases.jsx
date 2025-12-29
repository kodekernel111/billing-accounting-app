import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchBills } from '../features/purchase/purchaseSlice';
import { Link } from 'react-router-dom';

const Purchases = () => {
    const dispatch = useDispatch();
    const { bills, loading } = useSelector((state) => state.purchase);
    const { activeCompany } = useSelector((state) => state.company);

    useEffect(() => {
        if (activeCompany) {
            dispatch(fetchBills(activeCompany.id));
        }
    }, [dispatch, activeCompany]);

    if (!activeCompany) return <div className="p-4">Please select a company from Dashboard first.</div>;

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">Purchase Bills</h1>
                <Link 
                  to="/purchases/create" 
                  className="bg-orange-600 text-white px-4 py-2 rounded hover:bg-orange-700"
                >
                  + Record Bill
                </Link>
            </div>

            {loading && <p>Loading bills...</p>}

            <div className="overflow-x-auto bg-white rounded shadow">
                <table className="min-w-full">
                    <thead className="bg-gray-100 border-b">
                        <tr>
                            <th className="p-4 text-left">Date</th>
                            <th className="p-4 text-left">Bill #</th>
                            <th className="p-4 text-left">Supplier</th>
                            <th className="p-4 text-left">Items</th>
                            <th className="p-4 text-right">Tax</th>
                            <th className="p-4 text-right">Total Amount</th>
                        </tr>
                    </thead>
                    <tbody>
                        {bills.map((bill) => (
                            <tr key={bill.id} className="border-b hover:bg-gray-50">
                                <td className="p-4">{bill.date}</td>
                                <td className="p-4 font-bold text-orange-600">{bill.billNumber}</td>
                                <td className="p-4">{bill.party?.name}</td>
                                <td className="p-4 text-sm text-gray-600">
                                    {bill.items?.length} items
                                </td>
                                <td className="p-4 text-right">₹{bill.totalTax}</td>
                                <td className="p-4 text-right font-bold">₹{bill.totalAmount}</td>
                            </tr>
                        ))}
                         {bills.length === 0 && (
                            <tr><td colSpan="6" className="p-4 text-center text-gray-500">No bills found.</td></tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Purchases;
