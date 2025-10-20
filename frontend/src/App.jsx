import { useState } from 'react';
import CotizacionNueva from './pages/NewQuote.jsx';
import Catalogos from './pages/Catalogos.jsx';
import HistoricoCotizaciones from './pages/HistoricQuote.jsx';
import '../index.css';
import RAFLogoBlanco from './assets/RafLogoBlanco.png';

export default function App() {
    const [currentPage, setCurrentPage] = useState('historico');

    const renderPage = () => {
        switch (currentPage) {
            case 'cotizacion':
                return <CotizacionNueva onNavigateToHistorico={() => setCurrentPage('historico')} />;
            case 'catalogos':
                return <Catalogos />;
            case 'historico':
                return <HistoricoCotizaciones onNavigateNewQuote={setCurrentPage} />;
            default:
                return <HistoricoCotizaciones />;
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Navegación */}
            <nav className="bg-sky-950 shadow-sm border-b">
                <div className="mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-12 items-center">
                        <div className="flex">
                            <div className="flex-shrink-0 flex items-center space-x-10">
                                <img
                                    alt="RAF International Ground Support Logo"
                                    src={RAFLogoBlanco}
                                    className="h-10 w-auto object-contain"
                                />
                                <h1 className="text-xl font-bold text-white">Quote Generator RAF International Ground Support</h1>
                            </div>
                        </div>
                        <div className="flex space-x-8">
                            <button
                                onClick={() => setCurrentPage('historico')}
                                className={`px-3 py-2 rounded-md text-sm font-medium ${currentPage === 'historico'
                                    ? 'bg-sky-100 text-sky-700'
                                    : 'text-gray-500 hover:text-gray-700'
                                    } cursor-pointer`}
                            >
                                Historical
                            </button>
                            <button
                                onClick={() => setCurrentPage('catalogos')}
                                className={`px-3 py-2 rounded-md text-sm font-medium ${currentPage === 'catalogos'
                                    ? 'bg-sky-100 text-sky-700'
                                    : 'text-gray-500 hover:text-gray-700'
                                    } cursor-pointer`}
                            >
                                Catalogs
                            </button>
                            <button
                                onClick={() => setCurrentPage('cotizacion')}
                                className={`px-3 py-2 rounded-md text-sm font-medium ${currentPage === 'cotizacion'
                                    ? 'bg-sky-100 text-sky-700'
                                    : 'text-gray-500 hover:text-gray-700'
                                    } cursor-pointer`}
                            >
                                New Quote
                            </button>
                        </div>
                    </div>
                </div>
            </nav>
            {/* Contenido de la página */}
            <main className="w-full">
                {renderPage()}
            </main>
        </div>
        
    );
}