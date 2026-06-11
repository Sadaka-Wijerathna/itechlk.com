"use client";

import { useEffect, useState } from "react";
import AdminShell from "../AdminShell";
import { useCurrency } from "@/context/CurrencyContext";

export default function AdminOrdersPage() {
  const { formatPrice } = useCurrency();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedReceipt, setSelectedReceipt] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("All");

  const fetchOrders = async () => {
    setLoading(true);
    const res = await fetch("/api/orders");
    const data = await res.json();
    if (Array.isArray(data)) setOrders(data);
    setLoading(false);
  };

  useEffect(() => {
    setTimeout(() => {
      fetchOrders();
    }, 0);
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

  const deleteOrder = async (id: string) => {
    if (!confirm("Are you sure you want to PERMANENTLY delete this order? This cannot be undone and will delete it from the user's account as well.")) return;
    if (!confirm("LAST WARNING: This will completely remove the order from the database. Proceed?")) return;
    
    const res = await fetch(`/api/orders/${id}`, {
      method: "DELETE",
    });
    if (res.ok) {
      alert("Order deleted successfully");
      fetchOrders();
    } else {
      alert("Failed to delete order");
    }
  };

  const deleteAllOrders = async () => {
    if (!confirm("CRITICAL ACTION: Are you sure you want to PERMANENTLY delete ALL orders in the database? This cannot be undone.")) return;
    if (!confirm("FINAL CONFIRMATION: Type 'DELETE ALL' in your mind and click OK to confirm absolute deletion of every order.")) return;

    const res = await fetch("/api/orders", {
      method: "DELETE",
    });
    if (res.ok) {
      alert("All orders deleted");
      fetchOrders();
    } else {
      alert("Failed to delete all orders");
    }
  };

  const isPDF = (url: string) => url.toLowerCase().endsWith('.pdf');

  return (
    <AdminShell>
      <style dangerouslySetInnerHTML={{ __html: `
        .tab-buttons .os-btn:hover::after, 
        .order__info-top .os-btn:hover::after {
          display: none !important;
          height: 0 !important;
          opacity: 0 !important;
        }
        .tab-buttons .os-btn:hover,
        .order__info-top .os-btn:hover {
          background-color: #f5f5f5 !important;
          color: #000 !important;
          border-color: #ebebeb !important;
          transform: none !important;
        }
        .tab-buttons .os-btn-black:hover,
        .order__info-top .os-btn-black:hover {
          background-color: #000 !important;
          color: #fff !important;
          border-color: #000 !important;
        }
        .tab-buttons .os-btn-black:hover span {
          color: #fff !important;
        }
        .tab-buttons .os-btn:hover span {
          color: #000 !important;
        }
        .btn-no-hover:hover::after {
          display: none !important;
          height: 0 !important;
        }
        .btn-no-hover:hover {
          background-color: #dc3545 !important;
          border-color: #dc3545 !important;
          color: #fff !important;
        }
      ` }} />
      <div className="order__info" style={{ padding: '25px', background: '#fff', border: '1px solid #ebebeb' }}>
        <div className="order__info-top d-flex justify-content-between align-items-center mb-10">
          <h3 className="order__info-title m-0">
            <i className="fa fa-shopping-cart"></i> Manage Orders
          </h3>
        </div>

        <div className="d-flex justify-content-between align-items-center mb-25 flex-wrap gap-2" style={{ padding: '0 70px' }}>
          <div className="tab-buttons d-flex gap-2 flex-wrap">
            {["All", "Pending", "Confirmed", "Rejected"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`os-btn ${activeTab === tab ? "os-btn-black" : ""}`}
                style={{
                  padding: "0 12px",
                  height: "30px",
                  lineHeight: "28px",
                  fontSize: "11px",
                  fontWeight: 600,
                  backgroundColor: activeTab === tab ? "#000" : "#f5f5f5",
                  color: activeTab === tab ? "#fff" : "#000",
                  border: "1px solid #ebebeb",
                  transition: "all 0.3s ease",
                  borderRadius: "0px",
                  display: "flex",
                  alignItems: "center",
                  gap: "5px"
                }}
              >
                {tab}
                <span style={{ 
                  marginLeft: "4px",
                  fontSize: "11px",
                  color: activeTab === tab ? "#fff" : "#000",
                  opacity: activeTab === tab ? 1 : 0.7,
                  fontWeight: 600
                }}>
                  ({tab === "All" ? orders.length : orders.filter(o => o.status === tab).length})
                </span>
              </button>
            ))}
          </div>

          <button 
            onClick={deleteAllOrders}
            className="os-btn os-btn-black btn-no-hover"
            style={{ 
              backgroundColor: '#dc3545', 
              borderColor: '#dc3545',
              padding: '0 12px',
              height: '30px',
              lineHeight: '28px',
              fontSize: '10px',
              color: '#fff'
            }}
          >
            DELETE ALL ORDERS
          </button>
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
              ) : orders.filter(o => activeTab === "All" || o.status === activeTab).length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center py-5">No {activeTab.toLowerCase()} orders found.</td>
                </tr>
              ) : (
                orders
                  .filter(o => activeTab === "All" || o.status === activeTab)
                  .map((o) => (
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
                           style={{ background: 'none', border: '1px solid #ebebeb', padding: '2px', display: 'flex', width: '44px', height: '44px', justifyContent: 'center', alignItems: 'center' }}
                           title={isPDF(o.receiptUrl) ? "View PDF Receipt" : "View Image Receipt"}
                         >
                           {isPDF(o.receiptUrl) ? (
                             <i className="fa fa-file-pdf" style={{ fontSize: '24px', color: '#dc3545' }}></i>
                           ) : (
                             <img 
                              src={o.receiptUrl} 
                              alt="Receipt" 
                              style={{ width: '40px', height: '40px', objectFit: 'cover' }} 
                             />
                           )}
                         </button>
                      ) : (
                        <span style={{ fontSize: '11px', color: '#888' }}>No receipt</span>
                      )}
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
                      <div className="d-flex gap-2 align-items-center">
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
                        <button 
                          onClick={() => deleteOrder(o.id)}
                          title="Permanently Delete Order"
                          style={{ 
                            padding: '0 10px', height: '28px', lineHeight: '26px', fontSize: '11px', 
                            backgroundColor: '#000', border: '1px solid #000', color: '#fff',
                            transition: 'none', cursor: 'pointer', borderRadius: '0px'
                          }}
                        >
                          <i className="fa fa-trash"></i>
                        </button>
                      </div>
                    </td>
                    <td>
                      <button 
                        onClick={() => window.open(`/api/orders/${o.id}/invoice`, '_blank')}
                        title="View PDF Invoice"
                        style={{ 
                          padding: '0 12px', height: '28px', lineHeight: '26px', fontSize: '11px', 
                          backgroundColor: '#0d6efd', border: '1px solid #0d6efd', color: '#fff',
                          transition: 'none', cursor: 'pointer', borderRadius: '0px',
                          display: 'inline-flex', alignItems: 'center', gap: '5px'
                        }}
                      >
                        <i className="fa fa-file-pdf"></i> Invoice
                      </button>
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
          <div style={{ position: 'relative', width: '90%', height: '90%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
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
            
            {isPDF(selectedReceipt) ? (
              <iframe 
                src={selectedReceipt} 
                style={{ width: '100%', height: '80vh', border: 'none', background: '#fff' }} 
                title="Receipt PDF"
              />
            ) : (
              <img 
                src={selectedReceipt} 
                alt="Payment Receipt" 
                style={{ maxWidth: '100%', maxHeight: '80vh', objectFit: 'contain', border: '5px solid #fff', borderRadius: '4px' }} 
              />
            )}

            <div className="mt-20 text-center">
               <a 
                 href={selectedReceipt} 
                 download 
                 className="os-btn os-btn-black"
                 style={{ padding: '0 20px', height: '40px', lineHeight: '38px' }}
                >
                  <i className="fa fa-download"></i> Download {isPDF(selectedReceipt) ? 'PDF' : 'Receipt'}
               </a>
            </div>
          </div>
        </div>
      )}
    </AdminShell>
  );
}
