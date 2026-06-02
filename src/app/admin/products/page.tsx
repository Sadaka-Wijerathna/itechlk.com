"use client";

import { useEffect, useState } from "react";
import AdminShell from "../AdminShell";
import Link from "next/link";
import { useCurrency } from "@/context/CurrencyContext";

type Product = {
  id: string;
  title: string;
  category: string;
  price: number;
  oldPrice?: number | null;
  discount?: number | null;
  isNew: boolean;
  status: string;
  img: string;
  smDesc: string;
  detailsText: string;
  detailsText2: string;
  detailsList: string[];
  sizes: string[];
  brand: string;
  createdAt: string;
};

const PREDEFINED_CATEGORIES = [
  "AI Tools",
  "Creative & Editing",
  "Work & OS",
  "Streaming",
  "VPNs",
  "Adult",
];

const AVAILABLE_DURATIONS = [
  "1 Month",
  "3 Months",
  "6 Months",
  "1 Year",
  "Lifetime",
];

const DEFAULT_LOREM_IPSUM = `Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages.

Claritas est etiam processus dynamicus.
Qui sequitur mutationem consuetudium lectorum.
It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release.`;

const emptyForm = {
  title: "",
  price: "",
  oldPrice: "",
  discount: "",
  isDiscounted: false,
  img: "",
  thumbImg: "",
  category: "AI Tools",
  brand: "Digital",
  smDesc: "Get access to premium features and elevate your experience.",
  isNew: false,
  status: "Active",
  detailsText: DEFAULT_LOREM_IPSUM,
  detailsText2: "",
  detailsList: "Instant delivery via email\n24/7 Premium Support\n100% money back guarantee",
  sizes: [] as string[],
};

