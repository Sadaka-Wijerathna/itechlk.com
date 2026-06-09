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
      const lkrRate = data.conversion_rates.LKR;
      const eurRate = data.conversion_rates.EUR;

      // Update Database
      await Promise.all([
        prisma.siteSettings.upsert({
          where: { key: "USD_LKR" },
          update: { value: lkrRate.toString() },
          create: { key: "USD_LKR", value: lkrRate.toString() },
        }),
        prisma.siteSettings.upsert({
          where: { key: "USD_EUR" },
          update: { value: eurRate.toString() },
          create: { key: "USD_EUR", value: eurRate.toString() },
        })
      ]);

      console.log(`[Currency] Rates updated: LKR=${lkrRate}, EUR=${eurRate}`);
      return { LKR: lkrRate, EUR: eurRate };
    } else {
      console.error("ExchangeRate-API Error:", data["error-type"]);
      return null;
    }
  } catch (error) {
    console.error("Failed to update currency rates:", error);
    return null;
  }
}

export async function getCurrencyRates() {
  try {
    const rates = await prisma.siteSettings.findMany({
      where: {
        key: { in: ["USD_LKR", "USD_EUR"] }
      }
    });

    const ratesObj: Record<string, number> = {
      USD: 1,
      LKR: 325, // Fallback
      EUR: 0.92, // Fallback
    };

    rates.forEach((r) => {
      if (r.key === "USD_LKR") ratesObj.LKR = parseFloat(r.value);
      if (r.key === "USD_EUR") ratesObj.EUR = parseFloat(r.value);
    });

    return ratesObj;
  } catch (error) {
    console.error("Failed to get currency rates:", error);
    return { USD: 1, LKR: 325, EUR: 0.92 };
  }
}
