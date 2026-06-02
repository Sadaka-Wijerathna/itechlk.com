import InputRange from "@/ui/input-range";
import { maxPrice } from "@/utils/utils";
import { useAppDispatch, useAppSelector } from "@/redux/hook";
import { set_price_value } from "@/redux/features/filter";

const PriceFilter = () => {
  const {priceValue} = useAppSelector(state => state.filter);
  const dispatch = useAppDispatch();
  // handleChanges
  const handleChanges = (val: number[]) => {
    dispatch(set_price_value(val));
  };
  return (
    <div className="sidebar__widget mb-55">
      <div className="sidebar__widget-title mb-30">
        <h3>Filter By Price</h3>
      </div>
      <div className="sidebar__widget-content">
        <div className="price__slider">
          <div className="mb-25">
            <InputRange
              MAX={maxPrice()}
              MIN={0}
              STEP={1}
              values={priceValue}
              handleChanges={handleChanges}
            />
          </div>
          <div>
            <button type="submit">Filter</button>
            <label htmlFor="amount">Price :</label>
            <span className="input-range">
              ${ priceValue[0] } - ${ priceValue[1] }
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PriceFilter;
