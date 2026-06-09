"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import AdminShell from "../AdminShell";
import { toast } from "react-toastify";

export default function AdminBlogsPage() {
  const [blogs, setBlogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("All");

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

  const publishedCount = blogs.filter((b) => b.active).length;
  const draftsCount = blogs.filter((b) => !b.active).length;

  const filteredBlogs = blogs.filter(b => {
    if (activeTab === "All") return true;
    if (activeTab === "Published") return b.active;
    if (activeTab === "Drafts") return !b.active;
    return true;
  });

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
      ` }} />

      <div className="order__info" style={{ padding: '25px', background: '#fff', border: '1px solid #ebebeb' }}>
        <div className="order__info-top d-flex justify-content-between align-items-center mb-10">
          <h3 className="order__info-title m-0">
            <i className="fa fa-newspaper"></i> Manage Blogs
          </h3>
        </div>

        <div className="d-flex justify-content-between align-items-center mb-25 flex-wrap gap-2" style={{ padding: '0 70px' }}>
          <div className="tab-buttons d-flex gap-2 flex-wrap">
            {["All", "Published", "Drafts"].map((tab) => {
              const count = tab === "All" ? blogs.length : (tab === "Published" ? publishedCount : draftsCount);
              const isActive = activeTab === tab;
              return (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`os-btn ${isActive ? "os-btn-black" : ""}`}
                  style={{
                    padding: "0 12px",
                    height: "30px",
                    lineHeight: "28px",
                    fontSize: "11px",
                    fontWeight: 600,
                    backgroundColor: isActive ? "#000" : "#f5f5f5",
                    color: isActive ? "#fff" : "#000",
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
                    color: isActive ? "#fff" : "#000",
                    opacity: isActive ? 1 : 0.7,
                    fontWeight: 600
                  }}>
                    ({count})
                  </span>
                </button>
              );
            })}
          </div>

          <Link 
            href="/admin/blogs/add" 
            className="os-btn os-btn-black"
            style={{ 
              padding: '0 12px',
              height: '30px',
              lineHeight: '28px',
              fontSize: '11px',
              color: '#fff'
            }}
          >
            + ADD NEW BLOG
          </Link>
        </div>

        <div className="order__list white-bg table-responsive">
          <table className="table">
            <thead>
              <tr>
                <th scope="col" style={{ width: "80px" }}>Image</th>
                <th scope="col">Blog Title</th>
                <th scope="col">Category</th>
                <th scope="col">Status</th>
                <th scope="col">Date</th>
                <th scope="col" className="text-end">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} className="text-center py-5">Loading blogs...</td>
                </tr>
              ) : filteredBlogs.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-5 text-muted">
                    No blogs found. <Link href="/admin/blogs/add" className="order__title">Add your first blog</Link>
                  </td>
                </tr>
              ) : (
                filteredBlogs.map((blog) => (
                  <tr key={blog.id}>
                    <td>
                      <img
                        src={blog.image}
                        alt={blog.title}
                        style={{ width: "40px", height: "40px", objectFit: "cover", border: "1px solid #ebebeb", borderRadius: "0" }}
                        onError={(e: any) => { e.target.src = "/assets/img/logo/logo.png"; }}
                      />
                    </td>
                    <td>
                      <Link href={`/blog/${blog.slug}`} className="order__title">
                        {blog.title}
                      </Link>
                      <br />
                      <small className="text-muted">By {blog.author || "Admin"}</small>
                    </td>
                    <td>
                      <span style={{ fontSize: '12px', color: '#6d7170' }}>{blog.category}</span>
                    </td>
                    <td>
                      <span style={{ 
                        padding: '4px 8px', 
                        borderRadius: '20px', 
                        fontSize: '11px',
                        fontWeight: 'bold',
                        backgroundColor: blog.active ? '#dcfce7' : '#fee2e2',
                        color: blog.active ? '#166534' : '#991b1b'
                      }}>
                        {blog.active ? "Published" : "Draft"}
                      </span>
                    </td>
                    <td>
                      <span style={{ fontSize: "12px", color: '#848b8a' }}>
                        {new Date(blog.createdAt).toLocaleDateString("en-US", {
                          month: "short", day: "numeric", year: "numeric"
                        })}
                      </span>
                    </td>
                    <td>
                      <div className="d-flex gap-2 justify-content-end align-items-center">
                        <button
                          onClick={() => toggleStatus(blog)}
                          className="os-btn"
                          style={{ padding: "0 10px", height: 28, lineHeight: "26px", fontSize: 11, background: '#f5f5f5', color: '#000' }}
                          title={blog.active ? "Hide Blog" : "Publish Blog"}
                        >
                          <i className={`fa ${blog.active ? "fa-eye-slash" : "fa-eye"}`} />
                        </button>
                        <Link
                          href={`/admin/blogs/edit/${blog.id}`}
                          className="os-btn os-btn-black"
                          style={{ padding: "0 10px", height: 28, lineHeight: "26px", fontSize: 11 }}
                          title="Edit Blog"
                        >
                          <i className="fa fa-edit" />
                        </Link>
                        <button
                          onClick={() => deleteBlog(blog.id, blog.title)}
                          className="os-btn"
                          style={{ padding: "0 10px", height: 28, lineHeight: "26px", fontSize: 11, background: '#000', borderColor: '#000', color: '#fff' }}
                          title="Delete Blog"
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
      </div>
    </AdminShell>
  );
}
