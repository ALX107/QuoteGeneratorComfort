import React, { useState } from 'react';
import QuoteHeader from '../components/quote/QuoteHeader';
import QuoteForm from '../components/quote/QuoteForm';
import QuoteTable from '../components/quote/QuoteTable';
import QuoteTotal from '../components/quote/QuoteTotal';
import AddServiceModal from '../components/modals/AddServiceModal';

// This would typically come from an API call
const MOCK_SERVICES = [
    { id: 1, name: 'Servicio de Catering', description: 'Comida y bebida para el vuelo.' },
    { id: 2, name: 'Transporte Terrestre', description: 'Vehículo privado en destino.' },
    { id: 3, name: 'Seguridad Adicional', description: 'Equipo de seguridad personal.' },
    { id: 4, name: 'Wi-Fi a bordo', description: 'Conexión a internet durante el vuelo.' },
    { id: 5, name: 'Prensa Internacional', description: 'Periódicos y revistas.' },
];
const ALL_SERVICE_NAMES = new Set(MOCK_SERVICES.map(s => s.name));

function NewQuote() {
    const [items, setItems] = useState([
        { description: 'Servicio de Rampa', quantity: 1, price: 550, total: 550 },
    ]);

    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleAddItem = () => {
        setItems([...items, { description: '', quantity: 1, price: 0, total: 0 }]);
    };

    const handleRemoveItem = (index) => {
        const newItems = [...items];
        newItems.splice(index, 1);
        setItems(newItems);
    };

    const handleUpdateItem = (index, field, value) => {
        const newItems = [...items];
        const item = newItems[index];
        item[field] = value;
        if (field !== 'description') {
            item.total = item.quantity * item.price;
        }
        setItems(newItems);
    };

    const handleSaveServices = (selectedServices) => {
        const newItems = selectedServices.map(service => ({
            description: service.name,
            quantity: 1,
            price: 0, // Default price, user can edit
            total: 0,
        }));

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
        .filter(item => ALL_SERVICE_NAMES.has(item.description))
        .map(item => ({ name: item.description, id: MOCK_SERVICES.find(s => s.name === item.description)?.id }));

    return (
        <div className="bg-cafe p-8">
            <div className="bg-gray-50 min-h-screen rounded-lg shadow-lg p-6">
                <QuoteHeader />
                <main className="max-w-7xl mx-auto mt-4">
                    <QuoteForm onAddItem={handleAddItem} onOpenServiceModal={() => setIsModalOpen(true)} />
                    <QuoteTable items={items} onRemoveItem={handleRemoveItem} onUpdateItem={handleUpdateItem} />
                    <QuoteTotal subtotal={subtotal} tax={tax} total={total} />
                </main>
                <AddServiceModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    onSave={handleSaveServices}
                    onRemoveService={handleRemoveServiceByName}
                    initialSelectedServices={initialSelectedServices}
                    allServices={MOCK_SERVICES}
                />
            </div>
        </div>
    );
}
export default NewQuote;