import prisma from "./prisma";

const API_KEY = process.env.EXCHANGE_RATE_API_KEY;
const API_URL = `https://v6.exchangerate-api.com/v6/${API_KEY}/latest/USD`;

export async function updateCurrencyRates() {
  try {
    if (!API_KEY) {
      console.warn("EXCHANGE_RATE_API_KEY is not set.");
      return null;
    }

    const response = await fetch(API_URL);
    const data = await response.json();

    if (data.result === "success") {
      const usdLkrRate = data.conversion_rates.LKR;  // how many LKR per 1 USD
      const usdEurRate = data.conversion_rates.EUR;  // how many EUR per 1 USD

      // Store the raw USD-base rates in DB (no schema change needed)
      await Promise.all([
        prisma.siteSettings.upsert({
          where: { key: "USD_LKR" },
          update: { value: usdLkrRate.toString() },
          create: { key: "USD_LKR", value: usdLkrRate.toString() },
        }),
        prisma.siteSettings.upsert({
          where: { key: "USD_EUR" },
          update: { value: usdEurRate.toString() },
          create: { key: "USD_EUR", value: usdEurRate.toString() },
        })
      ]);

      console.log(`[Currency] Rates updated: USD_LKR=${usdLkrRate}, USD_EUR=${usdEurRate}`);
      return { LKR: usdLkrRate, EUR: usdEurRate };
    } else {
      console.error("ExchangeRate-API Error:", data["error-type"]);
      return null;
    }
  } catch (error) {
    console.error("Failed to update currency rates:", error);
    return null;
  }
}

/**
 * Returns rates relative to 1 LKR (LKR is the fixed base currency).
 * product.price is stored in LKR — use these rates to convert to other currencies.
 *
 * Example: if 1 USD = 325 LKR:
 *   LKR: 1          (no conversion)
 *   USD: 1/325      (~0.00308 USD per LKR)
 *   EUR: 0.92/325   (~0.00283 EUR per LKR)
 */
export async function getCurrencyRates() {
  try {
    const rows = await prisma.siteSettings.findMany({
      where: { key: { in: ["USD_LKR", "USD_EUR"] } }
    });

    // Fallback USD-base rates
    let usdLkr = 325;
    let usdEur = 0.92;

    rows.forEach((r) => {
      if (r.key === "USD_LKR") usdLkr = parseFloat(r.value);
      if (r.key === "USD_EUR") usdEur = parseFloat(r.value);
    });

    // Convert to LKR-base: how many foreign currency units per 1 LKR
    return {
      LKR: 1,                       // base — always 1
      USD: 1 / usdLkr,              // e.g. 1/325 ≈ 0.00308
      EUR: usdEur / usdLkr,         // e.g. 0.92/325 ≈ 0.00283
    };
  } catch (error) {
    console.error("Failed to get currency rates:", error);
    // Fallback to LKR-base rates
    return { LKR: 1, USD: 1 / 325, EUR: 0.92 / 325 };
  }
}

