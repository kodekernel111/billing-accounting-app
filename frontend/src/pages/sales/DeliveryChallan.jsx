import React from 'react';

const DeliveryChallan = () => {
    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">Delivery Challans</h1>
                <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                    + Create Challan
                </button>
            </div>
            <div className="bg-white p-8 rounded shadow text-center text-gray-500">
                <p>No delivery challans found.</p>
            </div>
        </div>
    );
};

export default DeliveryChallan;
