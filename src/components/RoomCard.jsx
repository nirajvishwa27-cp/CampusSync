// src/components/RoomCard.jsx
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import {
  canManageRoom,
  effectiveStatus,
  isReservationActive,
  timeAgo,
  timeUntil,
} from '../utils/helpers';
import useStore from '../store/useStore';
import { toggleRoomStatus, addLog } from '../firebase/rooms';
import toast from 'react-hot-toast';
import { STATUS } from '../lib/constants';
import QRModal from './QRModal';

export default function RoomCard({ room, showToggle = false }) {
  const navigate = useNavigate();
  const authUser = useStore((s) => s.authUser);
  const theme = useStore((s) => s.theme);
  const isDark = theme === 'dark';
  const [showQR, setShowQR] = useState(false);

  const status = effectiveStatus(room);
  const isFree = status === STATUS.FREE;
  const isReserved = status === STATUS.RESERVED;
  const canManage = canManageRoom(authUser, room.id);

  const handleToggle = async (e) => {
    e.stopPropagation();
    if (!canManage) return;
    try {
      await toggleRoomStatus({ ...room, status }, authUser.uid);
      await addLog(
        room.id,
        authUser.uid,
        isFree ? STATUS.OCCUPIED : STATUS.FREE,
        room.note || ''
      );
      toast.success(
        `${room.name} marked as ${isFree ? STATUS.OCCUPIED : STATUS.FREE}`
      );
    } catch (error) {
      console.error('Failed to toggle room from card', error);
      toast.error(error?.message || 'Failed to update room status.');
    }
  };

  const statusColor = isFree
    ? 'bg-green-400'
    : isReserved
      ? 'bg-yellow-400'
      : 'bg-red-400';
  const statusTextColor = isFree
    ? isDark
      ? 'text-green-300'
      : 'text-green-600'
    : isReserved
      ? isDark
        ? 'text-yellow-300'
        : 'text-yellow-600'
      : isDark
        ? 'text-red-300'
        : 'text-red-600';
  const statusBg = isFree
    ? isDark
      ? 'bg-green-900/30'
      : 'bg-green-100'
    : isReserved
      ? isDark
        ? 'bg-yellow-900/30'
        : 'bg-yellow-100'
      : isDark
        ? 'bg-red-900/30'
        : 'bg-red-100';

  return (
    <article
      onClick={() => navigate(`/room/${room.id}`)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          navigate(`/room/${room.id}`);
        }
      }}
      role="button"
      tabIndex={0}
      className={`group relative cursor-pointer rounded-2xl border-2 ${isDark ? 'border-slate-700 bg-[#242424]' : 'border-slate-900 bg-white'} p-4 transition-all duration-200 hover:-translate-y-1`}
      style={{ boxShadow: `4px 4px 0px 0px var(--shadow-color)` }}
    >
      {/* Status pill */}
      <span
        className={`absolute right-4 top-4 inline-flex items-center gap-1.5 rounded-full border-2 ${isDark ? 'border-slate-600' : 'border-slate-900'} px-2.5 py-1 text-xs font-bold uppercase ${statusBg} ${statusTextColor}`}
      >
        <span
          className={`h-2 w-2 rounded-full ${statusColor} ${isFree ? 'animate-pulse' : ''}`}
        />
        {isFree ? 'Free' : isReserved ? 'Reserved' : 'Occupied'}
      </span>

      <p
        className={`mb-1 font-mono text-[10px] uppercase tracking-widest ${isDark ? 'text-slate-500' : 'text-slate-400'}`}
      >
        Room
      </p>
      <h3
        className={`pr-20 text-lg font-black leading-tight ${isDark ? 'text-slate-100' : 'text-slate-900'}`}
      >
        {room.name}
      </h3>

      <div className="mt-3 flex flex-wrap gap-2">
        <span
          className={`rounded-lg border-2 ${isDark ? 'border-slate-600 bg-slate-800 text-slate-400' : 'border-slate-900 bg-slate-100 text-slate-600'} px-2 py-0.5 text-[10px] font-bold uppercase`}
        >
          {room.type || 'classroom'}
        </span>
        <span
          className={`rounded-lg border-2 ${isDark ? 'border-yellow-700 bg-yellow-900/30 text-yellow-400' : 'border-slate-900 bg-yellow-100 text-yellow-700'} px-2 py-0.5 text-[10px] font-bold uppercase`}
        >
          Cap {room.capacity || 0}
        </span>
      </div>

      <p
        className={`mt-3 font-mono text-xs ${isDark ? 'text-slate-500' : 'text-slate-500'}`}
      >
        {[
          room.building || 'Building N/A',
          room.floor ? `Floor ${room.floor}` : 'Floor N/A',
        ].join(' • ')}
      </p>

      <div
        className={`mt-4 border-t-2 ${isDark ? 'border-slate-700' : 'border-slate-900'} pt-3`}
      >
        {room.note && (
          <p
            className={`mb-2 rounded-lg border ${isDark ? 'border-slate-600 bg-slate-800 text-slate-400' : 'border-slate-300 bg-slate-50 text-slate-600'} px-2 py-1 text-xs font-medium`}
          >
            {room.note}
          </p>
        )}
        <p
          className={`font-mono text-[10px] uppercase ${isDark ? 'text-slate-600' : 'text-slate-400'}`}
        >
          Updated {timeAgo(room.updatedAt)}
        </p>
        {isReservationActive(room) && room.reservedUntil && (
          <p className="mt-1 font-bold text-yellow-600">
            Reserved for {timeUntil(room.reservedUntil)}
          </p>
        )}
      </div>

      {showToggle && canManage && (
        <div className="mt-4 flex gap-2">
          <button
            onClick={() => setShowQR(true)}
            className="flex-1 rounded-xl border-2 border-slate-900 bg-yellow-400 py-2 text-sm font-bold transition-all duration-200 hover:bg-yellow-300 active:scale-95"
          >
            QR
          </button>
          <button
            onClick={handleToggle}
            className={`flex-1 rounded-xl border-2 border-slate-900 py-2 text-sm font-bold transition-all duration-200 active:scale-95 ${
              isFree || isReserved
                ? 'bg-red-500 text-white hover:bg-red-600'
                : 'bg-green-500 text-white hover:bg-green-600'
            }`}
          >
            {isFree || isReserved ? 'Occupy' : 'Free'}
          </button>
        </div>
      )}

      {showQR && <QRModal room={room} onClose={() => setShowQR(false)} />}
    </article>
  );
}
