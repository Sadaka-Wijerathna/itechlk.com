import { useEffect, useState } from "react";

const COUNTRY_CALLING_CODES: Record<string, string> = {
  AF: "+93", AL: "+355", DZ: "+213", AD: "+376", AO: "+244", AR: "+54",
  AM: "+374", AU: "+61", AT: "+43", AZ: "+994", BS: "+1", BH: "+973",
  BD: "+880", BY: "+375", BE: "+32", BZ: "+501", BJ: "+229", BT: "+975",
  BO: "+591", BA: "+387", BW: "+267", BR: "+55", BN: "+673", BG: "+359",
  BI: "+257", KH: "+855", CM: "+237", CA: "+1", CL: "+56", CN: "+86",
  CO: "+57", CR: "+506", HR: "+385", CU: "+53", CY: "+357", CZ: "+420",
  DK: "+45", DO: "+1", EC: "+593", EG: "+20", SV: "+503", EE: "+372",
  ET: "+251", FJ: "+679", FI: "+358", FR: "+33", GE: "+995", DE: "+49",
  GH: "+233", GR: "+30", GT: "+502", HT: "+509", HN: "+504", HK: "+852",
  HU: "+36", IS: "+354", IN: "+91", ID: "+62", IR: "+98", IQ: "+964",
  IE: "+353", IL: "+972", IT: "+39", JM: "+1", JP: "+81", JO: "+962",
  KZ: "+7", KE: "+254", KW: "+965", LA: "+856", LV: "+371", LB: "+961",
  LY: "+218", LI: "+423", LT: "+370", LU: "+352", MO: "+853", MG: "+261",
  MY: "+60", MV: "+960", MT: "+356", MX: "+52", MD: "+373", MC: "+377",
  MN: "+976", ME: "+382", MA: "+212", MM: "+95", NP: "+977", NL: "+31",
  NZ: "+64", NI: "+505", NG: "+234", NO: "+47", OM: "+968", PK: "+92",
  PA: "+507", PY: "+595", PE: "+51", PH: "+63", PL: "+48", PT: "+351",
  QA: "+974", RO: "+40", RU: "+7", SA: "+966", RS: "+381", SG: "+65",
  SK: "+421", SI: "+386", ZA: "+27", KR: "+82", ES: "+34", LK: "+94",
  SD: "+249", SE: "+46", CH: "+41", SY: "+963", TW: "+886", TJ: "+992",
  TZ: "+255", TH: "+66", TN: "+216", TR: "+90", UG: "+256", UA: "+380",
  AE: "+971", GB: "+44", US: "+1", UY: "+598", UZ: "+998", VE: "+58",
  VN: "+84", YE: "+967", ZM: "+260", ZW: "+263",
};

