import { STATUS } from '../../lib/constants';
import useStore from '../../store/useStore';

export default function StatsCards({ stats }) {
  const theme = useStore((s) => s.theme);
  const isDark = theme === 'dark';

  const cards = [
    {
      label: 'Total',
      value: stats.total,
      valueClass: isDark ? 'text-slate-100' : 'text-slate-900',
      bgClass: isDark ? 'bg-slate-800' : 'bg-slate-100',
    },
    {
      label: 'Free',
      value: stats.free,
      valueClass: 'text-green-600',
      bgClass: isDark ? 'bg-green-900/30' : 'bg-green-100',
      borderColor: isDark ? 'border-green-700' : 'border-green-300',
    },
    {
      label: 'Reserved',
      value: stats.reserved,
      valueClass: 'text-yellow-600',
      bgClass: isDark ? 'bg-yellow-900/30' : 'bg-yellow-100',
      borderColor: isDark ? 'border-yellow-700' : 'border-yellow-300',
    },
    {
      label: 'Occupied',
      value: stats.occupied,
      valueClass: 'text-red-600',
      bgClass: isDark ? 'bg-red-900/30' : 'bg-red-100',
      borderColor: isDark ? 'border-red-700' : 'border-red-300',
    },
  ];

  return (
    <section
      className={`rounded-2xl border-2 ${isDark ? 'border-slate-700 bg-[#242424]' : 'border-slate-900 bg-white'} p-5 shadow-[4px_4px_0px_0px_#0f172a]`}
    >
      <p
        className={`mb-5 type-eyebrow ${isDark ? 'text-slate-500' : 'text-slate-500'}`}
      >
        Overview
      </p>

      <div className="grid grid-cols-2 gap-4">
        {cards.map((card) => (
          <div
            key={card.label}
            className={`rounded-xl border-2 ${isDark ? 'border-slate-700' : 'border-slate-900'} ${card.bgClass} px-3 py-3`}
          >
            <p
              className={`mb-1 type-micro ${isDark ? 'text-slate-500' : 'text-slate-500'}`}
            >
              {card.label}
            </p>
            <p className={`type-stat ${card.valueClass}`}>{card.value}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
