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
    const [exchangeRate, setExchangeRate] = useState(null);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isClearQuoteModalOpen, setIsClearQuoteModalOpen] = useState(false);
    const [isSaveQuoteModalOpen, setIsSaveQuoteModalOpen] = useState(false);
    const [isPdfPreviewOpen, setIsPdfPreviewOpen] = useState(false);
    const [isPdfSelectionModalOpen, setIsPdfSelectionModalOpen] = useState(false);
    const [pdfData, setPdfData] = useState(null);
    const [pdfDocumentComponent, setPdfDocumentComponent] = useState(null);
    const [allServices, setAllServices] = useState([]);
    const [defaultConceptos, setDefaultConceptos] = useState([]);

    const [isReadOnly, setIsReadOnly] = useState(!!previewingQuote);
    const [onNewQuoteBlocked, setOnNewQuoteBlocked] = useState(true);

    const [quoteDataForPreview, setQuoteDataForPreview] = useState(null);
    const [isFormReady, setIsFormReady] = useState(false);
    const [totalEnPalabras, setTotalEnPalabras] = useState(null);

    const [globalNoSc, setGlobalNoSc] = useState(false);
    const [globalNoVat, setGlobalNoVat] = useState(false);

    const quoteId = previewingQuote ? previewingQuote.id_cotizacion : null;

    const [isCaaMember, setIsCaaMember] = useState(false);
    const [currentMtow, setCurrentMtow] = useState(0);

    // Nuevos estados para Landing Permit Coordination
    const LANDING_PERMIT_COORD = 'Landing Permit Coordination';
    const [isGeneralAviation, setIsGeneralAviation] = useState(false);
    const [categoryCoordFee, setCategoryCoordFee] = useState(0);

    const [totals, setTotals] = useState({
        cost: 0,
        sCharge: 0,
        vat: 0,
        total: 0,
    });

    // Callback para recibir la tarifa desde QuoteForm
    const handleCategoryFeeChange = useCallback((fee) => {
        setCategoryCoordFee(fee);
    }, []);

    // Convertir a Toneladas
    const calculateTons = (val, unit) => {
        const weight = parseFloat(val) || 0;
        if (weight === 0) return 0;
        return unit === 'KG' ? weight / 1000 : weight / 2204.62;
    };

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
        if (quoteId) {
            setIsReadOnly(true);
            setOnNewQuoteBlocked(previewingQuote?.estatus === 'INACTIVA');

            axios.get(`http://localhost:3000/api/cotizacion/${quoteId}`)
                .then(response => {
                    const quoteData = response.data;
                    setTotalEnPalabras(quoteData.total_en_palabras || null);

                    const isJoinedQuote = quoteData.total_en_palabras && quoteData.total_en_palabras.startsWith('JOIN OF:');

                    const mappedItems = quoteData.servicios.map(servicio => {
                        const isLanding = servicio.nombre_servicio.toUpperCase().includes('LANDING FEE');
                        const isGeneralAviation = servicio.nombre_cat_concepto === 'Airport Services General Aviation';
                        const mtow = parseFloat(quoteData.mtow) || 0;
                        const mtowUnit = quoteData.mtow_unit || 'KG';
                        const tons = (mtow > 0) ? (mtowUnit === 'KG' ? mtow / 1000 : mtow / 2204.62) : 0;

                        let baseRate = undefined;
                        if (isLanding && isGeneralAviation && tons > 0) {
                            const priceMXN = parseFloat(servicio.costo_mxn) || 0;
                            if (priceMXN > 0) {
                                baseRate = (priceMXN / 1.16) / tons;
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

                    if (isJoinedQuote) {
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

                        const fullPdfData = {
                            formData: formDataForPdf,
                            items: mappedItems,
                            totals: calculatedTotals,
                            legs: legsData,
                        };

                        setPdfData(fullPdfData);
                        setIsPdfSelectionModalOpen(true);
                        setOnNewQuoteBlocked(false);
                    } else {
                        setQuoteDataForPreview(quoteData);
                        setOnNewQuoteBlocked(false);
                    }
                })
                .catch(error => console.error('Error fetching quote details:', error));
        } else if (previewingQuote?.isClone) {
            setIsReadOnly(false);
            setOnNewQuoteBlocked(true);
            setItems(previewingQuote.items || []);
            setExchangeRate(previewingQuote.exchangeRate);
            setQuoteDataForPreview(previewingQuote);
            setIsFormReady(false);

            const allNoSc = previewingQuote.items?.every(item => item.scPercentage === 0);
            const allNoVat = previewingQuote.items?.every(item => item.vatPercentage === 0);
            setGlobalNoSc(allNoSc);
            setGlobalNoVat(allNoVat);

            if (previewingQuote.selectedFboId) {
                axios.get('http://localhost:3000/api/servicios', {
                    params: { id_fbo: previewingQuote.selectedFboId },
                })
                .then(response => setAllServices(response.data))
                .catch(error => console.error('Error fetching services for clone:', error));
            }
        } else {
            setIsReadOnly(false);
            setOnNewQuoteBlocked(true);
            setQuoteDataForPreview(null);
            setTotalEnPalabras(null);
            setIsFormReady(false);
            setGlobalNoSc(false);
            setGlobalNoVat(false);

            if (quoteFormRef.current) {
                if (!previewingQuote?.isClone) quoteFormRef.current.clearAllFields();
            }
            
            const fetchExchangeRate = async () => {
                if (exchangeRateFetchedRef.current) return;
                exchangeRateFetchedRef.current = true;

                try {
                    const response = await axios.get('http://localhost:3000/api/tipo-de-cambio');
                    setExchangeRate(parseFloat(response.data.tipoDeCambio));
                } catch (error) {
                    console.error('Error fetching exchange rate:', error);
                    setExchangeRate(18);
                }
            };

            fetchExchangeRate();
        }
    }, [quoteId, previewingQuote]);

    useEffect(() => {
        if (quoteDataForPreview && isFormReady && quoteFormRef.current) {
            console.log("¡Sincronización completa! Rellenando formulario...");
            const isClone = previewingQuote?.isClone || false;
            quoteFormRef.current.setFormData(quoteDataForPreview, isClone);
        }
    }, [quoteDataForPreview, isFormReady, previewingQuote]);

    useEffect(() => {
        const newTotals = items.reduce((acc, item) => {
            const quantity = parseFloat(item.quantity) || 0;
            const priceUSD = parseFloat(item.priceUSD) || 0;
            const scPercentage = parseFloat(item.scPercentage) || 0;
            const vatPercentage = parseFloat(item.vatPercentage) || 0;

            const rawCost = quantity * priceUSD;
            const rawSCharge = rawCost * scPercentage;
            const rawVat = rawSCharge * vatPercentage;

            const costRounded = parseFloat(rawCost.toFixed(2));
            const sChargeRounded = parseFloat(rawSCharge.toFixed(2));
            const vatRounded = parseFloat(rawVat.toFixed(2));
            const itemTotalRounded = parseFloat((rawCost + rawSCharge + rawVat).toFixed(2));

            acc.cost += costRounded;
            acc.sCharge += sChargeRounded;
            acc.vat += vatRounded;
            acc.total += itemTotalRounded;
            return acc;
        }, { cost: 0, sCharge: 0, vat: 0, total: 0 });

        setTotals(newTotals);
    }, [items]);

    useEffect(() => {
        if (exchangeRate) {
            setItems(prevItems =>
                prevItems.map(item => {
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
                    } else {
                        newPriceMXN = parseFloat((Number(item.priceUSD || 0) * exchangeRate).toFixed(2));
                        newPriceUSD = parseFloat(Number(item.priceUSD || 0).toFixed(2));
                    }

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

    useEffect(() => {
        setItems(prevItems =>
            prevItems.map(item => {
                const targetVat = globalNoVat ? 0 : 0.16;
                const updatedItem = {
                    ...item,
                    vatPercentage: targetVat,
                    noVat: globalNoVat,
                };
                updatedItem.total = calculateItemTotal(updatedItem);
                return updatedItem;
            })
        );
    }, [globalNoVat]);

    const prevIsCaaMemberRef = useRef(isCaaMember);
    useEffect(() => {
        if (prevIsCaaMemberRef.current !== isCaaMember && !globalNoSc) {
            setItems(prevItems =>
                prevItems.map(item => {
                    // Respetar servicios exentos
                    if (item.isScExempt) return item;

                    if (isCaaMember && item.scPercentage === 0.18) {
                        const updatedItem = { ...item, scPercentage: 0.10 };
                        updatedItem.total = calculateItemTotal(updatedItem);
                        return updatedItem;
                    }
                    if (!isCaaMember && item.scPercentage === 0.10) {
                        const updatedItem = { ...item, scPercentage: 0.18 };
                        updatedItem.total = calculateItemTotal(updatedItem);
                        return updatedItem;
                    }
                    return item;
                })
            );
        }
        prevIsCaaMemberRef.current = isCaaMember;
    }, [isCaaMember, globalNoSc]);

    const handleGlobalCheckboxChange = (setter, value) => {
        setter(value);
        
        if (setter === setGlobalNoSc) {
            if (value) {
                setItems(prevItems =>
                    prevItems.map(item => {
                        // Respetar servicios exentos (ya tienen 0)
                        if (item.isScExempt) return item;

                        const updatedItem = {
                            ...item,
                            scPercentage: 0,
                            noSc: true,
                        };
                        updatedItem.total = calculateItemTotal(updatedItem);
                        return updatedItem;
                    })
                );
            } else {
                setItems(prevItems =>
                    prevItems.map(item => {
                        // Respetar servicios exentos (mantener en 0)
                        if (item.isScExempt) return item;

                        const targetSc = isCaaMember ? 0.10 : 0.18;
                        const updatedItem = {
                            ...item,
                            scPercentage: targetSc,
                            noSc: false,
                        };
                        updatedItem.total = calculateItemTotal(updatedItem);
                        return updatedItem;
                    })
                );
            }
        }
    };

    // useEffect para actualizar Landing Permit Coordination cuando cambia categoryCoordFee
    useEffect(() => {
        setItems(prevItems => 
            prevItems.map(item => {
                if (item.description === LANDING_PERMIT_COORD) {
                    // Solo aplica si es General Aviation
                    if (!isGeneralAviation) return item;

                    // Si el precio fue editado manualmente, no recalcular
                    if (item.manualPrice) return item;

                    const newPriceUSD = categoryCoordFee > 0 ? categoryCoordFee : (item.baseRate || 0);
                    const newPriceMXN = exchangeRate ? parseFloat((newPriceUSD * exchangeRate).toFixed(2)) : 0;

                    const updatedItem = {
                        ...item,
                        priceUSD: newPriceUSD,
                        priceMXN: newPriceMXN,
                        anchorCurrency: 'USD',
                        isCategoryOverride: categoryCoordFee > 0
                    };

                    updatedItem.total = calculateItemTotal(updatedItem);
                    return updatedItem;
                }
                return item;
            })
        );
    }, [categoryCoordFee, exchangeRate, isGeneralAviation]);

    const fetchServices = async (id_aeropuerto, id_fbo, fboName) => {
        if (isReadOnly) return;

        setItems(prevItems => prevItems.filter(item => item.description === ''));

        const isGenAv = fboName === 'Aviación General';
        setIsGeneralAviation(isGenAv);

        if (id_fbo) {
            try {
                const response = await axios.get('http://localhost:3000/api/servicios', {
                    params: { id_fbo },
                });

                const serviciosData = response.data;
                console.log("Servicios recibidos:", serviciosData);

                setAllServices(serviciosData);

                const defaultServices = serviciosData.filter(s => s.es_default);

                const newItemsToAdd = defaultServices.map(s => {
                    const isUSD = s.divisa === 'USD';
                    const rawRate = parseFloat(s.tarifa_servicio) || 0;
                    const isExempt = !!s.exento_sc;

                    // Detectar servicios especiales
                    const isLandingFee = s.nombre_concepto_default.toUpperCase().includes('LANDING FEE');
                    const isLandingPermitCoord = s.nombre_concepto_default === LANDING_PERMIT_COORD;

                    let priceMXN = 0;
                    let priceUSD = 0;
                    let anchorCurrency = isUSD ? 'USD' : 'MXN';

                    // LÓGICA ESPECIAL: Landing Permit Coordination
                    if (isLandingPermitCoord && isGenAv && categoryCoordFee > 0) {
                        priceUSD = categoryCoordFee;
                        priceMXN = exchangeRate ? parseFloat((priceUSD * exchangeRate).toFixed(2)) : 0;
                        anchorCurrency = 'USD';
                    }
                    // LÓGICA ESPECIAL: Landing Fee con MTOW
                    else if (isLandingFee && isGenAv && currentMtow > 0) {
                        const calculatedBase = rawRate * currentMtow * 1.16;
                        if (isUSD) {
                            priceUSD = parseFloat(calculatedBase.toFixed(2));
                            priceMXN = exchangeRate ? parseFloat((calculatedBase * exchangeRate).toFixed(2)) : 0;
                        } else {
                            priceMXN = parseFloat(calculatedBase.toFixed(2));
                            priceUSD = exchangeRate ? parseFloat((calculatedBase / exchangeRate).toFixed(2)) : 0;
                        }
                    }
                    // LÓGICA NORMAL
                    else {
                        if (isUSD) {
                            priceUSD = rawRate;
                            priceMXN = exchangeRate ? parseFloat((priceUSD * exchangeRate).toFixed(2)) : 0;
                        } else {
                            priceMXN = rawRate;
                            priceUSD = exchangeRate ? parseFloat((priceMXN / exchangeRate).toFixed(4)) : 0;
                        }
                    }

                    const quantity = 1;
                    const scPercentage = isExempt ? 0 : (globalNoSc ? 0 : (isCaaMember ? 0.10 : 0.18));
                    const vatPercentage = globalNoVat ? 0 : 0.16;

                    const cost = quantity * priceUSD;
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
                        anchorCurrency,
                        baseRate: rawRate,
                        total,
                        isScExempt: isExempt,
                    };
                });

                setItems(prev => [...prev, ...newItemsToAdd]);

            } catch (error) {
                console.error('Error fetching FBO services:', error);
            }
        } else {
            setAllServices([]);
        }
    };

    const handleMtowChange = useCallback((val, unit) => {
        const tons = calculateTons(val, unit);
        setCurrentMtow(tons);

        setItems(prevItems => 
            prevItems.map(item => {
                // Si el precio fue editado manualmente, no recalcular
                if (item.manualPrice) return item;

                const isLanding = item.description.toUpperCase().includes('LANDING FEE');
                const isGeneralAviation = item.category === 'Airport Services General Aviation';

                // Solo recalcular Landing Fees de General Aviation
                if (!isLanding || !isGeneralAviation) return item;

                const rate = item.baseRate || (item.anchorCurrency === 'USD' ? item.priceUSD : item.priceMXN);
                
                let newPriceMXN = 0;
                let newPriceUSD = 0;

                if (tons > 0) {
                    const calculatedBase = (rate * tons) * 1.16;
                    
                    if (item.anchorCurrency === 'USD') {
                        newPriceUSD = parseFloat(calculatedBase.toFixed(2));
                        newPriceMXN = exchangeRate ? parseFloat((calculatedBase * exchangeRate).toFixed(2)) : 0;
                    } else {
                        newPriceMXN = parseFloat(calculatedBase.toFixed(2));
                        newPriceUSD = exchangeRate ? parseFloat((calculatedBase / exchangeRate).toFixed(2)) : 0;
                    }
                }

                const updatedItem = {
                    ...item,
                    baseRate: item.baseRate || rate,
                    priceMXN: parseFloat(Number(newPriceMXN || 0).toFixed(2)),
                    priceUSD: parseFloat(Number(newPriceUSD || 0).toFixed(2)),
                };
                
                updatedItem.total = calculateItemTotal(updatedItem);
                return updatedItem;
            })
        );
    }, [exchangeRate]);

    const handleCaaChange = useCallback((isMember) => {
        setIsCaaMember(isMember);
    }, []);

    const handleAddItem = () => {
        const additionalServiceItem = allServices.find(s => 
            s.nombre_cat_concepto && s.nombre_cat_concepto.includes('Additional Services')
        );

        const correctCategory = additionalServiceItem 
            ? additionalServiceItem.nombre_cat_concepto 
            : '* Additional Services *';

        const initialSc = globalNoSc ? 0 : (isCaaMember ? 0.10 : 0.18);

        const newItem = {
            description: '',
            category: correctCategory,
            quantity: 1,
            priceMXN: 0,
            priceUSD: 0,
            scPercentage: initialSc,
            vatPercentage: globalNoVat ? 0 : 0.16,
            noSc: globalNoSc,
            noVat: globalNoVat,
            anchorCurrency: 'MXN',
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
        setItems([]);
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
        if (!exchangeRate) return;

        const newItems = [...items];
        const item = newItems[index];

        if (field === 'scPercentage' && globalNoSc) {
            setGlobalNoSc(false);
        }
        if (field === 'vatPercentage' && globalNoVat) {
            setGlobalNoVat(false);
        }

        // Marcar que el precio fue editado manualmente
        if (field === 'priceMXN' || field === 'priceUSD') {
            item.manualPrice = true;
        }

        item[field] = value;

        if (field === 'priceMXN') {
            item.priceUSD = parseFloat(Number((value || 0) / exchangeRate).toFixed(2));
            item.anchorCurrency = 'MXN';
        } else if (field === 'priceUSD') {
            item.priceMXN = parseFloat(Number((value || 0) * exchangeRate).toFixed(2));
            item.anchorCurrency = 'USD';
        }

        item.total = calculateItemTotal(item);
        setItems(newItems);
    };

    const handleSaveServices = (selectedServicesFromModal) => {
        if (!exchangeRate) return;

        const allServiceDescriptions = new Set(allServices.map(s => s.nombre_concepto_default));
        const manualItems = items.filter(item => !allServiceDescriptions.has(item.description));

        const processedServiceItems = selectedServicesFromModal.map(service => {
            const existingItem = items.find(item => item.description === service.name);

            if (existingItem) {
                return existingItem;
            }

            const isExempt = !!service.exento_sc;
            const isUSD = service.divisa?.trim().toUpperCase() === 'USD';
            const rawRate = parseFloat(service.tarifa_servicio) || 0;

            const isLandingFee = service.nombre_concepto_default.toUpperCase().includes('LANDING FEE');
            const isLandingPermitCoord = service.name === LANDING_PERMIT_COORD;

            let priceMXN = 0;
            let priceUSD = 0;
            let anchorCurrency = isUSD ? 'USD' : 'MXN';

            // LÓGICA ESPECIAL: Landing Permit Coordination
            if (isLandingPermitCoord && isGeneralAviation && categoryCoordFee > 0) {
                priceUSD = categoryCoordFee;
                priceMXN = parseFloat((priceUSD * exchangeRate).toFixed(2));
                anchorCurrency = 'USD';
            }
            // LÓGICA ESPECIAL: Landing Fee con MTOW
            else if (isLandingFee && isGeneralAviation && currentMtow > 0) {
                const calculatedBase = rawRate * currentMtow * 1.16;
                if (isUSD) {
                    priceUSD = parseFloat(calculatedBase.toFixed(2));
                    priceMXN = exchangeRate ? parseFloat((calculatedBase * exchangeRate).toFixed(2)) : 0;
                } else {
                    priceMXN = parseFloat(calculatedBase.toFixed(2));
                    priceUSD = exchangeRate ? parseFloat((calculatedBase / exchangeRate).toFixed(2)) : 0;
                }
            }
            // LÓGICA NORMAL
            else {
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

            const cost = quantity * priceUSD;
            const serviceCharge = cost * scPercentage;
            const vat = serviceCharge * vatPercentage;
            const total = cost + serviceCharge + vat;

            return {
                description: service.name,
                category: service.description,
                quantity,
                priceMXN,
                priceUSD,
                scPercentage,
                vatPercentage,
                noSc: isExempt || globalNoSc,
                noVat: globalNoVat,
                anchorCurrency,
                baseRate: rawRate,
                total,
                isScExempt: isExempt,
            };
        });

        setItems([...manualItems, ...processedServiceItems]);
    };

    const confirmAndSaveQuote = async () => {
        if (quoteFormRef.current) {
            const isValid = quoteFormRef.current.validate(exchangeRate);
            if (!isValid) {
                setIsSaveQuoteModalOpen(false);
                return;
            }

            const rawData = quoteFormRef.current.getFormData();

            const itemsToSave = items.map(item => {
                let finalScPercentage = item.scPercentage;
                let finalVatPercentage = item.vatPercentage;
                
                if (globalNoSc && !item.isScExempt) {
                    finalScPercentage = 0;
                }
                
                if (globalNoVat) {
                    finalVatPercentage = 0;
                }
                
                return {
                    ...item,
                    scPercentage: finalScPercentage,
                    vatPercentage: finalVatPercentage,
                    noSc: item.isScExempt ? false : globalNoSc,
                    noVat: globalNoVat,
                };
            });

            const servicios = itemsToSave.map(item => {
                const quantity = parseFloat(item.quantity) || 0;
                const costo_mxn = parseFloat(Number(item.priceMXN || 0).toFixed(2));
                const costo_usd = parseFloat(Number(item.priceUSD || 0).toFixed(2));
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

                total_costo: totals.cost,
                total_s_cargo: totals.sCharge,
                total_vat: totals.vat,
                total_final: totals.total,

                customer: {
                    id: rawData.customer,
                    label: rawData.customerName
                },

                aircraftModel: { 
                    id: rawData.aircraftModel,
                    label: rawData.aircraftRegistrationValue,
                    id_modelo_aeronave: rawData.aircraftModelId,
                    modelo: rawData.aircraftModelName
                },

                flightType: {
                    id: rawData.flightType,
                    label: rawData.flightTypeName
                },

                station: {
                    id: rawData.station,
                    label: rawData.stationName
                },

                fbo: rawData.fbo || rawData.fboName
                    ? { id: rawData.fbo, label: rawData.fboName }
                    : null,

                from: rawData.from || rawData.fromName
                    ? { id: rawData.from, label: rawData.fromName }
                    : null,

                to: rawData.to || rawData.toName
                    ? { id: rawData.to, label: rawData.toName }
                    : null,

                servicios: servicios
            };

            console.log("Payload enviado al Backend:", quoteData);
            try {
                const response = await axios.post('http://localhost:3000/api/cotizaciones', quoteData);
                console.log('Quote saved successfully:', response.data);
                onNavigateToHistorico();
            } catch (error) {
                console.error('Error saving quote:', error);
            }
        }
        setIsSaveQuoteModalOpen(false);
    };

    const handleSaveQuote = () => {
        if (quoteFormRef.current) {
            const isValid = quoteFormRef.current.validate(exchangeRate);
            if (isValid) {
                setIsSaveQuoteModalOpen(true);
            }
        }
    };

    const handleSaveAsNew = () => {
        if (quoteFormRef.current) {
            quoteFormRef.current.clearQuoteNumberOnly();

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

            quoteFormRef.current.setQuotedByValue(loggedInUser);
            const currentFormData = quoteFormRef.current.getAllFormData();

            onCloneQuote({
                ...currentFormData,
                quotedBy: loggedInUser,
                items: items,
                servicios: items,
                exchangeRate: exchangeRate,
                isClone: true,
            });
        }
    };

    const handlePreviewPdf = () => {
        setOnNewQuoteBlocked(true);
        if (quoteFormRef.current) {
            const isValid = quoteFormRef.current.validate(exchangeRate);
            if (!isValid) {
                setOnNewQuoteBlocked(false);
                return;
            }
            const formData = quoteFormRef.current.getFormData();
            const fullPdfData = {
                formData: {
                    ...formData,
                    totalEnPalabras: totalEnPalabras,
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
            const isValid = quoteFormRef.current.validate(exchangeRate);
            if (!isValid) {
                setOnNewQuoteBlocked(false);
                return;
            }
            const formData = quoteFormRef.current.getFormData();
            const fullPdfData = {
                formData: {
                    ...formData,
                    totalEnPalabras: totalEnPalabras,
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

    const initialSelectedServices = items
        .filter(item => allServices.some(s => s.nombre_concepto_default === item.description))
        .map(item => {
            const service = allServices.find(s => s.nombre_concepto_default === item.description);
            return {
                ...service,
                id: service.id_precio_concepto || service.id_concepto_std,
                name: service.nombre_concepto_default,
                description: service.nombre_cat_concepto
            };
        });

    return (
        <div className="bg-blue-dark p-8">
            <div className="bg-gray-50 min-h-screen rounded-lg shadow-lg p-6">
                <QuoteHeader
                    onClearQuote={handleClearQuote}
                    onSaveQuote={handleSaveQuote}
                    onExportToPdf={handlePreviewPdf}
                    onExportToClientPdf={handlePreviewClientPdf}
                    isReadOnly={isReadOnly}
                    onNewQuoteBlocked={onNewQuoteBlocked}
                    onSaveAsNew={handleSaveAsNew}
                />
                <main className="max-w-7xl mx-auto mt-4">
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
                    <QuoteTable
                        items={items}
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
                    allServices={allServices.map(s => ({
                        ...s,
                        id: s.id_precio_concepto || s.id_concepto_std,
                        name: s.nombre_concepto_default,
                        description: s.nombre_cat_concepto
                    }))}
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
                    <p className="text-base text-gray-700">¿Are you sure you want to clear this quote?</p>
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
                        if (totalEnPalabras && totalEnPalabras.startsWith('JOIN OF:')) {
                            onNavigateToHistorico();
                        } else if (quoteId) {
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