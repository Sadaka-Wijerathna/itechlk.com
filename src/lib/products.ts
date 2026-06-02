// Products DB helper functions for server components
import prisma from "@/lib/prisma";

export async function getAllProducts() {
  return prisma.product.findMany({
    where: { active: true },
    orderBy: { createdAt: "desc" },
  });
}

export async function getProductById(id: string) {
  return prisma.product.findUnique({ where: { id } });
}

export async function getTrendingProducts(limit = 8) {
  return prisma.product.findMany({
    where: { trending: true, active: true },
    take: limit,
    orderBy: { createdAt: "desc" },
  });
}

// Convert a DB product to the IProduct shape the existing components expect
export function dbProductToIProduct(p: any, index: number) {
  return {
    id: index + 1,            // numeric id for existing redux/pagination compat
    _id: p.id,                // raw MongoDB id for detail pages
    img: p.img,
    thumb_img: p.thumbImg,
    related_images: p.relatedImages,
    parentCategory: p.parentCategory,
    category: p.category,
    brand: p.brand,
    title: p.title,
    price: p.price,
    old_price: p.oldPrice ?? undefined,
    discount: p.discount ?? undefined,
    rating: p.rating,
    quantity: p.quantity,
    sm_desc: p.smDesc,
    sizes: p.sizes,
    colors: p.colors,
    weight: p.weight ?? 0,
    dimension: p.dimension ?? "Digital Delivery",
    trending: p.trending,
    topRated: p.topRated,
    bestSeller: p.bestSeller,
    new: p.isNew,
    details: {
      details_text: p.detailsText,
      details_list: p.detailsList,
      details_text_2: p.detailsText2,
    },
    reviews: [
      {
        img: "/assets/img/blog/comments/avater-1.png",
        name: "Verified Buyer",
        time: "1 Month Ago",
        rating: 5,
        review_desc: "Excellent service and instant delivery. Highly recommended!",
      },
    ],
  };
}
