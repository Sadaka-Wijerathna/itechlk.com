'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type Currency = 'USD' | 'LKR' | 'EUR';

// Approximate exchange rates: base USD
const RATES: Record<Currency, number> = {
  USD: 1,
  LKR: 325,
  EUR: 0.92,
};

const SYMBOLS: Record<Currency, string> = {
  USD: '$',
  LKR: 'Rs.',
  EUR: '€',
};

interface CurrencyContextType {
  currency: Currency;
  setCurrency: (c: Currency) => void;
  formatPrice: (priceInUSD: number) => string;
  symbol: string;
  rate: number;
}

const CurrencyContext = createContext<CurrencyContextType>({
  currency: 'LKR',
  setCurrency: () => {},
  formatPrice: (p) => `Rs. ${Math.round(p * 325).toLocaleString()}`,
  symbol: 'Rs.',
  rate: 325,
});

export function CurrencyProvider({ children }: { children: ReactNode }) {
  const [currency, setCurrencyState] = useState<Currency>('LKR');

  // Persist selection across page loads
  useEffect(() => {
    const saved = localStorage.getItem('currency') as Currency | null;
    if (saved && RATES[saved]) setCurrencyState(saved);
  }, []);

  const setCurrency = (c: Currency) => {
    setCurrencyState(c);
    localStorage.setItem('currency', c);
  };

  const rate = RATES[currency];
  const symbol = SYMBOLS[currency];

  const formatPrice = (priceInUSD: number) => {
    const converted = priceInUSD * rate;
    if (currency === 'LKR') {
      return `Rs. ${Math.round(converted).toLocaleString()}`;
    }
    if (currency === 'EUR') {
      return `€${converted.toFixed(2)}`;
    }
    return `$${converted.toFixed(2)}`;
  };

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency, formatPrice, symbol, rate }}>
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  return useContext(CurrencyContext);
}
