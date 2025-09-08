import React, { useEffect, useState } from 'react';
function QuoteForm({ onAddItem, onOpenServiceModal }) {
    
        const [date, setDate] = useState('');
        const [value, setValue] = useState("");
        const [unit, setUnit] = useState("KG");

        const handleInputChange = (e) => {
            let inputValue = e.target.value;

            let cleanedValue = inputValue.replace(/[^0-9.]/g, '');

            // Validar que no haya más de un punto
            const decimalParts = cleanedValue.split('.');
            if (decimalParts.length > 2) {
                cleanedValue = decimalParts[0] + '.' + decimalParts.slice(1).join('');
            }
        
            if (cleanedValue === '' || parseFloat(cleanedValue) < 0) {
                setValue('');
            } else {
                setValue(cleanedValue);
            }
        };

        const convertToLB = () => {
            const currentValue = parseFloat(value);
            if (isNaN(currentValue) || currentValue <=0) {
                setValue('');
                return;
            }
            
            if(unit=== "KG") {
                const lbValue = (currentValue * 2.20462).toFixed(2);
                setValue(lbValue);
                setUnit("LB");
                    } else {
                    setUnit("LB")
                }
            };
          
          const convertToKG = () => {
            const currentValue = parseFloat(value);
            if (isNaN(currentValue) || currentValue <= 0) {
                setValue('');
                return;
            }

            if (unit === "LB") {
              const kgValue = (currentValue / 2.20462).toFixed(2);
              setValue(kgValue);
              setUnit("KG");
                } else {
                    setUnit("KG")
                }
            };
      
    useEffect(() => {
        const today = new Date();
        const formattedDate = today.toISOString().split('T')[0];
        setDate(formattedDate); 
    }, []);

    return (
        <main className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-start">
                        <div className="md:col-span-1">
                            <label className="block text-sm font-medium text-dark-gray" htmlFor="customer">
                                Select Customer
                            </label>
                            <div className="relative mt-1">
                                <select className="w-full bg-gray-100 border border-gray-300 rounded-md shadow-sm pl-3 pr-10 py-2 text-left cursor-default focus:outline-none focus:ring-1 focus:ring-sky-500 focus:border-sky-500 sm:text-sm" id="customer">
                                    <option></option>
                                    <option>Customer A</option>
                                    <option>Customer B</option>
                                </select>
                                <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                                    <span className="material-icons text-gray-400"></span>
                                </span>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-dark-gray" htmlFor="aircraft-type">
                                Select Flight Type
                            </label>
                            <div className="relative mt-1">
                                <select className="w-full bg-gray-100 border border-gray-300 rounded-md shadow-sm pl-3 pr-10 py-2 text-left cursor-default focus:outline-none focus:ring-1 focus:ring-sky-500 focus:border-sky-500 sm:text-sm" id="aircraft-type">
                                    <option></option>
                                    <option>Private</option>
                                    <option>Commercial</option>
                                </select>
                                <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                                    <span className="material-icons text-gray-400"></span>
                                </span>
                            </div>
                        </div>

                        <div>
                            {/*Espacio en blanco*/}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-dark-gray">
                                Date
                            </label>

                            <div className="relative mt-1">
                                    <input className="w-full bg-gray-100 border border-gray-300 rounded-md shadow-sm pl-3 pr-10 py-2 text-left focus:outline-none focus:ring-1 focus:ring-sky-500 focus:border-sky-500 sm:text-sm" id="date" type="date" value={date} onChange={(e) => setDate(e.target.value)} />
                                    <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                                        <span className="material-icons text-gray-400"></span>
                                    </span>
                            </div>
                        </div>

                       <div className="col-span-1 md:col-span-2 grid grid-cols-1 sm:grid-cols-3 gap-4 items-start">
                        {/* Aircraft Registration */}
                        <div>
                            <label className="block text-sm font-medium text-dark-gray" htmlFor="aircraft-registration">
                                Aircraft Registration
                            </label>
                            <input
                                className="mt-1 w-full bg-gray-100 border border-gray-300 rounded-md shadow-sm pl-3 py-2 focus:outline-none focus:ring-1 focus:ring-sky-500 focus:border-sky-500 sm:text-sm"
                                id="aircraft-registration"
                                type="text"
                            />
                            <div className="checkbox-container flex items-center gap-2 mt-1">
                                <input id="caa-member" type="checkbox" />
                                <label htmlFor="caa-member" className="block text-sm font-medium text-dark-gray">
                                    Is CAA Member
                                </label>
                            </div>
                        </div>

                        {/* Aircraft Model */}
                        <div>
                            <label className="block text-sm font-medium text-dark-gray" htmlFor="aircraft-model">
                                Aircraft Model
                            </label>
                            <div className="relative mt-1">
                                <select
                                    className="w-full bg-gray-100 border border-gray-300 rounded-md shadow-sm pl-3 pr-10 py-2 text-left cursor-default focus:outline-none focus:ring-1 focus:ring-sky-500 focus:border-sky-500 sm:text-sm"
                                    id="aircraft-model"
                                >
                                    <option></option>
                                    <option>A319</option>
                                    <option>B737</option>
                                    <option>G650</option>
                                </select>
                                <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                                    <span className="material-icons text-gray-400"></span>
                                </span>
                            </div>
                        </div>

                        {/* Aircraft MTOW */}
                        <div>
                            <label className="block text-sm font-medium text-dark-gray" htmlFor="mtow">
                                Aircraft MTOW
                            </label>
                            <div className="flex items-center mt-1">
                                <input
                                    className="w-full bg-gray-100 border border-gray-300 rounded-l-md shadow-sm pl-3 py-2 focus:outline-none focus:ring-1 focus:ring-sky-500 focus:border-sky-500 sm:text-sm"
                                    id="mtow"
                                    type="number"
                                    value={value === "" ? undefined : value}
                                    step="any"
                                    onChange={handleInputChange}
                                />
                                <div className="flex">
                                    <button
                                        type="button"
                                        className={`px-3 py-2 border-t border-b border-gray-300 text-dark-gray text-sm ${unit === "KG" ? "bg-gray-200" : "bg-white"}`}
                                        onClick={convertToKG}
                                    >
                                        KG
                                    </button>
                                    <button
                                        type="button"
                                        className={`px-3 py-2 border border-gray-300 text-sm rounded-r-md ${unit === "LB" ? "bg-sky-600 text-white" : "bg-white text-dark-gray"}`}
                                        onClick={convertToLB}
                                    >
                                        LB
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                        <div>
                            {/*Espacio en blanco*/}
                        </div>
                        <div className="self-start">
                            <div>
                                <label className="block text-sm font-medium text-dark-gray" htmlFor="quoted-by">
                                    Quoted by
                                </label>
                                <input className="mt-1 w-full bg-gray-100 border border-gray-300 rounded-md shadow-sm pl-3 py-2 focus:outline-none focus:ring-1 focus:ring-sky-500 focus:border-sky-500 sm:text-sm" id="quoted-by" type="text" defaultValue="Max" />
                            </div>
                            <div className="mt-4">
                                <label className="block text-sm font-medium text-dark-gray" htmlFor="attn">
                                    Attn.
                                </label>
                                <input className="mt-1 w-full bg-gray-100 border border-gray-300 rounded-md shadow-sm pl-3 py-2 focus:outline-none focus:ring-1 focus:ring-sky-500 focus:border-sky-500 sm:text-sm" id="attn" type="text"  />
                            </div>
                        </div>
                        
                       
                       {/* Tercera Fila */}
                        <div className="md:col-span-4 grid grid-cols-1 md:grid-cols-7 gap-4 items-end">
                            {/* Select Station */}
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-dark-gray" htmlFor="station">
                                    Select Station
                                </label>
                                <div className="relative mt-1">
                                    <select className="w-full bg-gray-100 border border-gray-300 rounded-md shadow-sm pl-3 pr-10 py-2 text-left cursor-default focus:outline-none focus:ring-1 focus:ring-sky-500 focus:border-sky-500 sm:text-sm" id="station">
                                        <option></option>
                                        <option>Cancun International Airport (CUN)</option>
                                        <option>Mexico City International Airport (MEX)</option>
                                        <option>Guadalajara International Airport (GDL)</option>
                                    </select>
                                    <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                                        <span className="material-icons text-gray-400"></span>
                                    </span>
                                </div>
                            </div>

                            {/* ATA */}
                            <div>
                                <label className="block text-sm font-medium text-dark-gray" htmlFor="ata">
                                    Select ATA
                                </label>
                                <div className="relative mt-1">
                                    <input className="w-full bg-gray-100 border border-gray-300 rounded-md shadow-sm pl-3 pr-10 py-2 text-left focus:outline-none focus:ring-1 focus:ring-sky-500 focus:border-sky-500 sm:text-sm" id="ata" type="date" defaultValue="2025-07-29" />
                                </div>
                            </div>

                            {/* ========= INICIO DEL CAMBIO: Grupo flexible para Checkbox y From ========= */}
    {/* Este es el contenedor clave: ocupa 2 columnas y usa flexbox */}
    <div className="md:col-span-2 flex items-end gap-6">
        
        {/* ATA Checkbox - Con tamaño fijo, no se encogerá */}
        <div className="flex-shrink-0 flex items-end pb-2">
            <div className="flex items-center h-5">
                <input id="ata-checkbox" name="ata-checkbox" type="checkbox" className="focus:ring-sky-500 h-4 w-4 text-sky-600 border-gray-300 rounded" />
            </div>
            <div className="ml-2 text-sm">
                <label htmlFor="ata-checkbox" className="font-medium text-dark-gray whitespace-nowrap">No ATA</label>
            </div>
        </div>

        {/* From - Crecerá para ocupar todo el espacio sobrante */}
        <div className="flex-1">
            <label className="block text-sm font-medium text-dark-gray" htmlFor="from-station">
                From
            </label>
            <div className="relative mt-1">
                <select className="w-full bg-gray-100 border border-gray-300 rounded-md shadow-sm pl-3 pr-10 py-2 text-left cursor-default focus:outline-none focus:ring-1 focus:ring-sky-500 focus:border-sky-500 sm:text-sm" id="from-station">
                    <option>Select a station</option>
                    <option>Cancun International Airport (CUN)</option>
                    <option>Mexico City International Airport (MEX)</option>
                    <option>Guadalajara International Airport (GDL)</option>
                </select>
            </div>
        </div>
    </div>

                            {/* Crew */}
                            <div>
                                <label className="block text-sm font-medium text-dark-gray" htmlFor="crew-from">
                                    Crew
                                </label>
                                <input className="mt-1 w-full bg-gray-100 border border-gray-300 rounded-md shadow-sm pl-3 py-2 focus:outline-none focus:ring-1 focus:ring-sky-500 focus:border-sky-500 sm:text-sm" id="crew-from" type="number" />
                            </div>

                            {/* PAX */}
                            <div>
                                <label className="block text-sm font-medium text-dark-gray" htmlFor="pax-from">
                                    Pax
                                </label>
                                <input className="mt-1 w-full bg-gray-100 border border-gray-300 rounded-md shadow-sm pl-3 py-2 focus:outline-none focus:ring-1 focus:ring-sky-500 focus:border-sky-500 sm:text-sm" id="pax-from" type="number" />
                            </div>
                        </div>

                        {/* Cuarta Fila */}
                        <div className="md:col-span-4 grid grid-cols-1 md:grid-cols-7 gap-4 items-end">
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-dark-gray" htmlFor="fob">
                                Select FBO
                            </label>
                            <div className="relative mt-1">
                                <select className="w-full bg-gray-100 border border-gray-300 rounded-md shadow-sm pl-3 pr-10 py-2 text-left cursor-default focus:outline-none focus:ring-1 focus:ring-sky-500 focus:border-sky-500 sm:text-sm" id="fob">
                                    <option></option>
                                    <option>FBO 1</option>
                                    <option>FBO 2</option>
                                </select>
                                <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                                    <span className="material-icons text-gray-400"></span>
                                </span>
                            </div>
                        </div>
                        <div>
                                <label className="block text-sm font-medium text-dark-gray" htmlFor="atd">
                                    Select ATD
                                </label>
                                <div className="relative mt-1">
                                    <input className="w-full bg-gray-100 border border-gray-300 rounded-md shadow-sm pl-3 pr-10 py-2 text-left focus:outline-none focus:ring-1 focus:ring-sky-500 focus:border-sky-500 sm:text-sm" id="atd" type="date" defaultValue="2025-07-29" />
                                  
                                </div>
                        </div>

                        <div className="md:col-span-2 flex items-end gap-6">

                         {/* ATD Checkbox */}
                            <div className="flex-shrink-0 flex items-end pb-2">
                                <div className="flex items-center h-5">
                                    <input id="atd-checkbox" name="atd-checkbox" type="checkbox" className="focus:ring-sky-500 h-4 w-4 text-sky-600 border-gray-300 rounded" />
                                </div>

                                <div className="ml-2 text-sm">
                                    <label htmlFor="atd-checkbox" className="font-medium text-dark-gray">No ATD</label>
                                </div>
                            </div>
                        <div className="flex-1" >
                                    <label className="block text-sm font-medium text-dark-gray" htmlFor="to-station">
                                        To
                                    </label>
                                    <div className="relative mt-1">
                                        <select className="w-full bg-gray-100 border border-gray-300 rounded-md shadow-sm pl-3 pr-10 py-2 text-left cursor-default focus:outline-none focus:ring-1 focus:ring-sky-500 focus:border-sky-500 sm:text-sm" id="to-station">
                                            <option>Select a station</option>
                                            <option>Cancun International Airport (CUN)</option>
                                            <option>Mexico City International Airport (MEX)</option>
                                            <option>Guadalajara International Airport (GDL)</option>
                                        </select>
                                        <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                                            <span className="material-icons text-gray-400"></span>
                                        </span>
                                    </div>
                            </div>
                        </div>


                        {/* Crew */}
                            <div>
                                <label className="block text-sm font-medium text-dark-gray" htmlFor="crew-to">
                                    Crew
                                </label>
                                <input className="mt-1 w-full bg-gray-100 border border-gray-300 rounded-md shadow-sm pl-3 py-2 focus:outline-none focus:ring-1 focus:ring-sky-500 focus:border-sky-500 sm:text-sm" id="crew-to" type="number" />
                            </div>

                            {/* PAX */}
                            <div>
                                <label className="block text-sm font-medium text-dark-gray" htmlFor="pax-to">
                                    Pax
                                </label>
                                <input className="mt-1 w-full bg-gray-100 border border-gray-300 rounded-md shadow-sm pl-3 py-2 focus:outline-none focus:ring-1 focus:ring-sky-500 focus:border-sky-500 sm:text-sm" id="pax-to" type="number" />
                            </div>   

                    </div>
                      {/* Exchange Rate */}
                            <div className="md:col-span-4 flex justify-center">
                                <div className="w-50">
                                    <label className="block text-sm font-medium text-dark-gray" htmlFor="exchange-rate">
                                        Exchange Rate
                                    </label>
                                    <input className="mt-1 w-full bg-gray-100 border border-gray-300 rounded-md shadow-sm pl-3 py-2 focus:outline-none focus:ring-1 focus:ring-sky-500 focus:border-sky-500 sm:text-sm" id="exchange-rate" type="number" />
                                </div>
                            </div>

                    </div>
            <div className="mt-8 flex items-center space-x-4">
                <button
                    type="button"
                    onClick={onOpenServiceModal}
                    className="btn-glass"
                >
                    + Add Service
                </button>
            </div>
        </main>
    );

    
}

export default React.memo(QuoteForm);