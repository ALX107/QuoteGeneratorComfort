import React from 'react';

function QuoteTable({ items, onRemoveItem, onUpdateItem }) {

    const handleUpdate = (index, field, value) => {
        const numericFields = ['quantity', 'priceMXN', 'priceUSD'];
        if (numericFields.includes(field)) {
            const MAX_VALUE = 999999999; // Set a max value to prevent errors with large numbers
            // For numeric fields, ensure the value is a non-negative number and within the limit.
            let numericValue = parseFloat(value) || 0;
            numericValue = Math.max(0, numericValue); // Ensure non-negative
            numericValue = Math.min(MAX_VALUE, numericValue); // Ensure within limit
            onUpdateItem(index, field, numericValue);
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
                            <th className="px-4 py-3" scope="col">Sc%</th>
                            <th className="px-4 py-3" scope="col">S. Charge</th>
                            <th className="px-4 py-3" scope="col">VAT%</th>
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
                                <tr key={index} className="bg-white border-b hover:bg-gray-50">
                                    <td className="px-4 py-2">
                                        <input
                                            type="text"
                                            id="description"
                                            name="description"
                                            value={item.description}
                                            onChange={(e) => handleUpdate(index, 'description', e.target.value)}
                                            className="w-full bg-transparent border-none focus:ring-0 p-1"
                                        />
                                    </td>
                                    <td className="px-4 py-2">
                                        <input
                                            type="number"
                                            id="quantity"
                                            name="quantity"
                                            value={item.quantity}
                                            onChange={(e) => handleUpdate(index, 'quantity', e.target.value)}
                                            className="w-20 bg-gray-50 border border-gray-300 rounded-md p-1 text-center focus:ring-sky-500 focus:border-sky-500"
                                        />
                                    </td>
                                    <td className="px-4 py-2">
                                        <input
                                            type="number"
                                            id="priceMXN"
                                            name="priceMXN"
                                            value={item.priceMXN}
                                            onChange={(e) => handleUpdate(index, 'priceMXN', e.target.value)}
                                            className="w-20 bg-gray-50 border border-gray-300 rounded-md p-1 text-center focus:ring-sky-500 focus:border-sky-500"
                                        />
                                    </td>
                                    <td className="px-4 py-2">
                                        <input
                                            type="number"
                                            id="priceUSD"
                                            name="priceUSD"
                                            value={item.priceUSD}
                                            onChange={(e) => handleUpdate(index, 'priceUSD', e.target.value)}
                                            className="w-24 bg-gray-50 border border-gray-300 rounded-md p-1 text-right focus:ring-sky-500 focus:border-sky-500"
                                        />
                                    </td>
                                    <td className="px-4 py-2 font-medium text-gray-900">
                                        {((item.quantity || 0) * (item.priceUSD || 0)).toFixed(2)}
                                    </td>
                                    <td className="px-4 py-2">
                                        <select
                                            id="scPercentage"
                                            name="scPercentage"
                                            value={item.scPercentage}
                                            onChange={(e) => handleUpdate(index, 'scPercentage', parseFloat(e.target.value))}
                                            className="w-20 bg-gray-50 border border-gray-300 rounded-md p-1 text-center focus:ring-sky-500 focus:border-sky-500"
                                        >
                                            <option value="0.10">10%</option>
                                            <option value="0.12">12%</option>
                                            <option value="0.15">15%</option>
                                            <option value="0.18">18%</option>
                                        </select>
                                    </td>
                                     <td className="px-4 py-2 font-medium text-gray-900">
                                        {((item.priceUSD || 0) * (item.quantity || 0) * (item.scPercentage || 0)).toFixed(2)}
                                    </td>
                                     <td className="px-4 py-2">
                                        <select
                                            id="vatPercentage"
                                            name="vatPercentage"
                                            value={item.vatPercentage}
                                            onChange={(e) => handleUpdate(index, 'vatPercentage', parseFloat(e.target.value))}
                                            className="w-20 bg-gray-50 border border-gray-300 rounded-md p-1 text-center focus:ring-sky-500 focus:border-sky-500"
                                        >
                                            <option value="0.10">10%</option>
                                            <option value="0.12">12%</option>
                                            <option value="0.15">15%</option>
                                            <option value="0.18">18%</option>
                                        </select>
                                    </td>
                                    <td className="px-4 py-2 font-medium text-gray-900">
                                        {((item.priceUSD || 0) * (item.quantity || 0) * (item.vatPercentage || 0)).toFixed(2)}
                                    </td>
                                    <td className="px-4 py-2 font-medium text-gray-900">
                                        {item.total.toFixed(2)}
                                    </td>
                                    <td className="px-4 py-2">
                                        <button
                                            onClick={() => onRemoveItem(index)}
                                            className="text-red-500 hover:text-red-700"
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
