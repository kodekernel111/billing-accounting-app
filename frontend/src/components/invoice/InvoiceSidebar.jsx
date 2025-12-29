import React, { useState } from 'react';
import { ChevronDown, ChevronRight, Layout, Palette } from 'lucide-react';

const ThemeSection = ({ title, isOpen, onToggle, children }) => (
    <div className="border-b last:border-0 border-gray-100">
        <button 
            onClick={onToggle}
            className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors text-left"
        >
            <span className="font-medium text-gray-700 text-sm">{title}</span>
            {isOpen ? <ChevronDown size={16} className="text-gray-400" /> : <ChevronRight size={16} className="text-gray-400" />}
        </button>
        {isOpen && <div className="p-2 bg-gray-50">{children}</div>}
    </div>
);

const ThemeOption = ({ name, isSelected, onClick }) => (
    <button 
        onClick={onClick}
        className={`w-full text-left p-3 rounded mb-1 text-sm transition-all ${isSelected ? 'bg-blue-100 text-blue-700 font-semibold pl-4 border-l-4 border-blue-600' : 'hover:bg-gray-200 text-gray-600'}`}
    >
        {name}
    </button>
);

const ColorOption = ({ color, isSelected, onClick }) => (
    <button 
        onClick={onClick}
        className={`w-8 h-8 rounded-md transition-all ${isSelected ? 'ring-2 ring-offset-2 ring-blue-500 scale-110' : 'hover:scale-110'}`}
        style={{ backgroundColor: color }}
    />
);

const InvoiceSidebar = ({ currentTheme, onThemeChange, currentColor, onColorChange }) => {
    const [openSections, setOpenSections] = useState({
        classic: true,
        modern: true,
        bold: false
    });

    const toggleSection = (section) => {
        setOpenSections(prev => ({ ...prev, [section]: !prev[section] }));
    };

    const colors = [
        '#3b82f6', // blue
        '#ef4444', // red
        '#10b981', // green
        '#f59e0b', // amber
        '#8b5cf6', // violet
        '#ec4899', // pink
        '#6366f1', // indigo
        '#14b8a6', // teal
        '#f97316', // orange
        '#374151', // gray
    ];

    return (
        <div className="flex flex-col h-full bg-white border-r border-gray-200 w-full">
            <div className="p-4 border-b border-gray-200">
                <h2 className="font-bold text-gray-800 flex items-center gap-2">
                    <Layout size={18} />
                    Select Theme
                </h2>
            </div>

            <div className="flex-1 overflow-y-auto">
                <ThemeSection title="Classic Themes" isOpen={openSections.classic} onToggle={() => toggleSection('classic')}>
                    <ThemeOption name="Classic Standard" isSelected={currentTheme === 'classic'} onClick={() => onThemeChange('classic')} />
                </ThemeSection>
                
                <ThemeSection title="Modern Themes" isOpen={openSections.modern} onToggle={() => toggleSection('modern')}>
                     <ThemeOption name="Modern Minimal" isSelected={currentTheme === 'modern'} onClick={() => onThemeChange('modern')} />
                </ThemeSection>

                <ThemeSection title="Bold Themes" isOpen={openSections.bold} onToggle={() => toggleSection('bold')}>
                    <ThemeOption name="Bold Impact" isSelected={currentTheme === 'bold'} onClick={() => onThemeChange('bold')} />
                </ThemeSection>
            </div>

            <div className="p-4 border-t border-gray-200">
                <h3 className="font-semibold text-sm text-gray-700 mb-3 flex items-center gap-2">
                    <Palette size={16} />
                    Select Color
                </h3>
                <div className="flex flex-wrap gap-2">
                    {colors.map(color => (
                        <ColorOption 
                            key={color} 
                            color={color} 
                            isSelected={currentColor === color} 
                            onClick={() => onColorChange(color)} 
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default InvoiceSidebar;
