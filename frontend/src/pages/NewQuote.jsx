import React, { useState, useEffect, useRef, useCallback } from 'react';
import { jwtDecode } from 'jwt-decode';
import QuoteHeader from '../components/quote/QuoteHeader';
import QuoteForm from '../components/quote/QuoteForm';
import QuoteTable from '../components/quote/QuoteTable';
import QuoteTotal from '../components/quote/QuoteTotal';
import AddServiceModal from '../components/modals/AddServiceModal';
import PDFPreviewModal from '../components/modals/PDFPreviewModal';
import ConfirmationModal, { ExclamationTriangleIcon, InboxArrowDownIcon } from '../components/modals/ConfirmationModal';
import axios from 'axios';
import QuotePDFDocument from '../components/quote/QuotePDFDocument';
import QuotePDFClientDocument from '../components/quote/QuotePDFClientDocument';
import PDFSelectionModal from '../components/modals/PDFSelectionModal';

function NewQuote({ onNavigateToHistorico, previewingQuote, onCloneQuote }) {
    const [items, setItems] = useState([]);
    const conceptsFetchedRef = useRef(false);
    const exchangeRateFetchedRef = useRef(false);
    const quoteFormRef = useRef();
    const [exchangeRate, setExchangeRate] = useState(null); // To store the exchange rate

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isClearQuoteModalOpen, setIsClearQuoteModalOpen] = useState(false);
    const [isSaveQuoteModalOpen, setIsSaveQuoteModalOpen] = useState(false);
    const [isPdfPreviewOpen, setIsPdfPreviewOpen] = useState(false);
    const [isPdfSelectionModalOpen, setIsPdfSelectionModalOpen] = useState(false);
    const [pdfData, setPdfData] = useState(null);
    const [pdfDocumentComponent, setPdfDocumentComponent] = useState(null);
    const [allServices, setAllServices] = useState([]);
    const [defaultConceptos, setDefaultConceptos] = useState([]);


    // isReadOnly será true si se está previsualizando CUALQUIER cotización existente.
    const [isReadOnly, setIsReadOnly] = useState(!!previewingQuote);

    const [onNewQuoteBlocked, setOnNewQuoteBlocked] = useState(true);

    const [quoteDataForPreview, setQuoteDataForPreview] = useState(null);
    const [isFormReady, setIsFormReady] = useState(false);
    const [totalEnPalabras, setTotalEnPalabras] = useState(null);

    const [globalNoSc, setGlobalNoSc] = useState(false);
    const [globalNoVat, setGlobalNoVat] = useState(false);

    const quoteId = previewingQuote ? previewingQuote.id_cotizacion : null;

    const [isCaaMember, setIsCaaMember] = useState(false);


    const [totals, setTotals] = useState({
        cost: 0,
        sCharge: 0,
        vat: 0,
        total: 0,
    });

  
    useEffect(() => {
        //Si es una cotización existente, cargar sus datos (Previewing Quote)
        if (quoteId) {
            // Para CUALQUIER cotización existente, el formulario es de solo lectura.
            setIsReadOnly(true);
            // Los botones de Exportar/Clonar se habilitan para activas, se deshabilitan para inactivas.
            setOnNewQuoteBlocked(previewingQuote?.estatus === 'INACTIVA');

            axios.get(`http://localhost:3000/api/cotizacion/${quoteId}`)
                .then(response => {
                    const quoteData = response.data;
                    setTotalEnPalabras(quoteData.total_en_palabras || null); // Guarda el campo de unión si existe

                    // Verificar si es una cotización unida
                    const isJoinedQuote = quoteData.total_en_palabras && quoteData.total_en_palabras.startsWith('JOIN OF:');

                    // Mapear servicios a items
                    const mappedItems = quoteData.servicios.map(servicio => ({
                        description: servicio.nombre_servicio,
                        category: servicio.nombre_cat_concepto,
                        quantity: servicio.cantidad,
                        priceMXN: servicio.costo_mxn,
                        priceUSD: servicio.costo_usd,
                        scPercentage: servicio.sc_porcentaje,
                        vatPercentage: servicio.vat_porcentaje,
                        anchorCurrency: 'MXN',
                        total: servicio.total_usd,
                        noSc: parseFloat(servicio.sc_porcentaje) === 0,
                        noVat: parseFloat(servicio.vat_porcentaje) === 0,
                    }));
                    setItems(mappedItems);
                    setExchangeRate(quoteData.exchange_rate);

                    // Si es una cotización unida, abrir directamente el PDF
                    if (isJoinedQuote) {
                        // Construir formData desde los datos de la cotización
                        const formDataForPdf = {
                            quoteNumber: quoteData.numero_referencia || null, 
                            customerName: quoteData.cliente || '',
                            date: quoteData.fecha_cotizacion ? new Date(quoteData.fecha_cotizacion).toISOString().split('T')[0] : '',
                            flightTypeName: quoteData.cat_operacion || '',
                            quotedBy: quoteData.nombre_responsable || '',
                            aircraftModelName: quoteData.modelo_aeronave || '',
                            aircraftRegistrationValue: quoteData.matricula_aeronave || '',
                            stationName: quoteData.aeropuerto || '',
                            fboName: quoteData.fbo || '',
                            exchangeRate: quoteData.exchange_rate,
                            totalEnPalabras: quoteData.total_en_palabras || null,
                            eta: quoteData.fecha_llegada ? new Date(quoteData.fecha_llegada).toISOString().split('T')[0] : null,
                            etd: quoteData.fecha_salida ? new Date(quoteData.fecha_salida).toISOString().split('T')[0] : null,
                            crewFrom: quoteData.tripulacion_llegada || '',
                            paxFrom: quoteData.pasajeros_llegada || '',
                            crewTo: quoteData.tripulacion_salida || '',
                            paxTo: quoteData.pasajeros_salida || '',
                            fromName: quoteData.aeropuerto_origen || '',
                            toName: quoteData.aeropuerto_destino || '',
                        };

                        // Procesar piernas si existen
                        let legsData = null;
                        if (quoteData.legs && quoteData.legs.length > 0) {
                            legsData = quoteData.legs.map(leg => {
                                const legItems = leg.servicios.map(servicio => ({
                                    description: servicio.nombre_servicio,
                                    category: servicio.nombre_cat_concepto,
                                    quantity: servicio.cantidad,
                                    priceMXN: servicio.costo_mxn,
                                    priceUSD: servicio.costo_usd,
                                    scPercentage: servicio.sc_porcentaje,
                                    vatPercentage: servicio.vat_porcentaje,
                                    anchorCurrency: 'MXN',
                                    total: servicio.total_usd,
                                    noSc: parseFloat(servicio.sc_porcentaje) === 0,
                                    noVat: parseFloat(servicio.vat_porcentaje) === 0,
                                }));

                                return {
                                    quoteNumber: leg.quoteNumber,
                                    station: leg.station,
                                    eta: leg.eta ? new Date(leg.eta).toISOString().split('T')[0] : null,
                                    etd: leg.etd ? new Date(leg.etd).toISOString().split('T')[0] : null,
                                    from: leg.from,
                                    to: leg.to,
                                    crewFrom: leg.crewFrom,
                                    paxFrom: leg.paxFrom,
                                    crewTo: leg.crewTo,
                                    paxTo: leg.paxTo,
                                    items: legItems
                                };
                            });
                        }

                        // Calcular totales
                        const calculatedTotals = mappedItems.reduce((acc, item) => {
                            const quantity = parseFloat(item.quantity) || 0;
                            const priceUSD = parseFloat(item.priceUSD) || 0;
                            const scPercentage = parseFloat(item.scPercentage) || 0;
                            const vatPercentage = parseFloat(item.vatPercentage) || 0;

                            const cost = quantity * priceUSD;
                            const sCharge = cost * scPercentage;
                            const vat = cost * vatPercentage;

                            acc.cost += cost;
                            acc.sCharge += sCharge;
                            acc.vat += vat;
                            acc.total += cost + sCharge + vat;
                            return acc;
                        }, { cost: 0, sCharge: 0, vat: 0, total: 0 });

                        // Abrir PDF directamente
                        const fullPdfData = {
                            formData: formDataForPdf,
                            items: mappedItems,
                            totals: calculatedTotals,
                            legs: legsData, // Datos agrupados por pierna
                        };

                        setPdfData(fullPdfData);
                        setIsPdfSelectionModalOpen(true);
                        setOnNewQuoteBlocked(false);
                    } else {
                        // Si no es una unión, comportamiento normal: mostrar formulario
                        setQuoteDataForPreview(quoteData);
                        setOnNewQuoteBlocked(false);
                    }
                })
                .catch(error => console.error('Error fetching quote details:', error));
            // Si es una cotización clonada
        } else if (previewingQuote?.isClone) {
            setIsReadOnly(false); // El formulario debe ser editable
            setOnNewQuoteBlocked(true); // Bloqueamos el PDF hasta que se guarde
            setItems(previewingQuote.items || []); // Seteamos los servicios.
            setExchangeRate(previewingQuote.exchangeRate); // Usamos el tipo de cambio de la cotización clonada.
            setQuoteDataForPreview(previewingQuote); // Preparamos los datos para rellenar el formulario.
            setIsFormReady(false); // Reseteamos para forzar la sincronización

            // Check if all items have 0% to set the global checkboxes
            const allNoSc = previewingQuote.items?.every(item => item.scPercentage === 0);
            const allNoVat = previewingQuote.items?.every(item => item.vatPercentage === 0);
            setGlobalNoSc(allNoSc);
            setGlobalNoVat(allNoVat);

            //Si es nueva cotización
        } else {
            // Limpia todo y busca el tipo de cambio
            setIsReadOnly(false); // Asegura que el formulario esté editable para una nueva cotización
            setOnNewQuoteBlocked(true);
            setQuoteDataForPreview(null); // Limpia los datos de preview
            setTotalEnPalabras(null); // Limpia el campo de unión
            setIsFormReady(false); // Resetea el estado de "listo"
            setGlobalNoSc(false);
            setGlobalNoVat(false);

            if (quoteFormRef.current) {
                if (!previewingQuote?.isClone) quoteFormRef.current.clearAllFields();
            }
            const fetchExchangeRate = async () => {
                // Previene la doble llamada de la API en StrictMode para el tipo de cambio
                if (exchangeRateFetchedRef.current) {
                    return;
                }
                exchangeRateFetchedRef.current = true;

                try {
                    const response = await axios.get('http://localhost:3000/api/tipo-de-cambio');
                    setExchangeRate(parseFloat(response.data.tipoDeCambio));
                } catch (error) {
                    console.error('Error fetching exchange rate:', error);
                    setExchangeRate(18);
                }
            };

            fetchExchangeRate(); // <-- Llamada a la API (Solo 1 vez por carga)
        }

    }, [quoteId, previewingQuote]);

    // Se ejecuta cuando los datos de la cotización están listos O cuando el formulario está listo.
    useEffect(() => {
        // Solo procede si AMBAS condiciones se cumplen:
        // 1. Tenemos los datos de la cotización a previsualizar.
        // 2. El QuoteForm nos ha notificado que sus listas están cargadas.
        if (quoteDataForPreview && isFormReady && quoteFormRef.current) {
            console.log("¡Sincronización completa! Rellenando formulario...");
            // Si es una clonación (isClone = true), preservar el usuario logueado actual
            const isClone = previewingQuote?.isClone || false;
            quoteFormRef.current.setFormData(quoteDataForPreview, isClone);
        }
    }, [quoteDataForPreview, isFormReady, previewingQuote]);

    useEffect(() => {
        const newTotals = items.reduce((acc, item) => {
            // Aseguramos que todos los valores sean numéricos, con 0 como fallback.
            const quantity = parseFloat(item.quantity) || 0;
            const priceUSD = parseFloat(item.priceUSD) || 0;
            const scPercentage = parseFloat(item.scPercentage) || 0;
            const vatPercentage = parseFloat(item.vatPercentage) || 0;

            const cost = quantity * priceUSD;
            const sCharge = cost * scPercentage;
            const vat = cost * vatPercentage;

            acc.cost += cost;
            acc.sCharge += sCharge;
            acc.vat += vat;
            acc.total += cost + sCharge + vat; // Recalculamos el total aquí para mayor seguridad
            return acc;
        }, { cost: 0, sCharge: 0, vat: 0, total: 0 });

        setTotals(newTotals);
    }, [items]);

    // Recalculate all item totals when the exchange rate changes
    useEffect(() => {
        if (exchangeRate) {
            setItems(prevItems =>
                prevItems.map(item => {
                    let newPriceUSD = item.priceUSD;
                    let newPriceMXN = item.priceMXN;

                    if (item.anchorCurrency === 'MXN') {
                        newPriceUSD = +((item.priceMXN || 0) / exchangeRate).toFixed(4);
                    } else { // anchorCurrency is 'USD'
                        newPriceMXN = +((item.priceUSD || 0) * exchangeRate).toFixed(4);
                    }

                    // Recalculate the total for the item
                    const cost = (item.quantity || 0) * newPriceUSD;
                    const serviceCharge = cost * (item.scPercentage || 0);
                    const vat = cost * (item.vatPercentage || 0);
                    const newTotal = cost + serviceCharge + vat;

                    return {
                        ...item,
                        priceUSD: newPriceUSD,
                        priceMXN: newPriceMXN,
                        total: newTotal,
                    };
                })
            );
        }
    }, [exchangeRate]);

    // Effect for Global "No SC" Checkbox
    useEffect(() => {
        setItems(prevItems =>
            prevItems.map(item => ({
                ...item,
                scPercentage: globalNoSc ? 0 : 0.18,
                noSc: globalNoSc,
            }))
        );
    }, [globalNoSc]);

    // Effect for Global "No VAT" Checkbox
    useEffect(() => {
        setItems(prevItems =>
            prevItems.map(item => ({
                ...item,
                vatPercentage: globalNoVat ? 0 : 0.16,
                noVat: globalNoVat,
            }))
        );
    }, [globalNoVat]);

    const handleGlobalCheckboxChange = (setter, value) => {
        setter(value);
    };

    const fetchServices = async (id_aeropuerto, id_fbo) => {
        // GUARDIA DE SEGURIDAD:
        // Si estamos en modo lectura (visualizando una cotización guardada), 
        // NO permitimos que esta función altere o limpie los servicios.
        if (isReadOnly) return;

        // 1. Siempre limpiar items al cambiar de selección principal
        // Mantenemos solo items manuales que el usuario haya escrito a mano (sin descripción predefinida)

        setItems(prevItems => prevItems.filter(item => item.description === ''));

        if (id_fbo) {
            try {
                const response = await axios.get('http://localhost:3000/api/servicios', {
                    params: { id_fbo }, // Send only id_fbo
                });

                const serviciosData = response.data;
                setAllServices(serviciosData); // Guardamos todo para el Modal
 
               // 2. Filtramos solo los que deben aparecer AUTOMÁTICAMENTE (es_default = true)
                const defaultServices = serviciosData.filter(s => s.es_default);

                const newItemsToAdd = defaultServices.map(s => {
                // 1. Detectamos la divisa base del servicio
                const isUSD = s.divisa === 'USD';
                
                let priceMXN = 0;
                let priceUSD = 0;

                // 2. Calculamos precios según la divisa base
                if (isUSD) {
                    priceUSD = parseFloat(s.tarifa_servicio) || 0;
                    // Si es USD, el MXN se calcula multiplicando por el tipo de cambio
                    priceMXN = exchangeRate ? +((priceUSD) * exchangeRate).toFixed(2) : 0;
                } else {
                    priceMXN = parseFloat(s.tarifa_servicio) || 0;
                    // Si es MXN, el USD se calcula dividiendo
                    priceUSD = exchangeRate ? +((priceMXN) / exchangeRate).toFixed(4) : 0;
                }

                const quantity = 1;
                const scPercentage = globalNoSc ? 0 : 0.18;
                const vatPercentage = globalNoVat ? 0 : 0.16;
                
                // Calcular totales usando priceUSD (que ya es correcto sea cual sea el origen)
                const cost = quantity * priceUSD;
                const serviceCharge = cost * scPercentage;
                const vat = cost * vatPercentage;
                const total = cost + serviceCharge + vat;

                return {
                    description: s.nombre_concepto_default,
                    category: s.nombre_cat_concepto,
                    quantity,
                    priceMXN,
                    priceUSD,
                    scPercentage,
                    vatPercentage,
                    noSc: globalNoSc,
                    noVat: globalNoVat,
                    // 3. Aquí definimos quién manda (el ancla) para futuras ediciones manuales
                    anchorCurrency: isUSD ? 'USD' : 'MXN', 
                    total,
                };
            });
                    
                // Agregamos a la tabla
                setItems(prev => [...prev, ...newItemsToAdd]);

            } catch (error) {
                console.error('Error fetching FBO services:', error);
            }
        } else {
            // Si no hay FBO seleccionado (o se deseleccionó), limpiamos la lista de servicios disponibles
            setAllServices([]);
        }
    };

    // Usamos useCallback para que la función no se recree en cada render
        // y evite disparar el useEffect del hijo infinitamente.
        const handleCaaChange = useCallback((isMember) => {
            setIsCaaMember(isMember); 
            
            // Si Global No SC está activo, no hacemos nada visualmente
            if (globalNoSc) return; 

            setItems(prevItems => 
                prevItems.map(item => {
                    const newScPercentage = isMember ? 0.10 : 0.18;
                    
                    // Recalcular totales
                    // Nota: Usamos item.priceUSD y item.vatPercentage directamente del item actual
                    const cost = (item.quantity || 0) * (item.priceUSD || 0);
                    const sCharge = cost * newScPercentage;
                    const vat = cost * (item.vatPercentage || 0);
                    const newTotal = cost + sCharge + vat;

                    return {
                        ...item,
                        scPercentage: newScPercentage,
                        noSc: newScPercentage === 0, 
                        total: newTotal
                    };
                })
            );
        }, [globalNoSc]); // Dependencia: Solo se recrea si globalNoSc cambia
        
    
    const handleAddItem = () => {

        // Determinar porcentaje inicial: Si hay GlobalNoSC es 0, si es CAA es 0.10, sino 0.18
        const initialSc = globalNoSc ? 0 : (isCaaMember ? 0.10 : 0.18);

        const newItem = {
            description: '',
            category: '',
            quantity: 1,
            priceMXN: 0,
            priceUSD: 0,
            scPercentage: initialSc, // <--- CAMBIO AQUÍ            vatPercentage: globalNoVat ? 0 : 0.16, // Respect global state
            noSc: globalNoSc,
            noVat: globalNoVat,
            anchorCurrency: 'MXN', // Default anchor
            total: 0,
        };
        setItems([...items, newItem]);
    };

    const handleClearQuote = () => {
        setIsClearQuoteModalOpen(true);
    };

    const handleClerQuote = () => {
        if (quoteFormRef.current) {
            quoteFormRef.current.clearAllFields();
        }
        setItems([]); // Also clear the items in the table
        setIsClearQuoteModalOpen(false);
        setIsReadOnly(false);
    };

    const handleRemoveItem = (index) => {
        const newItems = [...items];
        newItems.splice(index, 1);
        setItems(newItems);
    };

    const handleUpdateItem = (index, field, value) => {
        if (!exchangeRate) return; // Don't update if exchange rate is not loaded

        const newItems = [...items];
        const item = newItems[index];

        // If a user manually changes a percentage, uncheck the global checkbox
        if (field === 'scPercentage' && globalNoSc) {
            setGlobalNoSc(false);
        }
        if (field === 'vatPercentage' && globalNoVat) {
            setGlobalNoVat(false);
        }

        item[field] = value;

        if (field === 'priceMXN') {
            item.priceUSD = +((value || 0) / exchangeRate).toFixed(4);
            item.anchorCurrency = 'MXN'; // Set anchor
        } else if (field === 'priceUSD') {
            item.priceMXN = +((value || 0) * exchangeRate).toFixed(4);
            item.anchorCurrency = 'USD'; // Set anchor
        }

        // Recalculate the total based on the full item data
        const cost = (item.quantity || 0) * (item.priceUSD || 0);
        const serviceCharge = cost * (item.scPercentage || 0);
        const vat = cost * (item.vatPercentage || 0);

        item.total = cost + serviceCharge + vat;

        setItems(newItems);
    };

    const handleSaveServices = (selectedServicesFromModal) => {
        if (!exchangeRate) return;

        const newServiceItems = selectedServicesFromModal.map(service => {
            //1. DETECCIÓN DE DIVISA
            // Verificamos si el servicio viene en USD desde la base de datos
            const isUSD = service.divisa?.trim().toUpperCase() === 'USD';

            let priceMXN = 0;
            let priceUSD = 0;

            // 2. CÁLCULO DE PRECIOS SEGÚN DIVISA BASE
            if (isUSD) {
                priceUSD = parseFloat(service.tarifa_servicio) || 0;
                priceMXN = +((priceUSD) * exchangeRate).toFixed(2);
            } else {
                priceMXN = parseFloat(service.tarifa_servicio) || 0;
                priceUSD = +((priceMXN) / exchangeRate).toFixed(4);
            }

            const quantity = 1;

            const scPercentage = globalNoSc ? 0 : (isCaaMember ? 0.10 : 0.18);
            const vatPercentage = globalNoVat ? 0 : 0.16;
        
            // Calculamos totales basados en priceUSD (estándar)
            const cost = quantity * priceUSD;
            const serviceCharge = cost * scPercentage;
            const vat = cost * vatPercentage;
            const total = cost + serviceCharge + vat;

            return {
                description: service.name,
                category: service.description,
                quantity,
                priceMXN,
                priceUSD,
                scPercentage,
                vatPercentage,
                noSc: globalNoSc,
                noVat: globalNoVat,
                // 3. FIJAMOS EL ANCLA CORRECTA
                anchorCurrency: isUSD ? 'USD' : 'MXN',
                total,
            };
        });

        const allServiceDescriptions = new Set(allServices.map(s => s.nombre_concepto_default));
        const nonServiceItems = items.filter(item => !allServiceDescriptions.has(item.description));

        setItems([...nonServiceItems, ...newServiceItems]);
    };


    const confirmAndSaveQuote = async () => {
        if (quoteFormRef.current) {
            const isValid = quoteFormRef.current.validate(exchangeRate); // Pass current exchangeRate
            if (!isValid) {
                setIsSaveQuoteModalOpen(false);
                return;
            }
            // Map frontend 'items' to backend 'servicios' structure

            const rawData = quoteFormRef.current.getFormData();

            const servicios = items.map(item => {
                const cost = (item.quantity || 0) * (item.priceUSD || 0);
                const s_cargo = cost * (item.scPercentage || 0);
                const vat = cost * (item.vatPercentage || 0);


                return {
                    nombre_servicio: item.description,
                    cantidad: item.quantity,
                    costo_mxn: item.priceMXN,
                    costo_usd: item.priceUSD,
                    sc_porcentaje: item.scPercentage,
                    vat_porcentaje: item.vatPercentage,
                    noSc: item.noSc,
                    noVat: item.noVat,
                    s_cargo: s_cargo,
                    vat: vat,
                    total_usd: item.total,
                };
            });

            const quoteData = {

                date: rawData.date,
                exchangeRate: rawData.exchangeRate,
                quotedBy: rawData.quotedBy,
                isCaaMember: rawData.isCaaMember,
                attn: rawData.attn,
                eta: rawData.eta,
                etd: rawData.etd,
                crewFrom: rawData.crewFrom,
                paxFrom: rawData.paxFrom,
                crewTo: rawData.crewTo,
                paxTo: rawData.paxTo,
                mtow: rawData.mtow,
                mtow_unit: rawData.mtow_unit,

                // Cliente
                customer: {
                    id: rawData.customer,       // ID o null
                    label: rawData.customerName // Nombre real o texto manual
                },

                        // Aeronave / Matrícula
                        aircraftModel: { 
                            id: rawData.aircraftModel, // ID de la matrícula (id_cliente_aeronave)
                            label: rawData.aircraftRegistrationValue, // Texto de la matrícula (ej. "XA-ABC")
                            id_modelo_aeronave: rawData.aircraftModelId, // ID del modelo de aeronave (id_modelo_aeronave)
                            modelo: rawData.aircraftModelName // AÑADIDO: El texto del modelo (ej. "G650")
                        },

                // Tipo de Vuelo
                flightType: {
                    id: rawData.flightType,
                    label: rawData.flightTypeName
                },

                // Estación
                station: {
                    id: rawData.station,
                    label: rawData.stationName
                },

                // FBO (Opcional)
                fbo: rawData.fbo || rawData.fboName
                    ? { id: rawData.fbo, label: rawData.fboName }
                    : null,

                // Origen (Opcional)
                from: rawData.from || rawData.fromName // Si hay ID o Texto
                    ? { id: rawData.from, label: rawData.fromName }
                    : null,

                // Destino (Opcional)
                to: rawData.to || rawData.toName
                    ? { id: rawData.to, label: rawData.toName }
                    : null,

                // --- SERVICIOS ---
                servicios: servicios
            };

            console.log("Payload enviado al Backend:", quoteData);
            try {
                const response = await axios.post('http://localhost:3000/api/cotizaciones', quoteData);
                console.log('Quote saved successfully:', response.data);
                // Navigate to historico after saving
                onNavigateToHistorico();

            } catch (error) {
                console.error('Error saving quote:', error);
                // Optionally, you can show an error message to the user
            }
        };
        setIsSaveQuoteModalOpen(false);
    };

    const handleSaveQuote = () => {
        if (quoteFormRef.current) {
            const isValid = quoteFormRef.current.validate(exchangeRate); // Pass current exchangeRate
            if (isValid) {
                setIsSaveQuoteModalOpen(true);
            }
        }
    };

    const handleSaveAsNew = () => {
        if (quoteFormRef.current) {
            quoteFormRef.current.clearQuoteNumberOnly();

            // Obtener el usuario logueado actual para reemplazar quotedBy
            const token = localStorage.getItem('token');
            let loggedInUser = '';
            if (token) {
                try {
                    const decodedToken = jwtDecode(token);
                    loggedInUser = decodedToken.username || '';
                } catch (error) {
                    console.error("Error decoding token:", error);
                }
            }

            // Asegurarse de que QuoteForm tenga el usuario actual antes de pasar los datos
            quoteFormRef.current.setQuotedByValue(loggedInUser);

            const currentFormData = quoteFormRef.current.getAllFormData();

            onCloneQuote({
                ...currentFormData,
                quotedBy: loggedInUser, // Sobrescribe con el usuario logueado actual
                items: items,
                servicios: items,
                exchangeRate: exchangeRate,
                isClone: true, // Marca explícitamente como clonación
            });
        }
    };

    const handlePreviewPdf = () => {
        setOnNewQuoteBlocked(true);
        if (quoteFormRef.current) {
            const isValid = quoteFormRef.current.validate(exchangeRate); // Pass current exchangeRate
            if (!isValid) {
                setOnNewQuoteBlocked(false); // Re-enable button if validation fails
                return;
            }
            const formData = quoteFormRef.current.getFormData();
            const fullPdfData = {
                formData: {
                    ...formData,
                    totalEnPalabras: totalEnPalabras, // Incluir el campo de unión si existe
                },
                items: items,
                totals: totals,

            };

            setPdfData(fullPdfData);
            setPdfDocumentComponent(() => QuotePDFDocument);
            setIsPdfPreviewOpen(true);
        }
    };

    const handlePreviewClientPdf = () => {
        setOnNewQuoteBlocked(true);
        if (quoteFormRef.current) {
            const isValid = quoteFormRef.current.validate(exchangeRate); // Pass current exchangeRate
            if (!isValid) {
                setOnNewQuoteBlocked(false); // Re-enable button if validation fails
                return;
            }
            const formData = quoteFormRef.current.getFormData();
            const fullPdfData = {
                formData: {
                    ...formData,
                    totalEnPalabras: totalEnPalabras, // Incluir el campo de unión si existe
                },
                items: items,
                totals: totals,
            };

            setPdfData(fullPdfData);
            setPdfDocumentComponent(() => QuotePDFClientDocument);
            setIsPdfPreviewOpen(true);
        }
    };

    const handleSelectOpsPdf = () => {
        setPdfDocumentComponent(() => QuotePDFDocument);
        setIsPdfSelectionModalOpen(false);
        setIsPdfPreviewOpen(true);
    };

    const handleSelectClientPdf = () => {
        setPdfDocumentComponent(() => QuotePDFClientDocument);
        setIsPdfSelectionModalOpen(false);
        setIsPdfPreviewOpen(true);
    };

    const subtotal = items.reduce((acc, item) => acc + item.total, 0);
    const tax = subtotal * 0.16; // 16% IVA
    const total = subtotal + tax;

    // Find which of the current items are services to pass to the modal
    const initialSelectedServices = items
        .filter(item => allServices.some(s => s.nombre_concepto_default === item.description))
        .map(item => {
            const service = allServices.find(s => s.nombre_concepto_default === item.description);
            return { ...service, id: service.id_precio_concepto || service.id_concepto_std, name: service.nombre_concepto_default };

        });

    return (
        <div className="bg-blue-dark p-8">
            <div className="bg-gray-50 min-h-screen rounded-lg shadow-lg p-6">
                <QuoteHeader onClearQuote={handleClearQuote}
                    onSaveQuote={handleSaveQuote}
                    onExportToPdf={handlePreviewPdf}
                    onExportToClientPdf={handlePreviewClientPdf}
                    isReadOnly={isReadOnly}
                    onNewQuoteBlocked={onNewQuoteBlocked}
                    onSaveAsNew={handleSaveAsNew}
                />
                <main className="max-w-7xl mx-auto mt-4 ">
                    <QuoteForm
                        ref={quoteFormRef}
                        onAddItem={handleAddItem}
                        onCaaChange={handleCaaChange}
                        onOpenServiceModal={() => setIsModalOpen(true)}
                        onSelectionChange={fetchServices}
                        exchangeRate={exchangeRate || ''}
                        onExchangeRateChange={(value) => setExchangeRate(parseFloat(value) || 0)}
                        isReadOnly={isReadOnly}
                        onDataLoaded={() => setIsFormReady(true)}
                        globalNoSc={globalNoSc}
                        globalNoVat={globalNoVat}
                        onGlobalNoScChange={(e) => handleGlobalCheckboxChange(setGlobalNoSc, e.target.checked)}
                        onGlobalNoVatChange={(e) => handleGlobalCheckboxChange(setGlobalNoVat, e.target.checked)}
                    />
                    <QuoteTable items={items}
                        onRemoveItem={handleRemoveItem}
                        onUpdateItem={handleUpdateItem}
                        isReadOnly={isReadOnly}
                        globalNoSc={globalNoSc}
                        globalNoVat={globalNoVat}
                    />
                    <QuoteTotal totals={totals} />
                </main>
                <AddServiceModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    onSave={handleSaveServices}
                    initialSelectedServices={initialSelectedServices}
                    allServices={allServices.map(s => ({ ...s, id: s.id_precio_concepto || s.id_concepto_std, name: s.nombre_concepto_default, description: s.nombre_cat_concepto }))}
                />
                <ConfirmationModal
                    isOpen={isClearQuoteModalOpen}
                    onClose={() => setIsClearQuoteModalOpen(false)}
                    onConfirm={handleClerQuote}
                    title="Clear Quote"
                    icon={ExclamationTriangleIcon}
                    iconBgColorClass="bg-red-100"
                    iconColorClass="text-red-600"
                >
                    <p className="text-base text-gray-700"> ¿Are you sure you want to clear this quote?</p>
                </ConfirmationModal>

                <ConfirmationModal
                    isOpen={isSaveQuoteModalOpen}
                    onClose={() => setIsSaveQuoteModalOpen(false)}
                    onConfirm={confirmAndSaveQuote}
                    title="Save Quote"
                    icon={InboxArrowDownIcon}
                    iconBgColorClass="bg-blue-100"
                    iconColorClass="text-blue-600"
                >
                    <p className="text-base text-gray-700">Do you want to save this quote?</p>
                </ConfirmationModal>

                <PDFPreviewModal
                    isOpen={isPdfPreviewOpen}
                    onClose={() => {
                        setIsPdfPreviewOpen(false);
                        // Si es una cotización unida, regresar al histórico
                        if (totalEnPalabras && totalEnPalabras.startsWith('JOIN OF:')) {
                            onNavigateToHistorico();
                        } else if (quoteId) {
                            // Si estamos en modo preview normal, los botones deben volver a habilitarse.
                            setOnNewQuoteBlocked(false);
                        }
                    }}
                    pdfData={pdfData}
                    DocumentComponent={pdfDocumentComponent}
                />
                <PDFSelectionModal
                    isOpen={isPdfSelectionModalOpen}
                    onClose={() => {
                        setIsPdfSelectionModalOpen(false);
                        onNavigateToHistorico();
                    }}
                    onSelectOps={handleSelectOpsPdf}
                    onSelectClient={handleSelectClientPdf}
                />
            </div>
        </div>
    );
}
export default NewQuote;
