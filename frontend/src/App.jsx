import { useState, useEffect } from 'react'
import { PDFDownloadLink, pdf } from '@react-pdf/renderer';
import InvoicePDF from './InvoicePDF';

function App() {
 
  const [invoice, setInvoice] = useState({
    themeColor: '#009e74', 
    currency: '₺',
    logo: null,
    invoiceNumber: '1',
    invoiceDate: new Date().toISOString().slice(0, 10),
    dueDate: '',
    poNumber: '',
    senderName: '',
    senderAddress: '',
    receiverName: '',
    receiverAddress: '',
    shipTo: '',
    notes: '',
    terms: '',
    taxRate: 20,
    shipping: 0,
    discount: 0,
    amountPaid: 0,
    items: [{ id: 1, name: '', qty: 1, price: 0 }]
  });

  const [history, setHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);

  // --- HESAPLAMALAR ---
  const calculateTotal = () => {
    const subTotal = invoice.items.reduce((acc, item) => acc + (item.qty * item.price), 0);
    const taxAmount = subTotal * (invoice.taxRate / 100);
    const total = subTotal + taxAmount + parseFloat(invoice.shipping) - parseFloat(invoice.discount);
    const balanceDue = total - parseFloat(invoice.amountPaid);
    return { subTotal, taxAmount, total, balanceDue };
  }
  const totals = calculateTotal();

  // --- LOCAL STORAGE & GEÇMİŞ ---
  useEffect(() => {
    const savedInvoice = localStorage.getItem('currentInvoice');
    const savedHistory = localStorage.getItem('invoiceHistory');
    if (savedInvoice) setInvoice(JSON.parse(savedInvoice));
    if (savedHistory) setHistory(JSON.parse(savedHistory));
  }, []);

  useEffect(() => {
    localStorage.setItem('currentInvoice', JSON.stringify(invoice));
  }, [invoice]);

  const saveToHistory = () => {
    const newHistory = [invoice, ...history].slice(0, 10); 
    setHistory(newHistory);
    localStorage.setItem('invoiceHistory', JSON.stringify(newHistory));
    alert('Fatura Geçmişe Kaydedildi!');
  };

  const loadFromHistory = (savedInvoice) => {
    setInvoice(savedInvoice);
    setShowHistory(false);
  };

  // --- HANDLERS (FONKSİYONLAR) ---
  const handleChange = (e) => setInvoice({ ...invoice, [e.target.name]: e.target.value });
  
  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setInvoice({ ...invoice, logo: reader.result });
      reader.readAsDataURL(file);
    }
  };

  const handleItemChange = (id, e) => {
    const newItems = invoice.items.map(item => item.id === id ? { ...item, [e.target.name]: e.target.value } : item);
    setInvoice({ ...invoice, items: newItems });
  };

  const addItem = () => setInvoice({ ...invoice, items: [...invoice.items, { id: Date.now(), name: '', qty: 1, price: 0 }] });
  const deleteItem = (id) => setInvoice({ ...invoice, items: invoice.items.filter(item => item.id !== id) });

  // --- YENİ ÖZELLİKLER: YAZDIR & EMAIL ---
  const handlePrint = async () => {
    
    const blob = await pdf(<InvoicePDF invoice={invoice} totals={totals} />).toBlob();
    const url = URL.createObjectURL(blob);
    window.open(url, '_blank');
  };

  const handleEmail = () => {
    
    const subject = `Fatura #${invoice.invoiceNumber} - ${invoice.senderName}`;
    const body = `Sayın ${invoice.receiverName},\n\nFaturanız ekte yer almaktadır. Lütfen inceleyiniz.\n\nToplam Tutar: ${totals.total} ${invoice.currency}\n\nSaygılarımla,\n${invoice.senderName}`;
    window.location.href = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    alert("E-posta istemciniz açılıyor. PDF dosyasını indirmeyi ve e-postaya eklemeyi unutmayın!");
  };

  return (
    <div className="min-h-screen bg-gray-100 flex font-sans text-gray-700">
      
      {/* --- SOL TARAFTAKİ BÜYÜK ALAN (FATURA KAĞIDI) --- */}
      <div className="flex-1 p-8 overflow-y-auto">
        <div className="max-w-4xl mx-auto bg-white shadow-xl rounded-lg border border-gray-200 min-h-[1000px] relative">
            
            {/* Üst Renk Çubuğu */}
            <div className="h-2 w-full rounded-t-lg" style={{ backgroundColor: invoice.themeColor }}></div>

            <div className="p-10">
                {/* Header: Logo ve Başlık */}
                <div className="flex justify-between items-start mb-8">
                    <div className="w-1/2">
                        <label className="block w-48 h-24 bg-gray-50 border-2 border-dashed border-gray-300 rounded hover:bg-gray-100 cursor-pointer flex items-center justify-center relative overflow-hidden group">
                            {invoice.logo ? (
                                <img src={invoice.logo} className="w-full h-full object-contain" />
                            ) : (
                                <div className="text-center text-gray-400 text-sm">
                                    <span className="text-2xl block">+</span> Logo Ekle
                                </div>
                            )}
                            <input type="file" accept="image/*" onChange={handleLogoChange} className="hidden"/>
                        </label>
                    </div>
                    <div className="w-1/2 text-right">
                        <h1 className="text-4xl font-light uppercase tracking-widest text-gray-800 mb-2">FATURA</h1>
                        <div className="flex justify-end items-center gap-2">
                            <span className="font-bold text-gray-500">#</span>
                            <input type="text" name="invoiceNumber" value={invoice.invoiceNumber} onChange={handleChange} className="border border-gray-300 rounded p-1 w-24 text-right" placeholder="1"/>
                        </div>
                    </div>
                </div>

                {/* Adresler ve Detaylar */}
                <div className="flex gap-10 mb-10">
                    <div className="w-1/2 space-y-4">
                        <div>
                            <input type="text" name="senderName" value={invoice.senderName} onChange={handleChange} className="w-full font-bold placeholder-gray-400 outline-none border-b border-transparent hover:border-gray-200 focus:border-blue-400 transition" placeholder="Şirket Adınız" />
                            <textarea name="senderAddress" value={invoice.senderAddress} onChange={handleChange} className="w-full text-sm resize-none outline-none h-16 mt-1 text-gray-500" placeholder="Adresiniz..."></textarea>
                        </div>
                        <div className="flex gap-4">
                           <div className="w-1/2">
                                <label className="text-xs font-bold text-gray-400 uppercase">Fatura Adresi</label>
                                <input type="text" name="receiverName" value={invoice.receiverName} onChange={handleChange} className="w-full font-bold placeholder-gray-400 outline-none border-b border-transparent hover:border-gray-200 focus:border-blue-400 transition mt-1" placeholder="Müşteri Adı" />
                                <textarea name="receiverAddress" value={invoice.receiverAddress} onChange={handleChange} className="w-full text-sm resize-none outline-none h-16 mt-1 text-gray-500" placeholder="Müşteri Adresi..."></textarea>
                           </div>
                           <div className="w-1/2">
                                <label className="text-xs font-bold text-gray-400 uppercase">Kargo Adresi</label>
                                <textarea name="shipTo" value={invoice.shipTo} onChange={handleChange} className="w-full text-sm resize-none outline-none h-24 mt-1 p-1 border border-gray-100 rounded text-gray-500" placeholder="(Opsiyonel)"></textarea>
                           </div>
                        </div>
                    </div>
                    <div className="w-1/2 grid grid-cols-1 gap-2 content-start">
                        <div className="flex items-center"><label className="w-32 text-right text-gray-500 text-sm mr-2">Tarih</label><input type="date" name="invoiceDate" value={invoice.invoiceDate} onChange={handleChange} className="flex-1 border rounded p-1 text-right text-sm"/></div>
                        <div className="flex items-center"><label className="w-32 text-right text-gray-500 text-sm mr-2">Vade Tarihi</label><input type="date" name="dueDate" value={invoice.dueDate} onChange={handleChange} className="flex-1 border rounded p-1 text-right text-sm"/></div>
                        <div className="flex items-center"><label className="w-32 text-right text-gray-500 text-sm mr-2">Sipariş No (PO)</label><input type="text" name="poNumber" value={invoice.poNumber} onChange={handleChange} className="flex-1 border rounded p-1 text-right text-sm"/></div>
                    </div>
                </div>

                {/* Tablo */}
                <div className="mb-8">
                    <div className="flex text-white text-sm font-bold py-2 px-2 rounded-t" style={{ backgroundColor: invoice.themeColor }}>
                        <div className="w-[50%]">Ürün / Hizmet</div>
                        <div className="w-[15%] text-center">Miktar</div>
                        <div className="w-[15%] text-right">Fiyat</div>
                        <div className="w-[20%] text-right">Tutar</div>
                    </div>
                    {invoice.items.map((item) => (
                        <div key={item.id} className="flex items-center p-2 border-b border-gray-100 hover:bg-gray-50 group relative">
                            <div className="w-[50%]"><input type="text" name="name" value={item.name} onChange={(e) => handleItemChange(item.id, e)} className="w-full bg-transparent outline-none" placeholder="Açıklama..." /></div>
                            <div className="w-[15%]"><input type="number" name="qty" value={item.qty} onChange={(e) => handleItemChange(item.id, e)} className="w-full text-center bg-transparent outline-none" /></div>
                            <div className="w-[15%]"><input type="number" name="price" value={item.price} onChange={(e) => handleItemChange(item.id, e)} className="w-full text-right bg-transparent outline-none" /></div>
                            <div className="w-[20%] text-right font-medium">{(item.qty * item.price).toFixed(2)} {invoice.currency}</div>
                            <button onClick={() => deleteItem(item.id)} className="absolute -left-6 text-red-400 hover:text-red-600 opacity-0 group-hover:opacity-100">✕</button>
                        </div>
                    ))}
                    <button onClick={addItem} className="mt-2 text-sm font-bold hover:underline flex items-center gap-1" style={{ color: invoice.themeColor }}>+ Satır Ekle</button>
                </div>

                {/* Alt Kısım */}
                <div className="flex justify-end">
                    <div className="w-1/2 space-y-2 text-sm">
                        <div className="flex justify-between"><span>Ara Toplam</span><span>{totals.subTotal.toFixed(2)} {invoice.currency}</span></div>
                        <div className="flex justify-between items-center"><span>KDV (%) <input type="number" name="taxRate" value={invoice.taxRate} onChange={handleChange} className="w-10 border rounded text-center ml-1"/></span><span>{totals.taxAmount.toFixed(2)} {invoice.currency}</span></div>
                        <div className="flex justify-between items-center text-red-500"><span>İndirim (-)</span><div className="flex items-center"><input type="number" name="discount" value={invoice.discount} onChange={handleChange} className="w-16 border rounded text-right mr-1 p-1 text-xs"/></div></div>
                        <div className="flex justify-between items-center text-green-600"><span>Kargo (+)</span><div className="flex items-center"><input type="number" name="shipping" value={invoice.shipping} onChange={handleChange} className="w-16 border rounded text-right mr-1 p-1 text-xs"/></div></div>
                        <div className="border-t pt-2 flex justify-between text-lg font-bold text-gray-800"><span>TOPLAM</span><span>{totals.total.toFixed(2)} {invoice.currency}</span></div>
                        <div className="flex justify-between items-center"><span>Ödenen Tutar</span><div className="flex items-center"><input type="number" name="amountPaid" value={invoice.amountPaid} onChange={handleChange} className="w-20 border rounded text-right mr-1 p-1"/></div></div>
                        <div className="flex justify-between font-bold text-gray-600 bg-gray-100 p-2 rounded"><span>Kalan Borç</span><span>{totals.balanceDue.toFixed(2)} {invoice.currency}</span></div>
                    </div>
                </div>

                <div className="mt-8 border-t pt-4 space-y-4">
                    <div>
                        <label className="text-xs font-bold text-gray-400 uppercase">Notlar</label>
                        <textarea name="notes" value={invoice.notes} onChange={handleChange} className="w-full bg-gray-50 p-2 rounded text-sm mt-1 h-16 resize-none outline-none" placeholder="Müşteriye not..."></textarea>
                    </div>
                    <div>
                        <label className="text-xs font-bold text-gray-400 uppercase">Şartlar & Koşullar</label>
                        <textarea name="terms" value={invoice.terms} onChange={handleChange} className="w-full bg-gray-50 p-2 rounded text-sm mt-1 h-16 resize-none outline-none" placeholder="Ödeme koşulları..."></textarea>
                    </div>
                </div>

            </div>
        </div>
      </div>

      {/* --- SAĞ TARAFTAKİ KONTROL PANELİ (SIDEBAR) --- */}
      <div className="w-80 bg-white border-l border-gray-200 p-6 flex flex-col gap-6 shadow-2xl z-10 h-screen sticky top-0 overflow-y-auto">
        
        {/* İndir Butonu */}
        <PDFDownloadLink document={<InvoicePDF invoice={invoice} totals={totals} />} fileName={`fatura-${invoice.invoiceNumber}.pdf`}>
            {({ loading }) => (
                <button 
                    className="w-full py-3 rounded-lg font-bold text-white shadow-lg transition transform hover:scale-105 flex items-center justify-center gap-2"
                    style={{ backgroundColor: invoice.themeColor }}
                    disabled={loading}
                >
                    {loading ? 'Hazırlanıyor...' : '📥 Faturayı İndir'}
                </button>
            )}
        </PDFDownloadLink>

        {/* Aksiyon Butonları */}
        <div className="grid grid-cols-2 gap-3">
             <button onClick={saveToHistory} className="border border-gray-300 rounded p-2 text-sm text-gray-600 hover:bg-gray-50 font-medium">💾 Kaydet</button>
             <button onClick={() => setShowHistory(!showHistory)} className="border border-gray-300 rounded p-2 text-sm text-gray-600 hover:bg-gray-50 font-medium">📜 Geçmiş</button>
             <button onClick={handlePrint} className="border border-gray-300 rounded p-2 text-sm text-gray-600 hover:bg-gray-50 font-medium">🖨️ Yazdır</button>
             <button onClick={handleEmail} className="border border-gray-300 rounded p-2 text-sm text-gray-600 hover:bg-gray-50 font-medium">📧 E-posta</button>
        </div>

        <hr className="border-gray-100"/>

        {/* Para Birimi Ayarı */}
        <div>
            <label className="text-sm font-bold text-gray-400 uppercase block mb-2">Para Birimi</label>
            <select name="currency" value={invoice.currency} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded bg-white">
                <option value="₺">₺ (TRY)</option>
                <option value="$">$ (USD)</option>
                <option value="€">€ (EUR)</option>
                <option value="£">£ (GBP)</option>
            </select>
        </div>

        {/* Tema Ayarı */}
        <div>
            <label className="text-sm font-bold text-gray-400 uppercase block mb-2">Tema Rengi</label>
            <div className="flex gap-2 flex-wrap">
                {['#009e74', '#3b82f6', '#1f2937', '#ef4444', '#8b5cf6'].map(color => (
                    <button 
                        key={color} 
                        onClick={() => setInvoice({ ...invoice, themeColor: color })}
                        className={`w-8 h-8 rounded-full border-2 ${invoice.themeColor === color ? 'border-gray-400 scale-110' : 'border-transparent'}`}
                        style={{ backgroundColor: color }}
                    />
                ))}
            </div>
        </div>

        {/* Geçmiş Paneli (Açılırsa görünür) */}
        {showHistory && (
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 mt-4">
                <h4 className="font-bold text-gray-700 mb-2">Son Faturalar</h4>
                {history.length === 0 ? <p className="text-xs text-gray-400">Henüz kayıt yok.</p> : (
                    <ul className="space-y-2">
                        {history.map((h, i) => (
                            <li key={i} onClick={() => loadFromHistory(h)} className="text-xs bg-white p-2 rounded border border-gray-200 cursor-pointer hover:border-blue-400">
                                <div className="font-bold">#{h.invoiceNumber} - {h.receiverName}</div>
                                <div className="text-gray-400">{h.invoiceDate}</div>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        )}

      </div>

    </div>
  )
}

export default App
