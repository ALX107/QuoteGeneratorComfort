import React from 'react';

function QuoteTable() {
    return (
        <div className="mt-6 bg-white rounded-lg shadow">
            <div className="p-4 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-dark-gray">Generated Quote</h2>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left text-gray-500">
                    <thead className="text-xs text-black font-semibold uppercase bg-gray-100">
                        <tr>
                            <th className="px-6 py-3" scope="col">Description</th>
                            <th className="px-6 py-3" scope="col">#</th>
                            <th className="px-6 py-3" scope="col">MXN</th>
                            <th className="px-6 py-3" scope="col">USD</th>
                            <th className="px-6 py-3" scope="col">Cost</th>
                            <th className="px-6 py-3" scope="col">SC%</th>
                            <th className="px-6 py-3" scope="col">S. Charge</th>
                            <th className="px-6 py-3" scope="col">VAT%</th>
                            <th className="px-6 py-3" scope="col">VAT</th>
                            <th className="px-6 py-3" scope="col">Total</th>
                            <th className="px-6 py-3" scope="col">Delete</th>
                        </tr>
                    </thead>
                   <tbody>
                        <tr className="bg-white border-b hover:bg-gray-50">
                            <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">RAF Coordination Fee</td>
                            <td className="px-6 py-4">1</td>
                            <td className="px-6 py-4">3499</td>
                            <td className="px-6 py-4">184.83</td>
                            <td className="px-6 py-4">184.83</td>
                            <td className="px-6 py-4">18</td>
                            <td className="px-6 py-4">33.27</td>
                            <td className="px-6 py-4">16</td>
                            <td className="px-6 py-4">5.32</td>
                            <td className="px-6 py-4 font-bold text-gray-900">223.42</td>
                            <td className="px-6 py-4">
                                <button className="text-red-500 hover:text-red-700">
                                    <span className="material-icons">delete</span>
                                </button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default QuoteTable;
