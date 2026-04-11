import { useMemo } from 'react';
import useStore from '../store/useStore';
import { timeAgo } from '../utils/helpers';
import { useActivityLogs } from '../hooks/useActivityLogs';
import { STATUS } from '../lib/constants';

const badgeClass = {
  [STATUS.OCCUPIED]: 'bg-red-900/30 text-red-400 border-2 border-red-700',
  [STATUS.FREE]: 'bg-green-900/30 text-green-400 border-2 border-green-700',
  [STATUS.RESERVED]:
    'bg-yellow-900/30 text-yellow-400 border-2 border-yellow-700',
};

const badgeLabel = {
  [STATUS.OCCUPIED]: '✕ Occupied',
  [STATUS.FREE]: '✓ Free',
  [STATUS.RESERVED]: '⏱ Reserved',
};

export default function ActivityFeed({
  maxRows = 30,
  title = 'Live Activity',
}) {
  const rooms = useStore((s) => s.rooms);
  const theme = useStore((s) => s.theme);
  const isDark = theme === 'dark';
  const logs = useActivityLogs(maxRows);

  const roomMap = useMemo(
    () => new Map(rooms.map((room) => [room.id, room.name])),
    [rooms]
  );

  return (
    <div
      className={`rounded-2xl border-2 ${isDark ? 'border-slate-700 bg-[#242424]' : 'border-slate-900 bg-white'} p-4 shadow-[4px_4px_0px_0px_#0f172a]`}
    >
      <div className="mb-4 flex items-center justify-between">
        <h2
          className={`type-eyebrow ${isDark ? 'text-slate-500' : 'text-slate-500'}`}
        >
          {title}
        </h2>
        <span
          className={`type-caption ${isDark ? 'text-slate-500' : 'text-slate-400'}`}
        >
          {logs.length} events
        </span>
      </div>

      <div
        className="max-h-[360px] space-y-3 overflow-auto pr-1"
        role="status"
        aria-live="polite"
      >
        {logs.length === 0 && (
          <div
            className={`rounded-xl border-2 border-dashed ${isDark ? 'border-slate-600 bg-slate-800/50' : 'border-slate-300 bg-slate-50'} px-3 py-8 text-center`}
          >
            <svg
              viewBox="0 0 24 24"
              className={`mx-auto mb-2 h-9 w-9 ${isDark ? 'text-slate-600' : 'text-slate-400'}`}
              fill="none"
            >
              <path
                d="M4 12h16M12 4v16"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
              />
              <circle
                cx="12"
                cy="12"
                r="9"
                stroke="currentColor"
                strokeWidth="1.4"
                opacity="0.5"
              />
            </svg>
            <p
              className={`font-mono text-sm ${isDark ? 'text-slate-500' : 'text-slate-500'}`}
            >
              No activity yet
            </p>
            <p
              className={`mt-1 text-xs ${isDark ? 'text-slate-600' : 'text-slate-400'}`}
            >
              Updates will appear as room statuses change.
            </p>
          </div>
        )}

        {logs.map((log) => (
          <div
            key={log.id}
            className={`rounded-xl border-2 ${isDark ? 'border-slate-700 bg-slate-800/50 hover:border-slate-600' : 'border-slate-200 bg-slate-50 hover:border-slate-900'} px-3 py-2 transition-all duration-200`}
          >
            <div className="flex items-center justify-between gap-2">
              <p
                className={`truncate type-heading-md ${isDark ? 'text-slate-200' : 'text-slate-900'}`}
              >
                {roomMap.get(log.roomId) || 'Unknown room'}
              </p>
              <span
                className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase ${badgeClass[log.action] || `bg-slate-700 text-slate-400 border-2 border-slate-600`}`}
              >
                {badgeLabel[log.action] || `• ${log.action}`}
              </span>
            </div>
            {log.note && (
              <p
                className={`mt-1 line-clamp-2 type-caption ${isDark ? 'text-slate-500' : 'text-slate-500'}`}
              >
                {log.note}
              </p>
            )}
            <p
              className={`mt-1 type-micro ${isDark ? 'text-slate-600' : 'text-slate-400'}`}
            >
              {timeAgo(log.timestamp)}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
