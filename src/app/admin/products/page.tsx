"use client";

import { useEffect, useState } from "react";
import AdminShell from "../AdminShell";
import Link from "next/link";
import { useCurrency } from "@/context/CurrencyContext";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

function SortableRow({ p, idx, formatPrice, openEdit, handleDelete, deleting, search }: any) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: p.id, disabled: !!search });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 10 : 1,
    position: 'relative' as any,
    background: isDragging ? '#fdfdfd' : 'transparent',
    boxShadow: isDragging ? '0 5px 15px rgba(0,0,0,0.1)' : 'none',
  };

  return (
    <tr ref={setNodeRef} style={style}>
      <td>
        <div 
          {...attributes} 
          {...listeners} 
          style={{ 
            cursor: !!search ? 'not-allowed' : 'grab', 
            padding: '10px',
            display: 'inline-block'
          }}
          title={!!search ? "Reordering is disabled when searching" : "Drag to reorder"}
        >
          <i className="fa fa-bars text-muted"></i>
        </div>
      </td>
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
              <small style={{ color: "#e32636", fontWeight: 600 }}>({Math.round(((p.oldPrice - p.price) / p.oldPrice) * 100)}%)</small>
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
  );
}

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
  sortOrder: number;
  durationPrices?: Record<string, { price: number; oldPrice?: number | null }> | null;
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
  sortOrder: 0,
  durationPrices: {} as Record<string, { price: string; oldPrice: string; discount: string; isDiscounted: boolean }>,
};

