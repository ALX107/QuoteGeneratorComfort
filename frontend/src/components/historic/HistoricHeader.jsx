import React from 'react';
import RAFLogo from '../../assets/RafLogo.png';

function HistoricHeader() {
    return (
        <header className="flex items-center justify-between bg-white shadow-md rounded-lg px-8 py-4 mb-6">

            {/* Izquierda */}
            <div className="flex items-center space-x-3">
                <button className="bg-sky-500 text-white px-3 py-1 rounded hover:bg-sky-700 transition">
                    New
                </button>
                <button className="bg-sky-500 text-white px-3 py-1 rounded hover:bg-sky-700 transition">
                    Find
                </button>
                <button className="bg-sky-500 text-white px-3 py-1 rounded hover:bg-sky-700 transition">
                    Join
                </button>
                <button className="bg-sky-500 text-white px-3 py-1 rounded hover:bg-sky-700 transition">
                    Separate
                </button>
                <button className="bg-sky-500 text-white px-3 py-1 rounded hover:bg-sky-700 transition">
                    Export to Excel
                </button>
                <button className="bg-sky-500 text-white px-3 py-1 rounded hover:bg-sky-700 transition">
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