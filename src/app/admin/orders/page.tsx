"use client";

import { useEffect, useState } from "react";
import AdminShell from "../AdminShell";
import { useCurrency } from "@/context/CurrencyContext";

export default function AdminOrdersPage() {
  const { formatPrice } = useCurrency();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedReceipt, setSelectedReceipt] = useState<string | null>(null);

  const fetchOrders = async () => {
    // ... same as before
    setLoading(true);
    const res = await fetch("/api/orders");
    const data = await res.json();
    if (Array.isArray(data)) setOrders(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const updateStatus = async (id: string, status: string) => {
    if (!confirm(`Are you sure you want to ${status.toLowerCase()} this order?`)) return;
    const res = await fetch(`/api/orders/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status })
    });
    if (res.ok) {
      alert(`Order ${status}`);
      fetchOrders();
    } else {
      alert("Failed to update status");
    }
  };

  const downloadInvoice = (order: any, item: any) => {
    const content = `ITechLK eCommerce Invoice\n------------------------------------------------\nOrder ID: ${order.id}\nDate: ${new Date(order.createdAt).toLocaleDateString()}\nStatus: ${order.status}\n\nBilled To:\n${order.firstName} ${order.lastName}\n${order.email} | ${order.phone}\nCountry: ${order.country}\n\nProduct: ${item.title}\nDuration: ${item.duration || 'N/A'}\nQuantity: ${item.quantity}\nPrice: ${formatPrice(item.price)}\n\nOrder Total: ${formatPrice(order.totalAmount)}\n------------------------------------------------\nThank you for your purchase!`;
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Invoice_${order.id.slice(-6)}_${item.title.replace(/\s+/g, '_')}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <AdminShell>
      <div className="order__info">
        <div className="order__info-top d-flex justify-content-between align-items-center">
          <h3 className="order__info-title">
            <i className="fa fa-shopping-cart"></i> Manage Orders
          </h3>
        </div>

        <div className="order__list white-bg table-responsive">
          <table className="table">
            <thead>
              <tr>
                <th scope="col">Order ID</th>
                <th scope="col">Customer</th>
                <th scope="col">Products</th>
                <th scope="col">Total</th>
                <th scope="col">Receipt</th>
                <th scope="col">Status</th>
                <th scope="col">Actions</th>
                <th scope="col">Invoice</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={8} className="text-center py-5">Loading orders...</td>
                </tr>
              ) : orders.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center py-5">No orders found.</td>
                </tr>
              ) : (
                orders.map((o) => (
                  <tr key={o.id}>
                    <td>#{o.id.slice(-6).toUpperCase()}</td>
                    <td>
                      <strong>{o.firstName} {o.lastName}</strong><br/>
                      <small>{o.email}</small><br/>
                      <small>
                        <a 
                          href={o.phone ? `https://wa.me/${o.phone.startsWith('0') ? '94' + o.phone.substring(1).replace(/\D/g, '') : o.phone.startsWith('94') ? o.phone.replace(/\D/g, '') : '94' + o.phone.replace(/\D/g, '')}` : '#'} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          style={{ color: '#25D366', fontWeight: 600 }}
                          title="Chat on WhatsApp"
                        >
                          <i className="fab fa-whatsapp"></i> {o.phone}
                        </a>
                      </small>
                    </td>
                    <td>
                      {o.items.map((item: any, i: number) => (
                        <div key={i} className="mb-1" style={{ fontSize: '12px' }}>
                          <span style={{ fontWeight: 600 }}>{item.title}</span><br/>
                          <span style={{ color: '#666' }}>Duration: {item.duration || 'N/A'}</span> (x{item.quantity})
                        </div>
                      ))}
                    </td>
                    <td>{formatPrice(o.totalAmount)}</td>
                    <td>
                      {o.receiptUrl ? (
                         <button 
                           onClick={() => setSelectedReceipt(o.receiptUrl)}
                           style={{ color: '#21a8c9', textDecoration: 'underline', background: 'none', border: 'none', padding: 0 }}
                         >
                           View
                         </button>
                      ) : 'N/A'}
                    </td>
                    <td>
                      <span style={{ 
                        padding: '4px 8px', 
                        borderRadius: '20px', 
                        fontSize: '11px',
                        fontWeight: 'bold',
                        backgroundColor: o.status === 'Confirmed' ? '#dcfce7' : o.status === 'Rejected' ? '#fee2e2' : '#fef3c7',
                        color: o.status === 'Confirmed' ? '#166534' : o.status === 'Rejected' ? '#991b1b' : '#92400e' 
                      }}>
                        {o.status}
                      </span>
                    </td>
                    <td>
                      <div className="d-flex gap-2">
                        {o.status === 'Pending' && (
                          <>
                            <button 
                              onClick={() => updateStatus(o.id, 'Confirmed')} 
                              style={{ 
                                padding: '0 10px', height: '28px', lineHeight: '26px', fontSize: '11px', 
                                backgroundColor: '#198754', border: '1px solid #198754', color: '#fff',
                                transition: 'none', cursor: 'pointer', borderRadius: '0px'
                              }}
                            >
                              Confirm
                            </button>
                            <button 
                              onClick={() => updateStatus(o.id, 'Rejected')} 
                              style={{ 
                                padding: '0 10px', height: '28px', lineHeight: '26px', fontSize: '11px', 
                                backgroundColor: '#dc3545', border: '1px solid #dc3545', color: '#fff',
                                transition: 'none', cursor: 'pointer', borderRadius: '0px'
                              }}
                            >
                              Reject
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                    <td>
                      {o.items.map((item: any, i: number) => (
                        <div key={i} className="mb-1">
                          <button 
                            onClick={() => downloadInvoice(o, item)}
                            className="os-btn"
                            style={{ padding: '0 10px', height: '28px', lineHeight: '26px', fontSize: '11px', backgroundColor: '#198754', borderColor: '#198754', color: '#fff' }}
                          >
                            Download
                          </button>
                        </div>
                      ))}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Receipt Modal */}
      {selectedReceipt && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundColor: 'rgba(0,0,0,0.85)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 9999,
          padding: '40px'
        }}>
          <div style={{ position: 'relative', maxWidth: '90%', maxHeight: '90%' }}>
            <button 
              onClick={() => setSelectedReceipt(null)}
              style={{
                position: 'absolute',
                top: '-40px',
                right: '0px',
                color: '#fff',
                background: 'none',
                border: 'none',
                fontSize: '30px',
                cursor: 'pointer'
              }}
            >
              &times;
            </button>
            <img 
              src={selectedReceipt} 
              alt="Payment Receipt" 
              style={{ maxWidth: '100%', maxHeight: '80vh', objectFit: 'contain', border: '5px solid #fff', borderRadius: '4px' }} 
            />
            <div className="mt-20 text-center">
               <a 
                 href={selectedReceipt} 
                 download 
                 className="os-btn os-btn-black"
                 style={{ padding: '0 20px', height: '40px', lineHeight: '38px' }}
                >
                  <i className="fa fa-download"></i> Download Receipt
               </a>
            </div>
          </div>
        </div>
      )}
    </AdminShell>
  );
}
