"use client";

import { useState, useEffect } from "react";
import AdminShell from "../AdminShell";
import ErrorMsg from "@/components/common/error-msg";
import { useCurrency } from "@/context/CurrencyContext";

type Coupon = {
  id: string;
  code: string;
  discountType: "percentage" | "flat";
  discountValue: number;
  minOrderValue: number;
  maxDiscount: number | null;
  expirationDate: string | null;
  maxUses: number | null;
  usedCount: number;
  active: boolean;
  createdAt: string;
};

export default function AdminCouponsPage() {
  const { formatPrice, rate } = useCurrency();
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  // Form State
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    code: "",
    discountType: "percentage",
    discountValue: "",
    minOrderValue: "",
    maxDiscount: "",
    expirationDate: "",
    maxUses: "",
    active: true,
  });

  useEffect(() => {
    fetchCoupons();
  }, []);

  const fetchCoupons = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/coupons");
      const data = await res.json();
      if (res.ok) {
        setCoupons(data);
      }
    } catch (err) {
      console.error("Failed to fetch coupons", err);
    } finally {
      setLoading(false);
    }
  };

  const openAdd = () => {
    setEditingId(null);
    setFormData({
      code: "",
      discountType: "percentage",
      discountValue: "",
      minOrderValue: "",
      maxDiscount: "",
      expirationDate: "",
      maxUses: "",
      active: true,
    });
    setError(null);
    setShowForm(true);
  };

  const openEdit = (coupon: Coupon) => {
    setEditingId(coupon.id);
    setFormData({
      code: coupon.code,
      discountType: coupon.discountType,
      discountValue: coupon.discountType === "percentage" 
        ? coupon.discountValue.toString() 
        : Math.round(coupon.discountValue * rate).toString(),
      minOrderValue: coupon.minOrderValue ? Math.round(coupon.minOrderValue * rate).toString() : "",
      maxDiscount: coupon.maxDiscount ? Math.round(coupon.maxDiscount * rate).toString() : "",
      expirationDate: coupon.expirationDate ? coupon.expirationDate.split("T")[0] : "",
      maxUses: coupon.maxUses ? coupon.maxUses.toString() : "",
      active: coupon.active,
    });
    setError(null);
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingId(null);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this coupon?")) return;
    try {
      const res = await fetch(`/api/admin/coupons/${id}`, { method: "DELETE" });
      if (res.ok) {
        fetchCoupons();
      } else {
        alert("Failed to delete coupon");
      }
    } catch (err) {
      console.error(err);
      alert("Error deleting coupon");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    const payload = {
      ...formData,
      discountValue: formData.discountType === "percentage"
        ? parseFloat(formData.discountValue)
        : parseFloat(formData.discountValue) / rate,
      minOrderValue: formData.minOrderValue ? parseFloat(formData.minOrderValue) / rate : 0,
      maxDiscount: (formData.discountType === "percentage" && formData.maxDiscount)
        ? parseFloat(formData.maxDiscount) / rate
        : null,
      maxUses: formData.maxUses ? parseInt(formData.maxUses, 10) : null,
      expirationDate: formData.expirationDate ? new Date(formData.expirationDate).toISOString() : null,
    };

    try {
      const url = editingId ? `/api/admin/coupons/${editingId}` : "/api/admin/coupons";
      const method = editingId ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (res.ok) {
        setShowForm(false);
        fetchCoupons();
      } else {
        setError(data.error || "Something went wrong");
      }
    } catch (err) {
      console.error(err);
      setError("An error occurred");
    } finally {
      setSubmitting(false);
    }
  };

  const filteredCoupons = coupons.filter(
    (c) =>
      c.code.toLowerCase().includes(search.toLowerCase()) ||
      c.discountType.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <AdminShell>
      <style dangerouslySetInnerHTML={{ __html: `
        .checkout-form-list input[type="date"] {
          background: #ffffff;
          border: 1px solid #eaedff;
          border-radius: 0;
          height: 45px;
          padding: 0 10px;
          width: 100%;
          font-family: inherit;
          font-size: 14px;
          color: #6f7172;
          outline: none;
        }
        .checkout-form-list input[type="date"]:focus {
          border-color: #000;
        }
      ` }} />
      {!showForm ? (
        <div className="order__info" style={{ padding: '25px', background: '#fff', border: '1px solid #ebebeb' }}>
          <div className="order__info-top d-flex justify-content-between align-items-center mb-10">
            <h3 className="order__info-title m-0">
              <i className="fa fa-tags"></i> Manage Coupons
            </h3>
            <button className="os-btn os-btn-black" onClick={openAdd}>
              + Add Coupon
            </button>
          </div>

          <div className="password__change-top d-flex justify-content-between align-items-center" style={{ paddingTop: 0, paddingBottom: 15 }}>
            <input
              type="text"
              placeholder="Search by code or type..."
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
                  <th scope="col">Code</th>
                  <th scope="col">Type</th>
                  <th scope="col">Value</th>
                  <th scope="col">Min Order</th>
                  <th scope="col">Used / Max</th>
                  <th scope="col">Expires</th>
                  <th scope="col">Status</th>
                  <th scope="col">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={8} className="text-center py-5">Loading coupons...</td>
                  </tr>
                ) : filteredCoupons.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="text-center py-5">No coupons found.</td>
                  </tr>
                ) : (
                  filteredCoupons.map((c) => (
                    <tr key={c.id}>
                      <td><strong>{c.code}</strong></td>
                      <td className="text-capitalize">{c.discountType}</td>
                      <td>
                        {c.discountType === "percentage" ? (
                          `${c.discountValue}%`
                        ) : (
                          formatPrice(c.discountValue)
                        )}
                        {c.discountType === "percentage" && c.maxDiscount ? (
                          <div style={{ fontSize: 11, color: '#666' }}>
                            Max: {formatPrice(c.maxDiscount)}
                          </div>
                        ) : null}
                      </td>
                      <td>{c.minOrderValue > 0 ? formatPrice(c.minOrderValue) : 'None'}</td>
                      <td>{c.usedCount} / {c.maxUses || '∞'}</td>
                      <td>{c.expirationDate ? new Date(c.expirationDate).toLocaleDateString() : 'Never'}</td>
                      <td>
                        <span style={{ 
                          padding: '4px 8px', 
                          borderRadius: '20px', 
                          fontSize: '11px',
                          fontWeight: 'bold',
                          backgroundColor: c.active ? '#dcfce7' : '#fee2e2',
                          color: c.active ? '#166534' : '#991b1b' 
                        }}>
                          {c.active ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td>
                        <div className="d-flex gap-2">
                          <button onClick={() => openEdit(c)} className="os-btn os-btn-black" style={{ padding: "0 14px", height: 32, lineHeight: "30px", fontSize: 12 }}>
                            Edit
                          </button>
                          <button onClick={() => handleDelete(c.id)} className="os-btn" style={{ padding: "0 14px", height: 32, lineHeight: "30px", fontSize: 12 }}>
                            Delete
                          </button>
                        </div>
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
              <i className={`fa ${editingId ? "fa-edit" : "fa-plus"}`}></i> {editingId ? "Edit Coupon" : "Add New Coupon"}
            </h3>
            <button className="profile__info-btn" onClick={closeForm}>
              <i className="fa fa-arrow-left"></i> Back to list
            </button>
          </div>

          <div className="password__form white-bg">
            {error && <div className="mb-20"><ErrorMsg msg={error} /></div>}
            <form onSubmit={handleSubmit}>
              <div className="row">
                <div className="col-lg-6">
                  <div className="checkout-form-list mb-20">
                    <label>Coupon Code <span className="required">*</span></label>
                    <input 
                      type="text" 
                      placeholder="e.g. SAVE10" 
                      required 
                      value={formData.code} 
                      onChange={e => setFormData({...formData, code: e.target.value.toUpperCase()})} 
                    />
                  </div>
                </div>

                <div className="col-lg-6">
                  <div className="checkout-form-list mb-20">
                    <label>Status <span className="required">*</span></label>
                    <select
                      value={formData.active ? "true" : "false"} 
                      onChange={e => setFormData({...formData, active: e.target.value === "true"})}
                      required
                      style={{ width: "100%", height: 50, border: "1px solid #ebebeb", padding: "0 15px", background: "#fff", fontSize: 14, color: "#201f1f" }}
                    >
                      <option value="true">Active</option>
                      <option value="false">Inactive</option>
                    </select>
                  </div>
                </div>

                <div className="col-lg-6">
                  <div className="checkout-form-list mb-20">
                    <label>Discount Type <span className="required">*</span></label>
                    <select
                      value={formData.discountType} 
                      onChange={e => setFormData({...formData, discountType: e.target.value as "percentage" | "flat"})}
                      required
                      style={{ width: "100%", height: 50, border: "1px solid #ebebeb", padding: "0 15px", background: "#fff", fontSize: 14, color: "#201f1f" }}
                    >
                      <option value="percentage">Percentage (%)</option>
                      <option value="flat">Flat Amount</option>
                    </select>
                  </div>
                </div>

                <div className="col-lg-6">
                  <div className="checkout-form-list mb-20">
                    <label>Discount Value {formData.discountType === "flat" ? "(LKR)" : "(%)"} <span className="required">*</span></label>
                    <input 
                      type="number" 
                      required 
                      min="0" 
                      step="0.01" 
                      value={formData.discountValue} 
                      onChange={e => setFormData({...formData, discountValue: e.target.value})} 
                    />
                  </div>
                </div>

                <div className="col-lg-6">
                  <div className="checkout-form-list mb-20">
                    <label>Max Discount Amount (LKR) {formData.discountType === "flat" ? "(Disabled for flat)" : "(Optional)"}</label>
                    <input 
                      type="number" 
                      placeholder="E.g. Limit 20% discount to Rs. 500" 
                      min="0" 
                      step="0.01" 
                      value={formData.maxDiscount} 
                      onChange={e => setFormData({...formData, maxDiscount: e.target.value})} 
                      disabled={formData.discountType === "flat"} 
                    />
                  </div>
                </div>

                <div className="col-lg-6">
                  <div className="checkout-form-list mb-20">
                    <label>Minimum Order Value (LKR) (Optional)</label>
                    <input 
                      type="number" 
                      placeholder="E.g. Rs. 2,000"
                      min="0" 
                      step="0.01" 
                      value={formData.minOrderValue} 
                      onChange={e => setFormData({...formData, minOrderValue: e.target.value})} 
                    />
                  </div>
                </div>

                <div className="col-lg-6">
                  <div className="checkout-form-list mb-20">
                    <label>Expiration Date (Optional)</label>
                    <input 
                      type="date" 
                      value={formData.expirationDate} 
                      onChange={e => setFormData({...formData, expirationDate: e.target.value})} 
                    />
                  </div>
                </div>

                <div className="col-lg-6">
                  <div className="checkout-form-list mb-20">
                    <label>Maximum Uses (Optional)</label>
                    <input 
                      type="number" 
                      placeholder="E.g. 100"
                      min="1" 
                      value={formData.maxUses} 
                      onChange={e => setFormData({...formData, maxUses: e.target.value})} 
                    />
                  </div>
                </div>

                <div className="col-lg-12">
                  <div className="mt-20">
                    <button type="submit" className="os-btn os-btn-black" disabled={submitting}>
                      {submitting ? "Saving..." : editingId ? "Update Coupon" : "Save Coupon"}
                    </button>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminShell>
  );
}
