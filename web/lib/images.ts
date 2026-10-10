// X-MAS product photography. Every product ships as a transparent cutout at
// web/public/products/<handle>.webp — WebP keeps the alpha channel at roughly a
// tenth of the PNG weight, which matters because the shop renders the whole
// filtered set at once. Medusa carries the same path as each product's
// thumbnail; this helper is only the fallback for records that arrive without one.

export const productImg = (handleOrId: string) => `/products/${handleOrId}.webp`;
