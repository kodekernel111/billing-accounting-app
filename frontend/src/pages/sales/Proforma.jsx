import React, { useState } from 'react';
import { Settings, X } from 'lucide-react';
import InvoiceSidebar from '../../components/invoice/InvoiceSidebar';
import InvoicePreview from '../../components/invoice/InvoicePreview';
import InvoiceActions from '../../components/invoice/InvoiceActions';

const Proforma = () => {
    const [currentTheme, setCurrentTheme] = useState('modern');
    const [currentColor, setCurrentColor] = useState('#3b82f6');
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    // Mock Data - in a real app this would come from props or a store
    const invoiceData = {
        companyName: 'KodeKernel',
        companyPhone: '9850559600',
        customerName: 'Namra',
        invoiceNo: '2',
        date: '29/12/2025',
        total: '0.00',
        items: [
            { name: 'Zero', qty: 1, rate: 0, amount: '0.00' }
        ]
    };

    return (
        <div className="h-[calc(100vh-64px)] flex flex-col bg-gray-100 overflow-hidden">
             {/* Header */}
             <div className="h-14 bg-white border-b border-gray-200 flex items-center justify-between px-4 shrink-0">
                 <div className="flex items-center gap-4">
                     <h1 className="text-xl font-bold text-gray-800">Preview</h1>
                 </div>
                 <div className="flex items-center gap-4">
                     <button className="text-blue-600 font-medium text-sm hover:underline">Save & Close</button>
                     <button className="text-gray-500 hover:text-gray-700"><Settings size={20} /></button>
                     <button className="text-gray-500 hover:text-gray-700"><X size={20} /></button>
                 </div>
             </div>

             {/* Main Content Area */}
             <div className="flex-1 flex overflow-hidden">
                {/* Left Sidebar - Theme Selection */}
                <div className={`w-80 bg-white border-r border-gray-200 flex-shrink-0 transition-all duration-300 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full absolute z-10 h-full'}`}>
                    <InvoiceSidebar 
                        currentTheme={currentTheme}
                        onThemeChange={setCurrentTheme}
                        currentColor={currentColor}
                        onColorChange={setCurrentColor}
                    />
                </div>
                
                {/* Center - Preview */}
                <div className="flex-1 overflow-hidden relative">
                    {!isSidebarOpen && (
                        <button 
                            className="absolute top-4 left-4 bg-white p-2 rounded shadow z-10"
                            onClick={() => setIsSidebarOpen(true)}
                        >
                            Open Sidebar
                        </button>
                    )}
                    <InvoicePreview 
                        theme={currentTheme} 
                        color={currentColor} 
                        data={invoiceData}
                    />
                </div>

                {/* Right Sidebar - Actions */}
                <div className="w-80 bg-white border-l border-gray-200 flex-shrink-0 p-4 overflow-y-auto">
                    <InvoiceActions />
                    
                    {/* Add More Space or Content Here if needed */}
                    <div className="mt-8 p-4 bg-green-50 rounded-lg border border-green-100">
                        <div className="flex items-center gap-2 mb-2">
                             <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white font-bold">W</div>
                             <h4 className="font-bold text-green-800">Explore WhatsApp!</h4>
                        </div>
                        <p className="text-xs text-green-700 mb-3">Now send invoices automatically through your WhatsApp number!</p>
                        <button className="w-full bg-red-500 hover:bg-red-600 text-white font-bold py-2 rounded text-sm transition-colors">
                            Connect WhatsApp
                        </button>
                    </div>
                </div>
             </div>
        </div>
    );
};

export default Proforma;
