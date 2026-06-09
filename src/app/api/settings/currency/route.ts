import { NextResponse } from 'next/server';
import { getCurrencyRates, updateCurrencyRates } from '@/lib/currency';
import { auth } from '@/auth';

export async function GET() {
  const rates = await getCurrencyRates();
  return NextResponse.json(rates);
}

// Admin only: Trigger a manual update
export async function POST() {
  const session = await auth();
  if (session?.user?.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const result = await updateCurrencyRates();
  if (result) {
    return NextResponse.json({ success: true, rates: result });
  } else {
    return NextResponse.json({ error: 'Failed to update rates' }, { status: 500 });
  }
}
