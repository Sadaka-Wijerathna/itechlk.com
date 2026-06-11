'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type Currency = 'USD' | 'LKR' | 'EUR';

interface CurrencyContextType {
  currency: Currency;
  setCurrency: (c: Currency) => void;
  formatPrice: (priceInUSD: number) => string;
  symbol: string;
  rate: number;
}

const DEFAULT_RATES: Record<Currency, number> = {
  USD: 1,
  LKR: 325,
  EUR: 0.92,
};

const SYMBOLS: Record<Currency, string> = {
  USD: '$',
  LKR: 'Rs.',
  EUR: '€',
};

const CurrencyContext = createContext<CurrencyContextType>({
  currency: 'LKR',
  setCurrency: () => {},
  formatPrice: (p) => `Rs. ${Math.round(p * 325).toLocaleString()}`,
  symbol: 'Rs.',
  rate: 325,
});

export function CurrencyProvider({ children }: { children: ReactNode }) {
  const [currency, setCurrencyState] = useState<Currency>('LKR');
  const [rates, setRates] = useState<Record<Currency, number>>(DEFAULT_RATES);

  // Fetch latest rates from DB
  useEffect(() => {
    const fetchRates = async () => {
      try {
        const res = await fetch('/api/settings/currency');
        const data = await res.json();
        if (data && data.LKR) {
          setRates(data);
        }
      } catch (err) {
        console.error("Failed to load live rates", err);
      }
    };
    fetchRates();
  }, []);

  // Persist selection across page loads
  useEffect(() => {
    const saved = localStorage.getItem('currency') as Currency | null;
    if (saved && DEFAULT_RATES[saved]) {
      setTimeout(() => {
        setCurrencyState(saved);
      }, 0);
    }
  }, []);

  const setCurrency = (c: Currency) => {
    setCurrencyState(c);
    localStorage.setItem('currency', c);
  };

  const currentRate = rates[currency] || DEFAULT_RATES[currency];
  const symbol = SYMBOLS[currency];

  const formatPrice = (priceInUSD: number) => {
    const converted = priceInUSD * currentRate;
    if (currency === 'LKR') {
      return `Rs. ${Math.round(converted).toLocaleString()}`;
    }
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
