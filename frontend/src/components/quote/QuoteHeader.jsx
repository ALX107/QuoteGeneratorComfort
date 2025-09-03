import React from 'react';
import RAFLogo from '../../assets/RafLogo.png';

function QuoteHeader() {
    return (
        <header className="flex items-center justify-between bg-white shadow-md rounded-lg px-8 py-4 mb-6">

            {/* Izquierda */}
            <div className="flex items-center space-x-4">
                <button className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 transition">
                    Save Quote
                </button>
                <button className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 transition">
                    Export to PDF
                </button>
            </div>

            {/* Centro */}
            <div className="flex-1 flex justify-center">
                <img
                    alt="RAF International Ground Support Logo"
                    src={RAFLogo}
                    className="h-12 w-auto object-contain" 
                />
            </div>

            {/* Derecha */}
            <div>
                <button className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 transition">
                    Clear Quote
                </button>
            </div>
        </header>
    );
}


export default QuoteHeader;
