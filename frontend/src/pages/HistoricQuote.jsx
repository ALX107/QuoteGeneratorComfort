import { useState, useEffect } from 'react';
import HistoricHeader from '../components/historic/HistoricHeader';
import HistoricTable from '../components/historic/HistoricTable';

export default function HistoricoCotizaciones({ onNavigateNewQuote, onPreviewQuote }) {
    const [quotes, setQuotes] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetch('http://localhost:3000/api/listar/cotizaciones/historico')
            .then(response => response.json())
            .then(data => setQuotes(data))
            .catch(error => console.error('Error fetching quotes:', error));
    }, []);

    const handleSearch = (event) => {
        setSearchTerm(event.target.value);
    };

    const filteredQuotes = quotes.filter(quote => {
        const searchTermLower = searchTerm.toLowerCase();
        return (
            (quote.numero_referencia?.toLowerCase() ?? '').includes(searchTermLower) ||
            (quote.nombre_cat_operacion?.toLowerCase() ?? '').includes(searchTermLower) ||
            (quote.icao_aeropuerto?.toLowerCase() ?? '').includes(searchTermLower) ||
            (new Date(quote.fecha_cotizacion).toLocaleDateString() ?? '').includes(searchTermLower) ||
            (quote.matricula_aeronave?.toString().toLowerCase() ?? '').includes(searchTermLower) ||
            (quote.nombre_cliente?.toLowerCase() ?? '').includes(searchTermLower) ||
            (quote.exchange_rate?.toLowerCase() ?? '').includes(searchTermLower) ||
            (quote.total_final?.toLowerCase() ?? '').includes(searchTermLower)
        );
    });

    return (
        <div className="bg-blue-dark p-8">
            <div className="bg-white rounded-lg shadow-lg p-6">
                <HistoricHeader 
                    onNavigateNewQuote={onNavigateNewQuote}
                    searchTerm={searchTerm}
                    handleSearch={handleSearch}
                />
                <HistoricTable quotes={filteredQuotes} onPreviewQuote={onPreviewQuote} />
            </div>
        </div>
    );
}