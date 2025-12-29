import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createTransaction } from '../features/transaction/transactionSlice';
import { fetchLedgers } from '../features/ledger/ledgerSlice';
import { useNavigate, useLocation } from 'react-router-dom';

const CreateTransaction = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    
    // Determine mode based on URL
    let mode = 'PAYMENT';
    let title = 'Record Payment';
    
    if (location.pathname.includes('receipt')) {
        mode = 'RECEIPT';
        title = 'Record Receipt';
    } else if (location.pathname.includes('journal')) {
        mode = 'JOURNAL';
        title = 'Record Journal Entry';
    }

    const { activeCompany } = useSelector((state) => state.company);
    const { ledgers } = useSelector((state) => state.ledger);

    const [formData, setFormData] = useState({
        voucherNumber: '',
        date: new Date().toISOString().split('T')[0],
        type: mode,
        amount: '',
        description: '',
        debitLedgerId: '',
        creditLedgerId: ''
    });

    useEffect(() => {
        setFormData(prev => ({ ...prev, type: mode }));
    }, [mode]);

    useEffect(() => {
        if (activeCompany) {
            dispatch(fetchLedgers(activeCompany.id));
        }
    }, [dispatch, activeCompany]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if(!activeCompany) return alert("Select Company");
        
        await dispatch(createTransaction({ 
            transactionData: formData, 
            companyId: activeCompany.id 
        }));
        navigate('/transactions');
    };

    return (
        <div className="bg-white p-6 rounded shadow max-w-2xl mx-auto">
            <h1 className="text-3xl font-bold mb-6 text-gray-800">{title}</h1>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-bold text-gray-700">Voucher No</label>
                        <input className="w-full border p-2 rounded" value={formData.voucherNumber} onChange={e => setFormData({...formData, voucherNumber: e.target.value})} placeholder="Auto/Manual" required />
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-gray-700">Date</label>
                        <input type="date" className="w-full border p-2 rounded" value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} required />
                    </div>
                </div>

                <div className="p-4 bg-gray-50 rounded border border-gray-200">
                    <h3 className="font-bold mb-3 text-lg">Accounting Details</h3>
                    
                    {/* LOGIC: 
                        Payment: Debit Party/Expense, Credit Cash/Bank
                        Receipt: Debit Cash/Bank, Credit Party/Income
                        Journal: Any to Any
                    */}

                    <div className="mb-4">
                        <label className="block text-sm font-bold text-blue-800">
                            {mode === 'PAYMENT' ? 'Paid To (Debit)' : mode === 'RECEIPT' ? 'Received In (Debit)' : 'Debit Account'}
                        </label>
                        <select className="w-full border p-2 rounded" value={formData.debitLedgerId} onChange={e => setFormData({...formData, debitLedgerId: e.target.value})} required>
                            <option value="">Select Account</option>
                            {ledgers.map(l => <option key={l.id} value={l.id}>{l.name} ({l.group.name})</option>)}
                        </select>
                    </div>

                    <div className="mb-4">
                         <label className="block text-sm font-bold text-green-800">
                            {mode === 'PAYMENT' ? 'Paid From (Credit)' : mode === 'RECEIPT' ? 'Received From (Credit)' : 'Credit Account'}
                        </label>
                        <select className="w-full border p-2 rounded" value={formData.creditLedgerId} onChange={e => setFormData({...formData, creditLedgerId: e.target.value})} required>
                            <option value="">Select Account</option>
                            {ledgers.map(l => <option key={l.id} value={l.id}>{l.name} ({l.group.name})</option>)}
                        </select>
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-bold">Amount</label>
                    <input type="number" className="w-full border p-2 rounded text-lg font-bold" value={formData.amount} onChange={e => setFormData({...formData, amount: e.target.value})} required />
                </div>

                <div>
                    <label className="block text-sm font-bold">Narration / Description</label>
                    <textarea className="w-full border p-2 rounded" rows="2" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})}></textarea>
                </div>

                <div className="flex justify-end gap-4">
                    <button type="button" onClick={() => navigate(-1)} className="px-4 py-2 text-gray-600">Cancel</button>
                    <button type="submit" className="bg-indigo-600 text-white px-6 py-2 rounded hover:bg-indigo-700">Save Transaction</button>
                </div>
            </form>
        </div>
    );
};

export default CreateTransaction;
