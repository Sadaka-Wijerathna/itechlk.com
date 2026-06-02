import PriceFilter from "./filter/price-filter";
import ColorFilter from "./filter/color-filter";
import AvailabilityFilter from "./filter/availability-filter";
import { IProduct } from "@/types/product-d-t";

// prop type
type IProps = {
  feature_products: IProduct[];
  brands: string[];
  colors: string[];
  sizes: string[];
};

const ShopSidebar = ({
  feature_products,
  brands,
  colors,
  sizes,
}: IProps) => {
  return (
    <div className="shop__sidebar">
      <PriceFilter />
      <AvailabilityFilter />
      <ColorFilter />
    </div>
  );
};

export default ShopSidebar;
