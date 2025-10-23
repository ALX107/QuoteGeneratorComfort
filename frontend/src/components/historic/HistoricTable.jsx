import React from 'react';

function HistoricTable({ quotes, onPreviewQuote }) { // Recibe las cotizaciones como props
    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        if (isNaN(date)) return 'Invalid Date';
        return date.toLocaleDateString();
    };

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
                            <th className="px-6 py-3" scope="col">Preview</th>
                            <th className="px-6 py-3" scope="col">Delete</th>
                        </tr>
                    </thead>
                    <tbody>
                        {quotes && quotes.length > 0 ? (
                            quotes.map((quote) => (
                                <tr key={quote.id_cotizacion} className="bg-white border-b hover:bg-gray-50">
                                    <td className='px-6 py-4'>
                                        <input type="checkbox" className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" />
                                    </td>
                                    <td className="px-6 py-4">{quote.numero_referencia}</td>
                                    <td className="px-6 py-4">{quote.nombre_cat_operacion}</td>
                                    <td className="px-6 py-4">{formatDate(quote.fecha_cotizacion)}</td>
                                    <td className="px-6 py-4">{quote.nombre_aeropuerto}</td>
                                    <td className="px-6 py-4">{quote.matricula_aeronave}</td>
                                    <td className="px-6 py-4">{formatDate(quote.fecha_llegada)}</td>
                                    <td className="px-6 py-4">{quote.nombre_cliente}</td>
                                    <td className="px-6 py-4">{`${parseFloat(quote.total_final || 0).toFixed(2)}`}</td>
                                    <td className="px-6 py-4">{parseFloat(quote.exchange_rate || 0).toFixed(4)}</td>
                                    <td className="px-6 py-4">
                                        <button onClick={() => onPreviewQuote(quote)} className="text-cyan-600 hover:text-cyan-900 cursor-pointer">
                                            <span className="material-icons">visibility</span>
                                        </button>                                    </td>
                                    <td className="px-6 py-4">
                                        <button className="btn-trashcan">
                                            <span className="material-icons">delete</span>
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="12" className="text-center py-4">No quotes found.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default HistoricTable;
