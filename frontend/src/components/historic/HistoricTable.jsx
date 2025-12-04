import React, { useState } from 'react';

function HistoricTable({ 
    quotes, 
    onPreviewQuote, selectedQuoteIds = [], onToggleQuote, 
    onDeleteQuote, 
    showPreview = true, 
    showDelete = true 
}) {
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
                } else if (sortConfig.key === 'fecha_creacion' || sortConfig.key === 'fecha_llegada') {
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

    const formatDate = (dateString, fieldName) => {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        if (isNaN(date)) return 'Invalid Date';
        // Si es la columna de fecha de creación ('Date'), muestra también la hora.
        if (fieldName === 'fecha_creacion') {
            return date.toLocaleString(undefined, {
                year: 'numeric', month: '2-digit', day: '2-digit',
                hour: '2-digit', minute: '2-digit'
            });
        }
        return date.toLocaleDateString(); // Para otras fechas como 'Operation Date', solo muestra la fecha.
    };

    const formatOperationDate = (quote) => {
        const arrivalDate = quote.fecha_llegada ? new Date(quote.fecha_llegada).toLocaleDateString() : null;
        const departureDate = quote.fecha_salida ? new Date(quote.fecha_salida).toLocaleDateString() : null;

        if (arrivalDate && departureDate) {
            if (arrivalDate === departureDate) {
                return arrivalDate; // Si son iguales, muestra solo una.
            }
            return `${arrivalDate} - ${departureDate}`;
            //Si solo existe una de las dos fechas, la muestra.
        } else if (arrivalDate) {
            return arrivalDate;
        } else if (departureDate) {
            return departureDate;
        }
        return 'N/A';
    };

    const isJoinedQuote = (quote) => {
        return quote.total_en_palabras && quote.total_en_palabras.startsWith('JOIN OF:');
    };

    const getJoinedStations = (quote) => {
        if (!isJoinedQuote(quote)) {
            return null;
        }
        // El formato es: "JOIN OF: 123/25, 130/25 | STATIONS: MMTO, MMUN, etc"
        const stationsMatch = quote.total_en_palabras.match(/STATIONS:\s*(.+)/);
        if (stationsMatch && stationsMatch[1]) {
            return stationsMatch[1].trim();
        }
        return null;
    };

    return (
        <div className="mt-6 bg-white rounded-lg shadow">
            
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-center text-gray-500">
                    <thead className="text-xs text-black font-semibold uppercase bg-gray-100">
                        <tr>
                            <th className="px-6 py-3" scope="col">J</th>
                            <th className="px-6 py-3 cursor-pointer" scope="col" onClick={() => requestSort('numero_referencia')}>
                                #Quote
                                {sortConfig.key === 'numero_referencia' ? (sortConfig.direction === 'ascending' ? ' \u25B4' : ' \u25BE') : null}
                            </th>
                            <th className="px-6 py-3 cursor-pointer" scope="col" onClick={() => requestSort('fecha_creacion')}>
                                Date
                                {sortConfig.key === 'fecha_creacion' ? (sortConfig.direction === 'ascending' ? ' \u25B4' : ' \u25BE') : null}
                            </th>
                            <th className="px-6 py-3 cursor-pointer" scope="col" onClick={() => requestSort('nombre_cat_operacion')}>
                                Type of Quote
                                {sortConfig.key === 'nombre_cat_operacion' ? (sortConfig.direction === 'ascending' ? ' \u25B4' : ' \u25BE') : null}
                            </th>
                            <th className="px-6 py-3 cursor-pointer" scope="col" onClick={() => requestSort('icao_aeropuerto')}>
                                Station
                                {sortConfig.key === 'icao_aeropuerto' ? (sortConfig.direction === 'ascending' ? ' \u25B4' : ' \u25BE') : null}
                            </th>
                            <th className="px-6 py-3 cursor-pointer" scope="col" onClick={() => requestSort('icao_aeronave')}>
                                Aircraft
                                {sortConfig.key === 'icao_aeronave' ? (sortConfig.direction === 'ascending' ? ' \u25B4' : ' \u25BE') : null}
                            </th>
                            <th className="px-6 py-3 cursor-pointer" scope="col" onClick={() => requestSort('matricula_aeronave')}>
                                Registration
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
                            {showPreview && <th className="px-2 py-3" scope="col">View</th>}
                            {showDelete && <th className="px-2 py-3" scope="col">Delete</th>}
                        </tr>
                    </thead>
                    <tbody>
                        {sortedQuotes && sortedQuotes.length > 0 ? (
                            sortedQuotes.map((quote) => {
                                const isJoined = isJoinedQuote(quote);
                                const joinedStations = getJoinedStations(quote);
                                const displayStation = isJoined && joinedStations ? joinedStations : quote.icao_aeropuerto;

                                return (
                                    <tr
                                        key={quote.id_cotizacion}
                                        className={`border-b ${isJoined ? 'bg-blue-50 hover:bg-blue-100' : 'bg-white hover:bg-gray-50'}`}
                                    >
                                        <td className='px-6 py-4'>
                                            <input
                                                type="checkbox"
                                                className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                                checked={selectedQuoteIds.includes(quote.id_cotizacion)}
                                                onChange={() => onToggleQuote && onToggleQuote(quote.id_cotizacion)}
                                            />
                                        </td>
                                        <td className="px-6 py-4">{quote.numero_referencia}</td>
                                        <td className="px-6 py-4">{formatDate(quote.fecha_creacion, 'fecha_creacion')}</td>
                                        <td className="px-6 py-4">{quote.nombre_cat_operacion}</td>
                                        <td className="px-6 py-4 font-medium">{displayStation}</td>
                                        <td className="px-6 py-4">{quote.icao_aeronave}</td>
                                        <td className="px-6 py-4">{quote.matricula_aeronave}</td>
                                        <td className="px-6 py-4">{formatOperationDate(quote)}</td>
                                        <td className="px-6 py-4">{quote.nombre_cliente}</td>
                                        <td className="px-6 py-4">{`${parseFloat(quote.total_final || 0).toFixed(2)}`}</td>
                                        <td className="px-6 py-4">{parseFloat(quote.exchange_rate || 0).toFixed(4)}</td>                                    
                                    {showPreview && (
                                            <td className="px-6 py-4">
                                                <button onClick={() => onPreviewQuote(quote)} className="text-cyan-600 hover:text-cyan-900 cursor-pointer block mx-auto">
                                                    <span className="material-icons">visibility</span>
                                                </button>
                                            </td>
                                    )}
                                    {showDelete && (
                                            <td className="px-6 py-4">
                                                <button onClick={() => onDeleteQuote(quote.id_cotizacion)} className="btn-trashcan block mx-auto">
                                                    <span className="material-icons">delete</span>
                                                </button>
                                            </td>
                                    )}
                                    </tr>
                                );
                            })
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
