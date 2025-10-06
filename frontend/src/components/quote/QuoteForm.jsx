import React, { useEffect, useState } from 'react';
import axios from 'axios';


function QuoteForm({onAddItem, onOpenServiceModal, onSelectionChange }) {
    const [clientes, setClientes] = useState([]);
    const [aeropuertos, setAeropuertos] = useState([]);
    const [clientesAeronaves, setClientesAeronaves] = useState([]); 

    const [allFbos, setAllFbos] = useState([]);
    const [filteredFbos, setFilteredFbos] = useState([]);
    const [allaeronavesModelos, setAllAeronavesModelos] = useState([]); 
    const [filteredRegistrations, setFilteredRegistrations] = useState([]);
    const [filteredAeronavesModelos, setFilteredAeronavesModelos] = useState([]);
    const [selectedCustomer, setSelectedCustomer] = useState(null);
    const [modelValue, setModelValue] = useState('');
    const [registrationValue, setRegistrationValue] = useState('');
    const [isCaaMember, setIsCaaMember] = useState(false); 


    const [categoriasOperaciones, setCategoriasOperaciones] = useState([]);
    const [selectedAirportId, setSelectedAirportId] = useState(null);
    const [selectedFboId, setSelectedFboId] = useState(null);
    
    //Fecha y MTOW
        const [date, setDate] = useState('');
        const [etaDate, setEtaDate] = useState('');
        const [etdDate, setEtdDate] = useState('');
        const [mtowValue, setMtowValue] = useState("");
        const [unit, setUnit] = useState("KG");

    useEffect(() => {
        const fetchData = async () => {
            try {
                const clientesResponse = await axios.get('http://localhost:3000/api/listar/clientes');
                setClientes(clientesResponse.data);

                const aeropuertosResponse = await axios.get('http://localhost:3000/api/listar/aeropuertos');
                setAeropuertos(aeropuertosResponse.data);

                const categoriasOperacionesResponse = await axios.get('http://localhost:3000/api/listar/categoriasOperaciones');
                setCategoriasOperaciones(categoriasOperacionesResponse.data);

                const fbosResponse = await axios.get('http://localhost:3000/api/listar/fbos');
                setAllFbos(fbosResponse.data);

                // Petición para Modelos Aeronave (necesitamos todos para poder filtrar después)
                const aeronavesModelosResponse = await axios.get('http://localhost:3000/api/listar/aeronaves_modelos');
                setAllAeronavesModelos(aeronavesModelosResponse.data);

                // Petición para Clientes Aeronaves
                const clientesAeronavesResponse = await axios.get('http://localhost:3000/api/listar/clientes_aeronaves');
                setClientesAeronaves(clientesAeronavesResponse.data);

                // Fetch initial services (generic)
                onSelectionChange(null, null);

            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, []);

     // Efecto para actualizar el estado del checkbox cuando cambia la matrícula seleccionada
        useEffect(() => {
            // 1. Busca la aeronave completa en la lista filtrada usando la matrícula seleccionada.
            const selectedRegistration = filteredRegistrations.find(
                (reg) => reg.matricula_aeronave === registrationValue
            );

            // 2. Si se encuentra una aeronave...
            if (selectedRegistration) {
                // 3. Actualiza el estado del checkbox.
                setIsCaaMember(!!selectedRegistration.es_miembro_caa);
            } else {
                // 4. Si no hay matrícula seleccionada, asegúrate de que la casilla esté desmarcada.
                setIsCaaMember(false);
            }
        }, [registrationValue, filteredRegistrations]); // 5. Este efecto se ejecuta cuando cambia la matrícula o la lista de matrículas.


    const handleStationChange = (event) => {
        const selectedAirportName = event.target.value;
        const selectedAirport = aeropuertos.find(
            (a) => a.nombre_aeropuerto === selectedAirportName
        );

        if (selectedAirport) {
            setSelectedAirportId(selectedAirport.id_aeropuerto);
            setSelectedFboId(null); // Reset FBO when airport changes
            const fbosForAirport = allFbos.filter(fbo => fbo.id_aeropuerto === selectedAirport.id_aeropuerto);
            setFilteredFbos(fbosForAirport);
            onSelectionChange(selectedAirport.id_aeropuerto, null);
        } else {
            setSelectedAirportId(null);
            setSelectedFboId(null);
            setFilteredFbos([]);
            onSelectionChange(null, null);
        }
    };

    const handleFboChange = (event) => {
        const selectedFboName = event.target.value;
        const selectedFbo = allFbos.find(
            (f) => f.nombre_fbo === selectedFboName
        );

        if (selectedFbo) {
            setSelectedFboId(selectedFbo.id_fbo);
            onSelectionChange(selectedAirportId, selectedFbo.id_fbo);
        } else {
            setSelectedFboId(null);
            onSelectionChange(selectedAirportId, null);
        }
    };

            const handleCustomerChange = (event) => {
            const selectedCustomerName = event.target.value;
            
          

            // Limpiamos los campos relacionados inmediatamente.
            setSelectedCustomer(null);
            setModelValue('');
            setRegistrationValue('');
            setMtowValue('');
            setFilteredRegistrations([]);
            setFilteredAeronavesModelos([]);
            
            

            const customer = clientes.find(c => c.nombre_cliente === selectedCustomerName);

            if (customer) {
                
                setSelectedCustomer(customer);
                
                const customerAircraftLinks = clientesAeronaves.filter(
                    registration => registration.id_cliente === customer.id_cliente
                );

                const uniqueModelIds = [...new Set(customerAircraftLinks.map(registration => registration.id_modelo_aeronave))];

                const models = allaeronavesModelos.filter(model => 
                    uniqueModelIds.includes(model.id_modelo_aeronave)
                );

                setFilteredAeronavesModelos(models);
            }
        };

        const handleModelChange = (event) => {
            const selectedModelName = event.target.value;
            setModelValue(selectedModelName);
            setRegistrationValue(''); // Reset registration on model change
            setMtowValue(''); // Reset MTOW on model change
        
            const selectedModel = filteredAeronavesModelos.find(
                (model) => model.nombre_aeronave === selectedModelName
            );
        
            if (selectedModel && selectedCustomer) {
                const registrations = clientesAeronaves.filter(
                    (registration) =>
                        registration.id_modelo_aeronave === selectedModel.id_modelo_aeronave &&
                        registration.id_cliente === selectedCustomer.id_cliente
                );
                setFilteredRegistrations(registrations);
        
                if (selectedModel.mtow_aeronave) {
                    setMtowValue(selectedModel.mtow_aeronave);
                    setUnit('KG');
                }
            } else {
                setFilteredRegistrations([]);
            }
        };



            const handleInputChange = (e) => {
                let inputValue = e.target.value;

                let cleanedValue = inputValue.replace(/[^0-9.]/g, '');

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
            const currentValue = parseFloat(mtowValue);
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
            const currentValue = parseFloat(mtowValue);
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
        setEtaDate(formattedDate);
        setEtdDate(formattedDate);

    }, []);

    return (
        <main className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-start">
                        <div className="md:col-span-1">
                            <label className="block text-sm font-medium text-dark-gray" htmlFor="customer">
                                Select Customer
                            </label>
                            <div className="relative mt-1">
                                <input
                                    list="customer-list"
                                    id="customer"
                                    name="customer"
                                    onChange={handleCustomerChange}
                                    className="w-full bg-gray-100 border border-gray-300 rounded-md shadow-sm pl-3 pr-10 py-2 text-left focus:outline-none focus:ring-1 focus:ring-sky-500 focus:border-sky-500 sm:text-sm"
                                />
                                <datalist id="customer-list">
                                    {clientes.map((cliente) => (
                                        <option key={cliente.id_cliente} value={cliente.nombre_cliente} />
                                    ))}
                                </datalist>
                                <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                                    <span className="material-icons text-gray-400"></span>
                                </span>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-dark-gray" htmlFor="flight-type">
                                Select Flight Type
                            </label>
                            <div className="relative mt-1">
                                <input
                                    list="categoriasOperaciones-list"
                                    id="flight-type"
                                    name="flight-type"
                                    className="w-full bg-gray-100 border border-gray-300 rounded-md shadow-sm pl-3 pr-10 py-2 text-left focus:outline-none focus:ring-1 focus:ring-sky-500 focus:border-sky-500 sm:text-sm"
                                />
                               <datalist id="categoriasOperaciones-list">
                                    {categoriasOperaciones.map((categoriaOp) => (
                                        <option key={categoriaOp.id_cat_operacion} value={categoriaOp.nombre_cat_operacion} />
                                    ))}
                                </datalist>

                                <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                                    <span className="material-icons text-gray-400"></span>
                                </span>
                            </div>
                        </div>

                        <div>
                            {/*Espacio en blanco*/}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-dark-gray" htmlFor="date">
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
                        
                        {/* Aircraft Model */}
                        <div>
                            <label className="block text-sm font-medium text-dark-gray" htmlFor="aircraft-model">
                                Aircraft Model
                            </label>
                            <div className="relative mt-1">
                                <input
                                    list="aircraft-model-list"
                                    id="aircraft-model"
                                    name="aircraft-model"
                                    className="w-full bg-gray-100 border border-gray-300 rounded-md shadow-sm pl-3 pr-10 py-2 text-left focus:outline-none focus:ring-1 focus:ring-sky-500 focus:border-sky-500 sm:text-sm"
                                    onChange={handleModelChange}
                                    value={modelValue}
                                />
                                 <datalist id="aircraft-model-list">
                                    {/* Se mapean las Aeronaves filtradas para mostrarlas como opciones */}
                                    {filteredAeronavesModelos.map((model) => (
                                        <option key={model.id_modelo_aeronave} value={model.nombre_aeronave} />
                                     ))}
                                </datalist>
                                
                                <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                                    <span className="material-icons text-gray-400"></span>
                                </span>
                            </div>
                        </div>
                        
                        {/* Aircraft Registration */}
                        <div>
                            <label className="block text-sm font-medium text-dark-gray" htmlFor="aircraft-registration">
                                Aircraft Registration
                            </label>

                              <input
                                    list="aircraft-registration-list"
                                    className="mt-1 w-full bg-gray-100 border border-gray-300 rounded-md shadow-sm pl-3 py-2 focus:outline-none focus:ring-1 focus:ring-sky-500 focus:border-sky-500 sm:text-sm"
                                    id="aircraft-registration"
                                    type="text"
                                    value={registrationValue}
                                    onChange={(e) => setRegistrationValue(e.target.value)}
                                />

                            <datalist id="aircraft-registration-list">
                                    {filteredRegistrations.map((registration) => (
                                        <option key={registration.id_cliente_aeronave} value={registration.matricula_aeronave} />
                                    ))}
                            </datalist>

                            <div className="checkbox-container flex items-center gap-2 mt-1">
                                <input 
                                    id="caa-member" 
                                    type="checkbox" 
                                    checked={isCaaMember}
                                    onChange={(e) => setIsCaaMember(e.target.checked)}
                                />
                                <label htmlFor="caa-member" className="block text-sm font-medium text-dark-gray">
                                    Is CAA Member
                                </label>
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
                                    value={mtowValue}
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
                                <label className="block text-sm font-medium text-dark-gray" htmlFor="select-station">
                                    Select Station
                                </label>
                                <div className="relative mt-1">
                                    <input
                                        list="select-station-list"
                                        id="select-station"
                                        name="select-station"
                                        onChange={handleStationChange}
                                        className="w-full bg-gray-100 border border-gray-300 rounded-md shadow-sm pl-3 pr-10 py-2 text-left focus:outline-none focus:ring-1 focus:ring-sky-500 focus:border-sky-500 sm:text-sm"
                                   />
                                   <datalist id="select-station-list">
                                        {aeropuertos.map((aeropuerto) => (
                                        <option key={aeropuerto.id_aeropuerto} value={aeropuerto.nombre_aeropuerto}/>
                                    ))}
                                    </datalist>

                                    <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                                        <span className="material-icons text-gray-400"></span>
                                    </span>
                                </div>
                            </div>

                            {/* ATA */}
                            <div>
                                <label className="block text-sm font-medium text-dark-gray" htmlFor="eta">
                                    Select ETA
                                </label>
                                <div className="relative mt-1">
                                    <input className="w-full bg-gray-100 border border-gray-300 rounded-md shadow-sm pl-3 pr-10 py-2 text-left focus:outline-none focus:ring-1 focus:ring-sky-500 focus:border-sky-500 sm:text-sm" id="eta" type="date" value={etaDate} onChange={(e) => setEtaDate(e.target.value)} />
                                </div>
                            </div>

                            {/* ========= INICIO DEL CAMBIO: Grupo flexible para Checkbox y From ========= */}
    {/* Este es el contenedor clave: ocupa 2 columnas y usa flexbox */}
    <div className="md:col-span-2 flex items-end gap-6">
        
        {/* ETA Checkbox - Con tamaño fijo, no se encogerá */}
        <div className="flex-shrink-0 flex items-end pb-2">
            <div className="flex items-center h-5">
                <input id="eta-checkbox" name="eta-checkbox" type="checkbox" className="focus:ring-sky-500 h-4 w-4 text-sky-600 border-gray-300 rounded" />
            </div>
            <div className="ml-2 text-sm">
                <label htmlFor="eta-checkbox" className="font-medium text-dark-gray whitespace-nowrap">No ETA</label>
            </div>
        </div>

        {/* From - Crecerá para ocupar todo el espacio sobrante */}
        <div className="flex-1">
            <label className="block text-sm font-medium text-dark-gray" htmlFor="from-station">
                From
            </label>
            <div className="relative mt-1">
                 <input
                    list="from-station-list"
                    id="from-station"
                    name="station"
                    className="w-full bg-gray-100 border border-gray-300 rounded-md shadow-sm pl-3 pr-10 py-2 text-left focus:outline-none focus:ring-1 focus:ring-sky-500 focus:border-sky-500 sm:text-sm"
                 />
                   <datalist id="from-station-list">
                                    {aeropuertos.map((aeropuerto) => (
                                        <option key={aeropuerto.id_aeropuerto} value={aeropuerto.icao_aeropuerto} />
                                    ))}
                   </datalist>

                
            </div>
        </div>
    </div>
                            {/* Crew */}
                            <div>
                                <label className="block text-sm font-medium text-dark-gray" htmlFor="crew-from">
                                    Crew
                                </label>
                                <input className="mt-1 w-full bg-gray-100 border border-gray-300 rounded-md shadow-sm pl-3 py-2 focus:outline-none focus:ring-1 focus:ring-sky-500 focus:border-sky-500 sm:text-sm" id="crew-from" type="number" min="0" onKeyDown={(e) => { if (e.key === '-') { e.preventDefault(); } }} />
                            </div>

                            {/* Pax */}
                            <div>
                                <label className="block text-sm font-medium text-dark-gray" htmlFor="pax-from">
                                    Pax
                                </label>
                                <input className="mt-1 w-full bg-gray-100 border border-gray-300 rounded-md shadow-sm pl-3 py-2 focus:outline-none focus:ring-1 focus:ring-sky-500 focus:border-sky-500 sm:text-sm" id="pax-from" type="number" min="0" onKeyDown={(e) => { if (e.key === '-') { e.preventDefault(); } }}/>
                            </div>
                        </div>

                        {/* Cuarta Fila */}
                        <div className="md:col-span-4 grid grid-cols-1 md:grid-cols-7 gap-4 items-end">
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-dark-gray" htmlFor="fbo">
                                Select FBO
                            </label>

                            <div className="relative mt-1">
                                <input
                                    list="fbo-list"
                                    id="fbo"
                                    name="fbo"
                                    onChange={handleFboChange}
                                    className="w-full bg-gray-100 border border-gray-300 rounded-md shadow-sm pl-3 pr-10 py-2 text-left focus:outline-none focus:ring-1 focus:ring-sky-500 focus:border-sky-500 sm:text-sm"
                                />
                                 
                                <datalist id="fbo-list">
                                     {/* Se mapean los FBOs filtrados para mostrarlos como opciones */}
                                     {filteredFbos.map((fbo) => (
                                        <option key={fbo.id_fbo} value={fbo.nombre_fbo} />
                                     ))}
                                </datalist>

                                <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                                    <span className="material-icons text-gray-400"></span>
                                </span>
                            </div>
                        </div>
                        <div>
                                <label className="block text-sm font-medium text-dark-gray" htmlFor="etd">
                                    Select ETD
                                </label>
                                <div className="relative mt-1">
                                    <input className="w-full bg-gray-100 border border-gray-300 rounded-md shadow-sm pl-3 pr-10 py-2 text-left focus:outline-none focus:ring-1 focus:ring-sky-500 focus:border-sky-500 sm:text-sm" id="etd" type="date" value={etdDate} onChange={(e) => setEtdDate(e.target.value)} />
                                  
                                </div>
                        </div>

                        <div className="md:col-span-2 flex items-end gap-6">

                         {/* ETD Checkbox */}
                            <div className="flex-shrink-0 flex items-end pb-2">
                                <div className="flex items-center h-5">
                                    <input id="etd-checkbox" name="etd-checkbox" type="checkbox" className="focus:ring-sky-500 h-4 w-4 text-sky-600 border-gray-300 rounded" />
                                </div>

                                <div className="ml-2 text-sm">
                                    <label htmlFor="etd-checkbox" className="font-medium text-dark-gray">No ETD</label>
                                </div>
                            </div>
                        <div className="flex-1" >
                                    <label className="block text-sm font-medium text-dark-gray" htmlFor="to-station">
                                        To
                                    </label>

                                    <div className="relative mt-1">
                                        <input
                                            list="to-station-list"
                                            id="to-station"
                                            name="to-station"
                                            className="w-full bg-gray-100 border border-gray-300 rounded-md shadow-sm pl-3 pr-10 py-2 text-left focus:outline-none focus:ring-1 focus:ring-sky-500 focus:border-sky-500 sm:text-sm"
                                        />

                                        <datalist id="to-station-list">
                                            {aeropuertos.map((aeropuerto) => (
                                            <option key={aeropuerto.id_aeropuerto} value={aeropuerto.icao_aeropuerto} />
                                            ))}
                                        </datalist>

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
                                <input className="mt-1 w-full bg-gray-100 border border-gray-300 rounded-md shadow-sm pl-3 py-2 focus:outline-none focus:ring-1 focus:ring-sky-500 focus:border-sky-500 sm:text-sm" id="crew-to" type="number" min="0" onKeyDown={(e) => { if (e.key === '-') { e.preventDefault(); } }}/>
                            </div>

                            {/* PAX */}
                            <div>
                                <label className="block text-sm font-medium text-dark-gray" htmlFor="pax-to">
                                    Pax
                                </label>
                                <input className="mt-1 w-full bg-gray-100 border border-gray-300 rounded-md shadow-sm pl-3 py-2 focus:outline-none focus:ring-1 focus:ring-sky-500 focus:border-sky-500 sm:text-sm" id="pax-to" type="number" min="0" onKeyDown={(e) => { if (e.key === '-') { e.preventDefault(); } }}/>
                            </div>   

                    </div>
                      {/* Exchange Rate */}
                            <div className="md:col-span-5 flex justify-center">
                                <div className="w-50">
                                    <label className="block text-sm font-medium text-dark-gray" htmlFor="exchange-rate">
                                        Exchange Rate
                                    </label>
                                    <input className="mt-1 w-full bg-gray-100 border border-gray-300 rounded-md shadow-sm pl-3 py-2 focus:outline-none focus:ring-1 focus:ring-sky-500 focus:border-sky-500 sm:text-sm" id="exchange-rate" type="number" min="0" onKeyDown={(e) => { if (e.key === '-') { e.preventDefault(); } }} />
                                        <a
                                        href="https://dof.gob.mx/indicadores.php#gsc.tab=0"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-xs text-sky-600 underline hover:text-sky-800"
                                        >
                                        Consultar tipo de cambio en el DOF
                                        </a>
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
                <button
                    type="button"
                    onClick={onAddItem}
                    className="btn-glass"
                >
                    + Add Empty Row
                </button>
            </div>
        </main>
    );
}
export default React.memo(QuoteForm);