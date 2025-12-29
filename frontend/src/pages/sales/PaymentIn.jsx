import React from 'react';

const PaymentIn = () => {
    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">Payment In / Receipts</h1>
                <button className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
                    + Record Payment
                </button>
            </div>
            <div className="bg-white p-8 rounded shadow text-center text-gray-500">
                <p>No payments received yet.</p>
            </div>
        </div>
    );
};

export default PaymentIn;
