import React from 'react';

function QuoteTable({ items, onRemoveItem, onUpdateItem, isReadOnly, globalNoSc, globalNoVat }) {
    
    const handleUpdate = (index, field, value) => {
        const numericFields = ['quantity', 'priceMXN', 'priceUSD'];
        if (numericFields.includes(field)) {
            let isValidFormat = false;
            if (field === 'quantity') {
                isValidFormat = /^[0-9]*$/.test(value);
            } else {
                isValidFormat = /^[0-9]*\.?[0-9]*$/.test(value);
            }

            if (!isValidFormat) {
                return; // Reject invalid format
            }

            // If the value is empty or just a decimal point, it's valid so far
            if (value === '' || value === '.') {
                onUpdateItem(index, field, value);
                return;
            }

            const numericValue = parseFloat(value);

            // Check against max values
            if (field === 'quantity' && numericValue > 999) {
                return; // Reject if over max
            }

            if ((field === 'priceMXN' || field === 'priceUSD')) {
                if (numericValue >= 10000000) { 
                    return; // Reject if over max
                }
                const parts = value.split('.');
                if (parts.length > 1 && parts[1].length > 2) {
                    return; // Reject if more than 2 decimal places
                }
            }

            onUpdateItem(index, field, value);
        } else if (field === 'scPercentage' || field === 'vatPercentage') {
            // Handle percentage fields
            if (!/^[0-9]*\.?[0-9]*$/.test(value)) {
                return; // Reject invalid format
            }
            if (value === '' || value === '.') {
                onUpdateItem(index, field, 0); // Pass 0 if empty
                return;
            }
            const numericValue = parseFloat(value);
            if (numericValue > 100) return; // Max 100%

            onUpdateItem(index, field, numericValue / 100);
        } else {
            onUpdateItem(index, field, value);
        }
    };

    return (
        <div className="mt-6 bg-white rounded-lg shadow">
            <div className="p-4 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-dark-gray">Generated Quote</h2>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left text-gray-500">
                    <thead className="text-xs text-black font-semibold uppercase bg-gray-100">
                        <tr>
                            <th className="px-4 py-3" scope="col">Description</th>
                            <th className="px-4 py-3" scope="col">Quantity</th>
                            <th className="px-4 py-3" scope="col">Price (MXN)</th>
                            <th className="px-4 py-3" scope="col">Price (USD)</th>
                            <th className="px-4 py-3" scope="col">Cost (USD)</th>
                            <th className="px-10 py-3" scope="col">Sc%</th>
                            <th className="px-4 py-3" scope="col">S. Charge</th>
                            <th className="px-10 py-3" scope="col">VAT%</th>
                            <th className="px-4 py-3" scope="col">VAT</th>
                            <th className="px-4 py-3" scope="col">Total</th>
                            <th className="px-4 py-3" scope="col">Delete</th>
                        </tr>
                    </thead>
                    <tbody>
                        {items.length === 0 ? (
                            <tr>
                                <td colSpan="11" className="text-center py-5 text-gray-500">
                                    There are no items in the quote. Add a service to begin.
                                </td>
                            </tr>
                        ) : (
                            items.map((item, index) => (
                                <tr key={index} className="bg-white border-b hover:bg-gray-50 ">
                                    <td className="px-4 py-2">
                                        <input
                                            type="text"
                                            id="description"
                                            name="description"
                                            value={item.description}
                                            onChange={(e) => handleUpdate(index, 'description', e.target.value)}
                                            disabled={isReadOnly}
                                            className="w-full bg-transparent border-none focus:ring-0 p-1 disabled:cursor-not-allowed"
                                        />
                                    </td>
                                    <td className="px-4 py-2">
                                        <input
                                            type="text"
                                            inputMode="numeric"
                                            id="quantity"
                                            name="quantity"
                                            value={item.quantity}
                                            onChange={(e) => handleUpdate(index, 'quantity', e.target.value)}
                                            disabled={isReadOnly}
                                            className="w-20 bg-gray-50 border border-gray-300 rounded-md p-1 text-center focus:ring-sky-500 focus:border-sky-500 disabled:cursor-not-allowed"
                                        />
                                    </td>
                                    <td className="px-4 py-2">
                                        <input
                                            type="text"
                                            inputMode="decimal"
                                            id="priceMXN"
                                            name="priceMXN"
                                            value={item.priceMXN}
                                            onChange={(e) => handleUpdate(index, 'priceMXN', e.target.value)}
                                            disabled={isReadOnly}
                                            className="w-20 bg-gray-50 border border-gray-300 rounded-md p-1 text-center focus:ring-sky-500 focus:border-sky-500 disabled:cursor-not-allowed"
                                        
                                        />
                                    </td>
                                    <td className="px-4 py-2">
                                        <input
                                            type="text"
                                            inputMode="decimal"
                                            id="priceUSD"
                                            name="priceUSD"
                                            value={item.priceUSD}
                                            onChange={(e) => handleUpdate(index, 'priceUSD', e.target.value)}
                                            disabled={isReadOnly}
                                            className="w-20 bg-gray-50 border border-gray-300 rounded-md p-1 text-center focus:ring-sky-500 focus:border-sky-500 disabled:cursor-not-allowed"
                                        />
                                        
                                    </td>
                                    <td className="px-4 py-2 font-medium text-gray-900">
                                        {((item.quantity || 0) * (item.priceUSD || 0)).toFixed(2)}
                                    </td>
                                    <td className="px-4 py-2">
                                        <input
                                            type="text"
                                            inputMode="decimal"
                                            id="scPercentage"
                                            name="scPercentage"
                                            value={
                                                item.scPercentage !== undefined
                                                    ? parseFloat((item.scPercentage * 100).toPrecision(12)).toString()
                                                    : ''
                                            }
                                            onChange={(e) => handleUpdate(index, 'scPercentage', e.target.value)}
                                            disabled={isReadOnly || globalNoSc}
                                            className="w-20 bg-gray-50 border border-gray-300 rounded-md p-1 text-center focus:ring-sky-500 focus:border-sky-500 disabled:cursor-not-allowed disabled:bg-gray-200"
                                        />
                                    </td>
                                     <td className="px-4 py-2 font-medium text-gray-900">
                                        {((item.priceUSD || 0) * (item.quantity || 0) * (item.scPercentage || 0)).toFixed(2)}
                                    </td>
                                     <td className="px-4 py-2">
                                        <input
                                            type="text"
                                            inputMode="decimal"
                                            id="vatPercentage"
                                            name="vatPercentage"
                                            value={
                                                item.vatPercentage !== undefined
                                                    ? parseFloat((item.vatPercentage * 100).toPrecision(12)).toString()
                                                    : ''
                                            }
                                            onChange={(e) => handleUpdate(index, 'vatPercentage', e.target.value)}
                                            disabled={isReadOnly || globalNoVat}
                                            className="w-20 bg-gray-50 border border-gray-300 rounded-md p-1 text-center focus:ring-sky-500 focus:border-sky-500 disabled:cursor-not-allowed disabled:bg-gray-200"
                                        />
                                    </td>
                                    <td className="px-4 py-2 font-medium text-gray-900">
                                        {((item.priceUSD || 0) * (item.quantity || 0) * (item.scPercentage || 0) * (item.vatPercentage || 0)).toFixed(2)}
                                    </td>
                                    <td className="px-4 py-2 font-medium text-gray-900">
                                        {(parseFloat(item.total) || 0).toFixed(2)}
                                    </td>
                                    <td className="px-4 py-2">
                                        <button
                                            onClick={() => onRemoveItem(index)}
                                            className="btn-trashcan block disabled:cursor-not-allowed"
                                            disabled={isReadOnly}
                                            
                                        >
                                            <span className="material-icons">delete</span>
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default QuoteTable;
