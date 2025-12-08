import RAFLogoBlanco from '../../assets/RafLogoBlanco.png';

function HistoricHeader({ 
    onNavigateNewQuote,
    onNavigateToDeleted,
    onNavigateToActive,
    isDeletedView = false,
    searchTerm,
    handleSearch,
    airports,
    aircrafts,
    years,
    customers,
    models,
    selectedAirport,
    setSelectedAirport,
    selectedAircraft,
    setSelectedAircraft,
    selectedModel,
    setSelectedModel,
    selectedYear,
    setSelectedYear,
    selectedCustomer,
    setSelectedCustomer,
    onJoinQuotes,
    selectedQuoteIds = [],
    isJoining = false
}) {
    return (
        <header className="bg-blue-dark shadow-md rounded-lg px-8 py-4 mb-6 border border-black">
            <div className="flex items-center justify-between mb-4">
                <h1 className="text-2xl font-bold text-white">
                    {isDeletedView ? 'Deleted Quotes' : 'Historical Quotes'}
                </h1>
                <div className="flex items-center space-x-2">
                    <input
                        type="text"
                        placeholder="Search..."
                        className="btn-glass flex items-center space-x-2"
                        value={searchTerm}
                        onChange={handleSearch}
                    />
                </div>
            </div>
            <div className="flex items-center flex-wrap gap-2 border-t border-gray-600 pt-4">
                {isDeletedView ? (
                    <button onClick={onNavigateToActive} className="btn-glass flex items-center space-x-2">
                        <span className="material-icons">arrow_back</span>
                        <span>Back to Active Quotes</span>
                    </button>
                ) : (
                    <>
                        <button onClick={() => onNavigateNewQuote('cotizacion')} className="btn-glass flex items-center space-x-2">New</button>
                         <button 
                            className="btn-glass flex items-center space-x-2 disabled:opacity-60 disabled:cursor-not-allowed"
                            onClick={onJoinQuotes}
                            disabled={selectedQuoteIds.length < 2 || isJoining}
                        >
                            {isJoining 
                                ? 'Joining...' 
                                : `Join ${selectedQuoteIds.length > 1 ? `(${selectedQuoteIds.length})` : ''}`}
                        </button>
                    </>
                )}
                <select
                    value={selectedYear}
                    onChange={(e) => setSelectedYear(parseInt(e.target.value, 10) || '')}
                    className="btn-glass"
                >
                    <option value="">All Years</option>
                    {years.map(year => (
                        <option key={year} value={year}>{year}</option>
                    ))}
                </select>

                <select
                    value={selectedAirport}
                    onChange={(e) => setSelectedAirport(e.target.value)}
                    className="btn-glass"
                >
                    <option value="">All Stations</option>
                    {airports.map(airport => (
                        <option key={airport} value={airport}>{airport}</option>
                    ))}
                </select>

                <select
                    value={selectedModel}
                    onChange={(e) => setSelectedModel(e.target.value)}
                    className="btn-glass"
                >
                    <option value="">All Aircrafts</option>
                    {models.map(model => (
                        <option key={model} value={model}>{model}</option>
                    ))}
                </select>

                <select
                    value={selectedAircraft}
                    onChange={(e) => setSelectedAircraft(e.target.value)}
                    className="btn-glass"
                >
                    <option value="">All Registrations</option>
                    {aircrafts.map(aircraft => (
                        <option key={aircraft} value={aircraft}>{aircraft}</option>
                    ))}
                </select>

                <select
                    value={selectedCustomer}
                    onChange={(e) => setSelectedCustomer(e.target.value)}
                    className="btn-glass"
                >
                    <option value="">All Customers</option>
                    {customers.map(customer => (
                        <option key={customer} value={customer}>{customer}</option>
                    ))}
                </select>

                {!isDeletedView && (
                    <button onClick={onNavigateToDeleted} className="btn-glass flex items-center space-x-2 bg-red-500/20 hover:bg-red-500/40">
                        <span className="material-icons">delete_sweep</span>
                        <span>Deleted</span>
                    </button>
                )}

                <button className="btn-glass flex items-center space-x-2 ml-auto">Export to Excel</button>
            </div>
        </header>
    );
}
export default HistoricHeader;