import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchParties, createParty } from '../features/party/partySlice';

const Parties = () => {
    const dispatch = useDispatch();
    const { parties, loading } = useSelector((state) => state.party);
    const { activeCompany } = useSelector((state) => state.company);
    
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({ name: '', type: 'CUSTOMER', mobile: '', gstin: '', address: '' });

    useEffect(() => {
        if (activeCompany) {
            dispatch(fetchParties(activeCompany.id));
        }
    }, [dispatch, activeCompany]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if(!activeCompany) return alert("No active company selected");
        
        await dispatch(createParty({ partyData: formData, companyId: activeCompany.id }));
        setShowModal(false);
        setFormData({ name: '', type: 'CUSTOMER', mobile: '', gstin: '', address: '' });
    };

    if (!activeCompany) return <div className="p-4">Please select a company from Dashboard first.</div>;

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">Parties (Customers & Suppliers)</h1>
                <button 
                  onClick={() => setShowModal(true)} 
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                  + Add Party
                </button>
            </div>

            {loading && <p>Loading parties...</p>}

            <div className="overflow-x-auto bg-white rounded shadow">
                <table className="min-w-full">
                    <thead className="bg-gray-100 border-b">
                        <tr>
                            <th className="p-4 text-left">Name</th>
                            <th className="p-4 text-left">Type</th>
                            <th className="p-4 text-left">Mobile</th>
                            <th className="p-4 text-left">GSTIN</th>
                            <th className="p-4 text-left">Ledger Group</th>
                        </tr>
                    </thead>
                    <tbody>
                        {parties.map((party) => (
                            <tr key={party.id} className="border-b hover:bg-gray-50">
                                <td className="p-4 font-medium">{party.name}</td>
                                <td className="p-4">
                                    <span className={`px-2 py-1 rounded text-xs ${party.type === 'CUSTOMER' ? 'bg-green-100 text-green-800' : 'bg-orange-100 text-orange-800'}`}>
                                        {party.type}
                                    </span>
                                </td>
                                <td className="p-4">{party.mobile}</td>
                                <td className="p-4">{party.gstin}</td>
                                <td className="p-4 text-gray-500">{party.ledger?.group?.name}</td>
                            </tr>
                        ))}
                        {parties.length === 0 && (
                            <tr><td colSpan="5" className="p-4 text-center text-gray-500">No parties found.</td></tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <div className="bg-white p-6 rounded w-96">
                        <h2 className="text-xl font-bold mb-4">Add Party</h2>
                        <form onSubmit={handleSubmit}>
                            <div className="mb-2">
                                <label className="block text-sm">Party Name</label>
                                <input className="w-full border p-2 rounded" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required/>
                            </div>
                            <div className="mb-2">
                                <label className="block text-sm">Type</label>
                                <select className="w-full border p-2 rounded" value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})}>
                                    <option value="CUSTOMER">Customer</option>
                                    <option value="SUPPLIER">Supplier</option>
                                </select>
                            </div>
                            <div className="mb-2">
                                <label className="block text-sm">Mobile</label>
                                <input className="w-full border p-2 rounded" value={formData.mobile} onChange={e => setFormData({...formData, mobile: e.target.value})} />
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm">GSTIN</label>
                                <input className="w-full border p-2 rounded" value={formData.gstin} onChange={e => setFormData({...formData, gstin: e.target.value})} />
                            </div>
                            <div className="flex justify-end gap-2">
                                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 text-gray-600">Cancel</button>
                                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">Create</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Parties;
