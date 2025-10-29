
import React from 'react';
import { Page, Text, View, Document, StyleSheet, Image } from '@react-pdf/renderer';
import RAFLogo from '../../assets/RafLogo.png';

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
    paddingBottom: 10,
    marginBottom: 20,
  },
  headerInfo: {
    textAlign: 'right',
  },
  logo: {
    width: 100,
    height: 'auto',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1A237E',
  },
  subtitle: {
    fontSize: 12,
    color: '#4A4A4A',
  },
  section: {
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 14,
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
    marginBottom: 8,
  },
  label: {
    fontSize: 10,
    color: '#4A4A4A',
    marginBottom: 2,
  },
  value: {
    fontSize: 11,
    color: '#000000',
  },
  table: {
    display: 'table',
    width: 'auto',
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#DFE3E8',
    borderRightWidth: 0,
    borderBottomWidth: 0,
    marginBottom: 20,
  },
  tableRow: {
    flexDirection: 'row',
  },
  tableColHeader: {
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#DFE3E8',
    backgroundColor: '#F4F6F8',
    padding: 5,
    borderLeftWidth: 0,
    borderTopWidth: 0,
  },
  tableCol: {
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#DFE3E8',
    padding: 5,
    borderLeftWidth: 0,
    borderTopWidth: 0,
  },
  tableHeader: {
    fontSize: 9,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
  },
  tableCell: {
    fontSize: 8,
    textAlign: 'right',
  },
  descriptionCol: {
    width: '20%',
    textAlign: 'left',
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
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 30,
    right: 30,
    textAlign: 'center',
    fontSize: 8,
    color: 'grey',
  },
});

const InfoField = ({ label, value }) => (
  <View style={styles.gridItem}>
    <Text style={styles.label}>{label}</Text>
    <Text style={styles.value}>{value || 'N/A'}</Text>
  </View>
);

// Create Document Component
const QuotePDFDocument = ({ formData, items, totals }) => (
  <Document>
    <Page size="LETTER" style={styles.page}>
      <View style={styles.header}>
        <Image style={styles.logo} src={RAFLogo} />
        <View style={styles.headerInfo}>
          <Text style={styles.title}>Quotation</Text>
          <Text style={styles.subtitle}>RAF International Ground Support</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Quote Details</Text>
        <View style={styles.grid}>
          <InfoField label="Customer" value={formData?.customerName} />
          <InfoField label="Date" value={formData?.date} />
          <InfoField label="Flight Type" value={formData?.flightTypeName} />
          <InfoField label="Quoted By" value={formData?.quotedBy} />
          <InfoField label="Aircraft Model" value={formData?.aircraftModelName} />
          <InfoField label="Aircraft Registration" value={formData?.aircraftRegistrationValue} />
          <InfoField label="Station" value={formData?.stationName} />
          <InfoField label="Aviation Type" value={formData?.fboName} />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Services</Text>
        <View style={styles.table}>
          {/* Table Header */}
          <View style={styles.tableRow}>
            <View style={[styles.tableColHeader, { width: '20%', textAlign: 'left' }]}><Text style={styles.tableHeader}>Description</Text></View>
            <View style={[styles.tableColHeader, { width: '7%' }]}><Text style={styles.tableHeader}>Qty</Text></View>
            <View style={[styles.tableColHeader, { width: '10%' }]}><Text style={styles.tableHeader}>Price (MXN)</Text></View>
            <View style={[styles.tableColHeader, { width: '10%' }]}><Text style={styles.tableHeader}>Price (USD)</Text></View>
            <View style={[styles.tableColHeader, { width: '10%' }]}><Text style={styles.tableHeader}>Cost (USD)</Text></View>
            <View style={[styles.tableColHeader, { width: '7%' }]}><Text style={styles.tableHeader}>Sc%</Text></View>
            <View style={[styles.tableColHeader, { width: '9%' }]}><Text style={styles.tableHeader}>S.Charge</Text></View>
            <View style={[styles.tableColHeader, { width: '7%' }]}><Text style={styles.tableHeader}>VAT%</Text></View>
            <View style={[styles.tableColHeader, { width: '9%' }]}><Text style={styles.tableHeader}>VAT</Text></View>
            <View style={[styles.tableColHeader, { width: '11%' }]}><Text style={styles.tableHeader}>Total</Text></View>
          </View>
          {/* Table Body */}
          {items.map((item, index) => (
            <View key={index} style={styles.tableRow}>
              <View style={[styles.tableCol, { width: '20%', textAlign: 'left' }]}><Text style={styles.tableCell}>{item.description}</Text></View>
              <View style={[styles.tableCol, { width: '7%' }]}><Text style={styles.tableCell}>{(parseFloat(item.quantity) || 0)}</Text></View>
              <View style={[styles.tableCol, { width: '10%' }]}><Text style={styles.tableCell}>{(parseFloat(item.priceMXN) || 0).toFixed(2)}</Text></View>
              <View style={[styles.tableCol, { width: '10%' }]}><Text style={styles.tableCell}>{(parseFloat(item.priceUSD) || 0).toFixed(2)}</Text></View>
              <View style={[styles.tableCol, { width: '10%' }]}><Text style={styles.tableCell}>{((parseFloat(item.quantity) || 0) * (parseFloat(item.priceUSD) || 0)).toFixed(2)}</Text></View>
              <View style={[styles.tableCol, { width: '7%' }]}><Text style={styles.tableCell}>{`${((parseFloat(item.scPercentage) || 0) * 100).toFixed(0)}%`}</Text></View>
              <View style={[styles.tableCol, { width: '9%' }]}><Text style={styles.tableCell}>{((parseFloat(item.priceUSD) || 0) * (parseFloat(item.quantity) || 0) * (parseFloat(item.scPercentage) || 0)).toFixed(2)}</Text></View>
              <View style={[styles.tableCol, { width: '7%' }]}><Text style={styles.tableCell}>{`${((parseFloat(item.vatPercentage) || 0) * 100).toFixed(0)}%`}</Text></View>
              <View style={[styles.tableCol, { width: '9%' }]}><Text style={styles.tableCell}>{((parseFloat(item.priceUSD) || 0) * (parseFloat(item.quantity) || 0) * (parseFloat(item.vatPercentage) || 0)).toFixed(2)}</Text></View>
              <View style={[styles.tableCol, { width: '11%' }]}><Text style={styles.tableCell}>{(parseFloat(item.total) || 0).toFixed(2)}</Text></View>
            </View>
          ))}
        </View>
      </View>

      <View style={styles.totals}>
        <View style={styles.totalsContainer}>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Subtotal:</Text>
            <Text style={styles.totalValue}>$ {totals.cost.toFixed(2)} USD</Text>
          </View>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Service Charge:</Text>
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

      <Text style={styles.footer} render={({ pageNumber, totalPages }) => (
        `Page ${pageNumber} of ${totalPages}`
      )} fixed />
    </Page>
  </Document>
);

export default QuotePDFDocument;
