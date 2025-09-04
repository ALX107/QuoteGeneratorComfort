import React from 'react';
import RAFLogo from '../../assets/RafLogo.png';

function HistoricHeader() {
    return (
        <header className="flex items-center justify-between bg-cafe-light shadow-md rounded-lg px-8 py-4 mb-6 border border-black">

            {/* Izquierda */}
            <div className="flex items-center space-x-3">
                <button className="btn-glass flex items-center space-x-2">
                    New
                </button>
                <button className="btn-glass flex items-center space-x-2">
                    Find
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
            </div>

            {/* Derecha */}
            <div className="flex-1 flex justify-end">
                <img
                    alt="RAF International Ground Support Logo"
                    src={RAFLogo}
                    className="h-12 w-auto object-contain" 
                />
            </div>
        </header>
    );
}
export default HistoricHeader;