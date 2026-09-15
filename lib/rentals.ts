import { productsByCategory } from "./products";
import type { RentalRates } from "./rental-quote";

// Weekly and monthly rental terms live as separate SKUs in the catalog; this
// pairs them back into one entry per physical device for the quote calculator
// and booking form. Prices come straight from the SKUs — a device whose terms
// are priced by phone (e.g. the Inogen Rove models) carries nulls.
function deriveRentalDevices(): RentalRates[] {
  const devices: RentalRates[] = [];
  for (const category of ["oxygen-rental", "cpap-rental"] as const) {
    const products = productsByCategory(category);
    for (const weekly of products) {
      if (!weekly.slug.endsWith("-weekly-rental")) continue;
      const key = weekly.slug.replace(/-weekly-rental$/, "");
      const monthly = products.find((p) => p.slug === `${key}-monthly-rental`);
      devices.push({
        key,
        name: weekly.name.replace(/ - Weekly Rental$/, ""),
        brand: weekly.brand,
        kind: category === "oxygen-rental" ? "oxygen" : "cpap",
        weeklyPrice: weekly.price,
        monthlyPrice: monthly?.price ?? null,
      });
    }
  }
  return devices;
}

export const RENTAL_DEVICES: RentalRates[] = deriveRentalDevices();

export function getRentalDevice(key: string): RentalRates | undefined {
  return RENTAL_DEVICES.find((d) => d.key === key);
}

/** Maps a rental SKU slug back to its device key for the quote calculator. */
export function rentalDeviceKey(slug: string): string {
  return slug.replace(/-(weekly|monthly)-rental$/, "");
}
