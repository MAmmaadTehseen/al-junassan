export const SITE_NAME = "Al Junassan";
export const SITE_DESCRIPTION =
  "Premium luxury jewelry brand offering elegant rings, necklaces, bracelets, and pendants for men and women across Pakistan.";
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://aljunassan.com";

export const SHIPPING_COST = 250;
export const FREE_SHIPPING_THRESHOLD = 15000;

export const CURRENCY = "PKR";

export const CONTACT = {
  phone: "+92 300 1234567",
  whatsapp: "923001234567",
  email: "info@aljunassan.com",
  address: "Lahore, Pakistan",
};

export const SOCIAL_LINKS = {
  instagram: "https://instagram.com/aljunassan",
  facebook: "https://facebook.com/aljunassan",
  tiktok: "https://tiktok.com/@aljunassan",
  snapchat: "https://snapchat.com/add/aljunassan",
};

export const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "Shop", href: "/shop" },
  { label: "Men", href: "/shop?gender=men" },
  { label: "Women", href: "/shop?gender=women" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

export const CATEGORIES = [
  "Rings",
  "Necklaces",
  "Bracelets",
  "Pendants",
  "Men Accessories",
];

export const ORDER_STATUSES = [
  { value: "pending", label: "Pending" },
  { value: "confirmed", label: "Confirmed" },
  { value: "shipped", label: "Shipped" },
  { value: "delivered", label: "Delivered" },
  { value: "cancelled", label: "Cancelled" },
] as const;