export default function AdminProductsPage() {
  const { formatPrice, rate } = useCurrency();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [deleting, setDeleting] = useState<string | null>(null);
  const [reordering, setReordering] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null); 

  const [form, setForm] = useState({ ...emptyForm });

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/products/all");
      const data = await res.json();
      setProducts(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Fetch products failed", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    setTimeout(() => {
      fetchProducts();
    }, 0);
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
    const durPrices: Record<string, any> = {};
    if (p.durationPrices) {
      Object.entries(p.durationPrices).forEach(([dur, data]: [string, any]) => {
        const price = data.price * rate;
        const oldPrice = data.oldPrice ? data.oldPrice * rate : null;
        let discount = "";
        if (price && oldPrice && oldPrice > 0) {
          discount = String(Math.round(((oldPrice - price) / oldPrice) * 100));
        }
        durPrices[dur] = {
          price: String(Math.round(price)),
          oldPrice: oldPrice ? String(Math.round(oldPrice)) : "",
          discount: discount,
          isDiscounted: !!data.oldPrice
        };
      });
    }

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
      sortOrder: p.sortOrder || 0,
      durationPrices: durPrices,
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
    try {
      const res = await fetch(`/api/products/${id}`, { method: "DELETE" });
      if (res.ok) {
        fetchProducts();
      } else {
        alert("Failed to delete.");
      }
    } catch (error) {
      alert("Error deleting product");
    }
    setDeleting(null);
  };

  const toggleDuration = (duration: string) => {
    setForm((prev) => {
      const current = prev.sizes;
      const isRemoving = current.includes(duration);
      const newSizes = isRemoving
        ? current.filter((d: string) => d !== duration)
        : [...current, duration];
      
      const newDurPrices = { ...prev.durationPrices };
      if (isRemoving) {
        delete newDurPrices[duration];
      } else if (!newDurPrices[duration]) {
        newDurPrices[duration] = { 
          price: "", 
          oldPrice: "", 
          discount: "",
          isDiscounted: false 
        };
      }
      
      return { ...prev, sizes: newSizes, durationPrices: newDurPrices };
    });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const isEdit = !!editingId;

    if (!form.title || form.sizes.length === 0 || (!isEdit && !form.img && !selectedFile)) {
      alert("Title, at least one Duration, and Image are required.");
      return;
    }
    setSaving(true);

    let uploadedImageUrl = form.img;

    if (selectedFile) {
      const formData = new FormData();
      formData.append("file", selectedFile);
      try {
        const uploadRes = await fetch("/api/upload", { method: "POST", body: formData });
        if (uploadRes.ok) {
          const uploadData = await uploadRes.json();
          uploadedImageUrl = uploadData.url;
        } else {
          alert("Image upload failed.");
          setSaving(false);
          return;
        }
      } catch (error) {
        alert("Upload error");
        setSaving(false);
        return;
      }
    }

    const updatedSmDesc =
      form.smDesc.includes("elevate your experience") && !form.smDesc.includes(form.title)
        ? `Get access to premium features and elevate your experience with ${form.title}.`
        : form.smDesc;

    // Find the entry-level price (shortest duration selected)
    const sortedSelected = [...form.sizes].sort((a, b) => 
      AVAILABLE_DURATIONS.indexOf(a) - AVAILABLE_DURATIONS.indexOf(b)
    );
    const shortestDuration = sortedSelected[0];
    const shortestData = form.durationPrices[shortestDuration];

    if (!shortestData || !shortestData.price) {
      alert(`Please set a price for the entry-level duration: ${shortestDuration}`);
      setSaving(false);
      return;
    }

    const priceInLKR = parseFloat(shortestData.price);
    const priceInUSD = priceInLKR / rate;
    
    const oldPriceInLKR = shortestData.isDiscounted && shortestData.oldPrice ? parseFloat(shortestData.oldPrice) : null;
    const oldPriceInUSD = oldPriceInLKR ? oldPriceInLKR / rate : null;
    const mainDiscount = shortestData.isDiscounted && shortestData.discount ? parseFloat(shortestData.discount) : null;

    const durationPricesUSD: Record<string, any> = {};
    form.sizes.forEach(dur => {
      const dData = form.durationPrices[dur];
      if (dData) {
        durationPricesUSD[dur] = {
          price: parseFloat(dData.price) / rate,
          oldPrice: dData.isDiscounted && dData.oldPrice ? parseFloat(dData.oldPrice) / rate : null
        };
      }
    });

    const payload = {
      title: form.title,
      price: priceInUSD,
      oldPrice: oldPriceInUSD,
      discount: mainDiscount,
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
      sortOrder: form.sortOrder,
      durationPrices: durationPricesUSD,
    };

    try {
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

      if (res.ok) {
        alert(isEdit ? "Product updated!" : "Product created!");
        closeForm();
        fetchProducts();
      } else {
        const err = await res.json();
        alert(`Failed to save. Details: ${err.details ?? err.error}`);
      }
    } catch (error) {
      alert("Error saving product");
    }

    setSaving(false);
  };


  const handleDurationOldPriceChange = (dur: string, val: string) => {
    const dData = form.durationPrices[dur];
    const oldP = parseFloat(val);
    const currP = parseFloat(dData.price);
    
    let disc = dData.discount;
    if (!isNaN(oldP) && !isNaN(currP) && oldP > 0) {
      disc = String(Math.round(((oldP - currP) / oldP) * 100));
    }

    setForm(prev => ({
      ...prev,
      durationPrices: {
        ...prev.durationPrices,
        [dur]: { ...dData, oldPrice: val, discount: disc }
      }
    }));
  };

  const handleReorder = async (productId: string, direction: "up" | "down" | "top" | "bottom" | "normalize") => {
    if (productId) setReordering(productId);
    else setLoading(true);
    
    try {
      const res = await fetch("/api/products/reorder", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, direction }),
      });
      if (res.ok) {
        await fetchProducts();
      }
    } catch (error) {
      console.error("Reorder failed", error);
    }
    setReordering(null);
    setLoading(false);
  };

  const updateSortOrder = async (productId: string, newOrder: number) => {
    setReordering(productId);
    try {
      const res = await fetch(`/api/products/${productId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sortOrder: newOrder }),
      });
      if (res.ok) {
        await fetchProducts();
      }
    } catch (error) {
      console.error("Update sortOrder failed", error);
    }
    setReordering(null);
  };

  const handleDurationDiscountChange = (dur: string, val: string) => {
    const dData = form.durationPrices[dur];
    const disc = parseFloat(val);
    const currP = parseFloat(dData.price);
    
    let oldP = dData.oldPrice;
    if (!isNaN(disc) && !isNaN(currP) && disc < 100) {
      oldP = String(Math.round(currP / (1 - disc / 100)));
    }

    setForm(prev => ({
      ...prev,
      durationPrices: {
        ...prev.durationPrices,
        [dur]: { ...dData, discount: val, oldPrice: oldP }
      }
    }));
  };

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = products.findIndex((p) => p.id === active.id);
    const newIndex = products.findIndex((p) => p.id === over.id);

    const newProducts = arrayMove(products, oldIndex, newIndex);
    setProducts(newProducts);

    try {
      await fetch("/api/products/reorder-all", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productIds: newProducts.map((p) => p.id) }),
      });
    } catch (error) {
      console.error("Failed to sync new order", error);
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

          <div className="password__change-top d-flex justify-content-between align-items-center" style={{ paddingTop: 0 }}>
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
            <div className="d-flex gap-2 align-items-center">
              <span className="small text-muted"><i className="fa fa-info-circle"></i> Drag rows to reorder</span>
              <button 
                className="os-btn os-btn-black" 
                onClick={() => { if(confirm("This will reset all product sort orders to multiples of 10. Continue?")) handleReorder("", "normalize") }}
                style={{ background: '#f5f5f5', color: '#000', border: '1px solid #ebebeb', padding: '0 15px', height: 44, display: 'flex', alignItems: 'center', gap: '8px' }}
                title="Normalize all sort orders"
              >
                <i className="fa fa-sort-amount-down"></i> Reset
              </button>
            </div>
          </div>

          <div className="order__list white-bg table-responsive">
            <DndContext 
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <table className="table">
                <thead>
                  <tr>
                    <th scope="col" style={{ width: 70 }}>Order</th>
                    <th scope="col">Product</th>
                    <th scope="col">Category</th>
                    <th scope="col">Price</th>
                    <th scope="col">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr><td colSpan={5} className="text-center py-5">Loading products…</td></tr>
                  ) : filtered.length === 0 ? (
                    <tr><td colSpan={5} className="text-center py-5">No products found.</td></tr>
                  ) : (
                    <SortableContext 
                      items={filtered.map(p => p.id)}
                      strategy={verticalListSortingStrategy}
                    >
                      {filtered.map((p, idx) => (
                        <SortableRow 
                          key={p.id} 
                          p={p} 
                          idx={idx} 
                          formatPrice={formatPrice} 
                          openEdit={openEdit} 
                          handleDelete={handleDelete}
                          deleting={deleting}
                          search={search}
                        />
                      ))}
                    </SortableContext>
                  )}
                </tbody>
              </table>
            </DndContext>
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
                    <label>Sort Order (Lower numbers appear first)</label>
                    <input 
                      type="number" 
                      placeholder="0" 
                      value={form.sortOrder} 
                      onChange={(e) => setForm({ ...form, sortOrder: parseInt(e.target.value) || 0 })} 
                    />
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
                    <label>Available Durations & Prices</label>
                    <div className="d-flex flex-wrap gap-3 pt-2 mb-20">
                       {AVAILABLE_DURATIONS.map((duration) => (
                        <label key={duration} className="d-flex align-items-center gap-2" style={{ cursor: "pointer", fontSize: 14 }}>
                          <input type="checkbox" checked={form.sizes.includes(duration)} onChange={() => toggleDuration(duration)} style={{ width: 16, height: 16 }} />
                          {duration}
                        </label>
                      ))}
                    </div>

                    {form.sizes.map(dur => (
                      <div key={dur} className="duration-price-row p-3 mb-3" style={{ border: '1px solid #ebebeb', borderRadius: '0' }}>
                        <div className="d-flex align-items-center justify-content-between mb-2">
                          <h6 className="mb-0">{dur} Price</h6>
                        </div>
                        <div className="row g-3">
                          <div className="col-md-4">
                            <label className="small">Price (LKR)</label>
                            <input 
                              type="number" 
                              value={form.durationPrices[dur]?.price || ""} 
                              onChange={(e) => {
                                const val = e.target.value;
                                setForm(prev => ({
                                  ...prev,
                                  durationPrices: {
                                    ...prev.durationPrices,
                                    [dur]: { ...prev.durationPrices[dur], price: val }
                                  }
                                }));
                              }}
                              placeholder="Price"
                            />
                            <label className="d-flex align-items-center gap-2 mt-2" style={{ cursor: "pointer", fontSize: 12 }}>
                              <input 
                                type="checkbox" 
                                checked={form.durationPrices[dur]?.isDiscounted || false} 
                                onChange={(e) => {
                                  const checked = e.target.checked;
                                  setForm(prev => ({
                                    ...prev,
                                    durationPrices: {
                                      ...prev.durationPrices,
                                      [dur]: { ...prev.durationPrices[dur], isDiscounted: checked }
                                    }
                                  }));
                                }}
                                style={{ width: 14, height: 14 }} 
                              />
                              <span>Discounted</span>
                            </label>
                          </div>
                          {form.durationPrices[dur]?.isDiscounted && (
                            <>
                              <div className="col-md-4">
                                <label className="small">Old Price (LKR)</label>
                                <input 
                                  type="number" 
                                  value={form.durationPrices[dur]?.oldPrice || ""} 
                                  onChange={(e) => handleDurationOldPriceChange(dur, e.target.value)}
                                  placeholder="Old Price"
                                />
                              </div>
                              <div className="col-md-4">
                                <label className="small">Discount %</label>
                                <input 
                                  type="number" 
                                  min="0" 
                                  max="100" 
                                  value={form.durationPrices[dur]?.discount || ""} 
                                  onChange={(e) => handleDurationDiscountChange(dur, e.target.value)}
                                  placeholder="20"
                                />
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                    ))}
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
