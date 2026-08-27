import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import AdminShell from "./AdminShell";
import Link from "next/link";
import { updateCurrencyRates } from "@/lib/currency";
import SalesChart from "./SalesChart";
import TopProductsChart from "./TopProductsChart";
import ChartFilter from "./ChartFilter";

async function getStats(durationStr: string) {
  let days = 30;
  if (durationStr === '60days') days = 60;
  else if (durationStr === '180days') days = 180;
  else if (durationStr === '365days') days = 365;
  else if (durationStr === 'lifetime') days = 0;

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

  const revenue = confirmedOrders.reduce((sum, order) => sum + order.totalAmount, 0);

  let dateFilter = {};
  if (days > 0) {
    const ago = new Date();
    ago.setDate(ago.getDate() - days);
    dateFilter = { gte: ago };
  }

  const recentConfirmedOrders = await prisma.order.findMany({
    where: { 
      status: "Confirmed",
      ...(days > 0 ? { createdAt: dateFilter } : {})
    },
    select: { totalAmount: true, createdAt: true, items: true }
  });

  const salesMap = new Map<string, number>();
  
  if (days === 0 || days > 60) {
    // Group by Month for long durations
    // Find the earliest date to determine how many months to go back
    const earliestDate = recentConfirmedOrders.length > 0 
      ? new Date(Math.min(...recentConfirmedOrders.map(o => new Date(o.createdAt).getTime())))
      : new Date();
    const currentDate = new Date();
    const monthsDiff = (currentDate.getFullYear() - earliestDate.getFullYear()) * 12 + (currentDate.getMonth() - earliestDate.getMonth());
    
    // Initialize months in order
    for (let i = monthsDiff; i >= 0; i--) {
      const d = new Date();
      d.setMonth(d.getMonth() - i);
      const dateStr = d.toLocaleDateString("en-US", { month: "short", year: "numeric" });
      salesMap.set(dateStr, 0);
    }

    recentConfirmedOrders.forEach((order) => {
      const dateStr = new Date(order.createdAt).toLocaleDateString("en-US", { month: "short", year: "numeric" });
      if (salesMap.has(dateStr)) {
        salesMap.set(dateStr, salesMap.get(dateStr)! + order.totalAmount);
      }
    });
  } else {
    // Group by Day for shorter durations
    for (let i = days - 1; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
      salesMap.set(dateStr, 0);
    }

    recentConfirmedOrders.forEach((order) => {
      const dateStr = new Date(order.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" });
      if (salesMap.has(dateStr)) {
        salesMap.set(dateStr, salesMap.get(dateStr)! + order.totalAmount);
      }
    });
  }

  const productQuantities = new Map<string, { name: string, qty: number }>();

  recentConfirmedOrders.forEach((order) => {
    if (order.items && Array.isArray(order.items)) {
      order.items.forEach((item: any) => {
        if (!item.title) return;
        
        // Normalize title to catch casing differences like "CapCut Pro" and "CAPCUT PRO"
        const normalized = item.title.trim().toLowerCase();
        
        const existing = productQuantities.get(normalized);
        if (existing) {
          existing.qty += item.quantity;
          
          // Try to prefer a "better" casing for display (e.g. Title Case over all lowercase/uppercase)
          // If existing name is all uppercase or all lowercase and the new one isn't, swap it.
          const isExistingBadCase = existing.name === existing.name.toLowerCase() || existing.name === existing.name.toUpperCase();
          const isNewBetterCase = item.title !== item.title.toLowerCase() && item.title !== item.title.toUpperCase();
          if (isExistingBadCase && isNewBetterCase) {
             existing.name = item.title.trim();
          }
        } else {
          productQuantities.set(normalized, { name: item.title.trim(), qty: item.quantity });
        }
      });
    }
  });

  const salesData = Array.from(salesMap.entries()).map(([date, amount]) => ({
    date,
    revenue: Math.round(amount)
  }));

  const topProductsData = Array.from(productQuantities.values())
    .map(({ name, qty }) => ({ name, value: qty }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 5);

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
    lastUpdateDate: lkrSetting?.updatedAt || null,
    salesData,
    topProductsData
  };
}

export default async function AdminDashboard({ searchParams }: { searchParams: Promise<{ duration?: string }> }) {
  const session = await auth();
  const params = await searchParams;
  const durationStr = params?.duration || "30days";
  const { activeProducts, totalUsers, totalOrders, revenue, usdLkr, usdEur, recentProducts, lastUpdateDate, salesData, topProductsData } = await getStats(durationStr);

  const stats = [
    { label: "Total Revenue", value: `Rs. ${Math.round(revenue).toLocaleString()}` },
    { label: "Total Orders", value: totalOrders.toString() },
    { label: "Active Products", value: activeProducts.toString() },
    { label: "Total Users", value: totalUsers.toString() },
  ];

  let durationLabel = "Last 30 Days";
  if (durationStr === '60days') durationLabel = "Last 2 Months";
  else if (durationStr === '180days') durationLabel = "Last 6 Months";
  else if (durationStr === '365days') durationLabel = "Last Year";
  else if (durationStr === 'lifetime') durationLabel = "Lifetime";

  return (
    <AdminShell>
      <style>{`
        .recharts-wrapper, .recharts-surface, .recharts-surface * {
          outline: none !important;
        }
      `}</style>
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

      <div className="d-flex justify-content-end" style={{ marginBottom: '-20px', marginTop: '20px', position: 'relative', zIndex: 10 }}>
        <ChartFilter />
      </div>

      <div className="row">
        <div className="col-lg-8">
          <SalesChart data={salesData} durationLabel={durationLabel} />
        </div>
        <div className="col-lg-4">
          <TopProductsChart data={topProductsData} durationLabel={durationLabel} />
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
