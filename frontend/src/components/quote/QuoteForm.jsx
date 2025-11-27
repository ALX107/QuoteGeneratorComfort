import React, { useEffect, useState, forwardRef, useImperativeHandle, useRef } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

import Calculator from '../features/Calculator.jsx';


const QuoteForm = forwardRef(({ onAddItem, onOpenServiceModal, onSelectionChange, exchangeRate, onExchangeRateChange, isReadOnly, onDataLoaded }, ref) => {
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

    const [customerValue, setCustomerValue] = useState('');
    const [attnValue, setAttnValue] = useState('');
    const [flightType, setFlightType] = useState('');

    const [selectStation, setSelectStation] = useState('');
    const [fromStation, setFromStation] = useState('');
    const [toStation, setToStation] = useState('');
    const [crewFrom, setCrewFrom] = useState('');
    const [paxFrom, setPaxFrom] = useState('');
    const [crewTo, setCrewTo] = useState('');
    const [paxTo, setPaxTo] = useState('');
    const [quotedBy, setQuotedBy] = useState('');
    const [loggedInUser, setLoggedInUser] = useState('');
    const [fboValue, setFboValue] = useState('');
    const [quoteNumber, setQuoteNumber] = useState(null);



    const [categoriasOperaciones, setCategoriasOperaciones] = useState([]);
    const [selectedAirportId, setSelectedAirportId] = useState(null);
    const [selectedFboId, setSelectedFboId] = useState(null);

    const [noEta, setNoEta] = useState(false);
    const [noEtd, setNoEtd] = useState(false); // 

    const [isDataLoaded, setIsDataLoaded] = useState(false);
    
    // Ref para decodificar el token una sola vez al montar (similar a exchangeRate)
    const userDecodedRef = useRef(false);
    
    //Fecha y MTOW
        const [date, setDate] = useState('');

        const [etaDate, setEtaDate] = useState('');
        const [etdDate, setEtdDate] = useState('');
        const [mtowValue, setMtowValue] = useState("");
        const [unit, setUnit] = useState("KG");

    useImperativeHandle(ref, () => {

    return {

        clearQuoteNumberOnly() {
            setQuoteNumber(null);
        },

        setQuotedByValue(userName) {
            setQuotedBy(userName);
        },
        
        clearAllFields() {
            setQuoteNumber(null);
            setSelectedCustomer(null);
            setModelValue('');
            setRegistrationValue('');
            setMtowValue('');
            setFilteredRegistrations([]);
            setFilteredAeronavesModelos([]);
            setIsCaaMember(false);
            setSelectedAirportId(null);
            setSelectedFboId(null);
            setFilteredFbos([]);
            setNoEta(false); 
            setNoEtd(false); 
            
            const today = new Date();
            const formattedDate = today.toISOString().split('T')[0];
            setDate(formattedDate);
            setEtaDate(formattedDate);
            setEtdDate(formattedDate);

            setCustomerValue('');
            setAttnValue('');
            setFlightType('');
            setSelectStation('');
            setFromStation('');
            setToStation('');
            setCrewFrom('');
            setPaxFrom('');
            setCrewTo('');
            setPaxTo('');
            setFboValue('');
            // Preserva el usuario logueado: restaura quotedBy al usuario autenticado
            if (loggedInUser) {
                setQuotedBy(loggedInUser);
            }
      
        },

        setFormData(quote, preserveCurrentUser = false) {


            setQuoteNumber(quote.numero_referencia || null);

            const customer = clientes.find(c => c.id_cliente === quote.id_cliente);
            const flightType = categoriasOperaciones.find(c => c.id_cat_operacion === quote.id_cat_operacion);
            const station = aeropuertos.find(a => a.id_aeropuerto === quote.id_aeropuerto);
            const fbo = allFbos.find(f => f.id_fbo === quote.id_fbo);
            const from = aeropuertos.find(a => a.id_aeropuerto === quote.aeropuerto_origen_id);
            const to = aeropuertos.find(a => a.id_aeropuerto === quote.aeropuerto_destino_id);

            

            setCustomerValue(customer ? customer.nombre_cliente : (quote.cliente || ''));            
            setSelectedCustomer(customer || null); 

            setFlightType(flightType ? flightType.nombre_cat_operacion : (quote.cat_operacion || '')); // Fallback texto

            setDate(quote.fecha_cotizacion ? new Date(quote.fecha_cotizacion).toISOString().split('T')[0] : '');
            // Si preserveCurrentUser es true (clonación), mantener quotedBy actual; si no, usar del quote
            if (!preserveCurrentUser) {
                setQuotedBy(quote.nombre_responsable || '');
            }
            setAttnValue(quote.nombre_solicitante || '');

            setSelectStation(station ? station.icao_aeropuerto : (quote.aeropuerto || '')); 
            setSelectedAirportId(station ? station.id_aeropuerto : null);
            
            // SOLUCIÓN: Establecer el valor de CAA directamente desde los datos de la cotización.
            setIsCaaMember(!!quote.es_miembro_caa);

            setNoEta(quote.fecha_llegada === null);
            setEtaDate(quote.fecha_llegada ? new Date(quote.fecha_llegada).toISOString().split('T')[0] : '');

            
            setFromStation(from ? from.icao_aeropuerto : (quote.aeropuerto_origen || ''));

            setToStation(to ? to.icao_aeropuerto : (quote.aeropuerto_destino || ''));


            setCrewFrom(quote.tripulacion_llegada || '');
            setPaxFrom(quote.pasajeros_llegada || '');

            setFboValue(fbo ? fbo.nombre_fbo : (quote.fbo || ''));
            setSelectedFboId(fbo ? fbo.id_fbo : null);

            // Si la fecha es null, marca el checkbox y limpia el campo de fecha.
            setNoEtd(quote.fecha_salida === null);
            setEtdDate(quote.fecha_salida ? new Date(quote.fecha_salida).toISOString().split('T')[0] : '');

            setCrewTo(quote.tripulacion_salida || '');
            setPaxTo(quote.pasajeros_salida || '');

            // Handle aircraft model and registration

            const aircraft = clientesAeronaves.find(a => a.id_cliente_aeronave === quote.id_cliente_aeronave);
                if (aircraft) {
                    const model = allaeronavesModelos.find(m => m.id_modelo_aeronave === aircraft.id_modelo_aeronave);
                    setModelValue(model ? model.nombre_aeronave : '');
                    setRegistrationValue(aircraft.matricula_aeronave || (quote.matricula_aeronave || ''));
                    // FIX: Priorizar el MTOW guardado en la cotización (snapshot).
                    // Si no existe, usar el del catálogo como fallback.
                    setMtowValue(quote.mtow || (model ? model.mtow_aeronave : ''));
                    setUnit(quote.mtow_unit || 'KG');
                } else {
                // CASO B: Manual / No existe en Catálogo (Usamos SNAPSHOT)
               
                
                setRegistrationValue(quote.matricula_aeronave || ''); // Matrícula snapshot
                
                setModelValue(quote.modelo_aeronave || '');         // Modelo snapshot
                setMtowValue(quote.mtow || '');                     // MTOW snapshot
                setUnit(quote.mtow_unit || 'KG');                   // Unit snapshot
                

            }


            if (customer) {
                const customerAircraftLinks = clientesAeronaves.filter(
                    registration => registration.id_cliente === customer.id_cliente
                );
                setFilteredRegistrations(customerAircraftLinks);
                const uniqueModelIds = [...new Set(customerAircraftLinks.map(registration => registration.id_modelo_aeronave))];
                const models = allaeronavesModelos.filter(model => 
                    uniqueModelIds.includes(model.id_modelo_aeronave)
                );
                setFilteredAeronavesModelos(models);
            }

                else {
        // Si no hay cliente (es manual), permitimos ver todos los modelos 
        // y vaciamos las matrículas filtradas (porque es manual)
        setFilteredRegistrations([]);
        setFilteredAeronavesModelos(allaeronavesModelos);
    }

                
            
            
        
    },
    
        //Guardar el formulario
        getFormData() { 
            const selectedFlightType = categoriasOperaciones.find(cat => cat.nombre_cat_operacion === flightType);
            // FIX: Buscar en la lista completa de aeronaves (`clientesAeronaves`) en lugar de solo en la lista filtrada.
            // Esto asegura que siempre encontremos el ID si la matrícula existe, previniendo el envío de `null`.
            const selectedRegistration = clientesAeronaves.find(reg => reg.matricula_aeronave === registrationValue);

            const selectedAircraftModel = filteredAeronavesModelos.find(model => model.nombre_aeronave === modelValue);
            const fromAirport = aeropuertos.find(a => a.icao_aeropuerto === fromStation);
            const toAirport = aeropuertos.find(a => a.icao_aeropuerto === toStation);
            const stationAirport = aeropuertos.find(a => a.id_aeropuerto === selectedAirportId);
            const fbo = allFbos.find(f => f.id_fbo === selectedFboId);

            return {
                // Existing fields for saving
                customer: selectedCustomer ? selectedCustomer.id_cliente : null,
                flightType: selectedFlightType ? selectedFlightType.id_cat_operacion : null,
                date: date,
                aircraftModel: selectedRegistration ? selectedRegistration.id_cliente_aeronave : null,
                isCaaMember: isCaaMember,
                mtow: mtowValue,
                mtow_unit: unit,
                quotedBy: quotedBy,
                attn: attnValue,
                station: selectedAirportId,
                eta: noEta ? null : etaDate,
                from: fromAirport ? fromAirport.id_aeropuerto : null,
                crewFrom: crewFrom,
                paxFrom: paxFrom,
                fbo: selectedFboId,
                etd: noEtd ? null : etdDate,
                to: toAirport ? toAirport.id_aeropuerto : null,
                crewTo: crewTo,
                paxTo: paxTo,
                exchangeRate: exchangeRate,

                // New fields for PDF

            // 1. Objetos completos (para obtener IDs fácilmente en el padre)
            selectedCustomer: selectedCustomer,
            selectedModel: selectedRegistration, // Pasamos el objeto de matrícula completo

            // 2. Valores de Texto Crudo (Lo que el usuario escribió)
            // ESTO ES LO QUE TE FALTABA PARA EVITAR "label: undefined"
            customerValue: customerValue,       
            registrationValue: registrationValue,

            // New fields for PDF
            customerName: selectedCustomer ? selectedCustomer.nombre_cliente : customerValue,
            flightTypeName: flightType,
            aircraftModelName: modelValue,
            aircraftRegistrationValue: registrationValue, // The string value
            stationName: stationAirport ? stationAirport.icao_aeropuerto : selectStation,
            fromName: fromAirport ? fromAirport.nombre_aeropuerto : fromStation,
            fboName: fbo ? fbo.nombre_fbo : fboValue,
            toName: toAirport ? toAirport.nombre_aeropuerto : toStation,

            }; 
          },

          //Clonar el formulario
          getAllFormData() {
            return {
                customerValue,
                attnValue,
                flightType,
                date,
                quotedBy,
                selectStation,
                etaDate,
                noEta,
                fromStation,
                crewFrom,
                paxFrom,
                fboValue,
                etdDate,
                noEtd,
                toStation,
                crewTo,
                paxTo,
                registrationValue,
                isCaaMember,
                modelValue,
                mtowValue,
                unit,
                // IDs and complex objects that are also part of the state
                selectedCustomer,
                selectedAirportId,
                selectedFboId,
            }
          }
         };
         
        },[
            isDataLoaded, 
            clientes,
            aeropuertos,
            clientesAeronaves,
            allFbos,
            filteredFbos,

            allaeronavesModelos,
            categoriasOperaciones,
            filteredRegistrations,
            filteredAeronavesModelos,
            selectedCustomer,
            modelValue,
            registrationValue,
            customerValue,
            attnValue,
            flightType,
            selectStation,
            fromStation,
            toStation,
            crewFrom,
            paxFrom,
            crewTo,
            paxTo,
            quotedBy,
            fboValue,
            date,
            etaDate,
            etdDate,
            mtowValue,
            unit,
            isCaaMember,
            noEta,
            noEtd,
            selectedAirportId,
            selectedFboId,
            quoteNumber,
            loggedInUser,
            
        ]
    );

    useEffect(() => {
        // CONSOLIDADO: Decodificar token + Cargar datos iniciales (similar a Exchange Rate)
        // Solo se ejecuta una vez al montar el componente
        
        // 1. Decodificar token y cargar usuario logueado (una sola vez)
        if (!userDecodedRef.current) {
            userDecodedRef.current = true;
            const token = localStorage.getItem('token');
            if (token) {
                try {
                    const decodedToken = jwtDecode(token);
                    const userName = decodedToken.username;
                    if (userName && typeof userName === 'string') {
                        setLoggedInUser(userName);
                        setQuotedBy(userName);
                    }
                } catch (error) {
                    console.error("Error decoding token:", error);
                }
            }
        }

        // 2. Establecer fechas de hoy
        const today = new Date();
        const formattedDate = today.toISOString().split('T')[0];
        setDate(formattedDate);
        setEtaDate(formattedDate);
        setEtdDate(formattedDate);

        // 3. Cargar datos de APIs
        const fetchData = async () => {
            try {
                const [
                    clientesResponse,
                    aeropuertosResponse,
                    categoriasOperacionesResponse,
                    fbosResponse,
                    aeronavesModelosResponse,
                    clientesAeronavesResponse
                ] = await Promise.all([
                    axios.get('http://localhost:3000/api/listar/clientes'),
                    axios.get('http://localhost:3000/api/listar/aeropuertos'),
                    axios.get('http://localhost:3000/api/listar/categoriasOperaciones'),
                    axios.get('http://localhost:3000/api/listar/fbos'),
                    axios.get('http://localhost:3000/api/listar/aeronaves_modelos'),
                    axios.get('http://localhost:3000/api/listar/clientes_aeronaves')
                ]);

                setClientes(clientesResponse.data);
                setAeropuertos(aeropuertosResponse.data);
                setCategoriasOperaciones(categoriasOperacionesResponse.data);
                setAllFbos(fbosResponse.data);
                setAllAeronavesModelos(aeronavesModelosResponse.data);
                setClientesAeronaves(clientesAeronavesResponse.data);

                onSelectionChange(null, null);
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setIsDataLoaded(true);
                if (onDataLoaded) onDataLoaded();
            }
        };

        fetchData();
    }, []);

    // Efecto para sincronizar los checkboxes 'No ETA' y 'No ETD' con sus campos de fecha.
    useEffect(() => {
        if (noEta) {
            setEtaDate(''); // Limpia la fecha si 'No ETA' está marcado
        }
    }, [noEta]);

    useEffect(() => {
        if (noEtd) {
            setEtdDate(''); // Limpia la fecha si 'No ETD' está marcado
        }
    }, [noEtd]);

    // Cuando se desmarca el checkbox, si no hay fecha, se establece la de hoy.
    const handleNoEtaChange = (e) => {
        setNoEta(e.target.checked);
        if (!e.target.checked && !etaDate) setEtaDate(new Date().toISOString().split('T')[0]);
    };

    const handleNoEtdChange = (e) => {
        setNoEtd(e.target.checked);
        if (!e.target.checked && !etdDate) setEtdDate(new Date().toISOString().split('T')[0]);
    };
           
    //No permite que la fecha de ETA sea posterior a la de ETD
    const handleEtaDateChange = (e) => {
        const newEta = e.target.value;
        setEtaDate(newEta);
        // Si la nueva fecha de llegada es posterior a la de salida, ajusta la de salida.
        if (newEta && etdDate && newEta > etdDate) {
            setEtdDate(newEta);
        }
    };



    const handleStationChange = (event) => {
        const selectedAirportName = event.target.value;
        const selectedAirport = aeropuertos.find(
            (a) => a.icao_aeropuerto === selectedAirportName
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

    const handleIntegerChange = (setter) => (e) => {
        const value = e.target.value;
        if (/^[0-9]*$/.test(value)) {
            if (value === '') {
                setter('');
                return;
            }
            const num = parseInt(value, 10);
            if (num <= 999) {
                setter(value);
            } else {
                setter('999');
            }
        }
    };

    //Carga ambas listas (modelos y matrículas) filtradas por cliente
    const handleCustomerChange = (event) => {

            const selectedCustomerName = event.target.value;
            
            setCustomerValue(selectedCustomerName);

            // Limpiamos los campos relacionados inmediatamente.
            setSelectedCustomer(null);
            setModelValue('');
            setRegistrationValue('');
            setMtowValue('');
            setFilteredRegistrations([]);
            setFilteredAeronavesModelos([]);

            //Buscar si el cliente existe en la lista 
            const customer = clientes.find(c => c.nombre_cliente === selectedCustomerName);

            if (customer) {  
                setSelectedCustomer(customer);
                
                // --- Cargar Matrículas del Cliente ---
                const customerAircraftLinks = clientesAeronaves.filter(
                    registration => registration.id_cliente === customer.id_cliente
                );
                
                // Setear TODAS las matrículas de ese cliente 
                setFilteredRegistrations(customerAircraftLinks);

                // --- Cargar Modelos del Cliente ---
                const uniqueModelIds = [...new Set(customerAircraftLinks.map(registration => registration.id_modelo_aeronave))];

                // Filtrar la lista maestra de modelos
                const models = allaeronavesModelos.filter(model => 
                    uniqueModelIds.includes(model.id_modelo_aeronave)
                );

                // Setear TODOS los modelos de ese cliente
                setFilteredAeronavesModelos(models);
            } else{

                //El cliente no fue encontrado, es un nombre nuevo.
                // 'selectedCustomer' se queda como null.

                console.log("Cliente NUEVO. Cargando TODOS los modelos.");
                // Cargar TODOS los modelos del universo
                setFilteredAeronavesModelos(allaeronavesModelos);
            }
        };

        //(Flow 1: Cliente -> Modelo -> Matrícula) Se dispara al seleccionar un modelo. Filtra la lista de matrículas.
        const handleModelChange = (event) => {
            const selectedModelName = event.target.value;
            setModelValue(selectedModelName);

            // Verificamos si la matrícula que está escrita actualmente existe en la base de datos
            const isKnownRegistration = clientesAeronaves.some(
                reg => reg.matricula_aeronave === registrationValue
            );

            if (isKnownRegistration) {
                setRegistrationValue(''); 
            }

            setMtowValue(''); // Reset MTOW on model change
        
            const selectedModel = filteredAeronavesModelos.find(
                (model) => model.nombre_aeronave === selectedModelName
            );
        
            if (selectedModel) {

                if (selectedModel.mtow_aeronave) {
                    setMtowValue(selectedModel.mtow_aeronave);
                    setUnit('KG');
                }

                    //Filtrar matrículas solo si hay un cliente existente seleccionado
                    if (selectedCustomer) {
                        // Filtrar la lista de matrículas para que solo muestre las de este modelo
                        const modelRegistrations = clientesAeronaves.filter(
                            (registration) =>
                                registration.id_modelo_aeronave === selectedModel.id_modelo_aeronave &&
                                registration.id_cliente === selectedCustomer.id_cliente
                        );
                        setFilteredRegistrations(modelRegistrations);
                    }
    
                } else if (!selectedModelName) {
                    // Si el usuario borra el campo modelo, reseteamos la lista de matrículas

                    if (selectedCustomer) {
                        const customerAircraftLinks = clientesAeronaves.filter(
                            registration => registration.id_cliente === selectedCustomer?.id_cliente
                        );
                        setFilteredRegistrations(customerAircraftLinks || []);
                    }
                };

            };

            //(Flow 2: Cliente -> Matrícula -> Modelo) Se dispara al seleccionar una matrícula. Autocompleta el modelo y MTOW.
            const handleRegistrationChange = (event) => {
                const selectedMatricula = event.target.value;

                //Actualiza el valor que el usuario está escribiendo
                setRegistrationValue(selectedMatricula);

               if (selectedMatricula === '') {
                // Limpiamos los campos dependientes para evitar confusiones
                setModelValue('');
                setMtowValue('');
                setIsCaaMember(false);

                // Si hay un cliente seleccionado, RE-CALCULAMOS su lista original de modelos
                if (selectedCustomer) {
                    const allCustomerRegistrations = clientesAeronaves.filter(
                    reg => reg.id_cliente === selectedCustomer.id_cliente
                ); 
                setFilteredRegistrations(allCustomerRegistrations);

                    if (allCustomerRegistrations.length > 0) {
                const uniqueModelIds = [...new Set(allCustomerRegistrations.map(r => r.id_modelo_aeronave))];
                const customerModels = allaeronavesModelos.filter(model => 
                    uniqueModelIds.includes(model.id_modelo_aeronave)
                );
                setFilteredAeronavesModelos(customerModels);
            } else {
                // Si el cliente no tiene nada, mostrar todo el catálogo
                setFilteredAeronavesModelos(allaeronavesModelos);
            }
        } else {
            // Si no hay cliente, mostrar todo el universo
            setFilteredAeronavesModelos(allaeronavesModelos);
            setFilteredRegistrations([]);
        }
        return; 
    }
                

                //Solo intenta autocompletar el modelo si el cliente existe
                if (selectedCustomer) {
                   

                    // Buscar la matrícula seleccionada filtrada por cliente
                    // por si el usuario escribe una matrícula sin haber filtrado por modelo.
                    const selectedRegistration = clientesAeronaves.find(
                        reg => reg.matricula_aeronave === selectedMatricula && 
                            reg.id_cliente === selectedCustomer?.id_cliente
                    );

                    //la matricula existe para este cliente
                    if (selectedRegistration) {
                        // Encontrar el modelo correspondiente a esta matrícula
                        const model = allaeronavesModelos.find(
                            m => m.id_modelo_aeronave === selectedRegistration.id_modelo_aeronave
                        );

                        if (model) {
                            // Autocompletar Modelo y MTOW
                            setModelValue(model.nombre_aeronave);
                            
                            if (model.mtow_aeronave) {
                                setMtowValue(model.mtow_aeronave);
                                setUnit('KG');
                            }
                            // Restaurar la lógica para actualizar el estado de CAA Member
                            // basado en la matrícula seleccionada.
                            setIsCaaMember(!!selectedRegistration.es_miembro_caa);
                        }
                       
                    }
                    else {
                        setFilteredAeronavesModelos(allaeronavesModelos);
                    }
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
                    setMtowValue('');
                } else {
                    setMtowValue(cleanedValue);
                }
            };

        const convertToLB = () => {
            const currentValue = parseFloat(mtowValue);
            if (isNaN(currentValue) || currentValue <=0) {
                setMtowValue('');
                return;
            }
            
            if(unit=== "KG") {
                const lbValue = (currentValue * 2.20462).toFixed(2);
                setMtowValue(lbValue);
                setUnit("LB");
                    } else {
                    setUnit("LB")
                }
            };
          
          const convertToKG = () => {
            const currentValue = parseFloat(mtowValue);
            if (isNaN(currentValue) || currentValue <= 0) {
                setMtowValue('');
                return;
            }

            if (unit === "LB") {
              const kgValue = (currentValue / 2.20462).toFixed(2);
              setMtowValue(kgValue);
              setUnit("KG");
                } else {
                    setUnit("KG")
                }
            };

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
                                    value = {customerValue}
                                    onChange={(e) => {
                                        setCustomerValue(e.target.value);
                                        handleCustomerChange(e);
                                    }}
                                    className="w-full bg-gray-100 border border-gray-300 rounded-md shadow-sm pl-3 pr-10 py-2 text-left focus:outline-none focus:ring-1 focus:ring-sky-500 focus:border-sky-500 sm:text-sm disabled:cursor-not-allowed"
                                    disabled={isReadOnly}
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
                                Select Category
                                {/* Category es flight type */}
                            </label>
                            <div className="relative mt-1">
                                <input
                                    list="categoriasOperaciones-list"
                                    id="flight-type"
                                    name="flight-type"
                                    className="w-full bg-gray-100 border border-gray-300 rounded-md shadow-sm pl-3 pr-10 py-2 text-left focus:outline-none focus:ring-1 focus:ring-sky-500 focus:border-sky-500 sm:text-sm disabled:cursor-not-allowed"
                                    disabled={isReadOnly}
                               
                                    value={flightType}
                                    onChange={(e) => setFlightType(e.target.value)}
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
                            {quoteNumber && (
                                <>
                                    <div className="mt-0 md:mt-0 flex justify-center">
                                        <div
                                            className="w-auto bg-gradient-to-r from-sky-500 to-cyan-700 text-white font-semibold rounded-md shadow-md px-3 py-2 text-center text-sm tracking-wide"
                                        >
                                            {`#${quoteNumber}`}
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-dark-gray" htmlFor="date">
                                Date
                            </label>

                            <div className="relative mt-1">
                                    <input className="w-full bg-gray-100 border border-gray-300 rounded-md shadow-sm pl-3 pr-10 py-2 text-left focus:outline-none focus:ring-1 focus:ring-sky-500 focus:border-sky-500 sm:text-sm disabled:cursor-not-allowed" 
                                           id="date" 
                                           type="date" 
                                           value={date} 
                                           onChange={(e) => setDate(e.target.value)}
                                           disabled={isReadOnly} />
                                    <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                                        <span className="material-icons text-gray-400"></span>
                                    </span>
                            </div>

   
                        </div>

                       <div className="col-span-1 md:col-span-2 grid grid-cols-1 sm:grid-cols-3 gap-4 items-start">

                           {/* Aircraft Registration (Flow 2)*/}
                        <div>
                            <label className="block text-sm font-medium text-dark-gray" htmlFor="aircraft-registration">
                                Aircraft Registration
                            </label>

                              <input
                                    list="aircraft-registration-list"
                                    className="mt-1 w-full bg-gray-100 border border-gray-300 rounded-md shadow-sm pl-3 py-2 focus:outline-none focus:ring-1 focus:ring-sky-500 focus:border-sky-500 sm:text-sm disabled:cursor-not-allowed"
                                    id="aircraft-registration"
                                    type="text"
                                    value={registrationValue}
                                    onChange={handleRegistrationChange}
                                    disabled={isReadOnly}
                                    //disabled={!customerValue}
                                />

                            <datalist id="aircraft-registration-list">
                                {/* Mapea las matrículas filtradas (ya sea por cliente o por modelo) */}
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
                                    disabled={isReadOnly}
                                    className='disabled:bg-gray-200 disabled:cursor-not-allowed'
                                />
                                <label htmlFor="caa-member" className="block text-sm font-medium text-dark-gray">
                                    <a>
                                        Is CAA Member
                                    </a>
                                </label>
                            </div>
                            <a
                                href="https://caa.org/my-dashboard"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-xs text-sky-600 underline hover:text-sky-800"
                                >
                                Verify if it is CAA Member
                            </a>
                        </div>
                        
                        {/* Aircraft Model (Flow 1)*/}
                        <div>
                            <label className="block text-sm font-medium text-dark-gray" htmlFor="aircraft-model">
                                Aircraft Model
                            </label>
                            <div className="relative mt-1">
                                <input
                                    list="aircraft-model-list"
                                    id="aircraft-model"
                                    name="aircraft-model"
                                    className="w-full bg-gray-100 border border-gray-300 rounded-md shadow-sm pl-3 pr-10 py-2 text-left focus:outline-none focus:ring-1 focus:ring-sky-500 focus:border-sky-500 sm:text-sm disabled:cursor-not-allowed"
                                    onChange={handleModelChange}
                                    value={modelValue}
                                    disabled={isReadOnly}
                                    //disabled={!customerValue}
                                    
                                />
                                 <datalist id="aircraft-model-list">
                                    {/* Mapear los modelos filtrados por CLIENTE */}
                                    {filteredAeronavesModelos.map((model) => (
                                        <option key={model.id_modelo_aeronave} value={model.nombre_aeronave} />
                                     ))}
                                </datalist>
                                
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
                                    className="w-full bg-gray-100 border border-gray-300 rounded-l-md shadow-sm pl-3 py-2 focus:outline-none focus:ring-1 focus:ring-sky-500 focus:border-sky-500 sm:text-sm disabled:cursor-not-allowed"
                                    id="mtow"
                                    type="number"
                                    value={mtowValue}
                                    step="any"
                                    onChange={handleInputChange}
                                    disabled={isReadOnly}
                                />
                                <div className="flex">
                                    <button
                                        type="button"
                                        className={`px-3 py-2 border-t border-b border-gray-300 text-sm ${unit === "KG" ? "bg-sky-600 text-white" : "bg-white text-dark-gray disabled:cursor-not-allowed"}`}
                                        onClick={convertToKG}
                                        disabled={isReadOnly}
                                    >
                                        KG
                                    </button>
                                    <button
                                        type="button"
                                        className={`px-3 py-2 border border-gray-300 text-sm rounded-r-md ${unit === "LB" ? "bg-sky-600 text-white" : "bg-white text-dark-gray disabled:cursor-not-allowed"}`}
                                        onClick={convertToLB}
                                        disabled={isReadOnly}
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
                                <input className="mt-1 w-full bg-gray-200 border border-gray-300 rounded-md shadow-sm pl-3 py-2 focus:outline-none sm:text-sm cursor-not-allowed" 
                                        id="quoted-by" 
                                        type="text" 
                                        value={quotedBy}
                                        readOnly
                                />
                            </div>
                            <div className="mt-4">
                                <label className="block text-sm font-medium text-dark-gray" htmlFor="attn">
                                    Attn.
                                </label>
                                <input className="mt-1 w-full bg-gray-100 border border-gray-300 rounded-md shadow-sm pl-3 py-2 focus:outline-none focus:ring-1 focus:ring-sky-500 focus:border-sky-500 sm:text-sm disabled:cursor-not-allowed" 
                                       id="attn" 
                                       type="text"  
                                       value={attnValue}
                                       onChange={(e) => setAttnValue(e.target.value)}
                                       disabled={isReadOnly}/>
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
                                        value = {selectStation}
                                        onChange={(e) => {
                                            setSelectStation(e.target.value);
                                            handleStationChange(e);
                                        }}

                                        className="w-full bg-gray-100 border border-gray-300 rounded-md shadow-sm pl-3 pr-10 py-2 text-left focus:outline-none focus:ring-1 focus:ring-sky-500 focus:border-sky-500 sm:text-sm disabled:cursor-not-allowed"
                                        disabled={isReadOnly}
                                        

                                   />
                                   <datalist id="select-station-list">
                                        {aeropuertos.map((aeropuerto) => (
                                        <option key={aeropuerto.id_aeropuerto} value={aeropuerto.icao_aeropuerto}/>
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
                                    <input className="w-full bg-gray-100 border border-gray-300 rounded-md shadow-sm pl-3 pr-10 py-2 text-left focus:outline-none focus:ring-1 focus:ring-sky-500 focus:border-sky-500 sm:text-sm
                                                       disabled:cursor-not-allowed disabled:text-opacity-70" 
                                           id="eta"                                           
                                           type={noEta ? 'text' : 'date'}
                                           value={etaDate}
                                           placeholder="No ETA Selected"
                                           onChange={handleEtaDateChange}
                                           disabled={noEta || isReadOnly} />
                                </div>
                            </div>

                            {/* ========= INICIO DEL CAMBIO: Grupo flexible para Checkbox y From ========= */}
    {/* Este es el contenedor clave: ocupa 2 columnas y usa flexbox */}
    <div className="md:col-span-2 flex items-end gap-6">
        
        {/* ETA Checkbox - Con tamaño fijo, no se encogerá */}
        <div className="flex-shrink-0 flex items-end pb-2">
            <div className="flex items-center h-5">
                <input id="eta-checkbox" 
                       name="eta-checkbox" 
                       type="checkbox" 
                       className="focus:ring-sky-500 h-4 w-4 text-sky-600 border-gray-300 rounded disabled:bg-gray-200 disabled:cursor-not-allowed"
                       checked={noEta}
                       onChange={handleNoEtaChange} 
                       disabled={isReadOnly}/>
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
                    className="w-full bg-gray-100 border border-gray-300 rounded-md shadow-sm pl-3 pr-10 py-2 text-left focus:outline-none focus:ring-1 focus:ring-sky-500 focus:border-sky-500 sm:text-sm disabled:cursor-not-allowed"
                    value={fromStation}
                    onChange={(e) => setFromStation(e.target.value)}
                    disabled={isReadOnly}
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
                                <input className="mt-1 w-full bg-gray-100 border border-gray-300 rounded-md shadow-sm pl-3 py-2 focus:outline-none focus:ring-1 focus:ring-sky-500 focus:border-sky-500 sm:text-sm disabled:cursor-not-allowed" 
                                       id="crew-from" 
                                       type="text" 
                                       inputMode="numeric"
                                       value={crewFrom}
                                       onChange={handleIntegerChange(setCrewFrom)}
                                       disabled={isReadOnly} />
                            </div>

                            {/* Pax */}
                            <div>
                                <label className="block text-sm font-medium text-dark-gray" htmlFor="pax-from">
                                    Pax
                                </label>
                                <input className="mt-1 w-full bg-gray-100 border border-gray-300 rounded-md shadow-sm pl-3 py-2 focus:outline-none focus:ring-1 focus:ring-sky-500 focus:border-sky-500 sm:text-sm disabled:cursor-not-allowed" 
                                       id="pax-from" 
                                       type="text" 
                                       inputMode="numeric"
                                       value={paxFrom}
                                       onChange={handleIntegerChange(setPaxFrom)}
                                       disabled={isReadOnly}
                                       />
                            </div>
                        </div>

                        {/* Cuarta Fila */}
                        <div className="md:col-span-4 grid grid-cols-1 md:grid-cols-7 gap-4 items-end">
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-dark-gray" htmlFor="fbo">
                                Select Aviation Type
                            </label>

                            <div className="relative mt-1">
                            <input
                                list="fbo-list"
                                id="fbo"
                                name="fbo"
                                className="w-full bg-gray-100 border border-gray-300 rounded-md shadow-sm pl-3 pr-10 py-2 text-left focus:outline-none focus:ring-1 focus:ring-sky-500 focus:border-sky-500 sm:text-sm disabled:cursor-not-allowed"
                                value={fboValue}
                                onChange={(e) => {
                                    setFboValue(e.target.value);
                                    handleFboChange(e);
                                }}
                                disabled={isReadOnly}
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
                                    <input className="w-full bg-gray-100 border border-gray-300 rounded-md shadow-sm pl-3 pr-10 py-2 text-left focus:outline-none focus:ring-1 focus:ring-sky-500 focus:border-sky-500 sm:text-sm
                                                       disabled:cursor-not-allowed disabled:text-opacity-70s" 
                                           id="etd"
                                           type={noEtd ? 'text' : 'date'}
                                           value={etdDate}
                                           placeholder="No ETD Selected"
                                           onFocus={(e) => e.target.type = 'date'}
                                           onChange={(e) => setEtdDate(e.target.value)}
                                           min={etaDate}
                                           disabled={noEtd || isReadOnly}/>
                                  
                                </div>
                        </div>

                        <div className="md:col-span-2 flex items-end gap-6">

                         {/* ETD Checkbox */}
                            <div className="flex-shrink-0 flex items-end pb-2">
                                <div className="flex items-center h-5">
                                    <input id="etd-checkbox" 
                                           name="etd-checkbox" 
                                           type="checkbox" 
                                           className="focus:ring-sky-500 h-4 w-4 text-sky-600 border-gray-300 rounded disabled:cursor-not-allowed"
                                           checked={noEtd}
                                           onChange={handleNoEtdChange} 
                                           disabled={isReadOnly} />
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
                                            className="w-full bg-gray-100 border border-gray-300 rounded-md shadow-sm pl-3 pr-10 py-2 text-left focus:outline-none focus:ring-1 focus:ring-sky-500 focus:border-sky-500 sm:text-sm disabled:cursor-not-allowed"
                                            value={toStation}
                                            onChange={(e) => setToStation(e.target.value)}
                                            disabled={isReadOnly}
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
                                <input className="mt-1 w-full bg-gray-100 border border-gray-300 rounded-md shadow-sm pl-3 py-2 focus:outline-none focus:ring-1 focus:ring-sky-500 focus:border-sky-500 sm:text-sm disabled:cursor-not-allowed" 
                                       id="crew-to" 
                                       type="text" 
                                       inputMode="numeric"
                                       value={crewTo}
                                       onChange={handleIntegerChange(setCrewTo)}
                                       disabled={isReadOnly}/>
                            </div>

                            {/* PAX */}
                            <div>
                                <label className="block text-sm font-medium text-dark-gray" htmlFor="pax-to">
                                    Pax
                                </label>
                                <input className="mt-1 w-full bg-gray-100 border border-gray-300 rounded-md shadow-sm pl-3 py-2 focus:outline-none focus:ring-1 focus:ring-sky-500 focus:border-sky-500 sm:text-sm disabled:cursor-not-allowed" 
                                       id="pax-to" 
                                       type="text" 
                                       inputMode="numeric"
                                       value={paxTo}
                                       onChange={handleIntegerChange(setPaxTo)}
                                       disabled={isReadOnly}/>
                            </div>   

                    </div>
                      {/* Exchange Rate */}
                            <div className="md:col-span-5 flex justify-center">
                                <div className="w-50">
                                    <label className="block text-sm font-medium text-dark-gray" htmlFor="exchange-rate">
                                        Exchange Rate
                                    </label>
                                    <input className="mt-1 w-full bg-gray-100 border border-gray-300 rounded-md shadow-sm pl-3 py-2 focus:outline-none focus:ring-1 focus:ring-sky-500 focus:border-sky-500 sm:text-sm disabled:cursor-not-allowed" 
                                           id="exchange-rate" 
                                           type="number" 
                                           min="0" onKeyDown={(e) => { if (e.key === '-') { e.preventDefault(); } }}
                                           value={exchangeRate}
                                           onChange={(e) => onExchangeRateChange(e.target.value)} 
                                           disabled={isReadOnly}/>

                                        <a
                                        href="https://dof.gob.mx/indicadores.php#gsc.tab=0"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-xs text-sky-600 underline hover:text-sky-800"
                                        >
                                        Verify exchange rate in DOF
                                        </a>
                                </div>
                            </div>  
                    </div>
            <div className="mt-8 flex items-center space-x-4">
                <button
                    type="button"
                    onClick={onOpenServiceModal}
                    
                    className="btn-glass disabled:opacity-60"
                    disabled={isReadOnly}
                >
                    + Add Service
                </button>
                <button
                    type="button"
                    onClick={onAddItem}

                    className="btn-glass disabled:opacity-60"
                    disabled={isReadOnly}
                >
                    + Add Empty Row
                </button>
                <Calculator isReadOnly={isReadOnly} />
            </div>
        </main>
    );
});
export default QuoteForm;
