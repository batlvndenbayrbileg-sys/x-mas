// X-MAS product photography. Every product ships as a transparent cutout at
// web/public/products/<handle>.png, so the catalogue reads as one set on the
// white canvas. Medusa carries the same path as each product's thumbnail; this
// helper is only the fallback for records that arrive without one.

export const productImg = (handleOrId: string) => `/products/${handleOrId}.png`;
