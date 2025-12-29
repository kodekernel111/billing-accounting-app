import React from 'react';

const SaleReturn = () => {
    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">Sale Return / Credit Note</h1>
                <button className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700">
                    + Create Return
                </button>
            </div>
            <div className="bg-white p-8 rounded shadow text-center text-gray-500">
                <p>No returns recorded.</p>
            </div>
        </div>
    );
};

export default SaleReturn;
