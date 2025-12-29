import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchItems, createItem } from '../features/inventory/itemSlice';

const Items = () => {
    const dispatch = useDispatch();
    const { items, loading } = useSelector((state) => state.item);
    const { activeCompany } = useSelector((state) => state.company);
    
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({ 
        name: '', code: '', type: 'PRODUCT', unit: 'Nos', 
        taxRate: 0, sellingPrice: 0, purchasePrice: 0, hsnCode: '' 
    });

    useEffect(() => {
        if (activeCompany) {
            dispatch(fetchItems(activeCompany.id));
        }
    }, [dispatch, activeCompany]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if(!activeCompany) return alert("No active company selected");
        
        await dispatch(createItem({ itemData: formData, companyId: activeCompany.id }));
        setShowModal(false);
        setFormData({ name: '', code: '', type: 'PRODUCT', unit: 'Nos', taxRate: 0, sellingPrice: 0, purchasePrice: 0, hsnCode: '' });
    };

    if (!activeCompany) return <div className="p-4">Please select a company from Dashboard first.</div>;

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">Item Master (Products & Services)</h1>
                <button 
                  onClick={() => setShowModal(true)} 
                  className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
                >
                  + Add Item
                </button>
            </div>

            {loading && <p>Loading items...</p>}

            <div className="overflow-x-auto bg-white rounded shadow">
                <table className="min-w-full">
                    <thead className="bg-gray-100 border-b">
                        <tr>
                            <th className="p-4 text-left">SKU/Code</th>
                            <th className="p-4 text-left">Name</th>
                            <th className="p-4 text-left">Type</th>
                            <th className="p-4 text-right">Tax %</th>
                            <th className="p-4 text-right">Selling Price</th>
                            <th className="p-4 text-right">Stock</th>
                        </tr>
                    </thead>
                    <tbody>
                        {items.map((item) => (
                            <tr key={item.id} className="border-b hover:bg-gray-50">
                                <td className="p-4">{item.code}</td>
                                <td className="p-4 font-medium">{item.name}</td>
                                <td className="p-4"><span className="text-xs bg-gray-200 px-2 py-1 rounded">{item.type}</span></td>
                                <td className="p-4 text-right">{item.taxRate}%</td>
                                <td className="p-4 text-right">₹{item.sellingPrice}</td>
                                <td className="p-4 text-right">{item.currentStock} {item.unit}</td>
                            </tr>
                        ))}
                         {items.length === 0 && (
                            <tr><td colSpan="6" className="p-4 text-center text-gray-500">No items found.</td></tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <div className="bg-white p-6 rounded w-[40rem] max-h-[90vh] overflow-y-auto">
                        <h2 className="text-xl font-bold mb-4">Add Item</h2>
                        <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
                            <div className="col-span-2">
                                <label className="block text-sm">Item Name</label>
                                <input className="w-full border p-2 rounded" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required/>
                            </div>
                            <div>
                                <label className="block text-sm">Item Code / SKU</label>
                                <input className="w-full border p-2 rounded" value={formData.code} onChange={e => setFormData({...formData, code: e.target.value})} />
                            </div>
                            <div>
                                <label className="block text-sm">Type</label>
                                <select className="w-full border p-2 rounded" value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})}>
                                    <option value="PRODUCT">Product</option>
                                    <option value="SERVICE">Service</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm">Unit</label>
                                <input className="w-full border p-2 rounded" value={formData.unit} onChange={e => setFormData({...formData, unit: e.target.value})} placeholder="e.g. Nos, Kg"/>
                            </div>
                            <div>
                                <label className="block text-sm">HSN/SAC Code</label>
                                <input className="w-full border p-2 rounded" value={formData.hsnCode} onChange={e => setFormData({...formData, hsnCode: e.target.value})} />
                            </div>
                            <div>
                                <label className="block text-sm">Tax Rate (%)</label>
                                <select className="w-full border p-2 rounded" value={formData.taxRate} onChange={e => setFormData({...formData, taxRate: Number(e.target.value)})}>
                                    <option value="0">0%</option>
                                    <option value="5">5%</option>
                                    <option value="12">12%</option>
                                    <option value="18">18%</option>
                                    <option value="28">28%</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm">Selling Price</label>
                                <input type="number" className="w-full border p-2 rounded" value={formData.sellingPrice} onChange={e => setFormData({...formData, sellingPrice: e.target.value})} required/>
                            </div>
                            <div className="col-span-2 flex justify-end gap-2 mt-4">
                                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 text-gray-600">Cancel</button>
                                <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded">Create</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Items;
