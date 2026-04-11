import { STATUS } from '../lib/constants';
import useStore from '../store/useStore';

export default function Filters({
  search,
  onSearch,
  availability,
  onAvailability,
  roomType,
  onRoomType,
  minCapacity,
  onMinCapacity,
  typeOptions,
  equipment,
  onEquipment,
  equipmentOptions,
}) {
  const theme = useStore((s) => s.theme);
  const isDark = theme === 'dark';

  const handleReset = () => {
    onSearch('');
    onAvailability('all');
    onRoomType('all');
    onMinCapacity(0);
    if (onEquipment) onEquipment('all');
  };

  const inputClass = 'ui-field pl-9 pr-3';
  const selectClass = 'ui-field';

  return (
    <div>
      <div className="mb-5 flex items-center justify-between gap-3">
        <h2
          className={`type-eyebrow ${isDark ? 'text-slate-500' : 'text-slate-500'}`}
        >
          Smart Filters
        </h2>
        <button type="button" onClick={handleReset} className="ui-btn-subtle">
          Reset
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5">
        <div className="relative">
          <svg
            viewBox="0 0 24 24"
            className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-slate-400"
            fill="none"
          >
            <circle
              cx="11"
              cy="11"
              r="6"
              stroke="currentColor"
              strokeWidth="1.7"
            />
            <path
              d="M16 16l4 4"
              stroke="currentColor"
              strokeWidth="1.7"
              strokeLinecap="round"
            />
          </svg>
          <input
            value={search}
            onChange={(e) => onSearch(e.target.value)}
            placeholder="Search by room name"
            className={inputClass}
          />
        </div>

        <select
          value={availability}
          onChange={(e) => onAvailability(e.target.value)}
          className={selectClass}
        >
          <option value="all">All availability</option>
          <option value={STATUS.FREE}>Free</option>
          <option value={STATUS.RESERVED}>Reserved</option>
          <option value={STATUS.OCCUPIED}>Occupied</option>
        </select>

        <select
          value={roomType}
          onChange={(e) => onRoomType(e.target.value)}
          className={selectClass}
        >
          <option value="all">All room types</option>
          {typeOptions.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>

        <select
          value={equipment}
          onChange={(e) => onEquipment(e.target.value)}
          className={selectClass}
        >
          <option value="all">All equipment</option>
          {equipmentOptions.map((eq) => (
            <option key={eq} value={eq}>
              {eq}
            </option>
          ))}
        </select>

        <input
          type="number"
          min="0"
          value={minCapacity}
          onChange={(e) => onMinCapacity(Number(e.target.value) || 0)}
          placeholder="Min capacity"
          className={inputClass}
        />
      </div>
    </div>
  );
}
