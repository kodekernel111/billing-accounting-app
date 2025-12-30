import React from 'react';

// Common sub-components for reusability
const InvoiceHeader = ({ data, themeColor, titleStyle }) => (
  <div className="flex justify-between items-start mb-8">
    <div>
      <h1 className={`text-4xl font-bold mb-2 ${titleStyle}`} style={{ color: themeColor }}>
        {data.title || 'PROFORMA INVOICE'}
      </h1>
      <div className="text-gray-600">
        <h2 className="text-xl font-semibold text-gray-800">{data.companyName}</h2>
        <p>Ph: {data.companyPhone}</p>
      </div>
    </div>
    <div className="w-32 h-32 bg-gray-200 flex items-center justify-center text-gray-500 rounded">
      LOGO
    </div>
  </div>
);

const InvoiceDetails = ({ data, themeColor }) => (
  <div className="flex justify-between mb-8 border-t border-b py-4 border-gray-200">
     <div className="w-1/2">
        <p className="text-sm text-gray-500 mb-1">Invoice For:</p>
        <p className="font-semibold">{data.customerName}</p>
     </div>
     <div className="w-1/2 text-right">
        <div className="flex justify-end gap-x-4 mb-1">
            <span className="text-gray-500">Invoice No:</span>
            <span className="font-semibold">{data.invoiceNo}</span>
        </div>
        <div className="flex justify-end gap-x-4">
            <span className="text-gray-500">Date:</span>
            <span className="font-semibold">{data.date}</span>
        </div>
     </div>
  </div>
);

const InvoiceItems = ({ items, themeColor }) => (
  <table className="w-full mb-8">
    <thead style={{ backgroundColor: themeColor + '20' }}>
      <tr>
        <th className="p-3 text-left" style={{ color: themeColor }}>Item</th>
        <th className="p-3 text-right" style={{ color: themeColor }}>Qty</th>
        <th className="p-3 text-right" style={{ color: themeColor }}>Rate</th>
        <th className="p-3 text-right" style={{ color: themeColor }}>Amount</th>
      </tr>
    </thead>
    <tbody>
      {items.map((item, index) => (
        <tr key={index} className="border-b border-gray-100">
          <td className="p-3">{item.name}</td>
          <td className="p-3 text-right">{item.qty}</td>
          <td className="p-3 text-right">{item.rate}</td>
          <td className="p-3 text-right">{item.amount}</td>
        </tr>
      ))}
    </tbody>
  </table>
);

const InvoiceFooter = ({ total, amountInWords, themeColor }) => (
  <div className="flex flex-col">
     <div className="self-end w-1/2 mb-8">
        <div className="flex justify-between p-3 rounded" style={{ backgroundColor: themeColor, color: 'white' }}>
            <span className="font-bold">Total</span>
            <span className="font-bold">₹ {total}</span>
        </div>
     </div>
     
     <div className="mb-8">
        <p className="text-sm text-gray-500 mb-1" style={{ color: themeColor }}>Amount In Words:</p>
        <p className="italic text-gray-700">{amountInWords}</p>
     </div>

     <div className="grid grid-cols-2 gap-8 mt-auto">
        <div>
            <h4 className="font-semibold mb-2" style={{ color: themeColor }}>Terms & Conditions</h4>
            <p className="text-sm text-gray-500">Thanks for doing business with us!</p>
        </div>
        <div className="text-right mt-12">
             <p className="font-semibold text-sm">For: {data.companyName}</p>
             <div className="h-16"></div>
             <p className="font-bold">Authorized Signatory</p>
        </div>
     </div>
  </div>
);


