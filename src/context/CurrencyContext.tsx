'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type Currency = 'USD' | 'LKR' | 'EUR';

interface CurrencyContextType {
  currency: Currency;
  setCurrency: (c: Currency) => void;
  /** Price input is in LKR — the fixed base currency set by admin */
  formatPrice: (priceInLKR: number) => string;
  symbol: string;
  rate: number;
}

// Default rates relative to 1 LKR (fallback when API hasn't loaded yet)
const DEFAULT_RATES: Record<Currency, number> = {
  LKR: 1,
  USD: 1 / 325,    // ~0.00308 USD per LKR
  EUR: 0.92 / 325, // ~0.00283 EUR per LKR
};

const SYMBOLS: Record<Currency, string> = {
  USD: '$',
  LKR: 'Rs.',
  EUR: '€',
};

const CurrencyContext = createContext<CurrencyContextType>({
  currency: 'LKR',
  setCurrency: () => {},
  formatPrice: (p) => `Rs. ${Math.round(p).toLocaleString()}`,
  symbol: 'Rs.',
  rate: 1,
});

export function CurrencyProvider({ children }: { children: ReactNode }) {
  const [currency, setCurrencyState] = useState<Currency>('LKR');
  const [rates, setRates] = useState<Record<Currency, number>>(DEFAULT_RATES);

  // Fetch latest LKR-base rates from DB via API
  useEffect(() => {
    const fetchRates = async () => {
      try {
        const res = await fetch('/api/settings/currency');
        const data = await res.json();
        // data is now LKR-base: { LKR: 1, USD: 0.00308, EUR: 0.00283 }
        if (data && data.LKR === 1 && data.USD) {
          setRates(data as Record<Currency, number>);
        }
      } catch (err) {
        console.error("Failed to load live rates", err);
      }
    };
    fetchRates();
  }, []);

  // Persist currency selection across page loads
  useEffect(() => {
    const saved = localStorage.getItem('currency') as Currency | null;
    if (saved && DEFAULT_RATES[saved] !== undefined) {
      setTimeout(() => setCurrencyState(saved), 0);
    }
  }, []);

  const setCurrency = (c: Currency) => {
    setCurrencyState(c);
    localStorage.setItem('currency', c);
  };

  const currentRate = rates[currency] ?? DEFAULT_RATES[currency];
  const symbol = SYMBOLS[currency];

  /**
   * Converts a price stored in LKR to the selected display currency.
   * LKR is fixed (set by admin). USD/EUR fluctuate with live exchange rates.
   */
  const formatPrice = (priceInLKR: number) => {
    if (currency === 'LKR') {
      return `Rs. ${Math.round(priceInLKR).toLocaleString()}`;
    }
    const converted = priceInLKR * currentRate;
    if (currency === 'EUR') {
      return `€${converted.toFixed(2)}`;
    }
    return `$${converted.toFixed(2)}`;
  };

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency, formatPrice, symbol, rate: currentRate }}>
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  return useContext(CurrencyContext);
}

