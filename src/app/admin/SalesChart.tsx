"use client";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from "recharts";

export default function SalesChart({ data, durationLabel }: { data: { date: string; revenue: number }[], durationLabel?: string }) {
  // Format the tooltip
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div style={{ background: '#fff', border: '1px solid #ebebeb', padding: '10px 15px', borderRadius: '4px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
          <p style={{ margin: 0, fontWeight: 600, color: '#000', marginBottom: '5px' }}>{label}</p>
          <p style={{ margin: 0, color: '#848b8a', fontSize: '13px' }}>
            <span style={{ textTransform: 'uppercase', fontSize: '10px', letterSpacing: '1px', display: 'block', marginBottom: '2px' }}>Revenue</span>
            Rs. {payload[0].value.toLocaleString()}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="order__info mt-40" style={{ padding: '25px', background: '#fff', border: '1px solid #ebebeb' }}>
      <div className="order__info-top d-flex justify-content-between align-items-center mb-3">
        <h3 className="order__info-title m-0">Revenue ({durationLabel || "Last 30 Days"})</h3>
      </div>
      
      <div style={{ width: "100%", height: 350 }}>
        <ResponsiveContainer width="100%" height="100%" style={{ outline: 'none' }}>
          <AreaChart
            data={data}
            style={{ outline: 'none' }}
            margin={{
              top: 10,
              right: 10,
              left: 10,
              bottom: 0,
            }}
          >
            <defs>
              <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#000" stopOpacity={0.15}/>
                <stop offset="95%" stopColor="#000" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#ebebeb" />
            <XAxis 
              dataKey="date" 
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#848b8a', fontSize: 12 }}
              dy={10}
              minTickGap={20}
            />
            <YAxis 
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#848b8a', fontSize: 12 }}
              tickFormatter={(value) => `Rs. ${value >= 1000 ? (value / 1000).toFixed(0) + 'k' : value}`}
              dx={-10}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area 
              type="monotone" 
              dataKey="revenue" 
              stroke="#000" 
              strokeWidth={2}
              fillOpacity={1} 
              fill="url(#colorRevenue)" 
              activeDot={{ r: 6, fill: '#21a8c9', stroke: '#fff', strokeWidth: 2 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
