"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import AdminShell from "../AdminShell";
import { toast } from "react-toastify";

export default function AdminCommentsPage() {
  const [comments, setComments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("Pending");

  useEffect(() => {
    fetchComments();
  }, []);

  const fetchComments = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/comments");
      if (res.ok) {
        const data = await res.json();
        setComments(data);
      } else {
        toast.error("Failed to load comments.");
      }
    } catch (error) {
      console.error("Error fetching comments:", error);
      toast.error("An error occurred while fetching comments.");
    } finally {
      setLoading(false);
    }
  };

  const deleteComment = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this comment? This cannot be undone.")) {
      try {
        const res = await fetch(`/api/admin/comments?id=${id}`, {
          method: "DELETE",
        });
        if (res.ok) {
          toast.success("Comment deleted successfully.");
          fetchComments();
        } else {
          toast.error("Failed to delete comment.");
        }
      } catch {
        toast.error("An error occurred while deleting the comment.");
      }
    }
  };

  const toggleApprovalStatus = async (id: string, currentApprovedStatus: boolean) => {
    try {
      const res = await fetch("/api/admin/comments", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, approved: !currentApprovedStatus }),
      });

      if (res.ok) {
        toast.success(`Comment successfully ${!currentApprovedStatus ? "approved" : "unapproved"}.`);
        fetchComments();
      } else {
        toast.error("Failed to update comment status.");
      }
    } catch {
      toast.error("An error occurred while updating the comment status.");
    }
  };

  const pendingCount = comments.filter((c) => !c.approved).length;
  const approvedCount = comments.filter((c) => c.approved).length;

  const filteredComments = comments.filter((c) => {
    if (activeTab === "All") return true;
    if (activeTab === "Pending") return !c.approved;
    if (activeTab === "Approved") return c.approved;
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
            <i className="fa fa-comments"></i> Manage Comments
          </h3>
        </div>

        <div className="d-flex justify-content-between align-items-center mb-25 flex-wrap gap-2" style={{ padding: '0 70px' }}>
          <div className="tab-buttons d-flex gap-2 flex-wrap">
            {["Pending", "Approved", "All"].map((tab) => {
              const count = tab === "All" ? comments.length : (tab === "Pending" ? pendingCount : approvedCount);
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
        </div>

        <div className="order__list white-bg table-responsive">
          <table className="table">
            <thead>
              <tr>
                <th scope="col">Blog Article</th>
                <th scope="col">User Details</th>
                <th scope="col" style={{ width: "35%" }}>Comment</th>
                <th scope="col">Status</th>
                <th scope="col">Date</th>
                <th scope="col" className="text-end">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} className="text-center py-5">Loading comments...</td>
                </tr>
              ) : filteredComments.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-5 text-muted">
                    No comments found in this category.
                  </td>
                </tr>
              ) : (
                filteredComments.map((c) => (
                  <tr key={c.id}>
                    <td>
                      {c.blog ? (
                        <Link href={`/blog/${c.blog.slug}`} className="order__title" target="_blank">
                          {c.blog.title}
                        </Link>
                      ) : (
                        <span className="text-muted">Deleted Blog</span>
                      )}
                    </td>
                    <td>
                      <strong>{c.name}</strong>
                      <br />
                      <small className="text-muted">{c.email}</small>
                    </td>
                    <td>
                      <p style={{ margin: 0, fontSize: "13px", color: "#555", wordBreak: "break-word" }}>{c.comment}</p>
                    </td>
                    <td>
                      <span style={{ 
                        padding: '4px 8px', 
                        borderRadius: '20px', 
                        fontSize: '11px',
                        fontWeight: 'bold',
                        backgroundColor: c.approved ? '#dcfce7' : '#fef3c7',
                        color: c.approved ? '#166534' : '#92400e'
                      }}>
                        {c.approved ? "Approved" : "Pending"}
                      </span>
                    </td>
                    <td>
                      <span style={{ fontSize: "12px", color: '#848b8a' }}>
                        {new Date(c.createdAt).toLocaleDateString("en-US", {
                          month: "short", day: "numeric", year: "numeric"
                        })}
                      </span>
                    </td>
                    <td>
                      <div className="d-flex gap-2 justify-content-end align-items-center">
                        <button
                          onClick={() => toggleApprovalStatus(c.id, c.approved)}
                          className={c.approved ? "os-btn" : "os-btn os-btn-black"}
                          style={{ 
                            padding: "0 10px", 
                            height: 28, 
                            lineHeight: "26px", 
                            fontSize: 11,
                            backgroundColor: c.approved ? "#f5f5f5" : "#000",
                            color: c.approved ? "#000" : "#fff",
                            borderColor: c.approved ? "#ebebeb" : "#000"
                          }}
                          title={c.approved ? "Unapprove Comment" : "Approve Comment"}
                        >
                          <i className={`fa ${c.approved ? "fa-thumbs-down" : "fa-thumbs-up"}`} /> {c.approved ? "Revoke" : "Approve"}
                        </button>
                        <button
                          onClick={() => deleteComment(c.id)}
                          className="os-btn"
                          style={{ padding: "0 10px", height: 28, lineHeight: "26px", fontSize: 11, background: '#000', borderColor: '#000', color: '#fff' }}
                          title="Delete Comment"
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
