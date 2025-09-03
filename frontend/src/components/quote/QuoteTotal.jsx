import React from 'react';

function QuoteTotal() {
    return (
        <>
            <div className="p-4 bg-gray-50 rounded-b-lg flex justify-end items-center space-x-8">
                <div className="text-right">
                    <p className="text-sm text-gray-500">Cost: <span className="font-medium text-gray-900">184.83</span></p>
                    <p className="text-sm text-gray-500">S.Charge: <span className="font-medium text-gray-900">33.27</span></p>
                    <p className="text-sm text-gray-500">VAT: <span className="font-medium text-gray-900">5.32</span></p>
                </div>
                <div className="text-right">
                    <p className="text-lg font-bold text-dark-gray">TOTAL</p>
                    <p className="text-2xl font-bold text-sky-600">223.42 USD</p>
                </div>
            </div>
            <div className="mt-6 text-right">
                <p className="text-sm font-medium text-dark-gray">TOTAL IN WORDS: TWO HUNDRED TWENTY-THREE AND 42/100 USD</p>
            </div>
        </>
    );
}

export default QuoteTotal;
