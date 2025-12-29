import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTrialBalance } from '../features/report/reportSlice';

const TrialBalance = () => {
    const dispatch = useDispatch();
    const { trialBalance, loading } = useSelector((state) => state.report);
    const { activeCompany } = useSelector((state) => state.company);

    useEffect(() => {
        if (activeCompany) {
            dispatch(fetchTrialBalance(activeCompany.id));
        }
    }, [dispatch, activeCompany]);

    if (!activeCompany) return <div className="p-4">Please select a company from Dashboard first.</div>;

    const totalDebit = trialBalance.reduce((acc, g) => acc + g.debitTotal, 0);
    const totalCredit = trialBalance.reduce((acc, g) => acc + g.creditTotal, 0);

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">Trial Balance</h1>
                <div className="text-sm text-gray-500">
                    As of {new Date().toLocaleDateString()}
                </div>
            </div>

            {loading && <p>Loading report...</p>}

            <div className="bg-white rounded shadow overflow-hidden">
                <table className="min-w-full">
                    <thead className="bg-gray-800 text-white">
                        <tr>
                            <th className="p-3 text-left w-1/2">Particulars</th>
                            <th className="p-3 text-right w-1/4 border-l border-gray-600">Debit</th>
                            <th className="p-3 text-right w-1/4 border-l border-gray-600">Credit</th>
                        </tr>
                    </thead>
                    <tbody>
                        {trialBalance.map((group, idx) => (
                            <div key={idx} style={{ display: 'contents' }}>
                                <tr className="bg-gray-100 font-bold border-b">
                                    <td className="p-3">{group.groupName}</td>
                                    <td className="p-3 text-right">{group.debitTotal > 0 ? group.debitTotal.toFixed(2) : '-'}</td>
                                    <td className="p-3 text-right">{group.creditTotal > 0 ? group.creditTotal.toFixed(2) : '-'}</td>
                                </tr>
                                {group.ledgers.map(l => (
                                    <tr key={l.id} className="border-b hover:bg-gray-50 text-sm">
                                        <td className="p-2 pl-8 text-gray-700">{l.name}</td>
                                        <td className="p-2 text-right">{l.balanceType === 'DR' ? l.balance.toFixed(2) : ''}</td>
                                        <td className="p-2 text-right">{l.balanceType === 'CR' ? l.balance.toFixed(2) : ''}</td>
                                    </tr>
                                ))}
                            </div>
                        ))}
                        <tr className="bg-gray-800 text-white font-bold text-lg">
                            <td className="p-4 border-t">Grand Total</td>
                            <td className="p-4 text-right border-t border-l border-gray-600">{totalDebit.toFixed(2)}</td>
                            <td className="p-4 text-right border-t border-l border-gray-600">{totalCredit.toFixed(2)}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default TrialBalance;
