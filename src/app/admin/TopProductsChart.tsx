"use client";

import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts";

const COLORS = ['#21a8c9', '#333333', '#666666', '#999999', '#cccccc'];

export default function TopProductsChart({ data, durationLabel }: { data: { name: string; value: number }[], durationLabel?: string }) {
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div style={{ background: '#fff', border: '1px solid #ebebeb', padding: '10px 15px', borderRadius: '4px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
          <p style={{ margin: 0, fontWeight: 600, color: '#000', marginBottom: '5px' }}>{payload[0].name}</p>
          <p style={{ margin: 0, color: '#848b8a', fontSize: '13px' }}>
            <span style={{ textTransform: 'uppercase', fontSize: '10px', letterSpacing: '1px', display: 'block', marginBottom: '2px' }}>Sold</span>
            {payload[0].value} units
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="order__info mt-40" style={{ padding: '25px', background: '#fff', border: '1px solid #ebebeb' }}>
      <div className="order__info-top d-flex justify-content-between align-items-center mb-3">
        <h3 className="order__info-title m-0">Top Products ({durationLabel || "Last 30 Days"})</h3>
      </div>
      
      <div style={{ width: "100%", height: 350 }}>
        <ResponsiveContainer width="100%" height="100%" style={{ outline: 'none' }}>
          <PieChart style={{ outline: 'none' }}>
            <Pie
              data={data}
              cx="50%"
              cy="45%"
              innerRadius={60}
              outerRadius={100}
              paddingAngle={2}
              dataKey="value"
              stroke="none"
              style={{ outline: 'none' }}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} style={{ outline: 'none' }} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend 
              verticalAlign="bottom" 
              height={36} 
              formatter={(value) => <span style={{ color: '#848b8a', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1px' }}>{value.length > 15 ? value.substring(0, 15) + '...' : value}</span>}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
