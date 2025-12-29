import React, { useState } from 'react';
import { Link } from 'react-router-dom';

// Placeholder data simulating items
const INITIAL_ITEMS = [
  { id: 1, name: 'Product A', price: 100, code: 'P001' },
  { id: 2, name: 'Product B', price: 250, code: 'P002' },
  { id: 3, name: 'Service C', price: 500, code: 'S001' },
  { id: 4, name: 'Gadget X', price: 1200, code: 'G001' },
];

const POS = () => {
    const [cart, setCart] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [customerName, setCustomerName] = useState('');

    const filteredItems = INITIAL_ITEMS.filter(item => 
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        item.code.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const addToCart = (item) => {
        setCart(prev => {
            const existing = prev.find(i => i.id === item.id);
            if (existing) {
                return prev.map(i => i.id === item.id ? { ...i, qty: i.qty + 1 } : i);
            }
            return [...prev, { ...item, qty: 1 }];
        });
    };

    const updateQty = (id, delta) => {
        setCart(prev => prev.map(item => {
            if (item.id === id) {
                const newQty = Math.max(1, item.qty + delta);
                return { ...item, qty: newQty };
            }
            return item;
        }));
    };

    const removeFromCart = (id) => {
        setCart(prev => prev.filter(item => item.id !== id));
    };

    const totalAmount = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);

    return (
        <div className="h-screen flex flex-col bg-gray-100">
            {/* Header */}
            <div className="h-14 bg-white border-b flex items-center justify-between px-4 shadow-sm">
                <div className="flex items-center space-x-4">
                     <Link to="/dashboard" className="text-gray-600 hover:text-gray-900 font-medium">← Back</Link>
                     <h1 className="text-xl font-bold text-gray-800">POS Terminal</h1>
                </div>
                <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-500">Support: +91-XXXXXXXXXX</span>
                    <button className="p-2 hover:bg-gray-100 rounded">⚙️</button>
                    <button className="p-2 hover:bg-gray-100 rounded">❌</button>
                </div>
            </div>

            <div className="flex-1 flex overflow-hidden">
                {/* Left Panel: Item Selection */}
                <div className="w-1/2 flex flex-col border-r bg-white">
                    <div className="p-2 border-b">
                         <input 
                            type="text" 
                            placeholder="Scan or search by item code, model no or item name"
                            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                         />
                    </div>
                    
                    {/* Items Grid */}
                    <div className="flex-1 p-4 grid grid-cols-3 gap-4 overflow-auto content-start">
                        {filteredItems.map(item => (
                            <button 
                                key={item.id} 
                                onClick={() => addToCart(item)}
                                className="h-24 flex flex-col items-center justify-center p-2 border rounded hover:bg-blue-50 hover:border-blue-300 transition-colors shadow-sm"
                            >
                                <span className="font-bold text-gray-800">{item.name}</span>
                                <span className="text-sm text-gray-500">{item.code}</span>
                                <span className="text-green-600 font-semibold">₹{item.price}</span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Right Panel: Transaction Billing */}
                <div className="w-1/2 flex flex-col bg-gray-50">
                    {/* Top Controls */}
                    <div className="p-2 space-y-2 bg-white border-b">
                        <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-500">{new Date().toLocaleDateString()}</span>
                            <span className="text-sm font-bold text-blue-600">New Bill [Ctrl+T]</span>
                        </div>
                        <input 
                            type="text" 
                            placeholder="Search for a customer by name, phone number [F11]"
                            className="w-full p-2 border rounded"
                            value={customerName}
                            onChange={(e) => setCustomerName(e.target.value)}
                        />
                    </div>

                    {/* Cart Table */}
                    <div className="flex-1 overflow-auto bg-white">
                         <table className="w-full text-sm text-left">
                            <thead className="bg-gray-100 text-gray-600 sticky top-0 border-b">
                                <tr>
                                    <th className="p-2 font-medium">#</th>
                                    <th className="p-2 font-medium">Item</th>
                                    <th className="p-2 font-medium text-center">Qty</th>
                                    <th className="p-2 font-medium text-right">Price</th>
                                    <th className="p-2 font-medium text-right">Total</th>
                                    <th className="p-2 font-medium text-center">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y">
                                {cart.map((item, idx) => (
                                    <tr key={item.id}>
                                        <td className="p-2 text-gray-500">{idx + 1}</td>
                                        <td className="p-2">
                                            <div className="font-medium">{item.name}</div>
                                            <div className="text-xs text-gray-400">{item.code}</div>
                                        </td>
                                        <td className="p-2 text-center">
                                            <div className="flex items-center justify-center border rounded w-fit mx-auto">
                                                <button onClick={() => updateQty(item.id, -1)} className="px-2 hover:bg-gray-100">-</button>
                                                <span className="px-2">{item.qty}</span>
                                                <button onClick={() => updateQty(item.id, 1)} className="px-2 hover:bg-gray-100">+</button>
                                            </div>
                                        </td>
                                        <td className="p-2 text-right">₹{item.price}</td>
                                        <td className="p-2 text-right font-medium">₹{item.price * item.qty}</td>
                                        <td className="p-2 text-center">
                                            <button onClick={() => removeFromCart(item.id)} className="text-red-500 hover:text-red-700">✖</button>
                                        </td>
                                    </tr>
                                ))}
                                {cart.length === 0 && (
                                    <tr>
                                        <td colSpan="6" className="p-8 text-center text-gray-400">
                                            Cart is empty. Add items to start billing.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                         </table>
                    </div>

                    {/* Footer Summary */}
                    <div className="bg-white border-t p-4 z-10 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)]">
                        <div className="flex justify-between items-center mb-4 p-4 bg-blue-50 rounded border border-blue-100">
                            <div>
                                <div className="text-2xl font-bold text-blue-800">Total ₹ {totalAmount.toFixed(2)}</div>
                                <div className="text-sm text-blue-600">Items: {cart.length}, Quantity: {cart.reduce((s,i)=>s+i.qty,0)}</div>
                            </div>
                            <button className="text-blue-600 hover:underline text-sm font-medium">Full Breakup [Ctrl+F]</button>
                        </div>

                        <div className="grid grid-cols-2 gap-4 mb-4">
                            <div>
                                <label className="block text-xs font-medium text-gray-500 mb-1">Payment Mode</label>
                                <select className="w-full p-2 border rounded bg-white">
                                    <option>Cash</option>
                                    <option>Card</option>
                                    <option>UPI</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-gray-500 mb-1">Amount Received</label>
                                <input type="number" className="w-full p-2 border rounded" placeholder="0.00" />
                            </div>
                        </div>

                        <button className="w-full bg-green-500 hover:bg-green-600 text-white py-3 rounded font-bold text-lg shadow-sm transition-colors">
                            Save & Print Bill [Ctrl+P]
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default POS;
