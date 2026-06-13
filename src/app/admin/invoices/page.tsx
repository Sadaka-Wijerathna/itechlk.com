"use client";

import { useEffect, useState } from "react";
import AdminShell from "../AdminShell";
import { useCurrency } from "@/context/CurrencyContext";
import { useGeoLocation } from "@/hooks/use-geo-location";

const COUNTRY_DATA = [
  { name: "Afghanistan", code: "+93" }, { name: "Albania", code: "+355" }, { name: "Algeria", code: "+213" },
  { name: "Andorra", code: "+376" }, { name: "Angola", code: "+244" }, { name: "Argentina", code: "+54" },
  { name: "Armenia", code: "+374" }, { name: "Australia", code: "+61" }, { name: "Austria", code: "+43" },
  { name: "Azerbaijan", code: "+994" }, { name: "Bahamas", code: "+1" }, { name: "Bahrain", code: "+973" },
  { name: "Bangladesh", code: "+880" }, { name: "Belarus", code: "+375" }, { name: "Belgium", code: "+32" },
  { name: "Belize", code: "+501" }, { name: "Benin", code: "+229" }, { name: "Bhutan", code: "+975" },
  { name: "Bolivia", code: "+591" }, { name: "Bosnia and Herzegovina", code: "+387" }, { name: "Botswana", code: "+267" },
  { name: "Brazil", code: "+55" }, { name: "Brunei", code: "+673" }, { name: "Bulgaria", code: "+359" },
  { name: "Burundi", code: "+257" }, { name: "Cambodia", code: "+855" }, { name: "Cameroon", code: "+237" },
  { name: "Canada", code: "+1" }, { name: "Chile", code: "+56" }, { name: "China", code: "+86" },
  { name: "Colombia", code: "+57" }, { name: "Costa Rica", code: "+506" }, { name: "Croatia", code: "+385" },
  { name: "Cuba", code: "+53" }, { name: "Cyprus", code: "+357" }, { name: "Czechia", code: "+420" },
  { name: "Denmark", code: "+45" }, { name: "Dominican Republic", code: "+1" }, { name: "Ecuador", code: "+593" },
  { name: "Egypt", code: "+20" }, { name: "El Salvador", code: "+503" }, { name: "Estonia", code: "+372" },
  { name: "Ethiopia", code: "+251" }, { name: "Fiji", code: "+679" }, { name: "Finland", code: "+358" },
  { name: "France", code: "+33" }, { name: "Georgia", code: "+995" }, { name: "Germany", code: "+49" },
  { name: "Ghana", code: "+233" }, { name: "Greece", code: "+30" }, { name: "Guatemala", code: "+502" },
  { name: "Haiti", code: "+509" }, { name: "Honduras", code: "+504" }, { name: "Hong Kong", code: "+852" },
  { name: "Hungary", code: "+36" }, { name: "Iceland", code: "+354" }, { name: "India", code: "+91" },
  { name: "Indonesia", code: "+62" }, { name: "Iran", code: "+98" }, { name: "Iraq", code: "+964" },
  { name: "Ireland", code: "+353" }, { name: "Israel", code: "+972" }, { name: "Italy", code: "+39" },
  { name: "Jamaica", code: "+1" }, { name: "Japan", code: "+81" }, { name: "Jordan", code: "+962" },
  { name: "Kazakhstan", code: "+7" }, { name: "Kenya", code: "+254" }, { name: "Kuwait", code: "+965" },
  { name: "Laos", code: "+856" }, { name: "Latvia", code: "+371" }, { name: "Lebanon", code: "+961" },
  { name: "Libya", code: "+218" }, { name: "Liechtenstein", code: "+423" }, { name: "Lithuania", code: "+370" },
  { name: "Luxembourg", code: "+352" }, { name: "Macao", code: "+853" }, { name: "Madagascar", code: "+261" },
  { name: "Malaysia", code: "+60" }, { name: "Maldives", code: "+960" }, { name: "Malta", code: "+356" },
  { name: "Mexico", code: "+52" }, { name: "Moldova", code: "+373" }, { name: "Monaco", code: "+377" },
  { name: "Mongolia", code: "+976" }, { name: "Montenegro", code: "+382" }, { name: "Morocco", code: "+212" },
  { name: "Myanmar", code: "+95" }, { name: "Nepal", code: "+977" }, { name: "Netherlands", code: "+31" },
  { name: "New Zealand", code: "+64" }, { name: "Nicaragua", code: "+505" }, { name: "Nigeria", code: "+234" },
  { name: "Norway", code: "+47" }, { name: "Oman", code: "+968" }, { name: "Pakistan", code: "+92" },
  { name: "Panama", code: "+507" }, { name: "Paraguay", code: "+595" }, { name: "Peru", code: "+51" },
  { name: "Philippines", code: "+63" }, { name: "Poland", code: "+48" }, { name: "Portugal", code: "+351" },
  { name: "Qatar", code: "+974" }, { name: "Romania", code: "+40" }, { name: "Russia", code: "+7" },
  { name: "Saudi Arabia", code: "+966" }, { name: "Serbia", code: "+381" }, { name: "Singapore", code: "+65" },
  { name: "Slovakia", code: "+421" }, { name: "Slovenia", code: "+386" }, { name: "South Africa", code: "+27" },
  { name: "South Korea", code: "+82" }, { name: "Spain", code: "+34" }, { name: "Sri Lanka", code: "+94" },
  { name: "Sudan", code: "+249" }, { name: "Sweden", code: "+46" }, { name: "Switzerland", code: "+41" },
  { name: "Syria", code: "+963" }, { name: "Taiwan", code: "+886" }, { name: "Tajikistan", code: "+992" },
  { name: "Tanzania", code: "+255" }, { name: "Thailand", code: "+66" }, { name: "Tunisia", code: "+216" },
  { name: "Turkey", code: "+90" }, { name: "Uganda", code: "+256" }, { name: "Ukraine", code: "+380" },
  { name: "United Arab Emirates", code: "+971" }, { name: "United Kingdom", code: "+44" },
  { name: "United States", code: "+1" }, { name: "Uruguay", code: "+598" }, { name: "Uzbekistan", code: "+998" },
  { name: "Venezuela", code: "+58" }, { name: "Vietnam", code: "+84" }, { name: "Yemen", code: "+967" },
  { name: "Zambia", code: "+260" }, { name: "Zimbabwe", code: "+263" }
];


