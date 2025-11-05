import React, { useState } from 'react';

function HistoricTable({ quotes, onPreviewQuote }) {
    const [sortConfig, setSortConfig] = useState({ key: 'numero_referencia', direction: 'descending' });

    const sortedQuotes = React.useMemo(() => {
        let sortableItems = [...quotes];
        if (sortConfig !== null) {
            sortableItems.sort((a, b) => {
                let valA = a[sortConfig.key];
                let valB = b[sortConfig.key];

                if (sortConfig.key === 'numero_referencia') {
                    valA = parseInt(valA, 10);
                    valB = parseInt(valB, 10);
                } else if (sortConfig.key === 'fecha_cotizacion' || sortConfig.key === 'fecha_llegada') {
                    valA = new Date(valA);
                    valB = new Date(valB);
                } else if (sortConfig.key === 'total_final' || sortConfig.key === 'exchange_rate') {
                    valA = parseFloat(valA);
                    valB = parseFloat(valB);
                }

                if (valA < valB) {
                    return sortConfig.direction === 'ascending' ? -1 : 1;
                }
                if (valA > valB) {
                    return sortConfig.direction === 'ascending' ? 1 : -1;
                }
                return 0;
            });
        }
        return sortableItems;
    }, [quotes, sortConfig]);

    const requestSort = (key) => {
        let direction = 'ascending';
        if (sortConfig.key === key && sortConfig.direction === 'ascending') {
            direction = 'descending';
        }
        setSortConfig({ key, direction });
    };

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
                <table className="w-full text-sm text-center text-gray-500">
                    <thead className="text-xs text-black font-semibold uppercase bg-gray-100">
                        <tr>
                            <th className="px-6 py-3" scope="col">J/S</th>
                            <th className="px-6 py-3 cursor-pointer" scope="col" onClick={() => requestSort('numero_referencia')}>
                                #Quote
                                {sortConfig.key === 'numero_referencia' ? (sortConfig.direction === 'ascending' ? ' \u25B4' : ' \u25BE') : null}
                            </th>
                            <th className="px-6 py-3 cursor-pointer" scope="col" onClick={() => requestSort('nombre_cat_operacion')}>
                                Type of Quote
                                {sortConfig.key === 'nombre_cat_operacion' ? (sortConfig.direction === 'ascending' ? ' \u25B4' : ' \u25BE') : null}
                            </th>
                            <th className="px-6 py-3 cursor-pointer" scope="col" onClick={() => requestSort('fecha_cotizacion')}>
                                Date
                                {sortConfig.key === 'fecha_cotizacion' ? (sortConfig.direction === 'ascending' ? ' \u25B4' : ' \u25BE') : null}
                            </th>
                            <th className="px-6 py-3 cursor-pointer" scope="col" onClick={() => requestSort('icao_aeropuerto')}>
                                Station
                                {sortConfig.key === 'icao_aeropuerto' ? (sortConfig.direction === 'ascending' ? ' \u25B4' : ' \u25BE') : null}
                            </th>
                            <th className="px-6 py-3 cursor-pointer" scope="col" onClick={() => requestSort('matricula_aeronave')}>
                                Aircraft
                                {sortConfig.key === 'matricula_aeronave' ? (sortConfig.direction === 'ascending' ? ' \u25B4' : ' \u25BE') : null}
                            </th>
                            <th className="px-6 py-3 cursor-pointer" scope="col" onClick={() => requestSort('fecha_llegada')}>
                                Operation Date
                                {sortConfig.key === 'fecha_llegada' ? (sortConfig.direction === 'ascending' ? ' \u25B4' : ' \u25BE') : null}
                            </th>
                            <th className="px-6 py-3 cursor-pointer" scope="col" onClick={() => requestSort('nombre_cliente')}>
                                Customer
                                {sortConfig.key === 'nombre_cliente' ? (sortConfig.direction === 'ascending' ? ' \u25B4' : ' \u25BE') : null}
                            </th>
                            <th className="px-6 py-3 cursor-pointer" scope="col" onClick={() => requestSort('total_final')}>
                                Total
                                {sortConfig.key === 'total_final' ? (sortConfig.direction === 'ascending' ? ' \u25B4' : ' \u25BE') : null}
                            </th>
                            <th className="px-6 py-3 cursor-pointer" scope="col" onClick={() => requestSort('exchange_rate')}>
                                Ex Rate
                                {sortConfig.key === 'exchange_rate' ? (sortConfig.direction === 'ascending' ? ' \u25B4' : ' \u25BE') : null}
                            </th>
                            <th className="px-6 py-3" scope="col">Preview</th>
                            <th className="px-6 py-3" scope="col">Delete</th>
                        </tr>
                    </thead>
                    <tbody>
                        {sortedQuotes && sortedQuotes.length > 0 ? (
                            sortedQuotes.map((quote) => (
                                <tr key={quote.id_cotizacion} className="bg-white border-b hover:bg-gray-50">
                                    <td className='px-6 py-4'>
                                        <input type="checkbox" className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" />
                                    </td>
                                    <td className="px-6 py-4">{quote.numero_referencia}</td>
                                    <td className="px-6 py-4">{quote.nombre_cat_operacion}</td>
                                    <td className="px-6 py-4">{formatDate(quote.fecha_cotizacion)}</td>
                                    <td className="px-6 py-4">{quote.icao_aeropuerto}</td>
                                    <td className="px-6 py-4">{quote.matricula_aeronave}</td>
                                    <td className="px-6 py-4">{formatDate(quote.fecha_llegada)}</td>
                                    <td className="px-6 py-4">{quote.nombre_cliente}</td>
                                    <td className="px-6 py-4">{`${parseFloat(quote.total_final || 0).toFixed(2)}`}</td>
                                    <td className="px-6 py-4">{parseFloat(quote.exchange_rate || 0).toFixed(4)}</td>
                                    <td className="px-6 py-4">
                                        <button onClick={() => onPreviewQuote(quote)} className="text-cyan-600 hover:text-cyan-900 cursor-pointer block mx-auto">
                                            <span className="material-icons">visibility</span>
                                        </button>
                                    </td>
                                    <td className="px-6 py-4">
                                        <button className="btn-trashcan block mx-auto">
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
