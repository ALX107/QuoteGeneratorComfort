import React from 'react';

function ConfirmationModal({ isOpen, onClose, onConfirm, title, children }) {
    if (!isOpen) return null;

    return (
        <>
            {/* Fondo oscuro con desenfoque */}
            <div className="fixed inset-0 bg-opacity-80 backdrop-blur-md z-40"></div>

            {/* Contenido del modal */}
            <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg shadow-lg p-6 z-50 w-1/3">
                <h2 className="text-xl font-bold mb-4">{title}</h2>
                <div className="mb-4">
                    {children}
                </div>
                <div className="flex justify-end space-x-4">
                    <button
                        onClick={onClose}
                        className="btn-secondary btn-cancel"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onConfirm}
                        className="btn-danger btn-confirm"
                    >
                        Confirm
                    </button>
                </div>
            </div>
        </>
    );
}

export default ConfirmationModal;
