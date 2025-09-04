import React, { useState, useEffect } from 'react';

function AddServiceModal({ isOpen, onClose, onSave, onRemoveService, initialSelectedServices, allServices }) {
    const [availableServices, setAvailableServices] = useState([]);
    const [selectedServices, setSelectedServices] = useState([]);

    useEffect(() => {
        if (isOpen) {
            // Initialize state from props when modal opens
            const selectedIds = new Set(initialSelectedServices.map(s => s.id));
            setSelectedServices(initialSelectedServices);
            setAvailableServices(allServices.filter(s => !selectedIds.has(s.id)));
        }
    }, [isOpen, initialSelectedServices, allServices]);

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
                <h2 className="text-2xl font-bold mb-6 text-dark-gray">Añadir Servicios</h2>

                <div className="grid grid-cols-2 gap-8">
                    {/* Columna Izquierda: Servicios Disponibles */}
                    <div>
                        <h3 className="text-lg font-semibold mb-4 border-b pb-2">Servicios Disponibles</h3>
                        <ul className="space-y-3 h-80 overflow-y-auto pr-2">
                            {availableServices.map(service => (
                                <li key={service.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg shadow-sm">
                                    <div>
                                        <p className="font-medium">{service.name}</p>
                                        <p className="text-sm text-gray-500">{service.description}</p>
                                    </div>
                                    <button
                                        onClick={() => handleAddService(service)}
                                        className="bg-blue-600 text-white px-3 py-1 rounded-md hover:bg-blue-700 transition text-sm"
                                    >
                                        Agregar
                                    </button>
                                </li>
                            ))}
                             {availableServices.length === 0 && (
                                <div className="text-center text-gray-400 pt-16">
                                    <p>No hay más servicios disponibles.</p>
                                </div>
                            )}
                        </ul>
                    </div>

                    {/* Columna Derecha: Servicios Agregados */}
                    <div>
                        <h3 className="text-lg font-semibold mb-4 border-b pb-2">Servicios Agregados</h3>
                        <ul className="space-y-3 h-80 overflow-y-auto pr-2">
                            {selectedServices.map(service => (
                                <li key={service.id} className="flex items-center justify-between p-3 bg-green-50 rounded-lg shadow-sm">
                                     <div>
                                        <p className="font-medium">{service.name}</p>
                                    </div>
                                    <button
                                        onClick={() => handleRemoveService(service)}
                                        className="bg-red-600 text-white px-3 py-1 rounded-md hover:red-700 transition text-sm"
                                    >
                                        Quitar
                                    </button>
                                </li>
                            ))}
                             {selectedServices.length === 0 && (
                                <div className="text-center text-gray-400 pt-16">
                                    <p>Los servicios agregados aparecerán aquí.</p>
                                </div>
                            )}
                        </ul>
                    </div>
                </div>

                {/* Botones de Acción */}
                <div className="flex justify-end mt-8 space-x-4">
                    <button
                        onClick={onClose}
                        className="px-6 py-2 rounded-lg text-gray-700 bg-gray-200 hover:bg-gray-300 transition"
                    >
                        Cancelar
                    </button>
                    <button
                        onClick={handleSave}
                        className="px-6 py-2 rounded-lg text-white bg-green-600 hover:bg-green-700 transition"
                    >
                        Guardar Servicios
                    </button>
                </div>
            </div>
        </div>
    );
}

export default AddServiceModal;