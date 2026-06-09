"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import AdminShell from "../../../AdminShell";
import { toast } from "react-toastify";

const CATEGORIES = ["AI Tools", "Streaming", "Gaming", "Software", "Digital", "Subscriptions", "Tips & Tricks"];

export default function EditBlogPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    author: "Admin",
    category: "Digital",
    image: "",
    tags: "",
    content: "",
    active: true,
  });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [imagePreview, setImagePreview] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const res = await fetch(`/api/blogs/${id}`);
        if (res.ok) {
          const data = await res.json();
          setFormData({
            title: data.title || "",
            slug: data.slug || "",
            author: data.author || "Admin",
            category: data.category || "Digital",
            image: data.image || "",
            tags: Array.isArray(data.tags) ? data.tags.join(", ") : (data.tags || ""),
            content: data.content || "",
            active: data.active !== undefined ? data.active : true,
          });
          setImagePreview(data.image || "");
        } else {
          toast.error("Failed to load blog");
          router.push("/admin/blogs");
        }
      } catch (error) {
        toast.error("An error occurred while loading");
      } finally {
        setLoading(false);
      }
    };
    fetchBlog();
  }, [id, router]);

  const handleChange = (e: any) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === "checkbox" ? checked : value;
    setFormData((prev) => ({ ...prev, [name]: newValue }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const url = URL.createObjectURL(file);
      setImagePreview(url);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    let imageUrl = formData.image;

    if (selectedFile) {
      try {
        const uploadFormData = new FormData();
        uploadFormData.append("file", selectedFile);
        const uploadRes = await fetch("/api/upload", {
          method: "POST",
          body: uploadFormData,
        });

        if (uploadRes.ok) {
          const uploadData = await uploadRes.json();
          imageUrl = uploadData.url;
        } else {
          toast.error("Image upload failed");
          setSubmitting(false);
          return;
        }
      } catch (error) {
        toast.error("Error uploading image");
        setSubmitting(false);
        return;
      }
    }

    const tagsArray = formData.tags
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    try {
      const res = await fetch(`/api/blogs/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, image: imageUrl, tags: tagsArray }),
      });

      const data = await res.json();
      if (res.ok) {
        toast.success("Blog updated successfully!");
        router.push("/admin/blogs");
      } else {
        toast.error(data.error || "Failed to update blog");
      }
    } catch (error) {
      toast.error("An error occurred");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <AdminShell>
        <div className="text-center py-5">Loading blog...</div>
      </AdminShell>
    );
  }

  return (
    <AdminShell>
      <style dangerouslySetInnerHTML={{ __html: `
        .os-btn:hover::after {
          display: none !important;
          height: 0 !important;
          opacity: 0 !important;
        }
        .os-btn:hover {
          background-color: #f5f5f5 !important;
          color: #000 !important;
          border-color: #ebebeb !important;
          transform: none !important;
        }
        .os-btn-black:hover {
          background-color: #000 !important;
          color: #fff !important;
          border-color: #000 !important;
        }
        .checkout-form-list select {
          width: 100%;
          height: 50px;
          border: 1px solid #ebebeb;
          padding: 0 15px;
          background: #fff;
          font-size: 14px;
          color: #201f1f;
        }
        .checkout-form-list textarea {
          width: 100%;
          border: 1px solid #ebebeb;
          padding: 12px 15px;
          font-size: 14px;
          background: #fff;
          resize: vertical;
        }
      ` }} />

      <div className="password__change">
        <div className="password__change-top d-flex justify-content-between align-items-center">
          <h3 className="password__change-title">
            <i className="fa fa-edit"></i> Edit Blog
          </h3>
          <button className="profile__info-btn" onClick={() => router.back()}>
            <i className="fa fa-arrow-left"></i> Back to list
          </button>
        </div>

        <div className="password__form white-bg">
          <form onSubmit={handleSubmit}>
            <div className="row">
              <div className="col-lg-6">
                <div className="checkout-form-list mb-20">
                  <label>Title <span className="required">*</span></label>
                  <input
                    type="text"
                    placeholder="e.g. Amazon Premium"
                    value={formData.title}
                    onChange={handleChange}
                    name="title"
                    required
                  />
                </div>
              </div>
              <div className="col-lg-6">
                <div className="checkout-form-list mb-20">
                  <label>Slug (URL) <span className="required">*</span></label>
                  <input
                    type="text"
                    className="font-monospace"
                    value={formData.slug}
                    onChange={handleChange}
                    name="slug"
                    required
                  />
                </div>
              </div>

              <div className="col-lg-6">
                <div className="checkout-form-list mb-20">
                  <label>Author</label>
                  <input
                    type="text"
                    value={formData.author}
                    onChange={handleChange}
                    name="author"
                  />
                </div>
              </div>
              <div className="col-lg-6">
                <div className="checkout-form-list mb-20">
                  <label>Category</label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="col-lg-12">
                <div className="checkout-form-list mb-20">
                  <label>Featured Image</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    style={{ paddingTop: '10px' }}
                  />
                  {imagePreview && (
                    <div className="mt-3">
                      <img
                        src={imagePreview}
                        alt="preview"
                        style={{ maxWidth: 200, maxHeight: 200, objectFit: "cover", border: "1px solid #ebebeb" }}
                      />
                    </div>
                  )}
                </div>
              </div>

              <div className="col-lg-12">
                <div className="checkout-form-list mb-20">
                  <label>Tags (comma separated)</label>
                  <input
                    type="text"
                    value={formData.tags}
                    onChange={handleChange}
                    name="tags"
                  />
                </div>
              </div>

              <div className="col-lg-12">
                <div className="checkout-form-list mb-20">
                  <label>Content <span className="required">*</span> (HTML Supported)</label>
                  <textarea
                    name="content"
                    rows={12}
                    value={formData.content}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
            </div>

            <div className="d-flex justify-content-end gap-3 mt-10">
              <button type="button" className="os-btn" onClick={() => router.back()}>Cancel</button>
              <button type="submit" disabled={submitting} className="os-btn os-btn-black">
                {submitting ? "Saving…" : "Save Changes"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </AdminShell>
  );
}
