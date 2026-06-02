import { useAppDispatch, useAppSelector } from "@/redux/hook";
import { add_sizes } from "@/redux/features/filter";

// props
type IProps = {
  sizes: string[];
};

const SizeFilter = ({ sizes }: IProps) => {
  const { sizes: stateSizes } = useAppSelector((state) => state.filter);
  const dispatch = useAppDispatch();
  return (
    <div className="sidebar__widget mb-55">
      <div className="sidebar__widget-title mb-30">
        <h3>Any Size</h3>
      </div>
      <div className="sidebar__widget-content">
        <div className="size">
          <ul>
            {sizes.map((size, i) => (
              <li key={i}>
                <button
                  className={stateSizes.includes(size) ? "active" : ""}
                  onClick={() => dispatch(add_sizes(size))}
                >
                  {size}
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default SizeFilter;
