import React from 'react';
import { Share2, Download, Printer, Mail, MessageSquare } from 'lucide-react';

const InvoiceActions = () => {
    return (
        <div className="bg-white rounded-lg shadow-sm p-4 w-full h-full">
            <h3 className="font-semibold mb-4 text-gray-700">Share Invoice</h3>
            
            <div className="grid grid-cols-2 gap-4 mb-8">
                <button className="flex flex-col items-center justify-center p-3 rounded-lg border border-gray-200 hover:bg-green-50 hover:border-green-200 transition-colors group">
                    <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center mb-2 group-hover:bg-green-200 text-green-600">
                        <MessageSquare size={20} />
                    </div>
                    <span className="text-xs font-medium text-gray-600">Whatsapp</span>
                </button>
                <button className="flex flex-col items-center justify-center p-3 rounded-lg border border-gray-200 hover:bg-red-50 hover:border-red-200 transition-colors group">
                    <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center mb-2 group-hover:bg-red-200 text-red-600">
                        <Mail size={20} />
                    </div>
                    <span className="text-xs font-medium text-gray-600">Gmail</span>
                </button>
            </div>

            <h3 className="font-semibold mb-4 text-gray-700">Actions</h3>
             <div className="space-y-3">
                <button className="w-full flex items-center p-3 rounded-lg border border-gray-200 hover:bg-blue-50 hover:border-blue-200 hover:text-blue-600 transition-colors">
                    <Download size={18} className="mr-3" />
                    <span className="text-sm font-medium">Download PDF</span>
                </button>
                <button className="w-full flex items-center p-3 rounded-lg border border-gray-200 hover:bg-blue-50 hover:border-blue-200 hover:text-blue-600 transition-colors">
                    <Printer size={18} className="mr-3" />
                    <span className="text-sm font-medium">Print (Thermal)</span>
                </button>
                 <button className="w-full flex items-center p-3 rounded-lg border border-gray-200 hover:bg-blue-50 hover:border-blue-200 hover:text-blue-600 transition-colors">
                    <Printer size={18} className="mr-3" />
                    <span className="text-sm font-medium">Print (A4)</span>
                </button>
             </div>
        </div>
    );
};

export default InvoiceActions;
