import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import AdminShell from "./AdminShell";
import Link from "next/link";

async function getStats() {
  const [activeProducts, totalUsers, totalOrders, revenueData] = await Promise.all([
    prisma.product.count({ where: { active: true } }),
    prisma.user.count(),
    prisma.order.count(),
    prisma.order.aggregate({
      _sum: {
        totalAmount: true
      },
      where: {
        status: "Confirmed"
      }
    })
  ]);

  const recentProducts = await prisma.product.findMany({
    where: { active: true },
    orderBy: { createdAt: "desc" },
    take: 5,
  });

  return { 
    activeProducts, 
    totalUsers, 
    totalOrders, 
    revenue: revenueData._sum.totalAmount || 0,
    recentProducts 
  };
}

export default async function AdminDashboard() {
  const session = await auth();
  const { activeProducts, totalUsers, totalOrders, revenue, recentProducts } = await getStats();

  // Currency rate conversion (USD to LKR)
  const RATE = 325;
  const lkrRevenue = revenue * RATE;

  const stats = [
    { label: "Total Revenue", value: `Rs. ${Math.round(lkrRevenue).toLocaleString()}` },
    { label: "Total Orders", value: totalOrders.toString() },
    { label: "Active Products", value: activeProducts.toString() },
    { label: "Total Users", value: totalUsers.toString() },
  ];

  return (
    <AdminShell>
      {/* Profile info block */}
      <div className="profile__info">
        <div className="profile__info-top d-flex justify-content-between align-items-center">
          <h3 className="profile__info-title">
            Welcome back, {session?.user?.name?.split(" ")[0] ?? "Admin"} 👋
          </h3>
        </div>

        <div className="order__info mt-10" style={{ padding: '25px', background: '#fff', border: '1px solid #ebebeb' }}>
          <div className="d-flex justify-content-between flex-wrap gap-4" style={{ padding: '20px 35px' }}>
            {stats.map((s) => (
              <div key={s.label} className="profile__info-item" style={{ borderBottom: '0', padding: '0', minWidth: '150px' }}>
                <p style={{ textTransform: 'uppercase', fontSize: '11px', letterSpacing: '1.2px', marginBottom: '8px', color: '#848b8a' }}>{s.label}</p>
                <h4 style={{ fontSize: '22px', fontWeight: '700', color: '#000', margin: '0' }}>{s.value}</h4>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent products table */}
      <div className="order__info mt-40" style={{ padding: '25px', background: '#fff', border: '1px solid #ebebeb' }}>
        <div className="order__info-top d-flex justify-content-between align-items-center">
          <h3 className="order__info-title">Recent Products</h3>
          <Link href="/admin/products" className="os-btn os-btn-black">
            View All
          </Link>
        </div>

        <div className="order__list table-responsive">
          <table className="table">
            <thead>
              <tr>
                <th scope="col">Product</th>
                <th scope="col">Category</th>
                <th scope="col">Price</th>
                <th scope="col">Status</th>
              </tr>
            </thead>
            <tbody>
              {recentProducts.map((p) => (
                <tr key={p.id}>
                  <td>
                    <Link
                      href={`/product-details/${p.id}`}
                      className="order__title"
                    >
                      {p.title}
                    </Link>
                    <br />
                    <small style={{ color: "#848b8a" }}>{p.brand}</small>
                  </td>
                  <td>{p.category}</td>
                  <td>Rs. {Math.round(p.price * RATE).toLocaleString()}</td>
                  <td>
                    <span
                      style={{
                        color: p.active ? "#21a8c9" : "#848b8a",
                        fontWeight: 600,
                      }}
                    >
                      {p.active ? "Active" : "Inactive"}
                    </span>
                  </td>
                </tr>
              ))}
              {recentProducts.length === 0 && (
                <tr>
                  <td colSpan={4} className="text-center py-4">
                    No products yet.{" "}
                    <Link href="/admin/products" className="order__title">
                      Add your first product
                    </Link>
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
