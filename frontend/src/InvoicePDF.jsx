import React from 'react';
import { Page, Text, View, Document, StyleSheet, Font, Image } from '@react-pdf/renderer';

// Font Kaydı
Font.register({
  family: 'Roboto',
  fonts: [
    { src: 'https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-regular-webfont.ttf' },
    { src: 'https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-bold-webfont.ttf', fontWeight: 'bold' }
  ]
});

const styles = StyleSheet.create({
  page: { padding: 40, fontSize: 10, fontFamily: 'Roboto', color: '#333', lineHeight: 1.5 },
  header: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 },
  logo: { width: 120, height: 60, objectFit: 'contain' },
  titleBig: { fontSize: 24, fontWeight: 'bold', textTransform: 'uppercase', color: '#333', textAlign: 'right' },
  
  // Grid Yapısı
  grid2: { flexDirection: 'row', gap: 20, marginBottom: 20 },
  colLeft: { width: '60%' },
  colRight: { width: '40%' },

  label: { fontSize: 8, color: '#666', marginBottom: 2, fontWeight: 'bold' },
  value: { fontSize: 10, marginBottom: 10 },
  
  // Tablo
  tableHeader: { flexDirection: 'row', backgroundColor: '#333', color: 'white', padding: 6, marginTop: 10, fontSize: 9, fontWeight: 'bold' },
  tableRow: { flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: '#eee', padding: 6 },
  colDesc: { width: '55%' },
  colQty: { width: '15%', textAlign: 'center' },
  colPrice: { width: '15%', textAlign: 'right' },
  colTotal: { width: '15%', textAlign: 'right' },

  // Alt Hesaplar
  totalsSection: { marginTop: 20, alignItems: 'flex-end' },
  totalRow: { flexDirection: 'row', marginBottom: 3 },
  totalLabel: { width: 100, textAlign: 'right', paddingRight: 10, color: '#666' },
  totalValue: { width: 80, textAlign: 'right' },
  
  balanceRow: { flexDirection: 'row', marginTop: 5, padding: 5, backgroundColor: '#eee' },
});

