// src/pages/AdminAnalytics.jsx
import { useMemo } from 'react';
import useStore from '../store/useStore';
import { useActivityLogs } from '../hooks/useActivityLogs';
import { effectiveStatus, hourLabel } from '../utils/helpers';
import { STATUS } from '../lib/constants';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
  PieChart,
  Pie,
} from 'recharts';

export default function AdminAnalytics() {
  const rooms = useStore((s) => s.rooms);
  const theme = useStore((s) => s.theme);
  const logs = useActivityLogs(500);
  const isDark = theme === 'dark';

  const stats = useMemo(() => {
    const statusCount = rooms.reduce((acc, room) => {
      const status = effectiveStatus(room);
      acc[status] = (acc[status] || 0) + 1;
      return acc;
    }, {});

    const freeCount = statusCount[STATUS.FREE] || 0;
    const occupiedCount = statusCount[STATUS.OCCUPIED] || 0;
    const reservedCount = statusCount[STATUS.RESERVED] || 0;

    return {
      total: rooms.length,
      free: freeCount,
      occupied: occupiedCount,
      reserved: reservedCount,
      occupancyRate:
        rooms.length > 0 ? Math.round((occupiedCount / rooms.length) * 100) : 0,
    };
  }, [rooms]);

  const peakHoursData = useMemo(() => {
    const hourMap = new Map();

    logs.forEach((log) => {
      if (!log.timestamp) return;
      const hour = hourLabel(log.timestamp);
      const current = hourMap.get(hour) || 0;
      hourMap.set(hour, current + 1);
    });

    const blocks = [
      { label: '0-3', start: 0, end: 3, count: 0 },
      { label: '3-6', start: 3, end: 6, count: 0 },
      { label: '6-9', start: 6, end: 9, count: 0 },
      { label: '9-12', start: 9, end: 12, count: 0 },
      { label: '12-15', start: 12, end: 15, count: 0 },
      { label: '15-18', start: 15, end: 18, count: 0 },
      { label: '18-21', start: 18, end: 21, count: 0 },
      { label: '21-24', start: 21, end: 24, count: 0 },
    ];

    hourMap.forEach((count, hour) => {
      const hourNum = parseInt(hour.split(':')[0], 10);
      const block = blocks.find((b) => hourNum >= b.start && hourNum < b.end);
      if (block) block.count += count;
    });

    return blocks;
  }, [logs]);

  const usageByResourceData = useMemo(() => {
    return rooms
      .map((room) => {
        const roomLogs = logs.filter(
          (log) => (log.roomId || log.resourceId) === room.id
        );
        const occupiedCount = roomLogs.filter(
          (log) =>
            log.action === STATUS.OCCUPIED || log.newStatus === STATUS.OCCUPIED
        ).length;
        return {
          name:
            room.name.length > 15 ? room.name.slice(0, 15) + '...' : room.name,
          fullName: room.name,
          occupiedHours: occupiedCount,
        };
      })
      .sort((a, b) => b.occupiedHours - a.occupiedHours)
      .slice(0, 10);
  }, [rooms, logs]);

  const statusDistributionData = useMemo(
    () =>
      [
        { name: 'Free', value: stats.free, color: '#22c55e' },
        { name: 'Occupied', value: stats.occupied, color: '#ef4444' },
        { name: 'Reserved', value: stats.reserved, color: '#eab308' },
      ].filter((d) => d.value > 0),
    [stats]
  );

  const recentActivity = useMemo(() => {
    return logs.slice(0, 20);
  }, [logs]);

  const panelClass = `rounded-2xl border-2 ${
    isDark ? 'border-slate-700 bg-[#242424]' : 'border-slate-900 bg-white'
  } shadow-[4px_4px_0px_0px_#0f172a]`;

  if (rooms.length === 0) {
    return (
      <div className="space-y-6">
        <div className={`${panelClass} p-6`}>
          <h1
            className={`text-2xl font-black ${isDark ? 'text-slate-100' : 'text-slate-900'}`}
          >
            Analytics Dashboard
          </h1>
          <p
            className={`mt-1 font-mono text-xs uppercase tracking-widest ${isDark ? 'text-slate-500' : 'text-slate-500'}`}
          >
            Real-time insights into campus resource utilization
          </p>
        </div>

        <div
          className={`rounded-2xl border-2 border-dashed p-10 text-center ${isDark ? 'border-slate-600 bg-[#242424]' : 'border-slate-300 bg-white'}`}
        >
          <p
            className={`text-base font-semibold ${isDark ? 'text-slate-200' : 'text-slate-700'}`}
          >
            No analytics data available yet.
          </p>
          <p
            className={`mt-2 text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}
          >
            Add resources and start using the system to populate analytics.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className={`${panelClass} p-6`}>
        <h1
          className={`text-2xl font-black ${isDark ? 'text-slate-100' : 'text-slate-900'}`}
        >
          Analytics Dashboard
        </h1>
        <p
          className={`mt-1 font-mono text-xs uppercase tracking-widest ${isDark ? 'text-slate-500' : 'text-slate-500'}`}
        >
          Real-time insights into campus resource utilization
        </p>
      </div>

      {/* Top Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <div className={`${panelClass} p-4`}>
          <p
            className={`text-3xl font-black ${isDark ? 'text-slate-100' : 'text-slate-900'}`}
          >
            {stats.total}
          </p>
          <p
            className={`mt-1 font-mono text-xs uppercase ${isDark ? 'text-slate-500' : 'text-slate-500'}`}
          >
            Total Resources
          </p>
        </div>
        <div
          className={`rounded-2xl border-2 p-4 shadow-[4px_4px_0px_0px_#0f172a] ${isDark ? 'border-slate-700 bg-green-900/30' : 'border-slate-900 bg-green-100'}`}
        >
          <p
            className={`text-3xl font-black ${isDark ? 'text-green-300' : 'text-green-600'}`}
          >
            {stats.free}
          </p>
          <p
            className={`mt-1 font-mono text-xs uppercase ${isDark ? 'text-green-400' : 'text-green-700'}`}
          >
            Currently Free
          </p>
        </div>
        <div
          className={`rounded-2xl border-2 p-4 shadow-[4px_4px_0px_0px_#0f172a] ${isDark ? 'border-slate-700 bg-red-900/30' : 'border-slate-900 bg-red-100'}`}
        >
          <p
            className={`text-3xl font-black ${isDark ? 'text-red-300' : 'text-red-600'}`}
          >
            {stats.occupied}
          </p>
          <p
            className={`mt-1 font-mono text-xs uppercase ${isDark ? 'text-red-400' : 'text-red-700'}`}
          >
            Occupied
          </p>
        </div>
        <div
          className={`rounded-2xl border-2 p-4 shadow-[4px_4px_0px_0px_#0f172a] ${isDark ? 'border-slate-700 bg-yellow-900/30' : 'border-slate-900 bg-yellow-100'}`}
        >
          <p
            className={`text-3xl font-black ${isDark ? 'text-yellow-300' : 'text-yellow-600'}`}
          >
            {stats.reserved}
          </p>
          <p
            className={`mt-1 font-mono text-xs uppercase ${isDark ? 'text-yellow-400' : 'text-yellow-700'}`}
          >
            Reserved
          </p>
        </div>
        <div
          className={`rounded-2xl border-2 p-4 shadow-[4px_4px_0px_0px_#0f172a] ${isDark ? 'border-slate-700 bg-blue-900/30' : 'border-slate-900 bg-blue-100'}`}
        >
          <p
            className={`text-3xl font-black ${isDark ? 'text-blue-300' : 'text-blue-600'}`}
          >
            {stats.occupancyRate}%
          </p>
          <p
            className={`mt-1 font-mono text-xs uppercase ${isDark ? 'text-blue-400' : 'text-blue-700'}`}
          >
            Occupancy Rate
          </p>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Peak Hours */}
        <div className={`${panelClass} p-6`}>
          <h2
            className={`mb-4 font-mono text-xs font-bold uppercase tracking-widest ${isDark ? 'text-slate-500' : 'text-slate-500'}`}
          >
            Activity by Time of Day
          </h2>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={peakHoursData}>
              <XAxis
                dataKey="label"
                tick={{ fontSize: 11, fill: isDark ? '#94a3b8' : '#64748b' }}
                axisLine={{
                  stroke: isDark ? '#475569' : '#0f172a',
                  strokeWidth: 2,
                }}
              />
              <YAxis hide />
              <Tooltip
                contentStyle={{
                  borderRadius: 8,
                  border: isDark ? '2px solid #334155' : '2px solid #0f172a',
                  background: isDark ? '#1e293b' : '#ffffff',
                  color: isDark ? '#f1f5f9' : '#0f172a',
                }}
              />
              <Bar dataKey="count" fill="#f97316" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Status Distribution */}
        <div className={`${panelClass} p-6`}>
          <h2
            className={`mb-4 font-mono text-xs font-bold uppercase tracking-widest ${isDark ? 'text-slate-500' : 'text-slate-500'}`}
          >
            Status Distribution
          </h2>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={statusDistributionData}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={80}
                paddingAngle={2}
                dataKey="value"
                label={({ name, percent }) =>
                  `${name} ${(percent * 100).toFixed(0)}%`
                }
              >
                {statusDistributionData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  borderRadius: 8,
                  border: isDark ? '2px solid #334155' : '2px solid #0f172a',
                  background: isDark ? '#1e293b' : '#ffffff',
                  color: isDark ? '#f1f5f9' : '#0f172a',
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Usage by Resource */}
      <div className={`${panelClass} p-6`}>
        <h2
          className={`mb-4 font-mono text-xs font-bold uppercase tracking-widest ${isDark ? 'text-slate-500' : 'text-slate-500'}`}
        >
          Usage by Resource (Top 10)
        </h2>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={usageByResourceData} layout="vertical">
            <XAxis type="number" hide />
            <YAxis
              type="category"
              dataKey="name"
              width={90}
              tick={{ fontSize: 10, fill: isDark ? '#94a3b8' : '#64748b' }}
              axisLine={{
                stroke: isDark ? '#475569' : '#0f172a',
                strokeWidth: 2,
              }}
            />
            <Tooltip
              formatter={(value, name, props) => [value, 'Occupancy Events']}
              labelFormatter={(label) => props?.payload?.fullName || label}
              contentStyle={{
                borderRadius: 8,
                border: isDark ? '2px solid #334155' : '2px solid #0f172a',
                background: isDark ? '#1e293b' : '#ffffff',
                color: isDark ? '#f1f5f9' : '#0f172a',
              }}
            />
            <Bar dataKey="occupiedHours" fill="#6366f1" radius={[0, 4, 4, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Recent Activity */}
      <div
        className={`rounded-2xl border-2 ${isDark ? 'border-slate-700 bg-[#242424]' : 'border-slate-900 bg-white'}`}
      >
        <div
          className={`border-b-2 px-6 py-4 ${isDark ? 'border-slate-700 bg-slate-800' : 'border-slate-900 bg-slate-100'}`}
        >
          <h2
            className={`font-mono text-xs font-bold uppercase tracking-widest ${isDark ? 'text-slate-400' : 'text-slate-600'}`}
          >
            Recent Activity ({recentActivity.length})
          </h2>
        </div>
        {recentActivity.length === 0 ? (
          <div
            className={`px-6 py-10 text-center text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}
          >
            No activity captured yet.
          </div>
        ) : (
          <div className="max-h-72 overflow-y-auto overflow-x-auto">
            <table className="w-full min-w-[560px]">
              <thead className={isDark ? 'bg-slate-900/60' : 'bg-slate-50'}>
                <tr>
                  <th
                    className={`px-4 py-3 text-left font-mono text-[10px] uppercase sm:px-6 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}
                  >
                    Time
                  </th>
                  <th
                    className={`px-4 py-3 text-left font-mono text-[10px] uppercase sm:px-6 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}
                  >
                    Room
                  </th>
                  <th
                    className={`px-4 py-3 text-left font-mono text-[10px] uppercase sm:px-6 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}
                  >
                    Action
                  </th>
                  <th
                    className={`hidden px-4 py-3 text-left font-mono text-[10px] uppercase sm:table-cell sm:px-6 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}
                  >
                    By
                  </th>
                </tr>
              </thead>
              <tbody
                className={`divide-y ${isDark ? 'divide-slate-700' : 'divide-slate-200'}`}
              >
                {recentActivity.map((log, index) => (
                  <tr
                    key={log.id || `${log.timestamp?.seconds || 'na'}-${index}`}
                    className={
                      isDark ? 'hover:bg-slate-800/70' : 'hover:bg-slate-50'
                    }
                  >
                    <td
                      className={`whitespace-nowrap px-4 py-3 font-mono text-xs sm:px-6 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}
                    >
                      {log.timestamp?.toDate
                        ? new Date(log.timestamp.toDate()).toLocaleTimeString()
                        : '--'}
                    </td>
                    <td
                      className={`max-w-[150px] truncate whitespace-nowrap px-4 py-3 text-sm font-bold sm:max-w-none sm:px-6 ${isDark ? 'text-slate-100' : 'text-slate-900'}`}
                    >
                      {log.resourceName || log.roomId || 'Unknown'}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 sm:px-6">
                      <span
                        className={`inline-flex rounded-full px-2 py-0.5 text-xs font-bold uppercase ${
                          log.action === STATUS.OCCUPIED
                            ? isDark
                              ? 'bg-red-900/30 text-red-300'
                              : 'bg-red-100 text-red-600'
                            : log.action === STATUS.FREE
                              ? isDark
                                ? 'bg-green-900/30 text-green-300'
                                : 'bg-green-100 text-green-600'
                              : isDark
                                ? 'bg-yellow-900/30 text-yellow-300'
                                : 'bg-yellow-100 text-yellow-600'
                        }`}
                      >
                        {log.action || log.newStatus || 'unknown'}
                      </span>
                    </td>
                    <td
                      className={`hidden whitespace-nowrap px-4 py-3 font-mono text-xs sm:table-cell sm:px-6 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}
                    >
                      {log.changedByName ||
                        log.userId?.slice(0, 8) ||
                        log.changedBy?.slice(0, 8) ||
                        'System'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