export default function AdminProductsPage() {
  const { formatPrice, rate } = useCurrency();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [deleting, setDeleting] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null); 

  const [form, setForm] = useState({ ...emptyForm });

  const fetchProducts = async () => {
    setLoading(true);
    const res = await fetch("/api/products/all");
    const data = await res.json();
    setProducts(Array.isArray(data) ? data : []);
    setLoading(false);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const openAdd = () => {
    setEditingId(null);
    setForm({ ...emptyForm, sizes: [] });
    setSelectedFile(null);
    setPreviewUrl(null);
    setShowForm(true);
  };

  const openEdit = (p: Product) => {
    setEditingId(p.id);
    setForm({
      title: p.title,
      price: String(Math.round(p.price * rate)), 
      oldPrice: p.oldPrice ? String(Math.round(p.oldPrice * rate)) : "",
      discount: p.discount ? String(p.discount) : "",
      isDiscounted: !!p.oldPrice,
      img: p.img,
      thumbImg: p.img,
      category: p.category,
      brand: p.brand,
      smDesc: p.smDesc,
      isNew: !!p.isNew,
      status: p.status || "Active",
      detailsText: p.detailsText,
      detailsText2: p.detailsText2,
      detailsList: p.detailsList.join("\n"),
      sizes: p.sizes ?? [],
    });
    setSelectedFile(null);
    setPreviewUrl(null);
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingId(null);
    setForm({ ...emptyForm, sizes: [] });
    setSelectedFile(null);
    setPreviewUrl(null);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Permanently delete this product? This cannot be undone.")) return;
    setDeleting(id);
    const res = await fetch(`/api/products/${id}`, { method: "DELETE" });
    if (res.ok) {
      fetchProducts();
    } else {
      alert("Failed to delete.");
    }
    setDeleting(null);
  };

  const toggleDuration = (duration: string) => {
    setForm((prev) => {
      const current = prev.sizes;
      return current.includes(duration)
        ? { ...prev, sizes: current.filter((d) => d !== duration) }
        : { ...prev, sizes: [...current, duration] };
    });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const isEdit = !!editingId;

    if (!form.title || !form.price || (!isEdit && !form.img && !selectedFile)) {
      alert("Title, Price and Image are required.");
      return;
    }
    setSaving(true);

    let uploadedImageUrl = form.img;

    if (selectedFile) {
      const formData = new FormData();
      formData.append("file", selectedFile);
      const uploadRes = await fetch("/api/upload", { method: "POST", body: formData });
      if (uploadRes.ok) {
        const uploadData = await uploadRes.json();
        uploadedImageUrl = uploadData.url;
      } else {
        alert("Image upload failed.");
        setSaving(false);
        return;
      }
    }

    const updatedSmDesc =
      form.smDesc.includes("elevate your experience") && !form.smDesc.includes(form.title)
        ? `Get access to premium features and elevate your experience with ${form.title}.`
        : form.smDesc;

    // Convert LKR input back to USD base for storage
    const priceInLKR = parseFloat(form.price);
    const priceInUSD = priceInLKR / rate;
    
    const oldPriceInLKR = form.isDiscounted && form.oldPrice ? parseFloat(form.oldPrice) : null;
    const oldPriceInUSD = oldPriceInLKR ? oldPriceInLKR / rate : null;

    const payload = {
      title: form.title,
      price: priceInUSD,
      oldPrice: oldPriceInUSD,
      discount: form.isDiscounted && form.discount ? parseFloat(form.discount) : null,
      img: uploadedImageUrl,
      thumbImg: uploadedImageUrl,
      relatedImages: [uploadedImageUrl],
      category: form.category,
      brand: form.brand,
      smDesc: updatedSmDesc,
      isNew: form.isNew,
      status: form.status,
      detailsText: form.detailsText,
      detailsText2: form.detailsText2,
      detailsList: form.detailsList.split("\n").filter(Boolean),
      sizes: form.sizes.length > 0 ? form.sizes : ["Standard"],
      colors: ["Default"],
    };

    let res: Response;
    if (isEdit) {
      res = await fetch(`/api/products/${editingId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
    } else {
      res = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
    }

    setSaving(false);

    if (res.ok) {
      alert(isEdit ? "Product updated!" : "Product created!");
      closeForm();
      fetchProducts();
    } else {
      const err = await res.json();
      alert(`Failed to update. Details: ${err.details ?? err.error}`);
    }
  };

  const handleOldPriceChange = (val: string) => {
    const oldP = parseFloat(val);
    const currP = parseFloat(form.price);
    if (!isNaN(oldP) && !isNaN(currP) && oldP > 0) {
      const disc = Math.round(((oldP - currP) / oldP) * 100);
      setForm({ ...form, oldPrice: val, discount: String(disc) });
    } else {
      setForm({ ...form, oldPrice: val });
    }
  };

  const handleDiscountChange = (val: string) => {
    const disc = parseFloat(val);
    const currP = parseFloat(form.price);
    if (!isNaN(disc) && !isNaN(currP) && disc < 100) {
      const oldP = currP / (1 - disc / 100);
      setForm({ ...form, discount: val, oldPrice: Math.round(oldP).toString() });
    } else {
      setForm({ ...form, discount: val });
    }
  };

  const filtered = products.filter(
    (p) =>
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <AdminShell>
      {!showForm ? (
        <div className="order__info" style={{ padding: '25px', background: '#fff', border: '1px solid #ebebeb' }}>
          <div className="order__info-top d-flex justify-content-between align-items-center">
            <h3 className="order__info-title">
              <i className="fa fa-archive"></i> Products
            </h3>
            <button className="os-btn os-btn-black" onClick={openAdd}>
              + Add Product
            </button>
          </div>

          <div className="password__change-top" style={{ paddingTop: 0 }}>
            <input
              type="text"
              placeholder="Search by name or category..."
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
                  <th scope="col">Product</th>
                  <th scope="col">Category</th>
                  <th scope="col">Price</th>
                  <th scope="col">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan={4} className="text-center py-5">Loading products…</td></tr>
                ) : filtered.length === 0 ? (
                  <tr><td colSpan={4} className="text-center py-5">No products found.</td></tr>
                ) : (
                  filtered.map((p) => (
                    <tr key={p.id}>
                      <td>
                        <div className="d-flex align-items-center gap-3">
                          {p.img && (
                            <img src={p.img} alt={p.title} style={{ width: 44, height: 44, objectFit: "cover", border: "1px solid #ebebeb" }} />
                          )}
                          <div>
                            <Link href={`/product-details/${p.id}`} className="order__title">{p.title}</Link>
                            <br /><small style={{ color: "#848b8a" }}>#{p.id.slice(-8)}</small>
                          </div>
                        </div>
                      </td>
                      <td>{p.category}</td>
                      <td>
                        <div className="d-flex align-items-center gap-2">
                          <strong>{formatPrice(p.price)}</strong>
                          {p.oldPrice && (
                            <>
                              <small style={{ color: "#848b8a", textDecoration: "line-through" }}>{formatPrice(p.oldPrice)}</small>
                              {p.discount && <small style={{ color: "#e32636", fontWeight: 600 }}>({p.discount}%)</small>}
                            </>
                          )}
                        </div>
                      </td>
                      <td>
                        <div className="d-flex gap-2">
                          <button onClick={() => openEdit(p)} className="os-btn os-btn-black" style={{ padding: "0 14px", height: 32, lineHeight: "30px", fontSize: 12 }}>
                            Edit
                          </button>
                          <button onClick={() => handleDelete(p.id)} disabled={deleting === p.id} className="os-btn" style={{ padding: "0 14px", height: 32, lineHeight: "30px", fontSize: 12, opacity: deleting === p.id ? 0.5 : 1 }}>
                            {deleting === p.id ? "…" : "Delete"}
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
              <i className={`fa ${editingId ? "fa-edit" : "fa-plus"}`}></i> {editingId ? "Edit Product" : "Add New Product"}
            </h3>
            <button className="profile__info-btn" onClick={closeForm}>
              <i className="fa fa-arrow-left"></i> Back to list
            </button>
          </div>

          <div className="password__form white-bg">
            <form onSubmit={handleSave}>
              <div className="row">
                <div className="col-lg-12">
                  <div className="checkout-form-list mb-20">
                    <label>Product Name <span className="required">*</span></label>
                    <input type="text" placeholder="e.g. Amazon Premium" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
                  </div>
                </div>

                <div className="col-lg-12">
                  <div className="checkout-form-list mb-20">
                    <label>Category <span className="required">*</span></label>
                    <select
                      value={form.category}
                      onChange={(e) => setForm({ ...form, category: e.target.value })}
                      required
                      style={{ width: "100%", height: 50, border: "1px solid #ebebeb", padding: "0 15px", background: "#fff", fontSize: 14, color: "#201f1f" }}
                    >
                      {PREDEFINED_CATEGORIES.map((cat) => <option key={cat} value={cat}>{cat}</option>)}
                    </select>
                  </div>
                </div>

                <div className="col-lg-12">
                  <div className="checkout-form-list mb-20">
                    <div className="row g-3">
                      <div className="col-md-4">
                        <label>Price (LKR) <span className="required">*</span></label>
                        <input type="number" step="1" placeholder="3250" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} required />
                        <label className="d-flex align-items-center gap-2 mt-2" style={{ cursor: "pointer", fontSize: 13 }}>
                          <input type="checkbox" checked={form.isDiscounted} onChange={(e) => setForm(prev => ({ ...prev, isDiscounted: e.target.checked }))} style={{ width: 16, height: 16 }} />
                          <span>Discounted</span>
                        </label>
                      </div>

                      {form.isDiscounted && (
                        <>
                          <div className="col-md-4">
                            <label>Old Price (LKR)</label>
                            <input type="number" step="1" placeholder="4500" value={form.oldPrice} onChange={(e) => handleOldPriceChange(e.target.value)} />
                          </div>
                          <div className="col-md-4">
                            <label>Discount %</label>
                            <input type="number" min="0" max="100" placeholder="20" value={form.discount} onChange={(e) => handleDiscountChange(e.target.value)} />
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </div>


                <div className="col-lg-12">
                  <div className="checkout-form-list mb-20">
                    <label style={{ marginBottom: 10, display: 'block' }}>Product Badges (Select One)</label>
                    <div className="d-flex flex-wrap gap-4 align-items-center pt-2">
                      <label className="d-flex align-items-center gap-2" style={{ cursor: "pointer", fontSize: 14 }}>
                        <input
                          type="checkbox"
                          checked={!form.isNew && form.status !== "Out of Stock" && form.status !== "Pre Order"}
                          onChange={() => setForm({ ...form, isNew: false, status: "Active" })}
                          style={{ width: 16, height: 16 }}
                        />
                        <span>Regular (No Badge)</span>
                      </label>

                      <label className="d-flex align-items-center gap-2" style={{ cursor: "pointer", fontSize: 14 }}>
                        <input
                          type="checkbox"
                          checked={form.isNew}
                          onChange={() => setForm({ ...form, isNew: !form.isNew })}
                          style={{ width: 16, height: 16 }}
                        />
                        <span>New</span>
                      </label>

                      <label className="d-flex align-items-center gap-2" style={{ cursor: "pointer", fontSize: 14 }}>
                        <input
                          type="checkbox"
                          checked={form.status === "Out of Stock"}
                          onChange={() => setForm({ ...form, isNew: false, status: form.status === "Out of Stock" ? "Active" : "Out of Stock" })}
                          style={{ width: 16, height: 16 }}
                        />
                        <span>Out of Stock</span>
                      </label>

                      <label className="d-flex align-items-center gap-2" style={{ cursor: "pointer", fontSize: 14 }}>
                        <input
                          type="checkbox"
                          checked={form.status === "Pre Order"}
                          onChange={() => setForm({ ...form, isNew: false, status: form.status === "Pre Order" ? "Active" : "Pre Order" })}
                          style={{ width: 16, height: 16 }}
                        />
                        <span>Pre Order</span>
                      </label>
                    </div>
                  </div>
                </div>

                <div className="col-lg-12">
                  <div className="checkout-form-list mb-20">
                    <label>Product Image {!editingId && <span className="required">*</span>}</label>
                    <input
                      type="file" accept="image/*"
                      onChange={(e) => { if (e.target.files?.[0]) { setSelectedFile(e.target.files[0]); setPreviewUrl(URL.createObjectURL(e.target.files[0])); }}}
                      style={{ width: "100%", height: 50, border: "1px solid #ebebeb", padding: "10px 15px", background: "#fff", cursor: "pointer", fontSize: 14 }}
                    />
                    {(previewUrl || form.img) && (
                      <div className="mt-3"><img src={previewUrl || form.img} alt="Preview" style={{ maxWidth: 120, maxHeight: 120, objectFit: "cover", border: "1px solid #ebebeb" }} /></div>
                    )}
                  </div>
                </div>

                <div className="col-lg-12">
                  <div className="checkout-form-list mb-20">
                    <label>Available Durations</label>
                    <div className="d-flex flex-wrap gap-3 pt-2">
                       {AVAILABLE_DURATIONS.map((duration) => (
                        <label key={duration} className="d-flex align-items-center gap-2" style={{ cursor: "pointer", fontSize: 14 }}>
                          <input type="checkbox" checked={form.sizes.includes(duration)} onChange={() => toggleDuration(duration)} style={{ width: 16, height: 16 }} />
                          {duration}
                        </label>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="col-lg-12">
                  <div className="checkout-form-list mb-20">
                    <label>Short Description</label>
                    <textarea value={form.smDesc} onChange={(e) => setForm({ ...form, smDesc: e.target.value })} rows={3} style={{ width: "100%", border: "1px solid #ebebeb", padding: "12px 15px", fontSize: 14, background: "#fff", resize: "vertical" }} />
                  </div>
                </div>

                <div className="col-lg-12">
                  <div className="checkout-form-list mb-20">
                    <label>Main Description</label>
                    <textarea value={form.detailsText} onChange={(e) => setForm({ ...form, detailsText: e.target.value })} rows={6} style={{ width: "100%", border: "1px solid #ebebeb", padding: "12px 15px", fontSize: 14, background: "#fff", resize: "vertical" }} />
                  </div>
                </div>

                <div className="col-lg-12">
                  <div className="checkout-form-list mb-20">
                    <label>Feature List (one per line)</label>
                    <textarea value={form.detailsList} onChange={(e) => setForm({ ...form, detailsList: e.target.value })} rows={4} style={{ width: "100%", border: "1px solid #ebebeb", padding: "12px 15px", fontSize: 14, background: "#fff", resize: "vertical" }} />
                  </div>
                </div>
              </div>

              <div className="d-flex justify-content-end gap-3 mt-10">
                <button type="button" className="os-btn" onClick={closeForm}>Cancel</button>
                <button type="submit" disabled={saving} className="os-btn os-btn-black">{saving ? "Saving…" : editingId ? "Update Product" : "Save Product"}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminShell>
  );
}
