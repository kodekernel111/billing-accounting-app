import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchLedgers, createLedger } from '../features/ledger/ledgerSlice';
import api from '../utils/axiosConfig'; // Direct call for groups or create thunk

const Ledgers = () => {
    const dispatch = useDispatch();
    const { ledgers, loading } = useSelector((state) => state.ledger);
    const { activeCompany } = useSelector((state) => state.company);
    
    const [showModal, setShowModal] = useState(false);
    const [groups, setGroups] = useState([]);
    const [formData, setFormData] = useState({ name: '', groupId: '' });

    useEffect(() => {
        if (activeCompany) {
            dispatch(fetchLedgers(activeCompany.id));
        }
        // Fetch groups
        api.get('/ledgers/groups').then(res => setGroups(res.data)).catch(console.error);
    }, [dispatch, activeCompany]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if(!activeCompany) return alert("No active company selected");
        
        await dispatch(createLedger({ 
            ledgerData: { 
                name: formData.name, 
                group: { id: formData.groupId },
                company: { id: activeCompany.id } // Explicitly setting, though backend handles it too
            }, 
            companyId: activeCompany.id 
        }));
        setShowModal(false);
        setFormData({ name: '', groupId: '' });
    };

    if (!activeCompany) return <div className="p-4">Please select a company from Dashboard first.</div>;

    return (
        <div>
           <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">Ledgers</h1>
                <button 
                  onClick={() => setShowModal(true)} 
                  className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
                >
                  + Add Ledger
                </button>
            </div>

            {loading && <p>Loading ledgers...</p>}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {ledgers.map((ledger) => (
                    <div key={ledger.id} className="bg-white p-4 rounded shadow border border-gray-200">
                        <h3 className="font-bold text-lg">{ledger.name}</h3>
                        <p className="text-sm text-gray-600">Group: {ledger.group?.name}</p>
                        <p className="text-sm text-gray-500 mt-2">Opening Bal: {ledger.openingBalance} {ledger.openingBalanceType}</p>
                    </div>
                ))}
            </div>

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <div className="bg-white p-6 rounded w-96">
                        <h2 className="text-xl font-bold mb-4">Add Ledger</h2>
                        <form onSubmit={handleSubmit}>
                            <div className="mb-2">
                                <label className="block text-sm">Ledger Name</label>
                                <input className="w-full border p-2 rounded" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required/>
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm">Group</label>
                                <select className="w-full border p-2 rounded" value={formData.groupId} onChange={e => setFormData({...formData, groupId: e.target.value})} required>
                                    <option value="">Select Group</option>
                                    {groups.map(g => (
                                        <option key={g.id} value={g.id}>{g.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="flex justify-end gap-2">
                                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 text-gray-600">Cancel</button>
                                <button type="submit" className="px-4 py-2 bg-purple-600 text-white rounded">Create</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Ledgers;
