import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTransactions } from '../features/transaction/transactionSlice';
import { Link } from 'react-router-dom';

const Transactions = () => {
    const dispatch = useDispatch();
    const { transactions, loading } = useSelector((state) => state.transaction);
    const { activeCompany } = useSelector((state) => state.company);

    useEffect(() => {
        if (activeCompany) {
            dispatch(fetchTransactions(activeCompany.id));
        }
    }, [dispatch, activeCompany]);

    if (!activeCompany) return <div className="p-4">Please select a company from Dashboard first.</div>;

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">Transactions (Day Book)</h1>
                <div className="space-x-2">
                    <Link to="/payments/create" className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700">Payment</Link>
                    <Link to="/receipts/create" className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">Receipt</Link>
                    <Link to="/journal/create" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Journal</Link>
                </div>
            </div>

            {loading && <p>Loading transactions...</p>}

            <div className="overflow-x-auto bg-white rounded shadow">
                <table className="min-w-full">
                    <thead className="bg-gray-100 border-b">
                        <tr>
                            <th className="p-4 text-left">Date</th>
                            <th className="p-4 text-left">Voucher #</th>
                            <th className="p-4 text-left">Type</th>
                            <th className="p-4 text-left">Particulars</th>
                            <th className="p-4 text-right">Debit</th>
                            <th className="p-4 text-right">Credit</th>
                        </tr>
                    </thead>
                    <tbody>
                        {transactions.map((txn) => (
                            <tr key={txn.id} className="border-b hover:bg-gray-50">
                                <td className="p-4">{txn.date}</td>
                                <td className="p-4 font-mono text-sm">{txn.voucherNumber}</td>
                                <td className="p-4">
                                    <span className={`px-2 py-1 rounded text-xs text-white ${txn.type === 'PAYMENT' ? 'bg-red-500' : 'bg-green-500'}`}>
                                        {txn.type}
                                    </span>
                                </td>
                                <td className="p-4">
                                    <div className="font-bold">{txn.debitLedger?.name}</div>
                                    <div className="text-xs text-gray-500">To: {txn.creditLedger?.name}</div>
                                    <div className="text-xs italic text-gray-400">{txn.description}</div>
                                </td>
                                <td className="p-4 text-right font-mono">{txn.amount}</td>
                                <td className="p-4 text-right font-mono">{txn.amount}</td>
                            </tr>
                        ))}
                        {transactions.length === 0 && (
                            <tr><td colSpan="6" className="p-4 text-center text-gray-500">No transactions found.</td></tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Transactions;
