import React, { useState, useEffect } from 'react';

function AddServiceModal({ isOpen, onClose, onSave, onRemoveService, initialSelectedServices, allServices }) {
    const [availableServices, setAvailableServices] = useState([]);
    const [selectedServices, setSelectedServices] = useState([]);

    useEffect(() => {
        if (isOpen) {
            // Initialize state from props ONLY when modal opens
            const selectedIds = new Set(initialSelectedServices.map(s => s.id));
            setSelectedServices(initialSelectedServices);
            setAvailableServices(allServices.filter(s => !selectedIds.has(s.id)));
        }
    }, [isOpen]); // <-- Depend only on 'isOpen'

    if (!isOpen) {
        return null;
    }

    const handleAddService = (service) => {
        setSelectedServices([...selectedServices, service]);
        setAvailableServices(availableServices.filter(s => s.id !== service.id));
    };

    const handleRemoveService = (service) => {
        // Move from selected back to available
        setAvailableServices([service, ...availableServices].sort((a, b) => a.id - b.id));
        setSelectedServices(selectedServices.filter(s => s.id !== service.id));

        // Trigger removal from the main quote table
        if (onRemoveService) {
            onRemoveService(service.name);
        }
    };

    const handleSave = () => {
        onSave(selectedServices);
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white rounded-lg shadow-2xl p-8 w-full max-w-4xl">
                <h2 className="text-2xl font-bold mb-6 text-dark-gray">Add Services</h2>

                <div className="grid grid-cols-2 gap-8">
                    {/* Columna Izquierda: Servicios Disponibles */}
                    <div>
                        <h3 className="text-lg font-semibold mb-4 border-b pb-2">Available Services</h3>
                        <ul className="space-y-3 h-80 overflow-y-auto pr-2">
                            {availableServices.map(service => (
                                <li key={service.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg shadow-sm">
                                    <div>
                                        <p className="font-medium">{service.name}</p>
                                        <p className="text-sm text-gray-500">{service.description}</p>
                                    </div>
                                    <button
                                        onClick={() => handleAddService(service)}
                                        className="bg-blue-600 text-white px-3 py-1 rounded-md hover:bg-blue-700 transition text-sm cursor-pointer"
                                    >
                                        Add
                                    </button>
                                </li>
                            ))}
                             {availableServices.length === 0 && (
                                <div className="text-center text-gray-400 pt-16">
                                    <p>There are no more services available.</p>
                                </div>
                            )}
                        </ul>
                    </div>

                    {/* Columna Derecha: Servicios Agregados */}
                    <div>
                        <h3 className="text-lg font-semibold mb-4 border-b pb-2">Added Services</h3>
                        <ul className="space-y-3 h-80 overflow-y-auto pr-2">
                            {selectedServices.map(service => (
                                <li key={service.id} className="flex items-center justify-between p-3 bg-green-50 rounded-lg shadow-sm">
                                    <div>
                                        <p className="font-medium">{service.name}</p>
                                        <p className="text-sm text-gray-500">{service.description}</p>
                                    </div>
                                    <button
                                        onClick={() => handleRemoveService(service)}
                                        className="bg-red-600 text-white px-3 py-1 rounded-md hover:red-700 transition text-sm cursor-pointer"
                                    >
                                        Remove
                                    </button>
                                </li>
                            ))}
                             {selectedServices.length === 0 && (
                                <div className="text-center text-gray-400 pt-16">
                                    <p>The added services will appear here.</p>
                                </div>
                            )}
                        </ul>
                    </div>
                </div>

                {/* Botones de Acción */}
                <div className="flex justify-end mt-8 space-x-4">
                    <button
                        onClick={onClose}
                        className="px-6 py-2 rounded-lg text-gray-700 bg-gray-200 hover:bg-gray-300 transition btn-cancel"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSave}
                        className="px-6 py-2 rounded-lg text-white bg-green-600 hover:bg-green-700 transition btn-confirm"
                    >
                        Save Services
                    </button>
                </div>
            </div>
        </div>
    );
}

export default AddServiceModal;