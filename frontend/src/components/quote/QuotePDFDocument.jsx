import React from 'react';
import { Page, Text, View, Document, StyleSheet, Image } from '@react-pdf/renderer';
import RAFLogo from '../../assets/RafLogo.png';
import NbaaLogo from '../../assets/NbaaLogo1.png';
import ISBAHLogo from '../../assets/ISBAHCompany.jpg';
import RafMorse from '../../assets/LINEAS.png';

// Create styles
const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#FFFFFF',
    padding: 30,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: '#1A237E',
    paddingBottom: 15,
    marginBottom: 20,
  },
  headerInfo: {
    textAlign: 'right',
  },
  logo: {
    width: 100,
    height: 'auto',
  },
  slogan: {
    fontSize: 11,
    color: '#C19A6B',
    fontStyle: 'italic',
    marginBottom: 4,
    letterSpacing: 0.5,
  },
  title: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#1A237E',
    marginBottom: 1,
  },
  subtitle: {
    fontSize: 9,
    color: '#4A4A4A',
    marginTop: 4,
    fontStyle: 'italic',
  },
  section: {
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 10,
    fontWeight: 'bold',
    backgroundColor: '#E8EAF6',
    padding: 5,
    marginBottom: 10,
    color: '#1A237E',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  gridItem: {
    width: '48%',
    marginBottom: 4,
  },
  infoBox: {
    backgroundColor: '#F5F5F5',
    border: '1px solid #C19A6B',
    padding: 4,
    borderRadius: 4,
    marginBottom: 5,
    width: '100%',
  },
  infoBoxTitle: {
    fontSize: 8,
    fontWeight: 'bold',
    color: '#1A237E',
    marginBottom: 3,
    textAlign: 'center',
  },
  flightInfoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  flightInfoColumn: {
    width: '48%',
  },
  flightInfoTitle: {
    fontSize: 9,
    fontWeight: 'bold',
    color: '#1A237E',
    marginBottom: 2,
    borderBottomWidth: 1,
    borderBottomColor: '#C19A6B',
    paddingBottom: 1,
  },
  flightInfoRow: {
    flexDirection: 'row',
    marginBottom: 1,
  },
  flightInfoLabel: {
    fontSize: 7,
    color: '#4A4A4A',
    width: '30%',
  },
  flightInfoValue: {
    fontSize: 7,
    color: '#000000',
    width: '70%',
  },
  label: {
    fontSize: 8,
    color: '#4A4A4A',
    marginBottom: 2,
  },
  value: {
    fontSize: 9,
    color: '#000000',
  },
  table: {
    display: 'table',
    width: '100%',
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#DFE3E8',
    borderRightWidth: 0,
    borderBottomWidth: 0,
    marginBottom: 10,
  },
  tableRow: {
    flexDirection: 'row',
  },
  tableColHeader: {
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#DFE3E8',
    backgroundColor: '#F4F6F8',
    padding: 4,
    borderLeftWidth: 0,
    borderTopWidth: 0,
  },
  tableCol: {
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#DFE3E8',
    padding: 4,
    borderLeftWidth: 0,
    borderTopWidth: 0,
  },
  tableHeader: {
    fontSize: 8,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
  },
  tableCell: {
    fontSize: 7,
    textAlign: 'right',
  },
  exchangeRate: {
    flexDirection: 'row',
    justifyContent: 'flex-left',
    marginBottom: 15,
    marginTop: 5,
    paddingRight: 10,
    fontWeight: 'bold',
  },
  exchangeRateText: {
    fontSize: 10,
    color: '#4A4A4A',
    fontStyle: 'italic',
  },
  totals: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  totalsContainer: {
    width: '40%',
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
    paddingTop: 10,
    marginBottom: 20,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  totalLabel: {
    fontSize: 11,
    color: '#4A4A4A',
  },
  totalValue: {
    fontSize: 11,
    fontWeight: 'bold',
  },
  finalTotal: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1A237E',
  },
  disclaimers: {
    marginTop: 20,
    marginBottom: 30,
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  disclaimerText: {
    fontSize: 6,
    color: '#666',
    textAlign: 'center',
    marginBottom: 3,
    fontStyle: 'italic',
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 30,
    right: 30,
    borderTopWidth: 1,
    borderTopColor: '#C19A6B',
    paddingTop: 10,
  },
  footerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  footerLeft: {
    flex: 1,
  },
  footerCenter: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
  },
  footerLogoLineas: {
    height: 15,
    width: 'auto',
    marginLeft: 10,
  },
  footerLogoNbaa: {
    height: 85,
    width: 'auto',
    marginLeft: 20,
  },
  footerLogoIsbah: {
    height: 40,
    width: 50,
  },
  footerCompany: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#1A237E',
    marginBottom: 2,
  },
  footerText: {
    fontSize: 8,
    color: '#666',
    marginBottom: 1,
  },
  footerRight: {
    flex: 1,
    textAlign: 'right',
    fontSize: 8,
    color: '#666',
  },
});

