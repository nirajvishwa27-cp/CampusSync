import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useStore from '../store/useStore';
import { effectiveStatus } from '../utils/helpers';
import { STATUS } from '../lib/constants';

export default function FloorPlanView() {
  const navigate = useNavigate();
  const rooms = useStore((s) => s.rooms);
  const theme = useStore((s) => s.theme);
  const [selectedBuilding, setSelectedBuilding] = useState('all');
  const [selectedFloor, setSelectedFloor] = useState('all');

  const isDark = theme === 'dark';

  const buildings = useMemo(() => {
    return [...new Set(rooms.map((r) => r.building).filter(Boolean))];
  }, [rooms]);

  const floors = useMemo(() => {
    return [...new Set(rooms.map((r) => String(r.floor)).filter(Boolean))].sort(
      (a, b) => a.localeCompare(b, undefined, { numeric: true })
    );
  }, [rooms]);

  const filteredRooms = useMemo(() => {
    return rooms.filter((r) => {
      const matchBuilding =
        selectedBuilding === 'all' || r.building === selectedBuilding;
      const matchFloor =
        selectedFloor === 'all' || String(r.floor) === selectedFloor;
      return matchBuilding && matchFloor;
    });
  }, [rooms, selectedBuilding, selectedFloor]);

  const getStatusDot = (room) => {
    const status = effectiveStatus(room);
    if (status === STATUS.FREE) return 'bg-green-400';
    if (status === STATUS.RESERVED) return 'bg-yellow-400';
    return 'bg-red-400';
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1
          className="text-2xl font-black"
          style={{ color: isDark ? '#f0e7dc' : '#201a15' }}
        >
          Floor Plan
        </h1>
        <button
          onClick={() => navigate('/dashboard')}
          className={`text-sm font-semibold hover:underline ${
            isDark ? 'text-blue-300' : 'text-blue-600'
          }`}
        >
          ← Back to List
        </button>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <select
          value={selectedBuilding}
          onChange={(e) => setSelectedBuilding(e.target.value)}
          className={`min-h-11 rounded-xl border-2 px-4 py-2.5 font-bold ${
            isDark
              ? 'border-slate-700 bg-slate-800 text-slate-200'
              : 'border-slate-900 bg-white text-slate-900'
          }`}
        >
          <option value="all">All Buildings</option>
          {buildings.map((b) => (
            <option key={b} value={b}>
              {b}
            </option>
          ))}
        </select>

        <select
          value={selectedFloor}
          onChange={(e) => setSelectedFloor(e.target.value)}
          className={`min-h-11 rounded-xl border-2 px-4 py-2.5 font-bold ${
            isDark
              ? 'border-slate-700 bg-slate-800 text-slate-200'
              : 'border-slate-900 bg-white text-slate-900'
          }`}
        >
          <option value="all">All Floors</option>
          {floors.map((f) => (
            <option key={f} value={f}>
              Floor {f}
            </option>
          ))}
        </select>
      </div>

      <div
        className="rounded-2xl border-2 p-6"
        style={{
          borderColor: isDark ? '#e2e8f0' : '#0f172a',
          background: isDark ? '#1a1a1a' : '#fdfbf7',
        }}
      >
        <div className="mb-4 flex flex-wrap gap-2 text-sm font-bold sm:gap-4">
          <div className="flex items-center gap-2">
            <span className="h-4 w-4 rounded-full bg-green-400" />
            <span style={{ color: isDark ? '#a0a0a0' : '#625041' }}>Free</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="h-4 w-4 rounded-full bg-yellow-400" />
            <span style={{ color: isDark ? '#a0a0a0' : '#625041' }}>
              Reserved
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="h-4 w-4 rounded-full bg-red-400" />
            <span style={{ color: isDark ? '#a0a0a0' : '#625041' }}>
              Occupied
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
          {filteredRooms.map((room) => {
            const status = effectiveStatus(room);
            const isFree = status === STATUS.FREE;
            const isReserved = status === STATUS.RESERVED;

            return (
              <button
                key={room.id}
                onClick={() => navigate(`/room/${room.id}`)}
                className={`group relative flex flex-col items-center justify-center rounded-xl border-2 p-2 py-3 transition-all hover:-translate-y-1 sm:p-3 sm:py-4 ${
                  isDark ? 'border-slate-700' : 'border-slate-900'
                }`}
                style={{
                  background: isDark ? '#242424' : '#ffffff',
                }}
              >
                <span
                  className={`absolute right-2 top-2 h-3 w-3 rounded-full ${getStatusDot(room)} ${
                    isFree ? 'animate-pulse' : ''
                  }`}
                />
                <span
                  className="text-xs font-bold uppercase tracking-wider"
                  style={{ color: isDark ? '#808080' : '#836c58' }}
                >
                  {room.type || 'room'}
                </span>
                <span
                  className="text-lg font-black"
                  style={{ color: isDark ? '#f0e7dc' : '#201a15' }}
                >
                  {room.name}
                </span>
                <span
                  className="text-xs font-bold"
                  style={{ color: isDark ? '#a0a0a0' : '#625041' }}
                >
                  Cap {room.capacity || 0}
                </span>
              </button>
            );
          })}
        </div>

        {filteredRooms.length === 0 && (
          <div className="py-12 text-center">
            <p
              className="text-lg font-medium"
              style={{ color: isDark ? '#a0a0a0' : '#625041' }}
            >
              No rooms found for selected filters
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
