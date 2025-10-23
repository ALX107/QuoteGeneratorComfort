import React, { useEffect } from 'react';
import { PDFViewer } from '@react-pdf/renderer';
import QuotePDFDocument from '../quote/QuotePDFDocument';

const PDFPreviewModal = ({ isOpen, onClose, pdfData }) => {
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose]);

  const handleOutsideClick = (event) => {
    if (event.target.className === 'modal-overlay') {
      onClose();
    }
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div
      className="modal-overlay"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000,
      }}
      onClick={handleOutsideClick}
    >
      <div
        style={{
          width: '90%',
          height: '90%',
          backgroundColor: 'white',
          position: 'relative',
        }}
      >
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            bottom: 10,
            right: 10,
            padding: '8px 12px',
            cursor: 'pointer',
            backgroundColor: '#E53E3E',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            fontSize: '16px',
            zIndex: 10,
          }}
        >
          Close
        </button>
        {pdfData ? (
          <PDFViewer style={{ width: '100%', height: '100%' }}>
            <QuotePDFDocument {...pdfData} />
          </PDFViewer>
        ) : (
          <p>Loading...</p>
        )}
      </div>
    </div>
  );
};

export default PDFPreviewModal;