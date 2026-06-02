import { add_availability } from "@/redux/features/filter";
import { useAppDispatch, useAppSelector } from "@/redux/hook";

const availabilities = ["In Stock", "Out of stock", "Pre order"];

const AvailabilityFilter = () => {
  const { availability: stateAvailability } = useAppSelector((state) => state.filter);
  const dispatch = useAppDispatch();
  return (
    <div className="sidebar__widget mb-60">
      <div className="sidebar__widget-title mb-20">
        <h3>Availability</h3>
      </div>
      <div className="sidebar__widget-content">
        <div className="brand">
          <ul>
            {availabilities.map((av, i) => (
              <li key={i} onClick={() => dispatch(add_availability(av))} style={{ padding: "5px 0" }}>
                <a className="cursor-pointer" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <input
                    type="checkbox"
                    checked={stateAvailability.includes(av)}
                    onChange={() => {}}
                    style={{ cursor: 'pointer', margin: 0, width: '16px', height: '16px' }}
                  />
                  <span className={stateAvailability.includes(av) ? "active" : ""}>{av}</span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AvailabilityFilter;
