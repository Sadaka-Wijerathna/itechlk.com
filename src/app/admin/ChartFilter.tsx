"use client";

import { useRouter, useSearchParams } from "next/navigation";

export default function ChartFilter() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const duration = searchParams.get("duration") || "30days";

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    router.push(`/admin?duration=${e.target.value}`, { scroll: false });
  };
  
  return (
    <select 
      value={duration} 
      onChange={handleChange} 
      style={{ 
        padding: '10px 35px 10px 15px', 
        border: '1px solid #ebebeb', 
        borderRadius: '0px', 
        fontSize: '11px', 
        textTransform: 'uppercase',
        letterSpacing: '1px',
        outline: 'none', 
        backgroundColor: '#fff', 
        cursor: 'pointer',
        color: '#000',
        fontWeight: 700,
        appearance: 'none',
        WebkitAppearance: 'none',
        MozAppearance: 'none',
        backgroundImage: 'url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'%23000\' stroke-width=\'2\' stroke-linecap=\'round\' stroke-linejoin=\'round\'%3e%3cpolyline points=\'6 9 12 15 18 9\'%3e%3c/polyline%3e%3c/svg%3e")',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'right 10px center',
        backgroundSize: '14px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.02)',
        transition: 'all 0.3s ease'
      }}
    >
      <option value="30days">Last 30 Days</option>
      <option value="60days">Last 2 Months</option>
      <option value="180days">Last 6 Months</option>
      <option value="365days">Last Year</option>
      <option value="lifetime">Lifetime</option>
    </select>
  );
}
