import React from 'react';

function HistoricTable() {
    return (
        <div className="mt-6 bg-white rounded-lg shadow">
            <div className="p-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">Historical Quotes</h2>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left text-gray-500">
                    <thead className="text-xs text-black font-semibold uppercase bg-gray-100">
                        <tr>
                            <th className="px-6 py-3" scope="col">J/S</th>
                            <th className="px-6 py-3" scope="col"># Quote</th>
                            <th className="px-6 py-3" scope="col">Type of Quote</th>
                            <th className="px-6 py-3" scope="col">Date</th>
                            <th className="px-6 py-3" scope="col">Station</th>
                            <th className="px-6 py-3" scope="col">Aircraft</th>
                            <th className="px-6 py-3" scope="col">Operation Date</th>
                            <th className="px-6 py-3" scope="col">Customer</th>
                            <th className="px-6 py-3" scope="col">Total</th>
                            <th className="px-6 py-3" scope="col">Ex Rate</th>
                            <th className="px-6 py-3" scope="col">Edit</th>
                            <th className="px-6 py-3" scope="col">Delete</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr className="bg-white border-b hover:bg-gray-50">
                            <td className='px-6 py-4'>
                                <input type="checkbox" className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" />
                            </td>
                            <td className="px-6 py-4">001</td>
                            <td className="px-6 py-4">Standard</td>
                            <td className="px-6 py-4">2024-01-15</td>
                            <td className="px-6 py-4">JFK</td>
                            <td className="px-6 py-4">B737</td>
                            <td className="px-6 py-4">2024-02-01</td>
                            <td className="px-6 py-4">Acme Corp</td>
                            <td className="px-6 py-4">$1,500.00</td>
                            <td className="px-6 py-4">1.00</td>
                            <td className="px-6 py-4">
                                <button className="text-amber-300 hover:text-amber-600">
                                    <span className="material-icons">edit</span>
                                </button>
                            </td>
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

export default HistoricTable;