export const ClassicTheme = ({ data, color }) => (
  <div className="p-8 bg-white h-full flex flex-col font-serif">
     <div className="border-b-2 mb-6 pb-4" style={{ borderColor: color }}>
        <h1 className="text-4xl text-center uppercase tracking-widest mb-4" style={{ color }}>Proforma Invoice</h1>
        <div className="flex justify-between items-center">
            <div className="w-24 h-24 bg-gray-100 flex items-center justify-center border text-xs">LOGO</div>
            <div className="text-right">
                <h2 className="text-2xl font-bold">{data.companyName}</h2>
                <p className="text-gray-600">Ph: {data.companyPhone}</p>
            </div>
        </div>
     </div>

     <div className="flex mb-8 border p-4 bg-gray-50">
        <div className="w-1/2 border-r pr-4">
            <p className="text-xs uppercase text-gray-500 mb-1">Bill To</p>
            <p className="font-bold text-lg">{data.customerName}</p>
        </div>
        <div className="w-1/2 pl-4 flex flex-col justify-center">
             <div className="flex justify-between mb-1">
                <span>Invoice No:</span>
                <span className="font-bold">{data.invoiceNo}</span>
             </div>
             <div className="flex justify-between">
                <span>Date:</span>
                <span className="font-bold">{data.date}</span>
             </div>
        </div>
     </div>

     <table className="w-full mb-8 border-collapse">
        <thead>
            <tr style={{ backgroundColor: color, color: 'white' }}>
                 <th className="p-2 text-left border border-white">Item</th>
                 <th className="p-2 text-right border border-white">Qty</th>
                 <th className="p-2 text-right border border-white">Price</th>
                 <th className="p-2 text-right border border-white">Total</th>
            </tr>
        </thead>
        <tbody>
            {data.items.map((item, idx) => (
                <tr key={idx} className="border-b">
                    <td className="p-2 border-r">{item.name}</td>
                    <td className="p-2 text-right border-r">{item.qty}</td>
                    <td className="p-2 text-right border-r">{item.rate}</td>
                    <td className="p-2 text-right">{item.amount}</td>
                </tr>
            ))}
        </tbody>
     </table>

     <div className="flex justify-end mb-8">
         <div className="w-1/3 border p-2">
             <div className="flex justify-between font-bold text-lg">
                 <span>Total:</span>
                 <span>₹ {data.total}</span>
             </div>
         </div>
     </div>

      <div className="mt-auto flex justify-between items-end">
         <div className="w-1/2 p-4 border text-sm">
              <p className="font-bold mb-1">Terms:</p>
              <p>1. Goods once sold will not be taken back.</p>
         </div>
         <div className="text-right">
             <p className="font-semibold text-sm mb-8">For: {data.companyName}</p>
             <p className="font-bold border-t border-gray-400 pt-1 inline-block">Authorized Signatory</p>
         </div>
      </div>
  </div>
);

export const ModernTheme = ({ data, color }) => (
  <div className="p-8 bg-white h-full flex flex-col font-sans">
    <div className="flex justify-between items-start mb-10">
        <div>
             <span className="text-white px-4 py-1 rounded-r-full text-sm font-bold uppercase tracking-wide mb-2 inline-block" style={{ backgroundColor: color }}>Proforma Invoice</span>
             <h1 className="text-3xl font-bold text-gray-800">{data.companyName}</h1>
             <p className="text-gray-500 text-sm mt-1">{data.companyPhone}</p>
        </div>
        <div className="p-4 bg-gray-50 rounded-xl">
            <div className="text-right">
                <p className="text-gray-500 text-xs uppercase">Invoice Details</p>
                <p className="font-bold text-lg">#{data.invoiceNo}</p>
                <p className="text-sm">{data.date}</p>
            </div>
        </div>
    </div>

    <div className="mb-8 p-6 rounded-xl bg-gray-50 flex justify-between items-center">
         <div>
             <p className="text-xs uppercase text-gray-400 font-bold mb-1">Invoiced To</p>
             <h2 className="text-xl font-bold text-gray-800">{data.customerName}</h2>
         </div>
         <div className="text-right">
             <p className="text-xs uppercase text-gray-400 font-bold mb-1">Total Amount</p>
             <h2 className="text-3xl font-bold" style={{ color: color }}>₹ {data.total}</h2>
         </div>
    </div>

    <div className="mb-4">
        {data.items.map((item, idx) => (
            <div key={idx} className="flex items-center justify-between p-4 mb-2 hover:bg-gray-50 rounded-lg transition-colors border-b border-gray-100 last:border-0">
                <div className="flex-1">
                    <p className="font-bold text-gray-800">{item.name}</p>
                </div>
                <div className="w-24 text-right">
                    <p className="text-gray-500 text-sm">{item.qty} x {item.rate}</p>
                </div>
                <div className="w-24 text-right">
                    <p className="font-bold text-gray-800">₹ {item.amount}</p>
                </div>
            </div>
        ))}
    </div>

    <div className="mt-auto bg-gray-900 text-white p-6 rounded-xl flex justify-between items-center">
        <div>
            <p className="text-gray-400 text-sm">Thank you for your business</p>
        </div>
         <div className="text-right">
             <p className="text-sm mb-4">For: {data.companyName}</p>
             <p className="text-xs text-gray-400 uppercase tracking-widest border-t border-gray-700 pt-1">Authorized Signatory</p>
         </div>
    </div>
  </div>
);


