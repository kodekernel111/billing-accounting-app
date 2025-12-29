import React from 'react';
import { Maximize2 } from 'lucide-react';
import { ClassicTheme, ModernTheme, BoldTheme } from './ThemeTemplates';

const InvoicePreview = ({ theme, color, data }) => {
    const renderTheme = () => {
        switch (theme) {
            case 'classic': return <ClassicTheme data={data} color={color} />;
            case 'modern': return <ModernTheme data={data} color={color} />;
            case 'bold': return <BoldTheme data={data} color={color} />;
            default: return <ClassicTheme data={data} color={color} />;
        }
    };

    return (
        <div className="bg-gray-100 p-8 h-full overflow-hidden flex flex-col">
            <div className="flex justify-between items-center mb-4">
                <h2 className="font-bold text-gray-700 text-lg">Preview</h2>
                <div className="flex items-center gap-2">
                   <div className="flex items-center gap-2 text-sm text-gray-500 mr-4">
                        <input type="checkbox" className="rounded" />
                        <span>Do not show invoice preview again</span>
                   </div>
                   <button className="text-gray-500 hover:text-gray-800">
                       <Maximize2 size={20} />
                   </button>
                </div>
            </div>

            <div className="flex-1 overflow-auto bg-gray-200 rounded-lg p-6 flex justify-center shadow-inner">
                {/* A4 Aspect Ratio Container */}
                <div 
                    className="bg-white shadow-2xl transition-all duration-300 w-full max-w-[210mm] min-h-[297mm] aspect-[210/297] flex flex-col shrink-0"
                    style={{ transformOrigin: 'top center' }}
                >
                    {renderTheme()}
                </div>
            </div>
        </div>
    );
};

export default InvoicePreview;
