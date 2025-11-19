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
    const [selectedModel, setSelectedModel] = useState('');

    useEffect(() => {
        fetch('http://localhost:3000/api/listar/cotizaciones/historico')
            .then(response => response.json())
            .then(data => setQuotes(data))
            .catch(error => console.error('Error fetching quotes:', error));
    }, []);

    const handleSearch = (event) => {
        setSearchTerm(event.target.value);
    };

    const airports = [...new Set(quotes.map(quote => quote.icao_aeropuerto))].filter(Boolean).sort();
    const aircrafts = [...new Set(quotes.map(quote => quote.matricula_aeronave))].filter(Boolean).sort();
    // FIX: Usar 'fecha_creacion' para obtener los años correctamente.
    const years = [...new Set(quotes.map(quote => new Date(quote.fecha_creacion).getFullYear()))].filter(Boolean).sort((a, b) => b - a);
    const customers = [...new Set(quotes.map(quote => quote.nombre_cliente))].filter(Boolean).sort();
    const models = [...new Set(quotes.map(quote => quote.modelo_aeronave))].filter(Boolean).sort();
    
    const filteredQuotes = quotes.filter(quote => {
        const searchTermLower = searchTerm.toLowerCase();
        // FIX: Usar 'fecha_creacion' para filtrar por año.
        const quoteYear = new Date(quote.fecha_creacion).getFullYear();
    
        // FIX: Formatear las fechas como se muestran en la tabla para que la búsqueda coincida.
        const formattedCreationDate = new Date(quote.fecha_creacion).toLocaleString(undefined, {
            year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit'
        }).toLowerCase();
    
        const arrivalDate = quote.fecha_llegada ? new Date(quote.fecha_llegada).toLocaleDateString() : null;
        const departureDate = quote.fecha_salida ? new Date(quote.fecha_salida).toLocaleDateString() : null;
        let formattedOperationDate = 'n/a';
        if (arrivalDate && departureDate) {
            formattedOperationDate = arrivalDate === departureDate ? arrivalDate : `${arrivalDate} - ${departureDate}`;
        } else if (arrivalDate) {
            formattedOperationDate = arrivalDate;
        } else if (departureDate) {
            formattedOperationDate = departureDate;
        }
    
        return (
            (selectedAirport ? quote.icao_aeropuerto === selectedAirport : true) &&
            (selectedAircraft ? quote.matricula_aeronave === selectedAircraft : true) &&
            (selectedModel ? quote.modelo_aeronave === selectedModel : true) &&
            (selectedYear ? quoteYear === selectedYear : true) &&
            (selectedCustomer ? quote.nombre_cliente === selectedCustomer : true) &&
            (
                (quote.numero_referencia?.toLowerCase() ?? '').includes(searchTermLower) ||
                (formattedCreationDate.includes(searchTermLower)) || // Búsqueda por fecha de creación
                (quote.nombre_cat_operacion?.toLowerCase() ?? '').includes(searchTermLower) ||
                (quote.icao_aeropuerto?.toLowerCase() ?? '').includes(searchTermLower) ||
                (formattedOperationDate.includes(searchTermLower)) || // Búsqueda por fecha de operación
                (quote.matricula_aeronave?.toString().toLowerCase() ?? '').includes(searchTermLower) ||
                (quote.modelo_aeronave?.toLowerCase() ?? '').includes(searchTermLower) ||
                (quote.nombre_cliente?.toLowerCase() ?? '').includes(searchTermLower) ||
                (quote.total_final?.toString().toLowerCase() ?? '').includes(searchTermLower)
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
                    models={models}
                    selectedAirport={selectedAirport}
                    setSelectedAirport={setSelectedAirport}
                    selectedAircraft={selectedAircraft}
                    setSelectedAircraft={setSelectedAircraft}
                    selectedModel={selectedModel}
                    setSelectedModel={setSelectedModel}
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