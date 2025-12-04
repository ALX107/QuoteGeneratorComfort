import RAFLogo from '../../assets/RafLogo.png';
import RAFLogoBlanco from '../../assets/RafLogoBlanco.png';

function QuoteHeader({ onClearQuote, onSaveQuote, onSaveAsNew, onExportToPdf, isReadOnly, onNewQuoteBlocked }) {
    return (
        <header className="flex items-center justify-between bg-blue-dark shadow-md rounded-lg px-8 py-4 mb-6 border border-black">
            {/* Izquierda */}
            <div className="flex items-center space-x-4 ">
                <button className="btn-glass disabled:opacity-60 disabled:cursor-not-allowed" 
                        disabled={isReadOnly} // Se puede guardar si no está en modo lectura
                        onClick={onSaveQuote}>
                    Save Quote
                </button>
                <button className="btn-glass disabled:opacity-60 disabled:cursor-not-allowed"
                        disabled={onNewQuoteBlocked} // Solo activo en modo lectura (preview)
                        onClick={onSaveAsNew}>
                    Save as New
                </button>
                <button className="btn-glass disabled:opacity-60 disabled:cursor-not-allowed" 
                        onClick={onExportToPdf}
                        disabled={onNewQuoteBlocked}>
                    Export to PDF
                </button>
            </div>

            {/* Centro */}
            <div className="flex-1 flex justify-center">
                <img
                    alt="RAF International Ground Support Logo"
                    src={RAFLogoBlanco}
                    className="h-12 w-auto object-contain" 
                />
            </div>

            {/* Derecha */}
            <div>
                <button className="btn-glass disabled:opacity-60 disabled:cursor-not-allowed" 
                        disabled={isReadOnly}
                        onClick={onClearQuote}>
                    Clear Quote
                </button>
            </div>
        </header>
    );
}


export default QuoteHeader;