interface InvoiceItemInput {
  type: "product" | "custom";
  productId: string;
  title: string;
  duration: string;
  price: string; // Local currency price as string
  quantity: number;
}

export default function AdminInvoicesPage() {
  const { formatPrice, rate, symbol } = useCurrency();
  const { geo } = useGeoLocation();
  
  // Data States
  const [invoices, setInvoices] = useState<any[]>([]);
  const [storeProducts, setStoreProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  // Form States
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    email: "",
    firstName: "",
    lastName: "",
    phone: "",
    phoneCode: "",
    country: "Sri Lanka",
    items: [] as InvoiceItemInput[],
    discountAmt: "0", // Local currency discount
  });

  // Fetch only direct invoices created by admins
  const fetchInvoices = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/invoices");
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data)) setInvoices(data);
      }
    } catch (err) {
      console.error("Failed to fetch invoices", err);
    }
    setLoading(false);
  };

  // Fetch active store products for dropdown selection
  const fetchProducts = async () => {
    try {
      const res = await fetch("/api/products");
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data)) setStoreProducts(data);
      }
    } catch (err) {
      console.error("Failed to fetch products", err);
    }
  };

  useEffect(() => {
    setTimeout(() => {
      fetchInvoices();
      fetchProducts();
    }, 0);
  }, []);

  // Invoice Status Actions
  const updateStatus = async (id: string, status: string) => {
    if (!confirm(`Are you sure you want to mark this invoice as ${status.toLowerCase()}?`)) return;
    try {
      const res = await fetch(`/api/orders/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (res.ok) {
        alert(`Invoice status updated to ${status}`);
        fetchInvoices();
      } else {
        alert("Failed to update invoice status");
      }
    } catch (err) {
      console.error("Error updating status", err);
    }
  };

  const deleteInvoice = async (id: string) => {
    if (!confirm("Are you sure you want to PERMANENTLY delete this invoice? This cannot be undone.")) return;
    try {
      const res = await fetch(`/api/orders/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        alert("Invoice deleted successfully");
        fetchInvoices();
      } else {
        alert("Failed to delete invoice");
      }
    } catch (err) {
      console.error("Error deleting invoice", err);
    }
  };

  // Invoice Form Helpers
  const openCreateForm = () => {
    setForm({
      email: "",
      firstName: "",
      lastName: "",
      phone: "",
      phoneCode: geo?.callingCode || "+94",
      country: geo?.countryName || "Sri Lanka",
      items: [
        {
          type: "product",
          productId: "",
          title: "",
          duration: "1 Month",
          price: "0",
          quantity: 1,
        },
      ],
      discountAmt: "0",
    });
    setShowForm(true);
  };

  const closeCreateForm = () => {
    setShowForm(false);
  };

  const addProductItem = () => {
    setForm((prev) => ({
      ...prev,
      items: [
        ...prev.items,
        {
          type: "product",
          productId: "",
          title: "",
          duration: "1 Month",
          price: "0",
          quantity: 1,
        },
      ],
    }));
  };

  const addCustomItem = () => {
    setForm((prev) => ({
      ...prev,
      items: [
        ...prev.items,
        {
          type: "custom",
          productId: "custom",
          title: "",
          duration: "Standard",
          price: "0",
          quantity: 1,
        },
      ],
    }));
  };

  const removeItem = (index: number) => {
    setForm((prev) => ({
      ...prev,
      items: prev.items.filter((_, idx) => idx !== index),
    }));
  };

  const handleProductChange = (index: number, prodId: string) => {
    const product = storeProducts.find((p) => p.id === prodId);
    if (!product) return;

    // Resolve durations
    const durations = product.sizes && product.sizes.length > 0 ? product.sizes : ["Standard"];
    const defaultDuration = durations[0];

    // Resolve price
    let priceUSD = product.price;
    if (product.durationPrices && product.durationPrices[defaultDuration]) {
      priceUSD = product.durationPrices[defaultDuration].price;
    }
    const localPrice = Math.round(priceUSD * rate);

    setForm((prev) => {
      const items = [...prev.items];
      items[index] = {
        ...items[index],
        productId: prodId,
        title: product.title,
        duration: defaultDuration,
        price: String(localPrice),
      };
      return { ...prev, items };
    });
  };

  const handleDurationChange = (index: number, duration: string) => {
    const item = form.items[index];
    if (item.type !== "product") return;

    const product = storeProducts.find((p) => p.id === item.productId);
    if (!product) return;

    let priceUSD = product.price;
    if (product.durationPrices && product.durationPrices[duration]) {
      priceUSD = product.durationPrices[duration].price;
    }
    const localPrice = Math.round(priceUSD * rate);

    setForm((prev) => {
      const items = [...prev.items];
      items[index] = {
        ...items[index],
        duration,
        price: String(localPrice),
      };
      return { ...prev, items };
    });
  };

  const handleItemFieldChange = (index: number, field: keyof InvoiceItemInput, value: any) => {
    setForm((prev) => {
      const items = [...prev.items];
      items[index] = {
        ...items[index],
        [field]: value,
      };
      return { ...prev, items };
    });
  };

  // Compute live totals
  const subtotal = form.items.reduce((acc, item) => {
    const itemPrice = parseFloat(item.price) || 0;
    return acc + itemPrice * item.quantity;
  }, 0);
  const discountVal = parseFloat(form.discountAmt) || 0;
  const total = Math.max(0, subtotal - discountVal);

  // Handle Form Submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.items.length === 0) {
      alert("Please add at least one item to the invoice.");
      return;
    }

    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.email)) {
      alert("Please enter a valid customer email.");
      return;
    }

    // Validate phone and country
    if (!form.phoneCode.trim()) {
      alert("Please enter a phone country code.");
      return;
    }
    if (!form.phone.trim()) {
      alert("Please enter a phone number.");
      return;
    }
    if (!form.country.trim()) {
      alert("Please select a country.");
      return;
    }

    // Validate products
    for (let i = 0; i < form.items.length; i++) {
      const item = form.items[i];
      if (item.type === "product" && !item.productId) {
        alert(`Please select a product for Item #${i + 1}`);
        return;
      }
      if (!item.title.trim()) {
        alert(`Please enter a title for Item #${i + 1}`);
        return;
      }
      if (parseFloat(item.price) < 0) {
        alert(`Item #${i + 1} price cannot be negative.`);
        return;
      }
      if (item.quantity <= 0) {
        alert(`Item #${i + 1} quantity must be at least 1.`);
        return;
      }
    }

    setSaving(true);

    // Convert prices and discount back to USD for the API database records
    const payloadItems = form.items.map((item) => ({
      productId: item.productId,
      title: item.title,
      price: (parseFloat(item.price) || 0) / rate,
      quantity: item.quantity,
      duration: item.duration,
    }));
    const discountAmtUSD = discountVal / rate;

    const payload = {
      email: form.email,
      firstName: form.firstName,
      lastName: form.lastName,
      phone: form.phone,
      phoneCode: form.phoneCode,
      country: form.country,
      items: payloadItems,
      discountAmt: discountAmtUSD,
    };

    try {
      const res = await fetch("/api/admin/invoices", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        const data = await res.json();
        alert("Invoice created successfully!");
        setShowForm(false);
        fetchInvoices();
        // Prompt to open invoice PDF
        if (data.order?.id) {
          window.open(`/api/orders/${data.order.id}/invoice`, "_blank");
        }
      } else {
        const err = await res.json();
        alert(`Failed to create invoice: ${err.error || "Server error"}`);
      }
    } catch (err) {
      alert("An error occurred while saving the invoice.");
    }
    setSaving(false);
  };

  // Filtering invoices list
  const filteredInvoices = invoices.filter((inv) => {
    const fullName = `${inv.firstName || ""} ${inv.lastName || ""}`.toLowerCase();
    const email = (inv.email || "").toLowerCase();
    const query = search.toLowerCase();
    return fullName.includes(query) || email.includes(query) || inv.id.toLowerCase().includes(query);
  });

  return (
    <AdminShell>

      {!showForm ? (
        <div className="order__info" style={{ padding: '25px', background: '#fff', border: '1px solid #ebebeb' }}>
          <div className="order__info-top d-flex justify-content-between align-items-center mb-10">
            <h3 className="order__info-title m-0">
              <i className="fa fa-file-invoice"></i> Manage Invoices
            </h3>
            <button className="os-btn os-btn-black" onClick={openCreateForm}>
              + Create Invoice
            </button>
          </div>

          <div className="password__change-top d-flex justify-content-between align-items-center" style={{ paddingTop: 0, paddingBottom: 15 }}>
            <input
              type="text"
              placeholder="Search by customer name, email, ID..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="password__input"
              style={{
                width: "100%", maxWidth: 340, height: 44, border: "1px solid #ebebeb",
                padding: "0 15px", fontSize: 14, background: "#fff",
              }}
            />
          </div>

          <div className="order__list white-bg table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th scope="col">Invoice ID</th>
                  <th scope="col">Customer</th>
                  <th scope="col">Items</th>
                  <th scope="col">Total</th>
                  <th scope="col">Date</th>
                  <th scope="col">Status</th>
                  <th scope="col">Actions</th>
                  <th scope="col">Invoice</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={8} className="text-center py-5">Loading invoices...</td>
                  </tr>
                ) : filteredInvoices.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="text-center py-5">No invoices found.</td>
                  </tr>
                ) : (
                  filteredInvoices.map((o) => (
                    <tr key={o.id}>
                      <td>#{o.id.slice(-6).toUpperCase()}</td>
                      <td>
                        <strong>{o.firstName} {o.lastName}</strong><br/>
                        <small>{o.email}</small><br/>
                        {o.phone && (
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
                        )}
                      </td>
                      <td>
                        {o.items.map((item: any, i: number) => (
                          <div key={i} className="mb-1" style={{ fontSize: '12px' }}>
                            <span style={{ fontWeight: 600 }}>{item.title}</span>
                            {item.duration && item.duration !== 'N/A' && <small style={{ color: '#666' }}> ({item.duration})</small>}
                            <span> (x{item.quantity})</span>
                          </div>
                        ))}
                      </td>
                      <td>{formatPrice(o.totalAmount)}</td>
                      <td>{new Date(o.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' })}</td>
                      <td>
                        <span style={{
                          padding: '4px 8px',
                          borderRadius: '20px',
                          fontSize: '11px',
                          fontWeight: 'bold',
                          backgroundColor: o.status === 'Confirmed' ? '#dcfce7' : o.status === 'Rejected' ? '#fee2e2' : '#fef3c7',
                          color: o.status === 'Confirmed' ? '#166534' : o.status === 'Rejected' ? '#991b1b' : '#92400e'
                        }}>
                          {o.status === 'Confirmed' ? 'Paid' : o.status === 'Rejected' ? 'Rejected' : 'Unpaid'}
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
                            onClick={() => deleteInvoice(o.id)}
                            title="Permanently Delete Invoice"
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
      ) : (
        <div className="password__change">
          <div className="password__change-top d-flex justify-content-between align-items-center">
            <h3 className="password__change-title">
              <i className="fa fa-plus"></i> Create Custom Invoice
            </h3>
            <button className="profile__info-btn" onClick={closeCreateForm}>
              <i className="fa fa-arrow-left"></i> Back to list
            </button>
          </div>

          <div className="password__form white-bg">
            <form onSubmit={handleSubmit}>
              {/* Customer Info Section */}
              <h5 className="mb-20 pb-10" style={{ borderBottom: '1px solid #eaedff', fontWeight: 600, color: '#201f1f' }}>Customer Information</h5>
              <div className="row">
                <div className="col-md-6 col-12">
                  <div className="checkout-form-list mb-20">
                    <label>Email Address <span className="required">*</span></label>
                    <input
                      type="email"
                      placeholder="customer@example.com"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      required
                    />
                  </div>
                </div>
                <div className="col-md-3 col-6">
                  <div className="checkout-form-list mb-20">
                    <label>First Name <span className="required">*</span></label>
                    <input
                      type="text"
                      placeholder="John"
                      value={form.firstName}
                      onChange={(e) => setForm({ ...form, firstName: e.target.value })}
                      required
                    />
                  </div>
                </div>
                <div className="col-md-3 col-6">
                  <div className="checkout-form-list mb-20">
                    <label>Last Name <span className="required">*</span></label>
                    <input
                      type="text"
                      placeholder="Doe"
                      value={form.lastName}
                      onChange={(e) => setForm({ ...form, lastName: e.target.value })}
                      required
                    />
                  </div>
                </div>
              </div>
              <div className="row mb-20">
                <div className="col-md-6 col-12">
                  <div className="checkout-form-list mb-20">
                    <label>WhatsApp Number <span className="required">*</span></label>
                    <div style={{ display: 'flex', gap: '10px' }}>
                      <div style={{ flex: '0 0 100px' }}>
                        <input
                          type="text"
                          placeholder="+1"
                          value={form.phoneCode}
                          onChange={(e) => setForm({ ...form, phoneCode: e.target.value })}
                          required
                        />
                      </div>
                      <div style={{ flex: 1 }}>
                        <input
                          type="text"
                          placeholder="771234567"
                          value={form.phone}
                          onChange={(e) => setForm({ ...form, phone: e.target.value })}
                          required
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-md-6 col-12">
                  <div className="country-select mb-20">
                    <label>Country <span className="required">*</span></label>
                    <select
                      value={form.country}
                      onChange={(e) => {
                        const countryName = e.target.value;
                        const country = COUNTRY_DATA.find(c => c.name === countryName);
                        setForm((prev) => ({
                          ...prev,
                          country: countryName,
                          phoneCode: country ? country.code : prev.phoneCode,
                        }));
                      }}
                      style={{ width: "100%", height: 50, border: "1px solid #ebebeb", padding: "0 15px", background: "#fff", fontSize: 14, color: "#201f1f" }}
                      required
                    >
                      <option value="">-- Select Country --</option>
                      {COUNTRY_DATA.map((c) => (
                        <option key={c.name} value={c.name}>{c.name}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Items Section */}
              <h5 className="mb-20 pb-10 d-flex justify-content-between align-items-center" style={{ borderBottom: '1px solid #eaedff', fontWeight: 600, color: '#201f1f' }}>
                <span>Invoice Items</span>
                <div className="d-flex gap-2">
                  <button type="button" className="os-btn os-btn-black" style={{ padding: "0 12px", height: 32, lineHeight: "30px", fontSize: 12 }} onClick={addProductItem}>
                    + Add Product Item
                  </button>
                  <button type="button" className="os-btn os-btn-black" style={{ padding: "0 12px", height: 32, lineHeight: "30px", fontSize: 12 }} onClick={addCustomItem}>
                    + Add Custom Item
                  </button>
                </div>
              </h5>

              {form.items.length === 0 ? (
                <div className="text-center py-4 text-muted" style={{ fontSize: '13px', border: '1px dashed #ebebeb', marginBottom: 20 }}>
                  No items added yet. Click one of the buttons above to add items.
                </div>
              ) : (
                form.items.map((item, idx) => (
                  <div key={idx} className="mb-20">
                    {idx > 0 && <hr style={{ borderTop: '1px dashed #eaedff', margin: '20px 0 25px 0' }} />}
                    <div className="row align-items-end">
                      {item.type === "product" ? (
                        <>
                          <div className="col-md-4 col-12">
                            <div className="checkout-form-list mb-15">
                              <label>Select Product <span className="required">*</span></label>
                              <select
                                value={item.productId}
                                onChange={(e) => handleProductChange(idx, e.target.value)}
                                style={{ width: "100%", height: 50, border: "1px solid #ebebeb", padding: "0 15px", background: "#fff", fontSize: 14, color: "#201f1f" }}
                                required
                              >
                                <option value="">-- Choose Product --</option>
                                {storeProducts.map((p) => (
                                  <option key={p.id} value={p.id}>{p.title}</option>
                                ))}
                              </select>
                            </div>
                          </div>
                          <div className="col-md-3 col-6">
                            <div className="checkout-form-list mb-15">
                              <label>Duration</label>
                              <select
                                value={item.duration}
                                onChange={(e) => handleDurationChange(idx, e.target.value)}
                                style={{ width: "100%", height: 50, border: "1px solid #ebebeb", padding: "0 15px", background: "#fff", fontSize: 14, color: "#201f1f" }}
                                disabled={!item.productId}
                              >
                                {item.productId ? (
                                  (storeProducts.find(p => p.id === item.productId)?.sizes || ["Standard"]).map((dur: string) => (
                                    <option key={dur} value={dur}>{dur}</option>
                                  ))
                                ) : (
                                  <option value="Standard">Standard</option>
                                )}
                              </select>
                            </div>
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="col-md-4 col-12">
                            <div className="checkout-form-list mb-15">
                              <label>Item Description <span className="required">*</span></label>
                              <input
                                type="text"
                                placeholder="Custom Service Name"
                                value={item.title}
                                onChange={(e) => handleItemFieldChange(idx, "title", e.target.value)}
                                required
                              />
                            </div>
                          </div>
                          <div className="col-md-3 col-6">
                            <div className="checkout-form-list mb-15">
                              <label>Duration / Unit</label>
                              <input
                                type="text"
                                placeholder="Standard"
                                value={item.duration}
                                onChange={(e) => handleItemFieldChange(idx, "duration", e.target.value)}
                              />
                            </div>
                          </div>
                        </>
                      )}

                      <div className="col-md-2 col-3">
                        <div className="checkout-form-list mb-15">
                          <label>Price ({symbol}) <span className="required">*</span></label>
                          <input
                            type="number"
                            placeholder="0"
                            value={item.price}
                            onChange={(e) => handleItemFieldChange(idx, "price", e.target.value)}
                            required
                          />
                        </div>
                      </div>
                      <div className="col-md-2 col-3">
                        <div className="checkout-form-list mb-15">
                          <label>Quantity <span className="required">*</span></label>
                          <input
                            type="number"
                            min="1"
                            value={item.quantity}
                            onChange={(e) => handleItemFieldChange(idx, "quantity", parseInt(e.target.value) || 1)}
                            required
                          />
                        </div>
                      </div>
                      <div className="col-md-1 col-12 mb-15 d-flex justify-content-end">
                        <button
                          type="button"
                          onClick={() => removeItem(idx)}
                          className="os-btn"
                          style={{
                            padding: '0 10px', height: '50px', lineHeight: '48px', fontSize: '12px',
                            backgroundColor: '#dc3545', borderColor: '#dc3545', color: '#fff',
                            transition: 'none', cursor: 'pointer', borderRadius: '0px', width: '100%',
                            display: 'flex', justifyContent: 'center', alignItems: 'center'
                          }}
                        >
                          <i className="fa fa-trash"></i>
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}

              {/* Total Calculation Section */}
              <div className="row mt-30">
                <div className="col-md-6 col-12">
                  <div className="checkout-form-list mb-20">
                    <label>Overall Manual Discount ({symbol})</label>
                    <input
                      type="number"
                      placeholder="0"
                      value={form.discountAmt}
                      onChange={(e) => setForm({ ...form, discountAmt: e.target.value })}
                    />
                  </div>
                </div>

                <div className="col-md-6 col-12 d-flex justify-content-end align-items-center text-end">
                  <div style={{ fontSize: '15px', color: '#201f1f', lineHeight: '1.6' }}>
                    <div>Subtotal: <strong>{formatPrice(subtotal / rate)}</strong></div>
                    {discountVal > 0 && <div className="text-danger">Discount: <strong>-{formatPrice(discountVal / rate)}</strong></div>}
                    <div style={{ fontSize: '20px', fontWeight: 'bold', marginTop: '5px' }}>Total: {formatPrice(total / rate)}</div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-30 d-flex gap-3 justify-content-end">
                <button
                  type="button"
                  className="os-btn"
                  style={{ background: '#f5f5f5', color: '#000', border: '1px solid #ebebeb', padding: "0 14px", height: 32, lineHeight: "30px", fontSize: 12 }}
                  onClick={closeCreateForm}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="os-btn os-btn-black"
                  style={{ padding: "0 14px", height: 32, lineHeight: "30px", fontSize: 12 }}
                  disabled={saving}
                >
                  {saving ? "Creating..." : "Save & Open PDF"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminShell>
  );
}
