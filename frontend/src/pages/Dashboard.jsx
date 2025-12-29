import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCompanies, createCompany, setActiveCompany } from '../features/company/companySlice';

const Dashboard = () => {
    const dispatch = useDispatch();
    const { companies, loading, activeCompany } = useSelector((state) => state.company);
    const [showModal, setShowModal] = useState(false);
    const [newCompany, setNewCompany] = useState({ name: '', address: '', gstin: '' });

    useEffect(() => {
        dispatch(fetchCompanies());
    }, [dispatch]);

    const handleCreateCompany = async (e) => {
        e.preventDefault();
        await dispatch(createCompany(newCompany));
        setShowModal(false);
        setNewCompany({ name: '', address: '', gstin: '' });
    };

    const handleSelectCompany = (company) => {
        dispatch(setActiveCompany(company));
        // You might want to save this to localStorage or fetch related FY data here
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">Dashboard</h1>
                <button 
                  onClick={() => setShowModal(true)} 
                  className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                >
                  + Add Company
                </button>
            </div>

            {loading && <p>Loading companies...</p>}

            {activeCompany && (
               <div className="bg-blue-50 border border-blue-200 p-4 rounded mb-6">
                   <h2 className="text-xl font-bold text-blue-800">Active Company: {activeCompany.name}</h2>
               </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {companies.map((company) => (
                    <div 
                        key={company.id} 
                        className={`bg-white p-6 rounded shadow cursor-pointer border-2 hover:border-blue-400 ${activeCompany?.id === company.id ? 'border-blue-500' : 'border-transparent'}`}
                        onClick={() => handleSelectCompany(company)}
                    >
                        <h3 className="text-xl font-semibold">{company.name}</h3>
                        <p className="text-gray-600">{company.address}</p>
                        <p className="text-sm text-gray-500 mt-2">GSTIN: {company.gstin}</p>
                    </div>
                ))}
            </div>

             {/* Simple Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <div className="bg-white p-6 rounded w-96">
                        <h2 className="text-xl font-bold mb-4">Add New Company</h2>
                        <form onSubmit={handleCreateCompany}>
                            <div className="mb-2">
                                <label className="block text-sm">Company Name</label>
                                <input className="w-full border p-2 rounded" value={newCompany.name} onChange={e => setNewCompany({...newCompany, name: e.target.value})} required/>
                            </div>
                            <div className="mb-2">
                                <label className="block text-sm">Address</label>
                                <input className="w-full border p-2 rounded" value={newCompany.address} onChange={e => setNewCompany({...newCompany, address: e.target.value})} required/>
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm">GSTIN</label>
                                <input className="w-full border p-2 rounded" value={newCompany.gstin} onChange={e => setNewCompany({...newCompany, gstin: e.target.value})} />
                            </div>
                            <div className="flex justify-end gap-2">
                                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 text-gray-600">Cancel</button>
                                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">create</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Dashboard;
