import React from 'react';

function QuoteTable({ items, onRemoveItem, onUpdateItem }) {

    const handleUpdate = (index, field, value) => {
        // For numeric fields, ensure the value is a non-negative number
        const numericValue = (field === 'quantity' || field === 'price') ? Math.max(0, parseFloat(value)) : value;
        onUpdateItem(index, field, numericValue);
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
                            <th className="px-4 py-3 w-1/3" scope="col">Description</th>
                            <th className="px-4 py-3" scope="col">Quantity</th>
                            <th className="px-4 py-3" scope="col">Price (MXN)</th>
                            <th className="px-4 py-3" scope="col">Total (MXN)</th>
                            <th className="px-4 py-3" scope="col">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {items.length === 0 ? (
                            <tr>
                                <td colSpan="5" className="text-center py-10 text-gray-500">
                                    There are no items in the quote. Add a service to begin.
                                </td>
                            </tr>
                        ) : (
                            items.map((item, index) => (
                                <tr key={index} className="bg-white border-b hover:bg-gray-50">
                                    <td className="px-4 py-2">
                                        <input
                                            type="text"
                                            value={item.description}
                                            onChange={(e) => handleUpdate(index, 'description', e.target.value)}
                                            className="w-full bg-transparent border-none focus:ring-0 p-1"
                                        />
                                    </td>
                                    <td className="px-4 py-2">
                                        <input
                                            type="number"
                                            value={item.quantity}
                                            onChange={(e) => handleUpdate(index, 'quantity', e.target.value)}
                                            className="w-20 bg-gray-50 border border-gray-300 rounded-md p-1 text-center focus:ring-sky-500 focus:border-sky-500"
                                        />
                                    </td>
                                    <td className="px-4 py-2">
                                        <input
                                            type="number"
                                            value={item.price}
                                            onChange={(e) => handleUpdate(index, 'price', e.target.value)}
                                            className="w-24 bg-gray-50 border border-gray-300 rounded-md p-1 text-right focus:ring-sky-500 focus:border-sky-500"
                                        />
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
