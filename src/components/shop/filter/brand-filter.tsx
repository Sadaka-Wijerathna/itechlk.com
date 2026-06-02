import { add_brand, reset } from "@/redux/features/filter";
import { useAppDispatch, useAppSelector } from "@/redux/hook";

type IProps = {
  brands: string[];
};

const BrandFilter = ({ brands }: IProps) => {
  const { brand: stateBrand } = useAppSelector((state) => state.filter);
  const dispatch = useAppDispatch();
  return (
    <div className="sidebar__widget mb-50">
      <div className="sidebar__widget-title mb-25">
        <h3>Brand</h3>
      </div>
      <div className="sidebar__widget-content">
        <div className="brand">
          <ul>
            {brands.map((b, i) => (
              <li key={i} onClick={() => dispatch(add_brand(b))}>
                <a className={`cursor-pointer ${stateBrand === b ? "active" : ""}`}>
                  {b}
                </a>
              </li>
            ))}
          </ul>
        </div>
        <div className="price__slider mt-20">
          <button type="button" onClick={()=> dispatch(reset())}>Reset Filter</button>
        </div>
      </div>
    </div>
  );
};

export default BrandFilter;
