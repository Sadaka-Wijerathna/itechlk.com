import InputRange from "@/ui/input-range";
import { useAppDispatch, useAppSelector } from "@/redux/hook";
import { set_price_value } from "@/redux/features/filter";
import { useCurrency } from "@/context/CurrencyContext";

const PriceFilter = () => {
  const { priceValue, maxPrice } = useAppSelector(state => state.filter);
  const { symbol, rate } = useCurrency();
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
              MAX={maxPrice}
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
              {symbol}{Math.round(priceValue[0] * rate).toLocaleString()} - {symbol}{Math.round(priceValue[1] * rate).toLocaleString()}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PriceFilter;
