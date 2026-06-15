import type { Residence } from './data';
import type { Filters } from '@/components/FiltersPanel';

export function applyFilters(
  residences: Residence[],
  filters: Filters,
  queryStr: string
): Residence[] {
  let out = residences.slice();

  if (filters.beds.length) {
    out = out.filter((r) =>
      r.bedroomOptions.some(
        (b) =>
          filters.beds.includes(b === 3 ? 3 : b) ||
          (b >= 3 && filters.beds.includes(3))
      )
    );
  }
  out = out.filter(
    (r) => r.priceFrom >= filters.priceMin && r.priceFrom <= filters.priceMax
  );
  if (filters.availability !== 'any') {
    out = out.filter((r) => r.availability === filters.availability);
  }
  if (filters.amenities.length) {
    out = out.filter((r) =>
      filters.amenities.every((a) =>
        r.amenities.some((x) => x.toLowerCase().includes(a.toLowerCase()))
      )
    );
  }
  if (queryStr) {
    const q = queryStr.toLowerCase();
    out = out.filter(
      (r) =>
        r.name.toLowerCase().includes(q) ||
        r.cityLabel.toLowerCase().includes(q) ||
        r.address.toLowerCase().includes(q)
    );
  }
  switch (filters.sort) {
    case 'price-asc':
      out.sort((a, b) => a.priceFrom - b.priceFrom);
      break;
    case 'price-desc':
      out.sort((a, b) => b.priceFrom - a.priceFrom);
      break;
    case 'bedrooms':
      out.sort(
        (a, b) => Math.max(...a.bedroomOptions) - Math.max(...b.bedroomOptions)
      );
      break;
    case 'name':
    default:
      out.sort((a, b) => a.name.localeCompare(b.name));
      break;
  }
  return out;
}
