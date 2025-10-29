import React, { useState, useEffect, useRef } from 'react';
import QuoteHeader from '../components/quote/QuoteHeader';
import QuoteForm from '../components/quote/QuoteForm';
import QuoteTable from '../components/quote/QuoteTable';
import QuoteTotal from '../components/quote/QuoteTotal';
import AddServiceModal from '../components/modals/AddServiceModal';
import ConfirmationModal from '../components/modals/ConfirmationModal';
import PDFPreviewModal from '../components/modals/PDFPreviewModal';
import axios from 'axios';

function NewQuote({ onNavigateToHistorico, previewingQuote }) {
    const [items, setItems] = useState([]);
    const quoteFormRef = useRef();
    const [exchangeRate, setExchangeRate] = useState(null); // To store the exchange rate

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
    const [isPdfPreviewOpen, setIsPdfPreviewOpen] = useState(false);
    const [pdfData, setPdfData] = useState(null);
    const [allServices, setAllServices] = useState([]);
    const [defaultConceptos, setDefaultConceptos] = useState([]);

    const quoteId = previewingQuote ? previewingQuote.id_cotizacion : null;

    const [totals, setTotals] = useState({
        cost: 0,
        sCharge: 0,
        vat: 0,
        total: 0,
    });

    useEffect(() => {
        // Fetch default conceptos once when the component mounts
        const fetchDefaultConceptos = async () => {
            try {
                const response = await axios.get('http://localhost:3000/api/conceptos-default');
                setDefaultConceptos(response.data);
            } catch (error) {
                console.error('Error fetching default conceptos:', error);
            }
        };

        fetchDefaultConceptos();
    }, []);

    useEffect(() => {
        if (quoteId) {
            axios.get(`http://localhost:3000/api/cotizacion/${quoteId}`)
                .then(response => {
                    const quoteData = response.data;
                    if (quoteFormRef.current) {
                        quoteFormRef.current.setFormData(quoteData); //se ejecuta cada vez que cambia quoteId
                    }
                    setItems(quoteData.servicios.map(servicio => ({
                        description: servicio.nombre_servicio,
                        quantity: servicio.cantidad,
                        priceMXN: servicio.costo_mxn,
                        priceUSD: servicio.costo_usd,
                        scPercentage: servicio.sc_porcentaje,
                        vatPercentage: servicio.vat_porcentaje,
                        anchorCurrency: 'MXN', // Assuming MXN is the default anchor
                        total: servicio.total_usd,
                    })));
                    setExchangeRate(quoteData.exchange_rate);
                })
                .catch(error => console.error('Error fetching quote details:', error));
        } else {
            // This is a new quote, initialize it
            if (quoteFormRef.current) {
                quoteFormRef.current.clearAllFields();
            }
            const initializeNewQuote = async () => {
                let currentExchangeRate;
                // 1. Fetch Exchange Rate
                try {
                    const response = await axios.get('http://localhost:3000/api/tipo-de-cambio');
                    currentExchangeRate = parseFloat(response.data.tipoDeCambio);
                    setExchangeRate(currentExchangeRate);
                } catch (error) {
                    console.error('Error fetching exchange rate:', error);
                    currentExchangeRate = 18; // Fallback
                    setExchangeRate(currentExchangeRate);
                }

                // 2. Use defaultConceptos from state
                if (defaultConceptos.length > 0) {
                    const newItems = defaultConceptos.map(concepto => {
                        const priceMXN = concepto.costo_concepto_default || 0;
                        const priceUSD = +((priceMXN) / currentExchangeRate).toFixed(4);
                        const quantity = 1;
                        const scPercentage = 0.10;
                        const vatPercentage = 0.10;

                        const cost = quantity * priceUSD;
                        const serviceCharge = cost * scPercentage;
                        const vat = cost * vatPercentage;
                        const total = cost + serviceCharge + vat;

                        return {
                            description: concepto.nombre_concepto_default,
                            quantity,
                            priceMXN,
                            priceUSD,
                            scPercentage,
                            vatPercentage,
                            anchorCurrency: 'MXN',
                            total,
                        };
                    });
                    setItems(newItems);
                }
            };

            initializeNewQuote();
        }
    }, [quoteId, defaultConceptos]);

        useEffect(() => {
        const newTotals = items.reduce((acc, item) => {
            const cost = (item.quantity || 0) * (item.priceUSD || 0);
            const sCharge = cost * (item.scPercentage || 0);
            const vat = cost * (item.vatPercentage || 0);
            
            acc.cost += cost;
            acc.sCharge += sCharge;
            acc.vat += vat;
            acc.total += parseFloat(item.total) || 0; // Ensure item.total is a number
            
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

    const fetchServices = async (id_aeropuerto, id_fbo) => {
        if (id_fbo) {
            try {
                const response = await axios.get('http://localhost:3000/api/servicios', {
                    params: { id_fbo }, // Send only id_fbo
                });
                setAllServices(response.data);
            } catch (error) {
                console.error('Error fetching FBO services:', error);
            }
        } else if (id_aeropuerto) {
            // When a station is selected but not an FBO, show the default concepts
            const formattedDefaultConceptos = defaultConceptos.map(c => ({
                ...c,
                nombre_local_concepto: c.nombre_concepto_default, // Aligning the property name
                costo_concepto: c.costo_concepto_default,
                divisa: 'MXN', // Assuming default is MXN
            }));
            setAllServices(formattedDefaultConceptos);
        } else {
            // When nothing is selected, also show default concepts
            const formattedDefaultConceptos = defaultConceptos.map(c => ({
                ...c,
                nombre_local_concepto: c.nombre_concepto_default,
                costo_concepto: c.costo_concepto_default,
                divisa: 'MXN',
            }));
            setAllServices(formattedDefaultConceptos);
        }
    };

    const handleAddItem = () => {
        const newItem = {
            description: '',
            quantity: 1,
            priceMXN: 0,
            priceUSD: 0,
            scPercentage: 0.10, // Default 10%
            vatPercentage: 0.10, // Default 10%
            anchorCurrency: 'MXN', // Default anchor
            total: 0,
        };
        setItems([...items, newItem]);
    };

    const handleClearQuote = () => {
        setIsConfirmModalOpen(true);
    };

    const handleConfirmClear = () => {
        if (quoteFormRef.current) {
            quoteFormRef.current.clearAllFields();
        }
        setItems([]); // Also clear the items in the table
        setIsConfirmModalOpen(false);
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
            const priceMXN = service.costo_concepto || 0;
            const priceUSD = +((priceMXN) / exchangeRate).toFixed(4);
            const quantity = 1;
            const scPercentage = 0.10;
            const vatPercentage = 0.10;

            const cost = quantity * priceUSD;
            const serviceCharge = cost * scPercentage;
            const vat = cost * vatPercentage;
            const total = cost + serviceCharge + vat;

            return {
                description: service.name,
                quantity,
                priceMXN,
                priceUSD,
                scPercentage,
                vatPercentage,
                anchorCurrency: 'MXN',
                total,
            };
        });

        const allServiceDescriptions = new Set(allServices.map(s => s.nombre_local_concepto));
        const nonServiceItems = items.filter(item => !allServiceDescriptions.has(item.description));

        setItems([...nonServiceItems, ...newServiceItems]);
    };


     const handleSaveQuote = async () => {
        if (quoteFormRef.current) {
            // Map frontend 'items' to backend 'servicios' structure
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
                    s_cargo: s_cargo,
                    vat: vat,
                    total_usd: item.total,
                };
            });

            const quoteData = {
                ...quoteFormRef.current.getFormData(),
                exchangeRate: exchangeRate, // Pass the exchange rate
                servicios: servicios, // Use the correct key 'servicios'
            };

            try {
                const response = await axios.post('http://localhost:3000/api/cotizaciones', quoteData);
                console.log('Quote saved successfully:', response.data);
                // Navigate to historico after saving
                onNavigateToHistorico();
            } catch (error) {
                console.error('Error saving quote:', error);
                // Optionally, you can show an error message to the user
            }
        }
    };

    const handlePreviewPdf = () => {
        if (quoteFormRef.current) {
            const formData = quoteFormRef.current.getFormData();
            const fullPdfData = {
                formData: formData,
                items: items,
                totals: totals,
            };

            setPdfData(fullPdfData);
            setIsPdfPreviewOpen(true);
        }
    };

    const subtotal = items.reduce((acc, item) => acc + item.total, 0);
    const tax = subtotal * 0.16; // 16% IVA
    const total = subtotal + tax;

    // Find which of the current items are services to pass to the modal
    const initialSelectedServices = items
        .filter(item => allServices.some(s => s.nombre_local_concepto === item.description))
        .map(item => {
            const service = allServices.find(s => s.nombre_local_concepto === item.description);
            return { ...service, id: service.id_precio_concepto || service.id_concepto_std, name: service.nombre_local_concepto };
        });

    return (
        <div className="bg-blue-dark p-8">
            <div className="bg-gray-50 min-h-screen rounded-lg shadow-lg p-6">
                <QuoteHeader onClearQuote={handleClearQuote} onSaveQuote={handleSaveQuote} onExportToPdf={handlePreviewPdf} />
                <main className="max-w-7xl mx-auto mt-4">
                    <QuoteForm
                        ref={quoteFormRef}
                        onAddItem={handleAddItem}
                        onOpenServiceModal={() => setIsModalOpen(true)}
                        onSelectionChange={fetchServices}
                        exchangeRate={exchangeRate || ''}
                        onExchangeRateChange={(value) => setExchangeRate(parseFloat(value) || 0)}
                    />
                    <QuoteTable items={items} onRemoveItem={handleRemoveItem} onUpdateItem={handleUpdateItem} />
                    <QuoteTotal totals={totals} />
                </main>
                <AddServiceModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    onSave={handleSaveServices}
                    initialSelectedServices={initialSelectedServices}
                    allServices={allServices.map(s => ({ ...s, id: s.id_precio_concepto || s.id_concepto_std, name: s.nombre_local_concepto, description: s.nombre_cat_concepto }))}
                />
                 <ConfirmationModal
                    isOpen={isConfirmModalOpen}
                    onClose={() => setIsConfirmModalOpen(false)}
                    onConfirm={handleConfirmClear}
                    title="Confirm Clear Quote"
                >
                    <p> ¿Are you sure you want to clear this quote?</p>
                </ConfirmationModal>
                <PDFPreviewModal
                    isOpen={isPdfPreviewOpen}
                    onClose={() => setIsPdfPreviewOpen(false)}
                    pdfData={pdfData}
                />
            </div>
        </div>
    );
}
export default NewQuote;
