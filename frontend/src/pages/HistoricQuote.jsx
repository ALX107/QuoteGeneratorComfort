import { useState, useEffect } from 'react';
import HistoricHeader from '../components/historic/HistoricHeader';
import HistoricTable from '../components/historic/HistoricTable';

export default function HistoricoCotizaciones() {
    const [quotes, setQuotes] = useState([]);

    useEffect(() => {
        fetch('http://localhost:3000/api/listar/cotizaciones/historico') 
            .then(response => response.json())
            .then(data => setQuotes(data))
            .catch(error => console.error('Error fetching quotes:', error));
    }, []);

    return (
        <div className="bg-blue-dark p-8">
            <div className="bg-white rounded-lg shadow-lg p-6">
                <HistoricHeader />
                <HistoricTable quotes={quotes} />
            </div>
        </div>
    );
}