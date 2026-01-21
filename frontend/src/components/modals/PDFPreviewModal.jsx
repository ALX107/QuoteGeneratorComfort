import React, { useEffect } from 'react';
import { PDFViewer, PDFDownloadLink } from '@react-pdf/renderer';
import QuotePDFDocument from '../quote/QuotePDFDocument';

const PDFPreviewModal = ({ isOpen, onClose, pdfData, DocumentComponent, fileName }) => {
  const Doc = DocumentComponent || QuotePDFDocument;

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
        <div
          style={{
            position: 'absolute',
            bottom: 15,
            right: 20,
            zIndex: 10,
            display: 'flex',
            gap: '12px',
          }}
        >
          {pdfData && (
            <PDFDownloadLink
              document={<Doc {...pdfData} />}
              fileName={fileName || 'document.pdf'}
              className="px-5 py-2.5 bg-blue-600 text-white rounded-lg shadow-lg hover:bg-blue-700 hover:shadow-xl transition-all duration-200 font-medium text-sm flex items-center gap-2"
              style={{ textDecoration: 'none' }}
            >
              {({ loading }) => (loading ? 'Generating...' : 'Download PDF')}
            </PDFDownloadLink>
          )}
          <button
            onClick={onClose}
            className="px-5 py-2.5 bg-red-600 text-white rounded-lg shadow-lg hover:bg-red-700 hover:shadow-xl transition-all duration-200 font-medium text-sm cursor-pointer"
          >
            Close
          </button>
        </div>
        {pdfData ? (
          <PDFViewer style={{ width: '100%', height: '100%' }}>
            <Doc {...pdfData} />
          </PDFViewer>
        ) : (
          <p>Loading...</p>
        )}
      </div>
    </div>
  );
};

export default PDFPreviewModal;