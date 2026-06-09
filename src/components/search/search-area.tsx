"use client";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { IProduct } from "@/types/product-d-t";
import ShopArea from "../shop/shop-area";

// prop type
type IProps = {
  product_data: IProduct[];
};

const SearchArea = ({ product_data }: IProps) => {
  const [productItems, setProductItems] = useState<IProduct[]>([
    ...product_data,
  ]);
  const searchParams = useSearchParams();
  const category = searchParams.get("category");
  const searchText = searchParams.get("searchText");

  useEffect(() => {
    const categoryMatch = (item: IProduct) => {
      return (
        !category || item.category.toLowerCase().includes(category.toLowerCase())
      );
    };

    const titleMatch = (item: IProduct) => {
      return (
        !searchText || item.title.toLowerCase().includes(searchText.toLowerCase())
      );
    };

    setProductItems(
      product_data.filter((item) => categoryMatch(item) && titleMatch(item))
    );
  }, [category, searchText, product_data]);

  return (
    <>
      <ShopArea
        shop_col="col-xl-3 col-lg-3 col-md-6 col-sm-6 custom-col-10"
        product_data={productItems}
      />
    </>
  );
};

export default SearchArea;
