import { useState, useEffect } from 'react';
import HistoricHeader from '../components/historic/HistoricHeader';
import HistoricTable from '../components/historic/HistoricTable';

export default function HistoricoCotizaciones({ onNavigateNewQuote, onPreviewQuote }) {
    const [quotes, setQuotes] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedAirport, setSelectedAirport] = useState('');
    const [selectedAircraft, setSelectedAircraft] = useState('');
    const [selectedYear, setSelectedYear] = useState('');
    const [selectedCustomer, setSelectedCustomer] = useState('');

    useEffect(() => {
        fetch('http://localhost:3000/api/listar/cotizaciones/historico')
            .then(response => response.json())
            .then(data => setQuotes(data))
            .catch(error => console.error('Error fetching quotes:', error));
    }, []);

    const handleSearch = (event) => {
        setSearchTerm(event.target.value);
    };

    const airports = [...new Set(quotes.map(quote => quote.icao_aeropuerto))].filter(Boolean);
    const aircrafts = [...new Set(quotes.map(quote => quote.matricula_aeronave))].filter(Boolean);
    const years = [...new Set(quotes.map(quote => new Date(quote.fecha_cotizacion).getFullYear()))].filter(Boolean);
    const customers = [...new Set(quotes.map(quote => quote.nombre_cliente))].filter(Boolean);

    const filteredQuotes = quotes.filter(quote => {
        const searchTermLower = searchTerm.toLowerCase();
        const quoteYear = new Date(quote.fecha_cotizacion).getFullYear();

        return (
            (selectedAirport ? quote.icao_aeropuerto === selectedAirport : true) &&
            (selectedAircraft ? quote.matricula_aeronave === selectedAircraft : true) &&
            (selectedYear ? quoteYear === selectedYear : true) &&
            (selectedCustomer ? quote.nombre_cliente === selectedCustomer : true) &&
            (
                (quote.numero_referencia?.toLowerCase() ?? '').includes(searchTermLower) ||
                (quote.nombre_cat_operacion?.toLowerCase() ?? '').includes(searchTermLower) ||
                (quote.icao_aeropuerto?.toLowerCase() ?? '').includes(searchTermLower) ||
                (new Date(quote.fecha_cotizacion).toLocaleDateString() ?? '').includes(searchTermLower) ||
                (quote.matricula_aeronave?.toString().toLowerCase() ?? '').includes(searchTermLower) ||
                (quote.nombre_cliente?.toLowerCase() ?? '').includes(searchTermLower) ||
                (quote.exchange_rate?.toLowerCase() ?? '').includes(searchTermLower) ||
                (quote.total_final?.toLowerCase() ?? '').includes(searchTermLower)
            )
        );
    });

    return (
        <div className="bg-blue-dark p-8">
            <div className="bg-white rounded-lg shadow-lg p-6">
                <HistoricHeader
                    onNavigateNewQuote={onNavigateNewQuote}
                    searchTerm={searchTerm}
                    handleSearch={handleSearch}
                    airports={airports}
                    aircrafts={aircrafts}
                    years={years}
                    customers={customers}
                    selectedAirport={selectedAirport}
                    setSelectedAirport={setSelectedAirport}
                    selectedAircraft={selectedAircraft}
                    setSelectedAircraft={setSelectedAircraft}
                    selectedYear={selectedYear}
                    setSelectedYear={setSelectedYear}
                    selectedCustomer={selectedCustomer}
                    setSelectedCustomer={setSelectedCustomer}
                />
                <HistoricTable quotes={filteredQuotes} onPreviewQuote={onPreviewQuote} />
            </div>
        </div>
    );
}