export const BoldTheme = ({ data, color }) => (
    <div className="bg-white h-full flex flex-col font-sans">
        <div className="text-white p-8" style={{ backgroundColor: color }}>
            <div className="flex justify-between items-end">
                <div>
                     <h1 className="text-5xl font-extrabold opacity-90">INVOICE</h1>
                     <p className="mt-2 opacity-80">#{data.invoiceNo}</p>
                </div>
                <div className="text-right">
                     <h2 className="text-2xl font-bold">{data.companyName}</h2>
                     <p className="opacity-80">{data.companyPhone}</p>
                </div>
            </div>
        </div>
        
        <div className="p-8">
            <div className="flex justify-between mb-12">
                <div>
                    <p className="text-gray-400 uppercase text-xs font-bold mb-2">Billed To</p>
                    <p className="text-2xl font-bold text-gray-800">{data.customerName}</p>
                </div>
                 <div className="text-right">
                    <p className="text-gray-400 uppercase text-xs font-bold mb-2">Date Issued</p>
                    <p className="text-lg font-medium">{data.date}</p>
                </div>
            </div>

            <table className="w-full">
                <thead className="border-b-2 border-gray-100">
                    <tr>
                        <th className="text-left py-3 text-gray-500 uppercase text-xs tracking-wider">Description</th>
                        <th className="text-right py-3 text-gray-500 uppercase text-xs tracking-wider">Qty</th>
                        <th className="text-right py-3 text-gray-500 uppercase text-xs tracking-wider">Price</th>
                        <th className="text-right py-3 text-gray-500 uppercase text-xs tracking-wider">Total</th>
                    </tr>
                </thead>
                <tbody>
                    {data.items.map((item, idx) => (
                        <tr key={idx} className="border-b border-gray-50">
                            <td className="py-4 font-medium text-gray-800">{item.name}</td>
                            <td className="py-4 text-right text-gray-600">{item.qty}</td>
                            <td className="py-4 text-right text-gray-600">{item.rate}</td>
                            <td className="py-4 text-right font-bold text-gray-800">{item.amount}</td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <div className="flex justify-end mt-8">
                 <div className="w-64">
                     <div className="flex justify-between py-2 border-b border-gray-100">
                         <span className="text-gray-600">Subtotal</span>
                         <span className="font-bold">₹ {data.total}</span>
                     </div>
                     <div className="flex justify-between py-4">
                         <span className="text-xl font-bold" style={{ color: color }}>Total</span>
                         <span className="text-xl font-bold" style={{ color: color }}>₹ {data.total}</span>
                     </div>
                 </div>
            </div>
        </div>

        <div className="mt-auto p-8 bg-gray-50 border-t border-gray-100 flex justify-between items-end">
             <p className="text-gray-500 text-sm">Thank you for your partnership</p>
             <div className="text-right">
                <p className="font-bold text-gray-800 text-sm mb-6">For: {data.companyName}</p>
                <p className="text-xs uppercase font-bold border-t border-gray-300 pt-1">Authorized Signatory</p>
             </div>
        </div>
    </div>
);
