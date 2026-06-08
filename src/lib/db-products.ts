import prisma from "@/lib/prisma";
import { IProduct } from "@/types/product-d-t";

export async function getDbProducts(): Promise<IProduct[]> {
  const products = await prisma.product.findMany({
    where: { active: true },
    orderBy: { createdAt: "desc" },
    include: {
      reviews: {
        include: {
          user: true
        }
      }
    }
  } as any);

  return products.map((p) => ({
    id: p.id as any, // casting to any since IProduct expects number but we have string
    img: p.img,
    thumb_img: p.thumbImg,
    big_img: p.img, // fallback
    banner_img: p.img,
    related_images: p.relatedImages,
    title: p.title,
    parentCategory: p.parentCategory,
    category: p.category,
    brand: p.brand,
    price: p.price,
    old_price: p.oldPrice || 0,
    discount: p.discount || 0,
    rating: p.rating,
    quantity: (p as any).quantity,
    sm_desc: p.smDesc,
    sizes: p.sizes,
    colors: p.colors,
    weight: p.weight || 0,
    dimension: p.dimension || "",
    status: p.status,       // "Active" | "Out of Stock" | "Pre Order"
    trending: p.trending,
    topRated: p.topRated,
    bestSeller: p.bestSeller,
    new: p.isNew,
    durationPrices: p.durationPrices as any,
    details: {
      details_text: p.detailsText,
      details_list: p.detailsList,
      details_text_2: p.detailsText2,
    },
    // @ts-ignore: Next.js dev server locks prisma generation, bypass type checking for mapping
    reviews: ((p.reviews || []) as any[]).map((r: any) => ({
      id: r.id,
      userId: r.userId,
      img: r.user?.image || "/assets/img/icon/avatar.jpg",
      name: r.user?.name || r.user?.firstName || "Anonymous",
      time: r.createdAt ? new Date(r.createdAt).toLocaleDateString() : "Just now",
      rating: r.rating,
      review_desc: r.comment
    })),
  }));
}

