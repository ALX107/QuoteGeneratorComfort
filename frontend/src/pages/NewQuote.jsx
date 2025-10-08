import React, { useState, useEffect, useRef } from 'react';
import QuoteHeader from '../components/quote/QuoteHeader';
import QuoteForm from '../components/quote/QuoteForm';
import QuoteTable from '../components/quote/QuoteTable';
import QuoteTotal from '../components/quote/QuoteTotal';
import AddServiceModal from '../components/modals/AddServiceModal';
import axios from 'axios';

function NewQuote() {
    const [items, setItems] = useState([]);
    const quoteFormRef = useRef();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [allServices, setAllServices] = useState([]);

    const fetchServices = async (id_aeropuerto, id_fbo) => {
        try {
            const response = await axios.get('http://localhost:3000/api/servicios', {
                params: { id_aeropuerto, id_fbo },
            });
            setAllServices(response.data);
        } catch (error) {
            console.error('Error fetching services:', error);
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
            // Calculated fields
            total: 0,
        };
        // The update function will correctly calculate the total for the new item
        setItems([...items, newItem]);
    };

    const handleClearQuote = () => {
        if (quoteFormRef.current) {
            quoteFormRef.current.clearAllFields();
        }
        setItems([]); // Also clear the items in the table
    };

    const handleRemoveItem = (index) => {
        const newItems = [...items];
        newItems.splice(index, 1);
        setItems(newItems);
    };

    const handleUpdateItem = (index, field, value) => {
        const newItems = [...items];
        const item = newItems[index];
        item[field] = value; // Update the specific field

        // Recalculate the total based on the full item data
        const cost = (item.quantity || 0) * (item.priceUSD || 0);
        const serviceCharge = cost * (item.scPercentage || 0);
        const vat = cost * (item.vatPercentage || 0);

        item.total = cost + serviceCharge + vat;

        setItems(newItems);
    };

    const handleSaveServices = (selectedServices) => {
        const exchangeRate = 0.0543; // MXN to USD

        const newItems = selectedServices.map(service => {
            const priceMXN = service.costo_concepto || 0;
            const priceUSD = priceMXN * exchangeRate;
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
                total,
            };
        });

        const existingDescriptions = new Set(items.map(item => item.description));
        const uniqueNewItems = newItems.filter(item => !existingDescriptions.has(item.description));

        setItems([...items, ...uniqueNewItems]);
    };

    const handleRemoveServiceByName = (serviceName) => {
        setItems(prevItems => prevItems.filter(item => item.description !== serviceName));
    };

    const subtotal = items.reduce((acc, item) => acc + item.total, 0);
    const tax = subtotal * 0.16; // 16% IVA
    const total = subtotal + tax;

    // Find which of the current items are services to pass to the modal
    const initialSelectedServices = items
        .filter(item => allServices.some(s => s.nombre_local_concepto === item.description))
        .map(item => {
            const service = allServices.find(s => s.nombre_local_concepto === item.description);
            return { ...service, id: service.id_precio_concepto, name: service.nombre_local_concepto };
        });

    return (
        <div className="bg-cafe p-8">
            <div className="bg-gray-50 min-h-screen rounded-lg shadow-lg p-6">
                <QuoteHeader onClearQuote={handleClearQuote} />
                <main className="max-w-7xl mx-auto mt-4">
                    <QuoteForm ref={quoteFormRef} onAddItem={handleAddItem} onOpenServiceModal={() => setIsModalOpen(true)} onSelectionChange={fetchServices} />
                    <QuoteTable items={items} onRemoveItem={handleRemoveItem} onUpdateItem={handleUpdateItem} />
                    <QuoteTotal subtotal={subtotal} tax={tax} total={total} />
                </main>
                <AddServiceModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    onSave={handleSaveServices}
                    onRemoveService={handleRemoveServiceByName}
                    initialSelectedServices={initialSelectedServices}
                    allServices={allServices.map(s => ({ ...s, id: s.id_precio_concepto, name: s.nombre_local_concepto, description: s.nombre_cat_concepto }))}
                />
            </div>
        </div>
    );
}
export default NewQuote;