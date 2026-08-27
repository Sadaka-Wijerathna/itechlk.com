"use client";

import { useState } from "react";
import AdminShell from "../AdminShell";

export default function UsersClient({ users, currentUserEmail }: { users: any[], currentUserEmail?: string | null }) {
  const [search, setSearch] = useState("");
  const [userList, setUserList] = useState(users);
  const [deleting, setDeleting] = useState<string | null>(null);

  const isSuperAdmin = currentUserEmail === "itechlkstore@gmail.com";

  const filteredUsers = userList.filter((u) => {
    const s = search.toLowerCase();
    return (
      !search ||
      (u.name && u.name.toLowerCase().includes(s)) ||
      (u.email && u.email.toLowerCase().includes(s)) ||
      (u.role && u.role.toLowerCase().includes(s))
    );
  });

  const handleDelete = async (userId: string) => {
    if (!confirm("Are you sure you want to PERMANENTLY delete this user? This cannot be undone.")) return;
    setDeleting(userId);
    try {
      const res = await fetch(`/api/users/${userId}`, { method: "DELETE" });
      if (res.ok) {
        setUserList(userList.filter(u => u.id !== userId));
      } else {
        const data = await res.json();
        alert(data.error || "Failed to delete user");
      }
    } catch (error) {
      alert("Error deleting user");
    }
    setDeleting(null);
  };

  return (
    <AdminShell>
      <div className="order__info" style={{ padding: '25px', background: '#fff', border: '1px solid #ebebeb' }}>
        <div className="order__info-top d-flex justify-content-between align-items-center mb-10">
          <h3 className="order__info-title m-0">
            <i className="fa fa-users"></i> Registered Users
          </h3>
        </div>

        <div className="password__change-top d-flex justify-content-between align-items-center mb-4" style={{ paddingTop: 0 }}>
          <input
            type="text"
            placeholder="Search by name, email or role..."
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
                <th scope="col">User</th>
                <th scope="col">Email</th>
                <th scope="col">Role</th>
                <th scope="col">Joined</th>
                <th scope="col">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((u) => (
                <tr key={u.id}>
                  <td>
                    <div className="d-flex align-items-center gap-3">
                      <img
                        src={u.image || "/assets/img/testimonial/person-1.jpg"}
                        alt={u.name || "User"}
                        referrerPolicy="no-referrer"
                        style={{
                          width: 38,
                          height: 38,
                          borderRadius: "50%",
                          objectFit: "cover",
                          border: "1px solid #ebebeb",
                        }}
                      />
                      <span className="order__title">
                        {u.name || "Unnamed User"}
                      </span>
                    </div>
                  </td>
                  <td>{u.email}</td>
                  <td>
                    {u.email === "itechlkstore@gmail.com" ? (
                      <span className="order__id">
                        SUPER ADMIN
                      </span>
                    ) : (
                      <span
                        className={u.role === "admin" ? "order__id" : ""}
                        style={u.role !== "admin" ? { color: "#848b8a" } : {}}
                      >
                        {u.role.toUpperCase()}
                      </span>
                    )}
                  </td>
                  <td>{new Date(u.createdAt).toLocaleDateString()}</td>
                  <td>
                    <div className="d-flex">
                      {u.email === currentUserEmail ? (
                        <span style={{ fontSize: '11px', color: '#888', padding: '6px 0' }}>You</span>
                      ) : (u.role === "admin" && !isSuperAdmin) ? (
                        <span style={{ fontSize: '11px', color: '#888', padding: '6px 0' }}>Not allowed</span>
                      ) : (
                        <button 
                          onClick={() => handleDelete(u.id)}
                          disabled={deleting === u.id}
                          className="os-btn"
                          style={{ padding: "0 14px", height: 32, lineHeight: "30px", fontSize: 12, opacity: deleting === u.id ? 0.5 : 1 }}
                        >
                          {deleting === u.id ? "…" : "Delete"}
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              {filteredUsers.length === 0 && (
                <tr>
                  <td colSpan={5} className="text-center py-4">
                    No users found matching your search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </AdminShell>
  );
}
