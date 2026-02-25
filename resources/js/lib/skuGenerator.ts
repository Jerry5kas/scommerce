/**
 * Auto-generate a product SKU from a product name.
 *
 * Strategy: take the first 4 uppercase letters of each word, join with hyphens.
 * e.g. "Country Butter" → "COUN-BUTT"
 *      "Fresh Curd"     → "FRES-CURD"
 *      "Cow Ghee"       → "COW-GHEE"
 */
export function generateProductSku(name: string): string {
    if (!name.trim()) return '';

    return name
        .trim()
        .toUpperCase()
        .split(/\s+/)
        .map((word) => word.replace(/[^A-Z0-9]/g, '').slice(0, 4))
        .filter(Boolean)
        .join('-');
}

/**
 * Auto-generate a variant SKU from the product SKU + variant label.
 *
 * e.g. productSku="COUN-BUTT", variantName="500g" → "COUN-BUTT-500G"
 *      productSku="COUN-BUTT", variantName="1 Kg"  → "COUN-BUTT-1KG"
 */
export function generateVariantSku(productSku: string, variantName: string): string {
    if (!variantName.trim()) return productSku;

    const suffix = variantName
        .trim()
        .toUpperCase()
        .replace(/[^A-Z0-9]/g, '');

    return productSku ? `${productSku}-${suffix}` : suffix;
}
