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

    const [currentMtow, setCurrentMtow] = useState(0); // Guardar el peso actual en Toneladas

    const LANDING_PERMIT_COORD = 'Landing Permit Coordination';
    
    const [isGeneralAviation, setIsGeneralAviation] = useState(false); 

    const [totals, setTotals] = useState({
        cost: 0,
        sCharge: 0,
        vat: 0,
        total: 0,
    });

    const [categoryCoordFee, setCategoryCoordFee] = useState(0);

    //Callback para recibir la tarifa desde QuoteForm
    const handleCategoryFeeChange = useCallback((fee) => {
        setCategoryCoordFee(fee);
    }, []);

    // Convertir a Toneladas
    const calculateTons = (val, unit) => {
        const weight = parseFloat(val) || 0;
        if (weight === 0) return 0;
        // Si es KG -> dividir entre 1000
        // Si es LB -> dividir entre 2204.62
        return unit === 'KG' ? weight / 1000 : weight / 2204.62;
    };

  
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
                    const mappedItems = quoteData.servicios.map(servicio => {
                        // RECONSTRUCCIÓN DE TARIFA BASE:
                        // Calculamos la tarifa unitaria original para que, si se recalcula por peso,
                        // el precio se mantenga estable y no se dispare.
                        const isLanding = servicio.nombre_servicio.toUpperCase().includes('LANDING FEE');
                        const isGeneralAviation = servicio.nombre_cat_concepto === 'Airport Services General Aviation';
                        const mtow = parseFloat(quoteData.mtow) || 0;
                        const mtowUnit = quoteData.mtow_unit || 'KG';
                        const tons = (mtow > 0) ? (mtowUnit === 'KG' ? mtow / 1000 : mtow / 2204.62) : 0;

                        let baseRate = undefined;
                        if (isLanding && isGeneralAviation && tons > 0) {
                            const priceMXN = parseFloat(servicio.costo_mxn) || 0;
                            // Fórmula inversa: Base = (Precio - 1.16) / Toneladas
                            if (priceMXN > 0) {
                                baseRate = (priceMXN - 1.16) / tons;
                            }
                        }

                        return {
                            description: servicio.nombre_servicio,
                            category: servicio.nombre_cat_concepto,
                            quantity: parseFloat(servicio.cantidad) || 0,
                            priceMXN: parseFloat(servicio.costo_mxn) || 0,
                            priceUSD: parseFloat(servicio.costo_usd) || 0,
                            scPercentage: parseFloat(servicio.sc_porcentaje) || 0,
                            vatPercentage: parseFloat(servicio.vat_porcentaje) || 0,
                            anchorCurrency: 'MXN',
                            total: parseFloat(servicio.total_usd) || 0,
                            noSc: parseFloat(servicio.sc_porcentaje) === 0,
                            noVat: parseFloat(servicio.vat_porcentaje) === 0,
                            baseRate: baseRate,
                        };
                    });
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
                            isCaaMember: !!quoteData.es_miembro_caa,
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
                            const vat = sCharge * vatPercentage;

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

            // Cargar los servicios disponibles para el FBO seleccionado
            if (previewingQuote.selectedFboId) {
                axios.get('http://localhost:3000/api/servicios', {
                    params: { id_fbo: previewingQuote.selectedFboId },
                })
                .then(response => setAllServices(response.data))
                .catch(error => console.error('Error fetching services for clone:', error));
            }

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

    // Helper: Calcular el total de un item (costo + sCharge + vat)
    const calculateItemTotal = (item) => {
        const quantity = parseFloat(item.quantity) || 0;
        const priceUSD = parseFloat(item.priceUSD) || 0;
        const scPercentage = parseFloat(item.scPercentage) || 0;
        const vatPercentage = parseFloat(item.vatPercentage) || 0;

        const cost = quantity * priceUSD;
        const sCharge = cost * scPercentage;
        const vat = sCharge * vatPercentage;
        const itemTotal = parseFloat((cost + sCharge + vat).toFixed(2));

        return itemTotal;
    };

    useEffect(() => {
        const newTotals = items.reduce((acc, item) => {
            // Aseguramos que todos los valores sean numéricos, con 0 como fallback.
            const quantity = parseFloat(item.quantity) || 0;
            const priceUSD = parseFloat(item.priceUSD) || 0;
            const scPercentage = parseFloat(item.scPercentage) || 0;
            const vatPercentage = parseFloat(item.vatPercentage) || 0;

            const rawCost = quantity * priceUSD;
            const rawSCharge = rawCost * scPercentage;
            const rawVat = rawSCharge * vatPercentage;

            // Redondeamos cada componente para que coincida con lo que se muestra en las columnas de la tabla
            const costRounded = parseFloat(rawCost.toFixed(2));
            const sChargeRounded = parseFloat(rawSCharge.toFixed(2));
            const vatRounded = parseFloat(rawVat.toFixed(2));
            
            // El total del ítem también se redondea (suma de crudos, luego redondeo)
            const itemTotalRounded = parseFloat((rawCost + rawSCharge + rawVat).toFixed(2));

            acc.cost += costRounded;
            acc.sCharge += sChargeRounded;
            acc.vat += vatRounded;
            acc.total += itemTotalRounded; 
            return acc;
        }, { cost: 0, sCharge: 0, vat: 0, total: 0 });

        setTotals(newTotals);
    }, [items]);

    // Recalculate all item totals when the exchange rate changes
    useEffect(() => {
        if (exchangeRate) {
            setItems(prevItems =>
                prevItems.map(item => {
                    // If the user entered a manual price, don't overwrite their values.
                    // Still recalculate the total using the manual price so totals stay in sync.
                    if (item.manualPrice) {
                        const cost = (item.quantity || 0) * (item.priceUSD || 0);
                        const serviceCharge = cost * (item.scPercentage || 0);
                        const vat = serviceCharge * (item.vatPercentage || 0);
                        const newTotal = parseFloat((cost + serviceCharge + vat).toFixed(2));
                        return {
                            ...item,
                            total: newTotal,
                        };
                    }

                    let newPriceUSD = item.priceUSD || 0;
                    let newPriceMXN = item.priceMXN || 0;

                    if (item.anchorCurrency === 'MXN') {
                        newPriceUSD = parseFloat((Number(item.priceMXN || 0) / exchangeRate).toFixed(2));
                        newPriceMXN = parseFloat(Number(item.priceMXN || 0).toFixed(2));
                    } else { // anchorCurrency is 'USD'
                        newPriceMXN = parseFloat((Number(item.priceUSD || 0) * exchangeRate).toFixed(2));
                        newPriceUSD = parseFloat(Number(item.priceUSD || 0).toFixed(2));
                    }

                    // Recalculate the total for the item using the updated prices
                    const updatedItem = {
                        ...item,
                        priceUSD: newPriceUSD,
                        priceMXN: newPriceMXN,
                    };
                    const newTotal = calculateItemTotal(updatedItem);

                    return {
                        ...updatedItem,
                        total: newTotal,
                    };
                })
            );
        }
    }, [exchangeRate]);


    // Effect for Global "No VAT" Checkbox - FUNCIONA BIEN, no modificar
    useEffect(() => {
        setItems(prevItems =>
            prevItems.map(item => {

                let targetSc;

                if (item.isScExempt) {
                    targetSc = globalNoSc ? 0 : item.scPercentage; 
                } else {
                    targetSc = globalNoSc ? 0 : (isCaaMember ? 0.10 : 0.18);
                }

                const targetVat = globalNoVat ? 0 : 0.16;
                
                // Actualizar vatPercentage y recalcular el total del item
                const updatedItem = {
                    ...item,
                    scPercentage: targetSc,
                    noSc: targetSc === 0,
                    total: cost + sCharge + vat,
                    vatPercentage: targetVat,
                    noVat: globalNoVat,
                };

                updatedItem.total = calculateItemTotal(updatedItem);
                return updatedItem;
            })
        );
    }, [globalNoVat]);

    // Effect: Cuando CAA Member cambia, actualizar SC% entre 10% y 18%
    const prevIsCaaMemberRef = useRef(isCaaMember);
    useEffect(() => {
        // Si isCaaMember cambió Y "No S.C." NO está marcado
        if (prevIsCaaMemberRef.current !== isCaaMember && !globalNoSc) {
            setItems(prevItems =>
                prevItems.map(item => {
                    // Si CAA se marcó (false → true): cambiar 18% a 10%
                    if (isCaaMember && item.scPercentage === 0.18) {
                        const updatedItem = {
                            ...item,
                            scPercentage: 0.10,
                        };
                        updatedItem.total = calculateItemTotal(updatedItem);
                        return updatedItem;
                    }
                    // Si CAA se desmarcó (true → false): cambiar 10% a 18%
                    if (!isCaaMember && item.scPercentage === 0.10) {
                        const updatedItem = {
                            ...item,
                            scPercentage: 0.18,
                        };
                        updatedItem.total = calculateItemTotal(updatedItem);
                        return updatedItem;
                    }
                    return item;
                })
            );
        }
        prevIsCaaMemberRef.current = isCaaMember;
    }, [isCaaMember, globalNoSc]);

    //Actualizar la tabla si cambia la categoría 
    useEffect(() => {
        setItems(prevItems => 
            prevItems.map(item => {
                if (item.description === LANDING_PERMIT_COORD) {
                    
                    if (!isGeneralAviation) {
                        return item; 
                    }

                    // Si manda 0, verificamos si el item tenía una tarifa base original, si no, 0.
                    const newPriceUSD = categoryCoordFee > 0 ? categoryCoordFee : (item.baseRate || 0);                    
                    // Convertir a MXN
                    const newPriceMXN = exchangeRate ? +((newPriceUSD) * exchangeRate).toFixed(2) : 0;
                    
                    const cost = (item.quantity || 0) * newPriceUSD;
                    const scPercentage = item.scPercentage || 0;
                    const vatPercentage = item.vatPercentage || 0;

                    return {
                        ...item,
                        priceUSD: newPriceUSD,
                        priceMXN: newPriceMXN,
                        anchorCurrency: 'USD', 
                        total: cost + (cost * scPercentage) + (cost * vatPercentage),
                        // Opcional: Marcar que este precio fue alterado por categoría
                        isCategoryOverride: categoryCoordFee > 0 
                    };
                }
                return item;
            })
        );
    }, [categoryCoordFee, exchangeRate, isGeneralAviation]); // Se ejecuta cuando cambia la tarifa de la categoría

    const handleGlobalCheckboxChange = (setter, value) => {
        setter(value);
        
        // SOLO para "No S.C.": aplicar la lógica inmediatamente sin sobrescribir ediciones manuales
        if (setter === setGlobalNoSc && value) {
            // Si marcó "No S.C.", poner SC% en 0 para TODOS
            setItems(prevItems =>
                prevItems.map(item => {
                    const updatedItem = {
                        ...item,
                        scPercentage: 0,
                        noSc: true,
                    };
                    updatedItem.total = calculateItemTotal(updatedItem);
                    return updatedItem;
                })
            );
        }
        // Si desmarcó "No S.C.", no hacer nada (los items mantienen sus valores)
    };

    const fetchServices = async (id_aeropuerto, id_fbo, fboName) => {
        // GUARDIA DE SEGURIDAD:
        // Si estamos en modo lectura (visualizando una cotización guardada), 
        // NO permitimos que esta función altere o limpie los servicios.
        if (isReadOnly) return;

        // 1. Siempre limpiar items al cambiar de selección principal
        // Mantenemos solo items manuales que el usuario haya escrito a mano (sin descripción predefinida)

        setItems(prevItems => prevItems.filter(item => item.description === ''));

        const isGenAv = fboName === 'Aviación General';
        setIsGeneralAviation(isGenAv); 

        if (id_fbo) {
            try {
                const response = await axios.get('http://localhost:3000/api/servicios', {
                    params: { id_fbo }, // Send only id_fbo
                });

                const serviciosData = response.data;

                setAllServices(serviciosData); // Guardamos todo para el Modal
 
               // 2. Filtramos solo los que deben aparecer AUTOMÁTICAMENTE (es_default = true)
                const defaultServices = serviciosData.filter(s => s.es_default);

                const TARGET_SERVICE_NAME = 'Landing Permit Coordination';

                const newItemsToAdd = defaultServices.map(s => {
                // 1. Detectamos la divisa base del servicio
                const isUSD = s.divisa === 'USD';
                
                let priceMXN = 0;
                let priceUSD = 0;

               const rawRate = parseFloat(s.tarifa_servicio) || 0;

                // 1. DETECTAR SI APLICA REGLA ESPECIAL (Por Nombre)
                const isTargetService = s.nombre_concepto_default === TARGET_SERVICE_NAME;

                // 2. CORRECCIÓN: Solo aplicamos el precio especial SI es Aviación General
                    if (isTargetService && categoryCoordFee > 0 && isGenAv) {
                        priceUSD = categoryCoordFee;
                        priceMXN = exchangeRate ? +((priceUSD) * exchangeRate).toFixed(2) : 0;
                    } else {
                        // Lógica normal (FBOs, Comercial, o sin categoría)
                        if (isUSD) {
                            priceUSD = rawRate;
                            priceMXN = exchangeRate ? +((priceUSD) * exchangeRate).toFixed(2) : 0;
                        } else {
                            priceMXN = rawRate;
                            priceUSD = exchangeRate ? +((priceMXN) / exchangeRate).toFixed(4) : 0;
                        }
                    }

                // Guardamos la tarifa base original para futuros cálculos de MTOW
                // Si es USD, la base es priceUSD, si es MXN (default), es priceMXN
                const baseRate = isUSD ? priceUSD : priceMXN;

                const quantity = 1;
                
                // Detectar si es exento desde la BD
                const isExempt = !!s.exento_sc;

                const scPercentage = isExempt ? 0 : (globalNoSc ? 0 : (isCaaMember ? 0.10 : 0.18));
                const vatPercentage = globalNoVat ? 0 : 0.16;

                
                // Calcular totales usando priceUSD (que ya es correcto sea cual sea el origen)
                const cost = quantity * priceUSD;

                // APLICAR FÓRMULA ESPECIAL PARA LANDING FEES DE AVIACIÓN GENERAL
                const isGeneralAviation = s.nombre_cat_concepto === 'Airport Services General Aviation';
                const isLanding = s.nombre_concepto_default.toUpperCase().includes('LANDING FEE');

                if (isGeneralAviation && isLanding && currentMtow > 0) {
                     const calculatedBase = baseRate * currentMtow + 1.16;
                     if (isUSD) {
                                priceUSD = parseFloat(calculatedBase.toFixed(2));
                                priceMXN = exchangeRate ? parseFloat((calculatedBase * exchangeRate).toFixed(2)) : 0;
                     } else {
                                priceMXN = parseFloat(calculatedBase.toFixed(2));
                                priceUSD = exchangeRate ? parseFloat((calculatedBase / exchangeRate).toFixed(2)) : 0;
                     }
                }

                const serviceCharge = cost * scPercentage;
                const vat = serviceCharge * vatPercentage;
                const total = cost + serviceCharge + vat;

                return {
                    description: s.nombre_concepto_default,
                    category: s.nombre_cat_concepto,
                    quantity,
                    priceMXN,
                    priceUSD,
                    scPercentage,
                    vatPercentage,
                    noSc: isExempt || globalNoSc,
                    noVat: globalNoVat,
                    // 3. Aquí definimos quién manda (el ancla) para futuras ediciones manuales
                    anchorCurrency: (isTargetService && categoryCoordFee > 0 && isGenAv) ? 'USD' : (isUSD ? 'USD' : 'MXN'),                    baseRate: baseRate, // Guardamos la tarifa base unitaria
                    total,

                    // NUEVA BANDERA: Protege este ítem de cambios automáticos
                    isScExempt: isExempt,
                    baseRate: rawRate
                    
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

    // 2. CALLBACK: Manejar cambio de MTOW (Con useCallback para evitar el error de loop)
    const handleMtowChange = useCallback((val, unit) => {
        const tons = calculateTons(val, unit);
        setCurrentMtow(tons);

        setItems(prevItems => 
            prevItems.map(item => {
                // Si el precio fue editado manualmente por el usuario, NO recalculamos
                if (item.manualPrice) return item;

                // Solo recalculamos si el ítem tiene guardada una 'baseRate' (Tarifa del DOF)
                // O si detectamos keywords en la descripción (por si son ítems viejos)
                const isLanding = item.description.toUpperCase().includes('LANDING FEE');

                // NUEVA VALIDACIÓN: Solo aplicar fórmula si es Aviación General
                const isGeneralAviation = item.category === 'Airport Services General Aviation';

                // Si no es Landing Fee O no es Aviación General, lo dejamos igual (no recalculamos)
                if (!isLanding || !isGeneralAviation) return item;

                // Definimos la tarifa base (Si ya la guardamos la usamos, si no, intentamos usar el precio actual como base solo la primera vez, pero es arriesgoso. Mejor confiamos en baseRate)
                const rate = item.baseRate || (item.anchorCurrency === 'USD' ? item.priceUSD : item.priceMXN);
                
                // Si tons es 0, dejamos el precio en 0 para evitar errores, o dejamos la tarifa base. 
                // Normalmente si no hay peso, el costo es 0 o la tarifa mínima. Asumiremos cálculo directo.
                let newPriceMXN = 0;
                let newPriceUSD = 0;

                if (tons > 0) {
                     // FÓRMULA: Tarifa * Toneladas + 1.16
                     const calculatedBase = (rate * tons) + 1.16;
                     
                     if (item.anchorCurrency === 'USD') {
                                newPriceUSD = parseFloat(calculatedBase.toFixed(2));
                                newPriceMXN = exchangeRate ? parseFloat((calculatedBase * exchangeRate).toFixed(2)) : 0;
                     } else {
                                newPriceMXN = parseFloat(calculatedBase.toFixed(2));
                                newPriceUSD = exchangeRate ? parseFloat((calculatedBase / exchangeRate).toFixed(2)) : 0;
                     }
                }

                // Recalcular totales del renglón usando el helper
                const updatedItem = {
                    ...item,
                    baseRate: item.baseRate || rate, 
                    priceMXN: parseFloat(Number(newPriceMXN || 0).toFixed(2)),
                    priceUSD: parseFloat(Number(newPriceUSD || 0).toFixed(2)),
                };
                
                const roundedTotal = calculateItemTotal(updatedItem);

                return {
                    ...updatedItem,
                    total: roundedTotal,
                };
            })
        );

    }, [exchangeRate]); // Dependencias: exchangeRate

    // Usamos useCallback para que la función no se recree en cada render
        // y evite disparar el useEffect del hijo infinitamente.
        const handleCaaChange = useCallback((isMember) => {
            setIsCaaMember(isMember);
        }, []); 
            
            
        
    
    const handleAddItem = () => {

        // 1. LÓGICA DE CONTEXTO:
        const additionalServiceItem = allServices.find(s => 
            s.nombre_cat_concepto && s.nombre_cat_concepto.includes('Additional Services')
        );

        // 2. ASIGNACIÓN:
        // Si lo encontramos (ej. "Additional Services Commercial Aviation"), usamos ese.
        // Si no (ej. aún no cargan servicios), usamos el de General Aviation como respaldo seguro.
        const correctCategory = additionalServiceItem 
            ? additionalServiceItem.nombre_cat_concepto 
            : '* Additional Services *';

        // Determinar porcentaje inicial: Si hay GlobalNoSC es 0, si es CAA es 0.10, sino 0.18       
        const initialSc = globalNoSc ? 0 : (isCaaMember ? 0.10 : 0.18);

        const newItem = {
            description: '',
            category: correctCategory,
            quantity: 1,
            priceMXN: 0,
            priceUSD: 0,
            scPercentage: initialSc,           
            vatPercentage: globalNoVat ? 0 : 0.16, // Respect global state
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
        setAllServices([]);
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
        
        // Si el usuario edita el precio manualmente, activamos la bandera para no sobrescribirlo con la fórmula de MTOW
        if (field === 'priceMXN' || field === 'priceUSD') {
            item.manualPrice = true;
        }

        item[field] = value;

        if (field === 'priceMXN') {
            item.priceUSD = parseFloat(Number((value || 0) / exchangeRate).toFixed(2));
            item.anchorCurrency = 'MXN'; // Set anchor
        } else if (field === 'priceUSD') {
            item.priceMXN = parseFloat(Number((value || 0) * exchangeRate).toFixed(2));
            item.anchorCurrency = 'USD'; // Set anchor
        }

        // Recalculate the total based on the full item data using the helper
        item.total = calculateItemTotal(item);

        setItems(newItems);
    };

    const handleSaveServices = (selectedServicesFromModal) => {
        if (!exchangeRate) return;

        // 1. Identificar items manuales (que no están en el catálogo de servicios del FBO actual)
        const allServiceDescriptions = new Set(allServices.map(s => s.nombre_concepto_default));
        const manualItems = items.filter(item => !allServiceDescriptions.has(item.description));

        // 2. Procesar los servicios seleccionados en el modal
        const processedServiceItems = selectedServicesFromModal.map(service => {
            // Verificar si este servicio YA existe en la tabla actual (items)
            // Usamos service.name porque así lo mapeamos al abrir el modal
            const existingItem = items.find(item => item.description === service.name);

            if (existingItem) {
                // Si ya existe, lo devolvemos TAL CUAL para no perder cambios manuales (precio, qty, etc.)
                return existingItem;
            }

            // Si es nuevo, calculamos sus valores iniciales
            //1. DETECCIÓN DE DIVISA
            // Verificamos si el servicio viene en USD desde la base de datos
            
            const isExempt = !!service.exento_sc;
            const isUSD = service.divisa?.trim().toUpperCase() === 'USD';

            const TARGET_SERVICE_NAME = 'Landing Permit Coordination';
            const isTargetService = service.name === TARGET_SERVICE_NAME;

            let priceMXN = 0;
            let priceUSD = 0;
            
            const rawRate = parseFloat(service.tarifa_servicio) || 0;

            // APLICAR REGLA: Si es el servicio Target + Es Aviación General + Hay Tarifa de Categoría
            if (isTargetService && isGeneralAviation && categoryCoordFee > 0) {
                priceUSD = categoryCoordFee;
                // Calculamos MXN basado en el precio especial
                priceMXN = +((priceUSD) * exchangeRate).toFixed(2);
            } else {
                // LÓGICA ESTÁNDAR (Si no cumple las condiciones anteriores)
                if (isUSD) {
                    priceUSD = rawRate;
                    priceMXN = parseFloat((priceUSD * exchangeRate).toFixed(2));
                } else {
                    priceMXN = rawRate;
                    priceUSD = parseFloat((priceMXN / exchangeRate).toFixed(4));
                }
            }

            const quantity = 1;

            const scPercentage = isExempt ? 0 : (globalNoSc ? 0 : (isCaaMember ? 0.10 : 0.18));
            const vatPercentage = globalNoVat ? 0 : 0.16;
        
            // Guardamos la tarifa base original para futuros cálculos de MTOW
            // Si es USD, la base es priceUSD, si es MXN (default), es priceMXN
            const baseRate = isUSD ? priceUSD : priceMXN;

            // APLICAR FÓRMULA ESPECIAL PARA LANDING FEES DE AVIACIÓN GENERAL
            const isGeneralAviation = service.nombre_cat_concepto === 'Airport Services General Aviation';
            const isLanding = service.nombre_concepto_default.toUpperCase().includes('LANDING FEE');

            if (isGeneralAviation && isLanding && currentMtow > 0) {
                const calculatedBase = baseRate * currentMtow + 1.16;
                if (isUSD) {
                    priceUSD = parseFloat(calculatedBase.toFixed(2));
                    priceMXN = exchangeRate ? parseFloat((calculatedBase * exchangeRate).toFixed(2)) : 0;
                } else {
                    priceMXN = parseFloat(calculatedBase.toFixed(2));
                    priceUSD = exchangeRate ? parseFloat((calculatedBase / exchangeRate).toFixed(2)) : 0;
                }
            }

            // Calculamos totales basados en priceUSD (estándar)
            const cost = quantity * priceUSD;
            const serviceCharge = cost * scPercentage;
            const vat = serviceCharge * vatPercentage;
            const total = parseFloat((cost + serviceCharge + vat).toFixed(2));

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
                anchorCurrency: (isTargetService && isGeneralAviation && categoryCoordFee > 0) ? 'USD' : (isUSD ? 'USD' : 'MXN'),                baseRate: baseRate, // Guardamos la tarifa base unitaria
                total,
                isScExempt: isExempt,
                baseRate: rawRate
            };
        });

        setItems([...manualItems, ...processedServiceItems]);
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

            // IMPORTANTE: Aplicar globalNoSc y globalNoVat JUSTO ANTES de guardar
            // para asegurar que los valores se respeten (esto evita problemas de timing con useEffect)
            const itemsToSave = items.map(item => {
                let finalScPercentage = item.scPercentage;
                let finalVatPercentage = item.vatPercentage;
                
                // Si globalNoSc está marcado, SIEMPRE usar 0 para SC
                if (globalNoSc) {
                    finalScPercentage = 0;
                }
                
                // Si globalNoVat está marcado, SIEMPRE usar 0 para VAT
                if (globalNoVat) {
                    finalVatPercentage = 0;
                }
                
                return {
                    ...item,
                    scPercentage: finalScPercentage,
                    vatPercentage: finalVatPercentage,
                    noSc: globalNoSc,
                    noVat: globalNoVat,
                };
            });

            const servicios = itemsToSave.map(item => {
                // Usar los precios y totales guardados directamente del item
                // Sin recalcular para respetar manualPrice, landing fee formula y valores exactos
                const quantity = parseFloat(item.quantity) || 0;
                const costo_mxn = parseFloat(Number(item.priceMXN || 0).toFixed(2));
                const costo_usd = parseFloat(Number(item.priceUSD || 0).toFixed(2));
                // Calcular s_cargo y vat IGUAL que en QuoteTable (qty * priceUSD * percentage)
                const s_cargo = parseFloat(Number(quantity * costo_usd * (item.scPercentage || 0)).toFixed(2));
                const vat = parseFloat(Number(s_cargo * (item.vatPercentage || 0)).toFixed(2));
                const total_usd = parseFloat(Number(item.total || 0).toFixed(2));

                return {
                    nombre_servicio: item.description,
                    cantidad: item.quantity,
                    costo_mxn: costo_mxn,
                    costo_usd: costo_usd,
                    sc_porcentaje: item.scPercentage,
                    vat_porcentaje: item.vatPercentage,
                    noSc: item.noSc,
                    noVat: item.noVat,
                    s_cargo: s_cargo,
                    vat: vat,
                    total_usd: total_usd,
                    nombre_cat_concepto: item.category,
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

                // Enviamos los totales calculados en el frontend para asegurar que se guarde lo mismo que se ve en pantalla
                total_costo: totals.cost,
                total_s_cargo: totals.sCharge,
                total_vat: totals.vat,
                total_final: totals.total,

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
            return { ...service, 
                        id: service.id_precio_concepto || service.id_concepto_std,
                        name: service.nombre_concepto_default,
                        description: service.nombre_cat_concepto
                   };

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
                        onMtowChange={handleMtowChange} 
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
                        onCategoryFeeChange={handleCategoryFeeChange}
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
