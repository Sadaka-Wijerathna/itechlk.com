import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import AdminShell from "../AdminShell";

export default async function AdminUsersPage() {
  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <AdminShell>
      <div className="order__info">
        <div className="order__info-top d-flex justify-content-between align-items-center">
          <h3 className="order__info-title">
            <i className="fa fa-users"></i> Registered Users
          </h3>
        </div>

        <div className="order__list white-bg table-responsive">
          <table className="table">
            <thead>
              <tr>
                <th scope="col">User</th>
                <th scope="col">Email</th>
                <th scope="col">Role</th>
                <th scope="col">Joined</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id}>
                  <td>
                    <div className="d-flex align-items-center gap-3">
                      <img
                        src={u.image || "/assets/img/testimonial/person-1.jpg"}
                        alt={u.name || "User"}
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
                    <span
                      className={u.role === "admin" ? "order__id" : ""}
                      style={u.role !== "admin" ? { color: "#848b8a" } : {}}
                    >
                      {u.role.toUpperCase()}
                    </span>
                  </td>
                  <td>{new Date(u.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
              {users.length === 0 && (
                <tr>
                  <td colSpan={4} className="text-center py-4">
                    No users found.
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
