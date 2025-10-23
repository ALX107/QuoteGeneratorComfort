import React from 'react';
import { toWords } from 'number-to-words';

// Function to convert number to words
function numberToWords(num) {
    if (num === null || num === undefined) return '';
    const dollars = Math.floor(num);
    const cents = Math.round((num - dollars) * 100);
    const dollarWords = toWords(dollars);
    return `${dollarWords.toUpperCase()} AND ${cents}/100 USD`;
}

function QuoteTotal({ totals }) {
    // Ensure totals is not null or undefined and has default values
    const { cost = 0, sCharge = 0, vat = 0, total = 0 } = totals || {};

    return (
        <>
            <div className="p-4 bg-gray-50 rounded-b-lg flex justify-end items-center space-x-8">
                <div className="text-right">
                    <p className="text-sm text-gray-500">Cost: <span className="font-medium text-gray-900">{(parseFloat(cost) || 0).toFixed(2)}</span></p>
                    <p className="text-sm text-gray-500">S.Charge: <span className="font-medium text-gray-900">{(parseFloat(sCharge) || 0).toFixed(2)}</span></p>
                    <p className="text-sm text-gray-500">VAT: <span className="font-medium text-gray-900">{(parseFloat(vat) || 0).toFixed(2)}</span></p>
                </div>
                <div className="text-right">
                    <p className="text-lg font-bold text-dark-gray">TOTAL</p>
                    <p className="text-2xl font-bold text-sky-600">{(parseFloat(total) || 0).toFixed(2)} USD</p>
                </div>
            </div>
            <div className="mt-6 text-right">
                <p className="text-sm font-medium text-dark-gray">TOTAL IN WORDS: {numberToWords(parseFloat(total) || 0)}</p>
            </div>
        </>
    );
}

export default QuoteTotal;