// Map ISO country code to full country name (matching our COUNTRY_DATA)
const COUNTRY_NAMES: Record<string, string> = {
  AF: "Afghanistan", AL: "Albania", DZ: "Algeria", AD: "Andorra", AO: "Angola",
  AR: "Argentina", AM: "Armenia", AU: "Australia", AT: "Austria", AZ: "Azerbaijan",
  BS: "Bahamas", BH: "Bahrain", BD: "Bangladesh", BY: "Belarus", BE: "Belgium",
  BZ: "Belize", BJ: "Benin", BT: "Bhutan", BO: "Bolivia", BA: "Bosnia and Herzegovina",
  BW: "Botswana", BR: "Brazil", BN: "Brunei", BG: "Bulgaria", BI: "Burundi",
  KH: "Cambodia", CM: "Cameroon", CA: "Canada", CL: "Chile", CN: "China",
  CO: "Colombia", CR: "Costa Rica", HR: "Croatia", CU: "Cuba", CY: "Cyprus",
  CZ: "Czechia", DK: "Denmark", DO: "Dominican Republic", EC: "Ecuador",
  EG: "Egypt", SV: "El Salvador", EE: "Estonia", ET: "Ethiopia", FJ: "Fiji",
  FI: "Finland", FR: "France", GE: "Georgia", DE: "Germany", GH: "Ghana",
  GR: "Greece", GT: "Guatemala", HT: "Haiti", HN: "Honduras", HK: "Hong Kong",
  HU: "Hungary", IS: "Iceland", IN: "India", ID: "Indonesia", IR: "Iran",
  IQ: "Iraq", IE: "Ireland", IL: "Israel", IT: "Italy", JM: "Jamaica",
  JP: "Japan", JO: "Jordan", KZ: "Kazakhstan", KE: "Kenya", KW: "Kuwait",
  LA: "Laos", LV: "Latvia", LB: "Lebanon", LY: "Libya", LI: "Liechtenstein",
  LT: "Lithuania", LU: "Luxembourg", MO: "Macao", MG: "Madagascar", MY: "Malaysia",
  MV: "Maldives", MT: "Malta", MX: "Mexico", MD: "Moldova", MC: "Monaco",
  MN: "Mongolia", ME: "Montenegro", MA: "Morocco", MM: "Myanmar", NP: "Nepal",
  NL: "Netherlands", NZ: "New Zealand", NI: "Nicaragua", NG: "Nigeria",
  NO: "Norway", OM: "Oman", PK: "Pakistan", PA: "Panama", PY: "Paraguay",
  PE: "Peru", PH: "Philippines", PL: "Poland", PT: "Portugal", QA: "Qatar",
  RO: "Romania", RU: "Russia", SA: "Saudi Arabia", RS: "Serbia", SG: "Singapore",
  SK: "Slovakia", SI: "Slovenia", ZA: "South Africa", KR: "South Korea",
  ES: "Spain", LK: "Sri Lanka", SD: "Sudan", SE: "Sweden", CH: "Switzerland",
  SY: "Syria", TW: "Taiwan", TJ: "Tajikistan", TZ: "Tanzania", TH: "Thailand",
  TN: "Tunisia", TR: "Turkey", UG: "Uganda", UA: "Ukraine", AE: "United Arab Emirates",
  GB: "United Kingdom", US: "United States", UY: "Uruguay", UZ: "Uzbekistan",
  VE: "Venezuela", VN: "Vietnam", YE: "Yemen", ZM: "Zambia", ZW: "Zimbabwe",
};

export type GeoInfo = {
  countryCode: string;   // "LK"
  countryName: string;   // "Sri Lanka"
  callingCode: string;   // "+94"
  currency: string;      // "LKR"
  currencySymbol: string;// "₨"
};

const CURRENCY_MAP: Record<string, { code: string; symbol: string }> = {
  US: { code: "USD", symbol: "$" }, GB: { code: "GBP", symbol: "£" },
  EU: { code: "EUR", symbol: "€" }, FR: { code: "EUR", symbol: "€" },
  DE: { code: "EUR", symbol: "€" }, IT: { code: "EUR", symbol: "€" },
  ES: { code: "EUR", symbol: "€" }, IN: { code: "INR", symbol: "₹" },
  AU: { code: "AUD", symbol: "A$" }, CA: { code: "CAD", symbol: "C$" },
  JP: { code: "JPY", symbol: "¥" }, CN: { code: "CNY", symbol: "¥" },
  LK: { code: "LKR", symbol: "₨" }, PK: { code: "PKR", symbol: "₨" },
  AE: { code: "AED", symbol: "د.إ" }, SA: { code: "SAR", symbol: "﷼" },
  BD: { code: "BDT", symbol: "৳" }, MY: { code: "MYR", symbol: "RM" },
  SG: { code: "SGD", symbol: "S$" }, PH: { code: "PHP", symbol: "₱" },
  TH: { code: "THB", symbol: "฿" }, ID: { code: "IDR", symbol: "Rp" },
  NG: { code: "NGN", symbol: "₦" }, KE: { code: "KES", symbol: "KSh" },
  ZA: { code: "ZAR", symbol: "R" }, BR: { code: "BRL", symbol: "R$" },
  MX: { code: "MXN", symbol: "MX$" }, AR: { code: "ARS", symbol: "$" },
};

export function useGeoLocation() {
  const [geo, setGeo] = useState<GeoInfo | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("https://ipapi.co/json/")
      .then((r) => r.json())
      .then((data) => {
        const code: string = data.country_code || "";
        const name = COUNTRY_NAMES[code] || data.country_name || "";
        const callingCode = COUNTRY_CALLING_CODES[code] || "";
        const currency = CURRENCY_MAP[code] || { code: data.currency || "USD", symbol: "$" };
        setGeo({
          countryCode: code,
          countryName: name,
          callingCode,
          currency: currency.code,
          currencySymbol: currency.symbol,
        });
      })
      .catch(() => {
        // Silently fail; don't auto-fill if detection fails
      })
      .finally(() => setLoading(false));
  }, []);

  return { geo, loading };
}
