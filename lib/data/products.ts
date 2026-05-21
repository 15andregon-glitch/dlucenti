import type { Product } from "@/lib/types";

export const products: Product[] = [
  {
    id: "1",
    slug: "lumiere-ring",
    name: "Lumière Ring",
    subtitle: "18K yellow gold · diamond",
    description:
      "A single line of light captured in gold — architectural, weightless, eternal.",
    materials:
      "18K yellow gold, brilliant-cut diamond. Hand-finished in our Paris atelier. Nickel-free, hallmarked.",
    price: 4200,
    currency: "EUR",
    category: "rings",
    targetGender: "women",
    collectionSlug: "lumiere",
    images: [
      "/products/necklace-2.jpg",
      "/products/earrings-1.jpg",
      "/products/necklace-1.jpg",
    ],
    featured: true,
    isNew: true,
    stock: 5,
  },
  {
    id: "2",
    slug: "noir-pendant",
    name: "Noir Pendant",
    subtitle: "Platinum · onyx",
    description:
      "Sculpted darkness suspended on a whisper of chain — pure Saint Laurent restraint.",
    materials:
      "Platinum 950, polished onyx. Adjustable chain length. Complimentary atelier sizing.",
    price: 6800,
    currency: "EUR",
    category: "necklaces",
    targetGender: "unisex",
    collectionSlug: "noir",
    images: [
      "/products/necklace-1.jpg",
      "/products/necklace-2.jpg",
      "/products/earrings-1.jpg",
    ],
    featured: true,
    stock: 5,
  },
  {
    id: "3",
    slug: "arc-ear-cuff",
    name: "Arc Ear Cuff",
    subtitle: "18K white gold",
    description:
      "An arc of metal that follows the ear's natural geometry — Jacquemus clarity.",
    materials:
      "18K white gold, high-polish finish. Sold individually. Designed for pierced and non-pierced wear.",
    price: 2900,
    currency: "EUR",
    category: "earrings",
    targetGender: "women",
    collectionSlug: "arc",
    images: [
      "/products/earrings-1.jpg",
      "/products/necklace-1.jpg",
      "/products/necklace-2.jpg",
    ],
    featured: true,
    stock: 5,
  },
  {
    id: "4",
    slug: "woven-bracelet",
    name: "Woven Bracelet",
    subtitle: "18K rose gold",
    description:
      "Intrecciato-inspired weave in precious metal — tactile, quiet, unmistakable.",
    materials:
      "18K rose gold, hand-woven links. Concealed clasp. Available in two lengths.",
    price: 5100,
    currency: "EUR",
    category: "bracelets",
    targetGender: "men",
    collectionSlug: "woven",
    images: [
      "/products/necklace-2.jpg",
      "/products/earrings-1.jpg",
      "/products/necklace-1.jpg",
    ],
    stock: 5,
  },
];
