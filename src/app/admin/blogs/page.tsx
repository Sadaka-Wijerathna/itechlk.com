"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import AdminShell from "../AdminShell";
import { toast } from "react-toastify";

export default function AdminBlogsPage() {
  const [blogs, setBlogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/blogs");
      const data = await res.json();
      setBlogs(data);
    } catch (error) {
      console.error("Error fetching blogs:", error);
    } finally {
      setLoading(false);
    }
  };

  const deleteBlog = async (id: string, title: string) => {
    if (window.confirm(`Delete "${title}"? This cannot be undone.`)) {
      try {
        const res = await fetch(`/api/blogs/${id}`, { method: "DELETE" });
        if (res.ok) {
          toast.success("Blog deleted");
          fetchBlogs();
        } else {
          toast.error("Failed to delete blog");
        }
      } catch {
        toast.error("An error occurred");
      }
    }
  };

  const toggleStatus = async (blog: any) => {
    try {
      const res = await fetch(`/api/blogs/${blog.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...blog, active: !blog.active }),
      });
      if (res.ok) {
        toast.success(`Blog ${!blog.active ? "published" : "hidden"}`);
        fetchBlogs();
      } else {
        toast.error("Failed to update status");
      }
    } catch {
      toast.error("An error occurred");
    }
  };

  const published = blogs.filter((b) => b.active).length;
  const drafts = blogs.filter((b) => !b.active).length;

  return (
    <AdminShell>
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <div>
          <h3 className="mb-1">Manage Blogs</h3>
          <small className="text-muted">
            {blogs.length} total &nbsp;·&nbsp;
            <span className="text-success">{published} published</span> &nbsp;·&nbsp;
            <span className="text-warning">{drafts} drafts</span>
          </small>
        </div>
        <Link href="/admin/blogs/add" className="tp-btn">
          + Add New Blog
        </Link>
      </div>

      <div className="table-responsive bg-white p-4 shadow-sm">
        <table className="table table-hover align-middle">
          <thead className="table-light">
            <tr>
              <th style={{ width: "60px" }}>Image</th>
              <th>Title</th>
              <th>Author</th>
              <th>Category</th>
              <th>Tags</th>
              <th>Status</th>
              <th>Date</th>
              <th style={{ width: "160px" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={8} className="text-center py-4">Loading...</td>
              </tr>
            ) : blogs.length === 0 ? (
              <tr>
                <td colSpan={8} className="text-center py-4 text-muted">
                  No blogs yet. <Link href="/admin/blogs/add">Add your first blog →</Link>
                </td>
              </tr>
            ) : (
              blogs.map((blog) => (
                <tr key={blog.id}>
                  <td>
                    <img
                      src={blog.image}
                      alt={blog.title}
                      style={{ width: "52px", height: "40px", objectFit: "cover", borderRadius: "4px" }}
                      onError={(e: any) => { e.target.src = "/assets/img/logo/logo.png"; }}
                    />
                  </td>
                  <td>
                    <div className="fw-semibold">{blog.title}</div>
                    <small className="text-muted font-monospace">/blog/{blog.slug}</small>
                  </td>
                  <td>{blog.author || "Admin"}</td>
                  <td>
                    <span className="badge bg-info text-white">{blog.category}</span>
                  </td>
                  <td>
                    {Array.isArray(blog.tags) && blog.tags.length > 0 ? (
                      <span className="text-muted" style={{ fontSize: "12px" }}>
                        {blog.tags.slice(0, 2).join(", ")}
                        {blog.tags.length > 2 && ` +${blog.tags.length - 2}`}
                      </span>
                    ) : (
                      <span className="text-muted" style={{ fontSize: "12px" }}>—</span>
                    )}
                  </td>
                  <td>
                    <span className={`badge ${blog.active ? "bg-success" : "bg-warning text-dark"}`}>
                      {blog.active ? "Published" : "Draft"}
                    </span>
                  </td>
                  <td style={{ fontSize: "13px" }}>
                    {new Date(blog.createdAt).toLocaleDateString("en-US", {
                      month: "short", day: "numeric", year: "numeric"
                    })}
                  </td>
                  <td>
                    <div className="d-flex gap-1 flex-wrap">
                      <button
                        onClick={() => toggleStatus(blog)}
                        className={`btn btn-sm ${blog.active ? "btn-outline-success" : "btn-outline-warning"}`}
                        title={blog.active ? "Make Invisible" : "Make Visible"}
                      >
                        <i className={`fa ${blog.active ? "fa-eye" : "fa-eye-slash"}`} />
                      </button>
                      <Link
                        href={`/admin/blogs/edit/${blog.id}`}
                        className="btn btn-sm btn-outline-primary"
                        title="Edit"
                      >
                        <i className="fa fa-edit" />
                      </Link>
                      <a
                        href={`/blog/${blog.slug}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-sm btn-outline-secondary"
                        title="View on site"
                      >
                        <i className="fa fa-external-link" />
                      </a>
                      <button
                        onClick={() => deleteBlog(blog.id, blog.title)}
                        className="btn btn-sm btn-outline-danger"
                        title="Delete"
                      >
                        <i className="fa fa-trash" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </AdminShell>
  );
}