const InvoicePDF = ({ invoice, totals }) => {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        
        {/* HEADER: Logo ve Başlık */}
        <View style={styles.header}>
          <View>
             {/* DÜZELTME: Ternary Operator Kullanımı */}
             {invoice.logo ? <Image src={invoice.logo} style={styles.logo} /> : null}
          </View>
          <View>
             <Text style={styles.titleBig}>FATURA</Text>
             <Text style={{textAlign: 'right', color: '#666'}}>#{invoice.invoiceNumber}</Text>
          </View>
        </View>

        {/* BİLGİ ALANLARI (Grid) */}
        <View style={styles.grid2}>
            {/* Sol: Adresler */}
            <View style={styles.colLeft}>
                <Text style={styles.label}>GÖNDEREN:</Text>
                <Text style={[styles.value, {fontWeight: 'bold'}]}>{invoice.senderName}</Text>
                
                <View style={{flexDirection: 'row', gap: 10, marginTop: 10}}>
                    <View style={{width: '50%'}}>
                        <Text style={styles.label}>FATURA ADRESİ:</Text>
                        <Text style={styles.value}>{invoice.receiverName}</Text>
                    </View>
                    <View style={{width: '50%'}}>
                        <Text style={styles.label}>KARGO ADRESİ:</Text>
                        <Text style={styles.value}>{invoice.shipTo}</Text>
                    </View>
                </View>
            </View>

            {/* Sağ: Detaylar */}
            <View style={styles.colRight}>
                <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                    <Text style={styles.label}>TARİH:</Text>
                    <Text style={{fontSize: 10}}>{invoice.invoiceDate}</Text>
                </View>
                <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                    <Text style={styles.label}>ÖDEME KOŞULU:</Text>
                    <Text style={{fontSize: 10}}>{invoice.paymentTerms}</Text>
                </View>
                <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                    <Text style={styles.label}>VADE TARİHİ:</Text>
                    <Text style={{fontSize: 10}}>{invoice.dueDate}</Text>
                </View>
                <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                    <Text style={styles.label}>SİPARİŞ NO (PO):</Text>
                    <Text style={{fontSize: 10}}>{invoice.poNumber}</Text>
                </View>
            </View>
        </View>

        {/* TABLO */}
        <View style={styles.tableHeader}>
            <Text style={styles.colDesc}>Açıklama</Text>
            <Text style={styles.colQty}>Miktar</Text>
            <Text style={styles.colPrice}>Birim Fiyat</Text>
            <Text style={styles.colTotal}>Tutar</Text>
        </View>
        
        {invoice.items.map((item, index) => (
            <View key={index} style={styles.tableRow}>
                <Text style={styles.colDesc}>{item.name}</Text>
                <Text style={styles.colQty}>{item.qty}</Text>
                <Text style={styles.colPrice}>{item.price} {invoice.currency}</Text>
                <Text style={styles.colTotal}>{(item.qty * item.price).toFixed(2)} {invoice.currency}</Text>
            </View>
        ))}

        {/* TOPLAMLAR */}
        <View style={styles.totalsSection}>
            <View style={styles.totalRow}>
                <Text style={styles.totalLabel}>Ara Toplam:</Text>
                <Text style={styles.totalValue}>{totals.subTotal.toFixed(2)} {invoice.currency}</Text>
            </View>
            <View style={styles.totalRow}>
                <Text style={styles.totalLabel}>KDV (%{invoice.taxRate}):</Text>
                <Text style={styles.totalValue}>{totals.taxAmount.toFixed(2)} {invoice.currency}</Text>
            </View>
            
            {/* DÜZELTME: && yerine Ternary Operator (? : null) kullanıldı */}
            {invoice.shipping > 0 ? (
                <View style={styles.totalRow}>
                    <Text style={styles.totalLabel}>Kargo (+):</Text>
                    <Text style={styles.totalValue}>{parseFloat(invoice.shipping).toFixed(2)} {invoice.currency}</Text>
                </View>
            ) : null}
            
            {/* DÜZELTME: && yerine Ternary Operator (? : null) kullanıldı */}
            {invoice.discount > 0 ? (
                <View style={styles.totalRow}>
                    <Text style={styles.totalLabel}>İndirim (-):</Text>
                    <Text style={styles.totalValue}>{parseFloat(invoice.discount).toFixed(2)} {invoice.currency}</Text>
                </View>
            ) : null}

            <View style={[styles.totalRow, {borderTopWidth: 1, borderColor: '#ccc', paddingTop: 5, marginTop: 5}]}>
                <Text style={[styles.totalLabel, {fontWeight: 'bold', color: 'black'}]}>TOPLAM:</Text>
                <Text style={[styles.totalValue, {fontWeight: 'bold'}]}>{totals.total.toFixed(2)} {invoice.currency}</Text>
            </View>

            <View style={styles.totalRow}>
                <Text style={styles.totalLabel}>Ödenen:</Text>
                <Text style={styles.totalValue}>({parseFloat(invoice.amountPaid).toFixed(2)}) {invoice.currency}</Text>
            </View>

            <View style={styles.balanceRow}>
                <Text style={[styles.totalLabel, {fontWeight: 'bold', color: 'black'}]}>KALAN BORÇ:</Text>
                <Text style={[styles.totalValue, {fontWeight: 'bold', color: 'black'}]}>{totals.balanceDue.toFixed(2)} {invoice.currency}</Text>
            </View>
        </View>

        {/* ALT NOTLAR */}
        <View style={{marginTop: 30, borderTopWidth: 1, borderColor: '#eee', paddingTop: 10}}>
            {/* DÜZELTME: Ternary Operator */}
            {invoice.notes ? (
                <View style={{marginBottom: 10}}>
                    <Text style={styles.label}>NOTLAR:</Text>
                    <Text style={{fontSize: 9}}>{invoice.notes}</Text>
                </View>
            ) : null}
            
            {/* DÜZELTME: Ternary Operator */}
            {invoice.terms ? (
                <View>
                    <Text style={styles.label}>ŞARTLAR VE KOŞULLAR:</Text>
                    <Text style={{fontSize: 9}}>{invoice.terms}</Text>
                </View>
            ) : null}
        </View>

      </Page>
    </Document>
  );
};

export default InvoicePDF;