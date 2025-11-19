import RAFLogoBlanco from '../../assets/RafLogoBlanco.png';

function HistoricHeader({ 
    onNavigateNewQuote, 
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
    setSelectedCustomer
}) {
    return (
        <header className="flex items-center justify-between bg-blue-dark shadow-md rounded-lg px-8 py-4 mb-6 border border-black">

            <div className="flex items-center flex-wrap gap-2">
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
                
            </div>
                <div className="flex items-center space-x-2">
                    <input 
                    type="text"
                    placeholder="Search..."
                    className="btn-glass flex items-center space-x-2"
                    value={searchTerm}
                    onChange={handleSearch}
                    />
                </div>
        </header>
    );
}
export default HistoricHeader;