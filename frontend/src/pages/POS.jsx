import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchItems } from '../features/inventory/itemSlice';
import { createInvoice } from '../features/sales/salesSlice';
import { fetchParties } from '../features/party/partySlice';

const POS = () => {
    const dispatch = useDispatch();
    const { items, loading: itemsLoading } = useSelector((state) => state.item);
    const { activeCompany } = useSelector((state) => state.company);
    const { parties } = useSelector((state) => state.party);
    
    const [cart, setCart] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedPartyId, setSelectedPartyId] = useState('');
    const [paymentMode, setPaymentMode] = useState('Cash');
    const [amountReceived, setAmountReceived] = useState('');
    
    // Discount State
    const [discountValue, setDiscountValue] = useState(0);
    const [discountType, setDiscountType] = useState('FIXED'); // FIXED or PERCENTAGE

    useEffect(() => {
        if (activeCompany?.id) {
            dispatch(fetchItems(activeCompany.id));
            dispatch(fetchParties(activeCompany.id));
        }
    }, [dispatch, activeCompany]);

    const filteredItems = items.filter(item => 
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        (item.code && item.code.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    const addToCart = (item) => {
        setCart(prev => {
            const existing = prev.find(i => i.id === item.id);
            if (existing) {
                return prev.map(i => i.id === item.id ? { ...i, qty: i.qty + 1 } : i);
            }
            return [...prev, { 
                ...item, 
                qty: 1,
                price: item.sellingPrice || 0, // CORRECT PRICE MAPPING
                taxRate: item.taxRate || 0
            }];
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

    // CALCULATIONS
    const calculateTotals = () => {
        let subtotal = 0;
        let totalTax = 0;

        cart.forEach(item => {
            const itemTotal = item.price * item.qty;
            const taxAmount = (itemTotal * item.taxRate) / 100;
            
            subtotal += itemTotal;
            totalTax += taxAmount;
        });

        let discountAmount = 0;
        if (discountType === 'FIXED') {
            discountAmount = parseFloat(discountValue) || 0;
        } else {
            discountAmount = ((subtotal + totalTax) * (parseFloat(discountValue) || 0)) / 100;
        }

        const grandTotal = (subtotal + totalTax) - discountAmount;
        return { subtotal, totalTax, discountAmount, grandTotal };
    };

    const { subtotal, totalTax, discountAmount, grandTotal } = calculateTotals();

    const handleSaveBill = async () => {
        if (cart.length === 0) {
            alert("Cart is empty!");
            return;
        }
        if (!activeCompany?.id) {
            alert("No Active Company Selected!");
            return;
        }
        if (!selectedPartyId) {
            alert("Please select a Customer (Party)!");
            return;
        }

        const invoiceData = {
            partyId: selectedPartyId, // Include Party ID
            date: new Date().toISOString().split('T')[0],
            invoiceNumber: `INV-${Date.now()}`, // Simple auto-gen for now
            items: cart.map(item => ({
                itemId: item.id,
                quantity: item.qty // Backend expects 'quantity', not 'qty' in Request DTO? Let's check DTO. 
                                   // InvoiceItemRequest has 'itemId' and 'quantity'.
            })),
            // Backend calculates amounts, but we might want to send overrides if supported. 
            // For now, relying on backend calculation logic based on MVP service code viewed.
            // Wait, previous code sent everything. The backend createInvoice uses item IDs to fetch prices.
            // But let's check InvoiceRequest DTO again. It has list of InvoiceItemRequest { itemId, quantity }. 
            // It does NOT take price/amount from frontend override in the viewed DTO.
            paymentMode,
            amountReceived: parseFloat(amountReceived) || 0
        };

        try {
            await dispatch(createInvoice({ invoiceData, companyId: activeCompany.id })).unwrap();
            alert(`Bill Saved! Total: ₹${grandTotal.toFixed(2)}`);
            setCart([]);
            setSelectedPartyId('');
            setAmountReceived('');
            setDiscountValue(0);
            // Refresh Inventory
            dispatch(fetchItems(activeCompany.id));
        } catch (err) {
            console.error("Save Error:", err);
            const errMsg = typeof err === 'string' ? err : (err.message || JSON.stringify(err));
            alert("Failed to save bill: " + errMsg);
        }
    };

    return (
        <div className="h-screen flex flex-col bg-gray-100">
            {/* Header */}
            <div className="h-14 bg-white border-b flex items-center justify-between px-4 shadow-sm">
                <div className="flex items-center space-x-4">
                     <Link to="/dashboard" className="text-gray-600 hover:text-gray-900 font-medium">← Back</Link>
                     <h1 className="text-xl font-bold text-gray-800">POS Terminal {activeCompany ? `- ${activeCompany.name}` : ''}</h1>
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
                        {itemsLoading ? <p className="col-span-3 text-center text-gray-500">Loading Items...</p> : 
                            filteredItems.map(item => (
                            <button 
                                key={item.id} 
                                onClick={() => addToCart(item)}
                                className="h-24 flex flex-col items-center justify-center p-2 border rounded hover:bg-blue-50 hover:border-blue-300 transition-colors shadow-sm"
                            >
                                <span className="font-bold text-gray-800 text-center line-clamp-2">{item.name}</span>
                                <span className="text-sm text-gray-500">{item.code || '-'}</span>
                                <div className="flex gap-1 text-xs mt-1">
                                    <span className="text-green-600 font-bold">₹{item.sellingPrice}</span>
                                    {item.taxRate > 0 && <span className="text-gray-400">+{item.taxRate}% GST</span>}
                                </div>
                            </button>
                        ))}
                        {!itemsLoading && filteredItems.length === 0 && (
                            <div className="col-span-3 text-center text-gray-400 mt-10">
                                No items found. Add items to Inventory first.
                            </div>
                        )}
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
                        <select 
                            className="w-full p-2 border rounded"
                            value={selectedPartyId}
                            onChange={(e) => setSelectedPartyId(e.target.value)}
                        >
                            <option value="">Select Customer</option>
                            {parties.map(party => (
                                <option key={party.id} value={party.id}>{party.name}</option>
                            ))}
                        </select>
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
                                    <th className="p-2 font-medium text-right">GST</th>
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
                                        <td className="p-2 text-right text-xs text-gray-500">
                                            {item.taxRate}%<br/>
                                            (₹{((item.price * item.qty * item.taxRate)/100).toFixed(2)})
                                        </td>
                                        <td className="p-2 text-right font-medium">₹{(item.price * item.qty).toFixed(2)}</td>
                                        <td className="p-2 text-center">
                                            <button onClick={() => removeFromCart(item.id)} className="text-red-500 hover:text-red-700">✖</button>
                                        </td>
                                    </tr>
                                ))}
                                {cart.length === 0 && (
                                    <tr>
                                        <td colSpan="7" className="p-8 text-center text-gray-400">
                                            Cart is empty. Add items to start billing.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                         </table>
                    </div>

                    {/* Footer Summary */}
                    <div className="bg-white border-t p-4 z-10 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)]">
                        <div className="flex justify-between items-start mb-4 p-4 bg-blue-50 rounded border border-blue-100">
                            <div className="flex-1">
                                <div className="text-sm text-gray-600 flex justify-between mb-1">
                                    <span>Subtotal:</span>
                                    <span>₹ {subtotal.toFixed(2)}</span>
                                </div>
                                <div className="text-sm text-gray-600 flex justify-between mb-1">
                                    <span>Total GST:</span>
                                    <span>₹ {totalTax.toFixed(2)}</span>
                                </div>
                                <div className="text-sm text-red-600 flex justify-between mb-2 border-b border-blue-200 pb-2">
                                    <span>Discount:</span>
                                    <span>- ₹ {discountAmount.toFixed(2)}</span>
                                </div>
                                <div className="text-2xl font-bold text-blue-800 flex justify-between">
                                    <span>Grand Total:</span>
                                    <span>₹ {grandTotal.toFixed(2)}</span>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 mb-4">
                            {/* Discount Controls */}
                            <div className="col-span-2 grid grid-cols-2 gap-4 bg-gray-50 p-2 rounded border border-gray-100 mb-2">
                                <div>
                                    <label className="block text-xs font-medium text-gray-500 mb-1">Discount Type</label>
                                    <select 
                                        className="w-full p-2 border rounded bg-white text-sm"
                                        value={discountType}
                                        onChange={(e) => setDiscountType(e.target.value)}
                                    >
                                        <option value="FIXED">Flat Amount (₹)</option>
                                        <option value="PERCENTAGE">Percentage (%)</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-gray-500 mb-1">Discount Value</label>
                                    <input 
                                        type="number" 
                                        className="w-full p-2 border rounded text-sm" 
                                        placeholder="0" 
                                        value={discountValue}
                                        onChange={(e) => setDiscountValue(e.target.value)}
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-medium text-gray-500 mb-1">Payment Mode</label>
                                <select 
                                    className="w-full p-2 border rounded bg-white"
                                    value={paymentMode}
                                    onChange={(e) => setPaymentMode(e.target.value)}
                                >
                                    <option>Cash</option>
                                    <option>Card</option>
                                    <option>UPI</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-gray-500 mb-1">Amount Received</label>
                                <input 
                                    type="number" 
                                    className="w-full p-2 border rounded" 
                                    placeholder="0.00" 
                                    value={amountReceived}
                                    onChange={(e) => setAmountReceived(e.target.value)}
                                />
                            </div>
                        </div>

                        <button 
                            onClick={handleSaveBill}
                            className="w-full bg-green-500 hover:bg-green-600 text-white py-3 rounded font-bold text-lg shadow-sm transition-colors"
                        >
                            Save & Print Bill [Ctrl+P]
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default POS;
