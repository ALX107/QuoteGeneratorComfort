import RAFLogo from '../../assets/RafLogo.png';
import RAFLogoBlanco from '../../assets/RafLogoBlanco.png';

function HistoricHeader({ onNavigateNewQuote, searchTerm, handleSearch }) {
    return (
        <header className="flex items-center justify-between bg-blue-dark shadow-md rounded-lg px-8 py-4 mb-6 border border-black">

            {/* Izquierda */}
            <div className="flex items-center space-x-3">
                <button onClick={() => onNavigateNewQuote('cotizacion')} className="btn-glass flex items-center space-x-2">
                    New
                </button>
                <button className="btn-glass flex items-center space-x-2">
                    Join
                </button>
                <button className="btn-glass flex items-center space-x-2">
                    Separate
                </button>
                <button className="btn-glass flex items-center space-x-2">
                    Export to Excel
                </button>
                <button className="btn-glass flex items-center space-x-2">
                    Filter:2025
                </button>
                <input 
                    type="text"
                    placeholder="Search..."
                    className="btn-glass flex items-center space-x-2"
                    value={searchTerm}
                    onChange={handleSearch}
                />
            </div>

            {/* Derecha */}
            <div className="flex-1 flex justify-end">
                <img
                    alt="RAF International Ground Support Logo"
                    src={RAFLogoBlanco}
                    className="h-12 w-auto object-contain" 
                />
            </div>
        </header>
    );
}
export default HistoricHeader;