const InfoField = ({ label, value }) => (
  <View style={styles.gridItem}>
    <Text style={styles.label}>{label}</Text>
    <Text style={styles.value}>{value || 'N/A'}</Text>
  </View>
);

// Create Document Component
const QuotePDFDocument = ({ formData, items, totals, legs }) => {
  const isJoinedQuote = legs && legs.length > 0;

  return (
    <Document>
      <Page size="LETTER" style={styles.page}>
        <View style={styles.header}>
          <Image style={styles.logo} src={RAFLogo} />
          <View style={styles.headerInfo}>
            <Text style={styles.slogan}>"The art of ground handling in Mexico"</Text>
            <Text style={styles.title}>Quotation</Text>
            <Text style={styles.subtitle}>Quoted by: {formData?.quotedBy.toUpperCase()}</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quote Details</Text>

          {formData?.totalEnPalabras && formData.totalEnPalabras.startsWith('JOIN OF:') && (
            <View style={{ marginBottom: 10, padding: 8, backgroundColor: '#FFF3CD', borderLeftWidth: 4, borderLeftColor: '#FFC107' }}>
              <Text style={{ fontSize: 8, color: '#856404', fontWeight: 'bold' }}>
                {formData.totalEnPalabras}
              </Text>
            </View>
          )}

          <View style={styles.grid}>
            <InfoField label="Customer" value={formData?.customerName} />
            <InfoField label="Date" value={formData?.date} />
            <InfoField label="Flight Type" value={formData?.flightTypeName} />
            <InfoField label="Aircraft Model" value={formData?.aircraftModelName} />
            <InfoField label="Aircraft Registration" value={formData?.aircraftRegistrationValue} />
          </View>
        </View>

        {isJoinedQuote ? (
          // Mostrar una sección por cada pierna
          legs.map((leg, legIndex) => (
            <View key={legIndex} style={styles.section}>
              {/* Station Info Box para esta pierna */}
              <View style={styles.infoBox}>
                <Text style={styles.infoBoxTitle}>STATION: {leg.station || 'N/A'}</Text>
                <View style={styles.flightInfoContainer}>
                  <View style={styles.flightInfoColumn}>
                    <Text style={styles.flightInfoTitle}>Arrival</Text>
                    <View style={styles.flightInfoRow}>
                      <Text style={styles.flightInfoLabel}>ATA:</Text>
                      <Text style={styles.flightInfoValue}>{leg.eta || 'N/A'}</Text>
                    </View>
                    <View style={styles.flightInfoRow}>
                      <Text style={styles.flightInfoLabel}>From:</Text>
                      <Text style={styles.flightInfoValue}>{leg.fromName || leg.fromIcao || leg.from || 'N/A'}</Text>
                    </View>
                    <View style={styles.flightInfoRow}>
                      <Text style={styles.flightInfoLabel}>Crew:</Text>
                      <Text style={styles.flightInfoValue}>{leg.crewFrom || 'N/A'}</Text>
                    </View>
                    <View style={styles.flightInfoRow}>
                      <Text style={styles.flightInfoLabel}>PAX:</Text>
                      <Text style={styles.flightInfoValue}>{leg.paxFrom || 'N/A'}</Text>
                    </View>
                  </View>
                  <View style={styles.flightInfoColumn}>
                    <Text style={styles.flightInfoTitle}>Departure</Text>
                    <View style={styles.flightInfoRow}>
                      <Text style={styles.flightInfoLabel}>ATD:</Text>
                      <Text style={styles.flightInfoValue}>{leg.etd || 'N/A'}</Text>
                    </View>
                    <View style={styles.flightInfoRow}>
                      <Text style={styles.flightInfoLabel}>To:</Text>
                      <Text style={styles.flightInfoValue}>{leg.toName || leg.toIcao || leg.to || 'N/A'}</Text>
                    </View>
                    <View style={styles.flightInfoRow}>
                      <Text style={styles.flightInfoLabel}>Crew:</Text>
                      <Text style={styles.flightInfoValue}>{leg.crewTo || 'N/A'}</Text>
                    </View>
                    <View style={styles.flightInfoRow}>
                      <Text style={styles.flightInfoLabel}>PAX:</Text>
                      <Text style={styles.flightInfoValue}>{leg.paxTo || 'N/A'}</Text>
                    </View>
                  </View>
                </View>
              </View>

              {/* Tabla de servicios para esta pierna */}
              <View style={styles.table}>
                {/* Table Header */}
                <View style={styles.tableRow}>
                  <View style={[styles.tableColHeader, { width: '35%', textAlign: 'left' }]}><Text style={styles.tableHeader}>Description</Text></View>
                  <View style={[styles.tableColHeader, { width: '7%' }]}><Text style={styles.tableHeader}>#</Text></View>
                  <View style={[styles.tableColHeader, { width: '12%' }]}><Text style={styles.tableHeader}>Unit Price</Text></View>
                  <View style={[styles.tableColHeader, { width: '12%' }]}><Text style={styles.tableHeader}>Before VAT</Text></View>
                  <View style={[styles.tableColHeader, { width: '11%' }]}><Text style={styles.tableHeader}>Admin Fee</Text></View>
                  <View style={[styles.tableColHeader, { width: '11%' }]}><Text style={styles.tableHeader}>VAT</Text></View>
                  <View style={[styles.tableColHeader, { width: '12%' }]}><Text style={styles.tableHeader}>TOTAL COST</Text></View>
                </View>
                {/* Table Body */}
                {leg.items.map((item, index) => (
                  <View key={index} style={styles.tableRow}>
                    <View style={[styles.tableCol, { width: '35%', textAlign: 'left' }]}><Text style={styles.tableCell}>{item.description}</Text></View>
                    <View style={[styles.tableCol, { width: '7%' }]}><Text style={styles.tableCell}>{(parseFloat(item.quantity) || 0)}</Text></View>
                    <View style={[styles.tableCol, { width: '12%' }]}><Text style={styles.tableCell}>{(parseFloat(item.priceUSD) || 0).toFixed(2)}</Text></View>
                    <View style={[styles.tableCol, { width: '12%' }]}><Text style={styles.tableCell}>{((parseFloat(item.quantity) || 0) * (parseFloat(item.priceUSD) || 0)).toFixed(2)}</Text></View>
                    <View style={[styles.tableCol, { width: '11%' }]}><Text style={styles.tableCell}>{((parseFloat(item.priceUSD) || 0) * (parseFloat(item.quantity) || 0) * (parseFloat(item.scPercentage) || 0)).toFixed(2)}</Text></View>
                    <View style={[styles.tableCol, { width: '11%' }]}><Text style={styles.tableCell}>{((parseFloat(item.priceUSD) || 0) * (parseFloat(item.quantity) || 0) * (parseFloat(item.vatPercentage) || 0)).toFixed(2)}</Text></View>
                    <View style={[styles.tableCol, { width: '12%' }]}><Text style={styles.tableCell}>{(parseFloat(item.total) || 0).toFixed(2)}</Text></View>
                  </View>
                ))}
              </View>
            </View>
          ))
        ) : (
          // Cotización normal (sin piernas)
          <View style={styles.section}>
            {/* Station Info Box */}
            <View style={styles.infoBox}>
              <Text style={styles.infoBoxTitle}>STATION: {formData?.stationName || 'N/A'}</Text>
              <View style={styles.flightInfoContainer}>
                <View style={styles.flightInfoColumn}>
                  <Text style={styles.flightInfoTitle}>Arrival</Text>
                  <View style={styles.flightInfoRow}>
                    <Text style={styles.flightInfoLabel}>ATA:</Text>
                    <Text style={styles.flightInfoValue}>{formData?.eta || 'N/A'}</Text>
                  </View>
                  <View style={styles.flightInfoRow}>
                    <Text style={styles.flightInfoLabel}>From:</Text>
                    <Text style={styles.flightInfoValue}>{formData?.fromName || 'N/A'}</Text>
                  </View>
                  <View style={styles.flightInfoRow}>
                    <Text style={styles.flightInfoLabel}>Crew:</Text>
                    <Text style={styles.flightInfoValue}>{formData?.crewFrom || 'N/A'}</Text>
                  </View>
                  <View style={styles.flightInfoRow}>
                    <Text style={styles.flightInfoLabel}>PAX:</Text>
                    <Text style={styles.flightInfoValue}>{formData?.paxFrom || 'N/A'}</Text>
                  </View>
                </View>
                <View style={styles.flightInfoColumn}>
                  <Text style={styles.flightInfoTitle}>Departure</Text>
                  <View style={styles.flightInfoRow}>
                    <Text style={styles.flightInfoLabel}>ATD:</Text>
                    <Text style={styles.flightInfoValue}>{formData?.etd || 'N/A'}</Text>
                  </View>
                  <View style={styles.flightInfoRow}>
                    <Text style={styles.flightInfoLabel}>To:</Text>
                    <Text style={styles.flightInfoValue}>{formData?.toName || 'N/A'}</Text>
                  </View>
                  <View style={styles.flightInfoRow}>
                    <Text style={styles.flightInfoLabel}>Crew:</Text>
                    <Text style={styles.flightInfoValue}>{formData?.crewTo || 'N/A'}</Text>
                  </View>
                  <View style={styles.flightInfoRow}>
                    <Text style={styles.flightInfoLabel}>PAX:</Text>
                    <Text style={styles.flightInfoValue}>{formData?.paxTo || 'N/A'}</Text>
                  </View>
                </View>
              </View>
            </View>
            <View style={styles.table}>
              {/* Table Header */}
              <View style={styles.tableRow}>
                <View style={[styles.tableColHeader, { width: '35%', textAlign: 'left' }]}><Text style={styles.tableHeader}>Description</Text></View>
                <View style={[styles.tableColHeader, { width: '7%' }]}><Text style={styles.tableHeader}>#</Text></View>
                <View style={[styles.tableColHeader, { width: '12%' }]}><Text style={styles.tableHeader}>Unit Price</Text></View>
                <View style={[styles.tableColHeader, { width: '12%' }]}><Text style={styles.tableHeader}>Before VAT</Text></View>
                <View style={[styles.tableColHeader, { width: '11%' }]}><Text style={styles.tableHeader}>Admin Fee</Text></View>
                <View style={[styles.tableColHeader, { width: '11%' }]}><Text style={styles.tableHeader}>VAT</Text></View>
                <View style={[styles.tableColHeader, { width: '12%' }]}><Text style={styles.tableHeader}>TOTAL COST</Text></View>
              </View>
              {/* Table Body */}
              {items.map((item, index) => (
                <View key={index} style={styles.tableRow}>
                  <View style={[styles.tableCol, { width: '35%', textAlign: 'left' }]}><Text style={styles.tableCell}>{item.description}</Text></View>
                  <View style={[styles.tableCol, { width: '7%' }]}><Text style={styles.tableCell}>{(parseFloat(item.quantity) || 0)}</Text></View>
                  <View style={[styles.tableCol, { width: '12%' }]}><Text style={styles.tableCell}>{(parseFloat(item.priceUSD) || 0).toFixed(2)}</Text></View>
                  <View style={[styles.tableCol, { width: '12%' }]}><Text style={styles.tableCell}>{((parseFloat(item.quantity) || 0) * (parseFloat(item.priceUSD) || 0)).toFixed(2)}</Text></View>
                  <View style={[styles.tableCol, { width: '11%' }]}><Text style={styles.tableCell}>{((parseFloat(item.priceUSD) || 0) * (parseFloat(item.quantity) || 0) * (parseFloat(item.scPercentage) || 0)).toFixed(2)}</Text></View>
                  <View style={[styles.tableCol, { width: '11%' }]}><Text style={styles.tableCell}>{((parseFloat(item.priceUSD) || 0) * (parseFloat(item.quantity) || 0) * (parseFloat(item.vatPercentage) || 0)).toFixed(2)}</Text></View>
                  <View style={[styles.tableCol, { width: '12%' }]}><Text style={styles.tableCell}>{(parseFloat(item.total) || 0).toFixed(2)}</Text></View>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Exchange Rate */}
        <View style={styles.exchangeRate}>
          <Text style={styles.exchangeRateText}>EXCHANGE RATE ${formData?.exchangeRate} PESOS PER USD</Text>
        </View>

        {/* Totals - Solo un total al final para cotizaciones unidas */}
        <View style={styles.totals}>
          <View style={styles.totalsContainer}>
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Before VAT:</Text>
              <Text style={styles.totalValue}>$ {totals.cost.toFixed(2)} USD</Text>
            </View>
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Admin Fee:</Text>
              <Text style={styles.totalValue}>$ {totals.sCharge.toFixed(2)} USD</Text>
            </View>
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>VAT:</Text>
              <Text style={styles.totalValue}>$ {totals.vat.toFixed(2)} USD</Text>
            </View>
            <View style={[styles.totalRow, { marginTop: 5, paddingTop: 5, borderTopWidth: 1, borderTopColor: '#E0E0E0' }]}>
              <Text style={[styles.totalLabel, styles.finalTotal]}>Total:</Text>
              <Text style={[styles.totalValue, styles.finalTotal]}>$ {totals.total.toFixed(2)} USD</Text>
            </View>
          </View>
        </View>

        {/* Disclaimers */}
        <View style={styles.disclaimers}>
          <Text style={styles.disclaimerText}>* THIS QUOTE IS FOR INFORMATIONAL PURPOSES ONLY, AND MAY BE SUBJECT TO CHANGES WITHOUT PRIOR NOTICE.</Text>
          <Text style={styles.disclaimerText}>* EXCLUDES CATERING, OVERTIME, TRANSPORTATION AND FUEL UPLIFT</Text>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <View style={styles.footerContent}>
            <View style={styles.footerLeft}>
              <Text style={styles.footerCompany}>Real Alfa Flight Aviation Services S.A de C.V</Text>
              <Text style={styles.footerText}>MMTO Avenida No.1, Calle 3, Módulo 2, Hangar 22, 50226.</Text>
              <Text style={styles.footerText}>Toluca, Mexico</Text>
            </View>
            <View style={styles.footerCenter}>
              <Image style={styles.footerLogoNbaa} src={NbaaLogo} />
              <Image style={styles.footerLogoIsbah} src={ISBAHLogo} />
              <Image style={styles.footerLogoLineas} src={RafMorse} />
            </View>
            <View style={styles.footerRight}>
              <Text style={styles.footerText}>Phones: +52 722 319 6726, +52 722 319 6727</Text>
              <Text style={styles.footerText} render={({ pageNumber, totalPages }) => (
                `Page ${pageNumber} of ${totalPages}`
              )} />
            </View>
          </View>
        </View>
      </Page>
    </Document>
  );
};

export default QuotePDFDocument;