import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import AdminShell from "./AdminShell";
import Link from "next/link";
import { updateCurrencyRates } from "@/lib/currency";

async function getStats() {
  const [activeProducts, totalUsers, totalOrders, confirmedOrders] = await Promise.all([
    prisma.product.count({ where: { active: true } }),
    prisma.user.count(),
    prisma.order.count({ where: { status: "Confirmed" } }),
    prisma.order.findMany({
      where: { status: "Confirmed" },
      select: { totalAmount: true }
    })
  ]);

  const recentProducts = await prisma.product.findMany({
    where: { active: true },
    orderBy: { createdAt: "desc" },
    take: 5,
  });

  // Calculate revenue: convert older USD orders to LKR using historical rate (325)
  const revenue = confirmedOrders.reduce((sum, order) => {
    const amountInLKR = order.totalAmount < 1000 ? order.totalAmount * 325 : order.totalAmount;
    return sum + amountInLKR;
  }, 0);

  // Lazy Update Check: If rates are older than 24h, trigger an update in the background
  const lkrSetting = await prisma.siteSettings.findUnique({ where: { key: "USD_LKR" } });
  const eurSetting = await prisma.siteSettings.findUnique({ where: { key: "USD_EUR" } });
  const lastUpdate = lkrSetting?.updatedAt ? new Date(lkrSetting.updatedAt).getTime() : 0;
  const now = new Date().getTime();
  const ONE_DAY = 24 * 60 * 60 * 1000;

  if (now - lastUpdate > ONE_DAY) {
    console.log("[Currency] Rates are older than 24h. Triggering background update...");
    updateCurrencyRates().catch(err => console.error("Auto-update failed:", err));
  }

  return { 
    activeProducts, 
    totalUsers, 
    totalOrders, 
    revenue,
    usdLkr: lkrSetting?.value ? parseFloat(lkrSetting.value) : 325,
    usdEur: eurSetting?.value ? parseFloat(eurSetting.value) : 0.92,
    recentProducts,
    lastUpdateDate: lkrSetting?.updatedAt || null
  };
}

export default async function AdminDashboard() {
  const session = await auth();
  const { activeProducts, totalUsers, totalOrders, revenue, usdLkr, usdEur, recentProducts, lastUpdateDate } = await getStats();

  const stats = [
    { label: "Total Revenue", value: `Rs. ${Math.round(revenue).toLocaleString()}` },
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
          <div className="d-flex flex-column align-items-end">
            <div className="d-flex gap-2">
              <span style={{ fontSize: '11px', color: '#848b8a', background: '#f5f5f5', padding: '4px 10px', borderRadius: '4px' }}>
                USD/LKR: {usdLkr}
              </span>
              <span style={{ fontSize: '11px', color: '#848b8a', background: '#f5f5f5', padding: '4px 10px', borderRadius: '4px' }}>
                USD/EUR: {usdEur}
              </span>
            </div>
            {lastUpdateDate && (
              <small style={{ fontSize: '9px', color: '#bbb', marginTop: '4px' }}>
                Last Sync: {new Intl.DateTimeFormat('en-US', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(lastUpdateDate))}
              </small>
            )}
          </div>
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
                      href={`/product-details/${p.slug || p.id}`}
                      className="order__title"
                    >
                      {p.title}
                    </Link>
                    <br />
                    <small style={{ color: "#848b8a" }}>{p.brand}</small>
                  </td>
                  <td>{p.category}</td>
                  <td>Rs. {Math.round(p.price).toLocaleString()}</td>
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
