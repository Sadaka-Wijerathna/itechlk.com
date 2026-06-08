"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import AdminShell from "../../../AdminShell";
import { toast } from "react-toastify";

const CATEGORIES = ["AI Tools", "Streaming", "Gaming", "Software", "Digital", "Subscriptions", "Tips & Tricks"];

function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

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
    tags: "",       // stored as comma-separated string in form, sent as array to API
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
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3>Edit Blog</h3>
        <div className="d-flex gap-2">
          {formData.slug && (
            <a
              href={`/blog/${formData.slug}`}
              target="_blank"
              rel="noopener noreferrer"
              className="tp-btn-2"
            >
              👁 View on Site
            </a>
          )}
          <button onClick={() => router.back()} className="tp-btn-2">
            ← Back
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-white p-4 shadow-sm">

        {/* ── Row 1: Title + Slug ── */}
        <div className="row">
          <div className="col-md-6 mb-3">
            <label className="form-label fw-semibold">
              Title <span className="text-danger">*</span>
            </label>
            <input
              type="text"
              name="title"
              className="form-control"
              value={formData.title}
              onChange={handleChange}
              required
            />
          </div>
          <div className="col-md-6 mb-3">
            <label className="form-label fw-semibold">
              Slug (URL) <span className="text-danger">*</span>
            </label>
            <input
              type="text"
              name="slug"
              className="form-control font-monospace"
              value={formData.slug}
              onChange={handleChange}
              required
            />
            {formData.slug && (
              <small className="text-muted">
                URL: /blog/<strong>{formData.slug}</strong>
              </small>
            )}
          </div>
        </div>

        {/* ── Row 2: Author + Category ── */}
        <div className="row">
          <div className="col-md-6 mb-3">
            <label className="form-label fw-semibold">Author</label>
            <input
              type="text"
              name="author"
              className="form-control"
              placeholder="e.g. Sadaka"
              value={formData.author}
              onChange={handleChange}
            />
          </div>
          <div className="col-md-6 mb-3">
            <label className="form-label fw-semibold">Category</label>
            <select
              name="category"
              className="form-control"
              value={formData.category}
              onChange={handleChange}
            >
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
        </div>

        {/* ── Row 3: Image URL + Preview ── */}
        <div className="row">
          <div className="col-md-7 mb-3">
            <label className="form-label fw-semibold">
              Featured Image <span className="text-danger">*</span>
            </label>
            <input
              type="file"
              accept="image/*"
              className="form-control"
              onChange={handleFileChange}
            />
            <small className="text-muted">Upload a new image to replace the current one, or leave empty to keep it.</small>
          </div>
          <div className="col-md-5 mb-3">
            <label className="form-label fw-semibold">Image Preview</label>
            {imagePreview ? (
              <img
                src={imagePreview}
                alt="preview"
                style={{ width: "100%", height: "250px", objectFit: "cover", borderRadius: "6px", border: "1px solid #ddd" }}
                onError={(e: any) => { e.target.style.display = "none"; }}
              />
            ) : (
              <div
                style={{
                  width: "100%", height: "250px", background: "#f5f5f5",
                  border: "1px dashed #ccc", borderRadius: "6px",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  color: "#aaa", fontSize: "13px"
                }}
              >
                Enter a file to preview
              </div>
            )}
          </div>
        </div>

        {/* ── Tags ── */}
        <div className="row">
          <div className="col-12 mb-3">
            <label className="form-label fw-semibold">Tags</label>
            <input
              type="text"
              name="tags"
              className="form-control"
              placeholder="e.g. AI, ChatGPT, Productivity  (comma separated)"
              value={formData.tags}
              onChange={handleChange}
            />
            <small className="text-muted">Separate tags with commas</small>
          </div>
        </div>

        {/* ── Content ── */}
        <div className="row">
          <div className="col-12 mb-3">
            <label className="form-label fw-semibold">
              Content <span className="text-danger">*</span>
              <small className="text-muted fw-normal ms-2">— supports HTML for headings, bold, lists, links, etc.</small>
            </label>
            <textarea
              name="content"
              className="form-control font-monospace"
              rows={16}
              value={formData.content}
              onChange={handleChange}
              required
              style={{ fontSize: "13px" }}
            />
            <small className="text-muted">
              Tip: Use <code>&lt;h2&gt;</code>, <code>&lt;p&gt;</code>, <code>&lt;ul&gt;</code>, <code>&lt;strong&gt;</code>, <code>&lt;a href=""&gt;</code>, <code>&lt;img src=""&gt;</code>
            </small>
          </div>
        </div>


        {/* ── Actions ── */}
        <div className="d-flex gap-3 pt-2 border-top mt-2">
          <button type="submit" className="tp-btn" disabled={submitting}>
            {submitting ? "Saving..." : "Save Changes"}
          </button>
          <button type="button" onClick={() => router.back()} className="tp-btn-2">
            Cancel
          </button>
          {formData.slug && (
            <a
              href={`/blog/${formData.slug}`}
              target="_blank"
              rel="noopener noreferrer"
              className="tp-btn-2 ms-auto"
            >
              👁 Preview on Site
            </a>
          )}
        </div>
      </form>
    </AdminShell>
  );
}
