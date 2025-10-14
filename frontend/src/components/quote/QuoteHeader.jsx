import RAFLogo from '../../assets/RafLogo.png';
import RAFLogoBlanco from '../../assets/RafLogoBlanco.png';

function QuoteHeader({ onClearQuote }) {
    return (
        <header className="flex items-center justify-between bg-blue-dark shadow-md rounded-lg px-8 py-4 mb-6 border border-black">
            {/* Izquierda */}
            <div className="flex items-center space-x-4">
                <button className="btn-glass">
                    Save Quote
                </button>
                <button className="btn-glass">
                    Save as New
                </button>
                <button className="btn-glass">
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
                <button className="btn-glass" onClick={onClearQuote}>
                    Clear Quote
                </button>
            </div>
        </header>
    );
}


export default QuoteHeader;
