import { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchItems, createItem, updateItem, uploadItems } from '../features/inventory/itemSlice';

const Items = () => {
    const dispatch = useDispatch();
    const { items, loading } = useSelector((state) => state.item);
    const { activeCompany } = useSelector((state) => state.company);
    const fileInputRef = useRef(null);
    
    const [showModal, setShowModal] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editingId, setEditingId] = useState(null);

    const initialFormState = { 
        name: '', code: '', type: 'PRODUCT', unit: 'Nos', 
        taxRate: 0, sellingPrice: 0, purchasePrice: 0, hsnCode: '', currentStock: 0 
    };

    const [formData, setFormData] = useState(initialFormState);

    useEffect(() => {
        if (activeCompany) {
            dispatch(fetchItems(activeCompany.id));
        }
    }, [dispatch, activeCompany]);

    const handleEdit = (item) => {
        setFormData({
            name: item.name,
            code: item.code || '',
            type: item.type,
            unit: item.unit || '',
            taxRate: item.taxRate || 0,
            sellingPrice: item.sellingPrice || 0,
            purchasePrice: item.purchasePrice || 0,
            hsnCode: item.hsnCode || '',
            currentStock: item.currentStock || 0
        });
        setEditingId(item.id);
        setIsEditing(true);
        setShowModal(true);
    };

    const handleAddNew = () => {
        setFormData(initialFormState);
        setIsEditing(false);
        setEditingId(null);
        setShowModal(true);
    };

    const handleUploadClick = () => {
        fileInputRef.current.click();
    };

    const handleDownloadTemplate = () => {
        // Direct download via window.location or anchor tag since it's a GET request returning a file
        // But since we have auth token, we might need to use fetch/axios and create a blob URL
        // Simple way:
        const token = localStorage.getItem('token');
        fetch('http://localhost:8080/api/items/template', {
            headers: { 'Authorization': `Bearer ${token}` }
        })
        .then(response => response.blob())
        .then(blob => {
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'item_template.xlsx';
            a.click();
            window.URL.revokeObjectURL(url);
        })
        .catch(err => alert("Failed to download template"));
    };

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        if (!activeCompany) return alert("Select a company first");

        await dispatch(uploadItems({ file, companyId: activeCompany.id }));
        // Refresh items or rely on slice update
        e.target.value = null; // Reset input
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if(!activeCompany) return alert("No active company selected");
        
        if (isEditing) {
            await dispatch(updateItem({ id: editingId, itemData: formData }));
        } else {
            await dispatch(createItem({ itemData: formData, companyId: activeCompany.id }));
        }
        setShowModal(false);
        setFormData(initialFormState);
    };

    if (!activeCompany) return <div className="p-4">Please select a company from Dashboard first.</div>;

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">Item Master (Products & Services)</h1>
                <div className="flex gap-2">
                     <button 
                        onClick={handleDownloadTemplate}
                        className="text-indigo-600 hover:underline px-4 py-2 text-sm font-medium"
                    >
                        Download Template
                    </button>
                    <input 
                        type="file" 
                        ref={fileInputRef} 
                        onChange={handleFileChange} 
                        className="hidden" 
                        accept=".xlsx, .xls"
                    />
                    <button 
                        onClick={handleUploadClick}
                        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 flex items-center gap-2"
                    >
                        <span>📄</span> Import Excel
                    </button>
                    <button 
                        onClick={handleAddNew} 
                        className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
                    >
                        + Add Item
                    </button>
                </div>
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
                            <th className="p-4 text-center">Actions</th>
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
                                <td className="p-4 text-right">
                                    {item.currentStock <= 0 ? (
                                        <span className="px-2 py-1 rounded-full text-xs font-bold bg-red-100 text-red-800">
                                            Out of Stock
                                        </span>
                                    ) : item.currentStock < 10 ? (
                                        <span className="px-2 py-1 rounded-full text-xs font-bold bg-yellow-100 text-yellow-800">
                                            Low: {item.currentStock} {item.unit}
                                        </span>
                                    ) : (
                                        <span className="px-2 py-1 rounded-full text-xs font-bold bg-green-100 text-green-800">
                                            {item.currentStock} {item.unit}
                                        </span>
                                    )}
                                </td>
                                <td className="p-4 text-center">
                                    <button 
                                        onClick={() => handleEdit(item)}
                                        className="text-blue-600 hover:text-blue-800 text-sm font-semibold"
                                    >
                                        Edit
                                    </button>
                                </td>
                            </tr>
                        ))}
                         {items.length === 0 && (
                            <tr><td colSpan="7" className="p-4 text-center text-gray-500">No items found.</td></tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <div className="bg-white p-6 rounded w-[40rem] max-h-[90vh] overflow-y-auto">
                        <h2 className="text-xl font-bold mb-4">{isEditing ? 'Edit Item' : 'Add Item'}</h2>
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
                            <div>
                                <label className="block text-sm">Current Stock (Opening/Adjustment)</label>
                                <input type="number" className="w-full border p-2 rounded" value={formData.currentStock} onChange={e => setFormData({...formData, currentStock: e.target.value})}/>
                            </div>
                            <div className="col-span-2 flex justify-end gap-2 mt-4">
                                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 text-gray-600">Cancel</button>
                                <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded">{isEditing ? 'Update' : 'Create'}</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Items;
