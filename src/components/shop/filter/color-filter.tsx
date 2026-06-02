import { add_sub_category } from "@/redux/features/filter";
import { useAppDispatch, useAppSelector } from "@/redux/hook";

const categories = ["AI Tools", "Creative & Editing", "Work & OS", "Streaming", "VPNs", "Adults"];

const ColorFilter = () => {
  const { subCategory: stateCategory } = useAppSelector((state) => state.filter);
  const dispatch = useAppDispatch();
  return (
    <div className="sidebar__widget mb-60">
      <div className="sidebar__widget-title mb-20">
        <h3>Choose Category</h3>
      </div>
      <div className="sidebar__widget-content">
        <div className="brand">
          <ul>
            {categories.map((cat, i) => (
              <li key={i} onClick={() => dispatch(add_sub_category(cat))} style={{ padding: "5px 0" }}>
                <a className="cursor-pointer" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <input
                    type="checkbox"
                    checked={stateCategory === cat}
                    onChange={() => {}}
                    style={{ cursor: 'pointer', margin: 0, width: '16px', height: '16px' }}
                  />
                  <span className={stateCategory === cat ? "active" : ""}>{cat}</span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ColorFilter;
