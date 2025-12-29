import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createInvoice } from '../features/sales/salesSlice';
import { fetchParties } from '../features/party/partySlice';
import { fetchItems } from '../features/inventory/itemSlice';
import { useNavigate } from 'react-router-dom';

const CreateInvoice = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { activeCompany } = useSelector((state) => state.company);
    const { parties } = useSelector((state) => state.party);
    const { items } = useSelector((state) => state.item);

    const [invoiceData, setInvoiceData] = useState({
        invoiceNumber: `INV-${Date.now()}`,
        date: new Date().toISOString().split('T')[0],
        dueDate: '',
        partyId: ''
    });

    const [lineItems, setLineItems] = useState([
        { itemId: '', quantity: 1, rate: 0, taxRate: 0, total: 0 }
    ]);

    useEffect(() => {
        if (activeCompany) {
            dispatch(fetchParties(activeCompany.id));
            dispatch(fetchItems(activeCompany.id));
        }
    }, [dispatch, activeCompany]);

    const handleItemChange = (index, field, value) => {
        const newItems = [...lineItems];
        newItems[index][field] = value;
        
        if (field === 'itemId') {
            const selectedItem = items.find(i => i.id === Number(value));
            if (selectedItem) {
                newItems[index].rate = selectedItem.sellingPrice;
                newItems[index].taxRate = selectedItem.taxRate;
            }
        }
        
        // Recalculate Total for Row
        const qty = Number(newItems[index].quantity);
        const rate = Number(newItems[index].rate);
        const taxRate = Number(newItems[index].taxRate);
        const base = qty * rate;
        const tax = (base * taxRate) / 100;
        newItems[index].total = base + tax;

        setLineItems(newItems);
    };

    const addItemRow = () => {
        setLineItems([...lineItems, { itemId: '', quantity: 1, rate: 0, taxRate: 0, total: 0 }]);
    };

    const removeRow = (index) => {
        setLineItems(lineItems.filter((_, i) => i !== index));
    };

    const calculateGrandTotal = () => {
        return lineItems.reduce((acc, curr) => acc + curr.total, 0).toFixed(2);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if(!activeCompany) return alert("Select Company");
        if(!invoiceData.partyId) return alert("Select Party");

        await dispatch(createInvoice({ 
            invoiceData: { ...invoiceData, items: lineItems }, 
            companyId: activeCompany.id 
        }));
        navigate('/sales');
    };

    return (
        <div className="bg-white p-6 rounded shadow">
            <h1 className="text-3xl font-bold mb-6">Create Invoice</h1>
            <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-3 gap-4 mb-6">
                    <div>
                        <label className="block text-sm font-bold">Invoice #</label>
                        <input className="w-full border p-2 rounded" value={invoiceData.invoiceNumber} onChange={e => setInvoiceData({...invoiceData, invoiceNumber: e.target.value})} required />
                    </div>
                    <div>
                        <label className="block text-sm font-bold">Date</label>
                        <input type="date" className="w-full border p-2 rounded" value={invoiceData.date} onChange={e => setInvoiceData({...invoiceData, date: e.target.value})} required />
                    </div>
                    <div>
                        <label className="block text-sm font-bold">Customer</label>
                        <select className="w-full border p-2 rounded" value={invoiceData.partyId} onChange={e => setInvoiceData({...invoiceData, partyId: e.target.value})} required>
                            <option value="">Select Customer</option>
                            {parties.filter(p => p.type === 'CUSTOMER').map(p => (
                                <option key={p.id} value={p.id}>{p.name}</option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="mb-6">
                    <table className="min-w-full border">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="p-2 border">Item</th>
                                <th className="p-2 border w-24">Qty</th>
                                <th className="p-2 border w-32">Rate</th>
                                <th className="p-2 border w-24">Tax %</th>
                                <th className="p-2 border w-32">Total</th>
                                <th className="p-2 border w-16">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {lineItems.map((row, index) => (
                                <tr key={index}>
                                    <td className="p-2 border">
                                        <select className="w-full p-1" value={row.itemId} onChange={e => handleItemChange(index, 'itemId', e.target.value)} required>
                                            <option value="">Select Item</option>
                                            {items.map(item => (
                                                <option key={item.id} value={item.id}>{item.name}</option>
                                            ))}
                                        </select>
                                    </td>
                                    <td className="p-2 border">
                                        <input type="number" className="w-full p-1" value={row.quantity} onChange={e => handleItemChange(index, 'quantity', e.target.value)} min="1" required />
                                    </td>
                                    <td className="p-2 border text-right">{row.rate}</td>
                                    <td className="p-2 border text-right">{row.taxRate}%</td>
                                    <td className="p-2 border text-right font-bold">{row.total.toFixed(2)}</td>
                                    <td className="p-2 border text-center">
                                        <button type="button" onClick={() => removeRow(index)} className="text-red-600">X</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <button type="button" onClick={addItemRow} className="mt-2 text-blue-600 font-bold">+ Add Item</button>
                </div>

                <div className="flex justify-end gap-4 items-center">
                    <div className="text-xl font-bold">Grand Total: ₹{calculateGrandTotal()}</div>
                    <button type="submit" className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700">Save Invoice</button>
                </div>
            </form>
        </div>
    );
};

export default CreateInvoice;
