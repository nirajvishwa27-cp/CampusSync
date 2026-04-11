import React, {
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { useNavigate } from 'react-router-dom';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import {
  ArrowRight,
  Circle,
  Layout,
  Menu,
  PenTool,
  Ruler,
  Scissors,
  Shapes,
  Star,
  User,
  X,
  Zap,
  MessageCircle,
  LogOut,
} from 'lucide-react';
import { doc, getDoc } from 'firebase/firestore';
import useStore from '../store/useStore';
import {
  loginUser,
  logoutUser,
  registerUser,
} from '../features/auth/authService';
import { db } from '../firebase/config';
import {
  canManageRoom,
  effectiveStatus,
  isReservationActive,
  timeAgo,
  timeUntil,
} from '../utils/helpers';
import { useActivityLogs } from '../hooks/useActivityLogs';
import {
  addRoom,
  clearReservation,
  deleteRoom,
  reserveRoom,
  toggleRoomStatus,
} from '../firebase/rooms';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

function cn(...classes) {
  return classes.filter(Boolean).join(' ');
}

function timestampToMs(value) {
  if (!value) return null;
  if (typeof value === 'number') return value;
  if (value?.toDate) return value.toDate().getTime();
  const parsed = new Date(value).getTime();
  return Number.isNaN(parsed) ? null : parsed;
}

// --- 1. The Magic SVG Filter (Squiggly Lines) ---
export function SquiggleFilter() {
  return (
    <svg className="hidden" aria-hidden="true">
      <defs>
        <filter id="squiggle">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.01 0.01"
            numOctaves="5"
            result="noise"
            seed="0"
          />
          <feDisplacementMap in="SourceGraphic" in2="noise" scale="4" />
        </filter>
        <filter id="pencil-texture">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="1.2"
            numOctaves="3"
            stitchTiles="stitch"
          />
          <feColorMatrix type="saturate" values="0" />
        </filter>
      </defs>
    </svg>
  );
}

// --- 2. Hand-Drawn Components ---
export function SketchButton({ children, className, ...props }) {
  return (
    <motion.button
      whileHover={{ scale: 1.05, rotate: -1 }}
      whileTap={{ scale: 0.95, rotate: 1 }}
      className={cn(
        'relative px-8 py-3 font-bold text-slate-800 transition-colors group',
        className
      )}
      {...props}
    >
      <div
        className="absolute inset-0 h-full w-full"
        style={{ filter: 'url(#squiggle)' }}
      >
        <svg className="h-full w-full overflow-visible">
          <rect
            x="2"
            y="2"
            width="100%"
            height="100%"
            rx="8"
            fill="transparent"
            stroke="currentColor"
            strokeWidth="3"
            className="text-slate-800"
          />
        </svg>
      </div>
      <div
        className="absolute inset-0 top-1 left-1 -z-10 h-full w-full rounded-lg bg-yellow-300 opacity-0 transition-opacity group-hover:opacity-100"
        style={{ filter: 'url(#squiggle)' }}
      />
      <span className="relative z-10 flex items-center gap-2">{children}</span>
    </motion.button>
  );
}

export function StickyNote({
  children,
  color = 'bg-yellow-200',
  rotate = 0,
  className,
}) {
  return (
    <motion.div
      whileHover={{ scale: 1.1, rotate: rotate * -1, zIndex: 10 }}
      className={cn(
        'relative flex h-64 w-64 flex-col justify-between p-6 shadow-sm',
        color,
        className
      )}
      style={{
        filter: 'url(#squiggle)',
        transform: `rotate(${rotate}deg)`,
      }}
    >
      <div className="absolute -top-3 left-1/2 h-8 w-24 -translate-x-1/2 bg-white/40 shadow-sm rotate-1" />
      <div className="font-handwriting text-slate-800 text-lg leading-relaxed">
        {children}
      </div>
      <div className="self-end opacity-50">
        <Scissors size={16} />
      </div>
    </motion.div>
  );
}

export function CampusSyncLogo({ className, variant = 'classic' }) {
  return (
    <div
      className={cn(
        'h-10 w-10 rounded-xl border-2 border-slate-900 bg-white p-1.5 shadow-[2px_2px_0px_0px_#000]',
        className
      )}
      style={{ filter: 'url(#squiggle)' }}
      aria-hidden="true"
    >
      <svg viewBox="0 0 40 40" className="h-full w-full" fill="none">
        <rect
          x="4"
          y="4"
          width="32"
          height="32"
          rx="8"
          fill={variant === 'premium' ? '#dbeafe' : '#fef3c7'}
          stroke="#0f172a"
          strokeWidth="2.4"
        />

        {variant === 'minimal' ? (
          <>
            <path
              d="M26 14c-1.2-1.2-2.9-2-4.8-2a7 7 0 0 0 0 14c1.9 0 3.6-.8 4.8-2"
              stroke="#0f172a"
              strokeWidth="2.4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M13 27c3 3 10.5 3 14 0"
              stroke="#0f172a"
              strokeWidth="2"
              strokeLinecap="round"
            />
            <circle
              cx="30"
              cy="11"
              r="3.5"
              fill="#22c55e"
              stroke="#0f172a"
              strokeWidth="1.8"
            />
          </>
        ) : variant === 'premium' ? (
          <>
            <path
              d="M9 27h22"
              stroke="#0f172a"
              strokeWidth="2.2"
              strokeLinecap="round"
            />
            <rect
              x="10.5"
              y="16"
              width="7"
              height="11"
              rx="1.5"
              fill="#fff"
              stroke="#0f172a"
              strokeWidth="1.8"
            />
            <rect
              x="20.5"
              y="13"
              width="9"
              height="14"
              rx="1.5"
              fill="#fff"
              stroke="#0f172a"
              strokeWidth="1.8"
            />
            <path
              d="M9 11c3-2.5 6-2.5 9 0s6 2.5 9 0"
              stroke="#2563eb"
              strokeWidth="2"
              strokeLinecap="round"
            />
            <circle
              cx="31"
              cy="10"
              r="2.6"
              fill="#22c55e"
              stroke="#0f172a"
              strokeWidth="1.6"
            />
          </>
        ) : (
          <>
            <path
              d="M12 25V15h16v10"
              stroke="#0f172a"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M16 21h2M22 21h2"
              stroke="#0f172a"
              strokeWidth="2"
              strokeLinecap="round"
            />
            <circle
              cx="30"
              cy="11"
              r="3.5"
              fill="#22c55e"
              stroke="#0f172a"
              strokeWidth="1.8"
            />
          </>
        )}
      </svg>
    </div>
  );
}

// --- 3. Graph Paper Background ---
export function GraphPaper() {
  return (
    <div className="fixed inset-0 -z-10 bg-[#fdfbf7]">
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage:
            'linear-gradient(#0ea5e9 1px, transparent 1px), linear-gradient(90deg, #0ea5e9 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }}
      />
      <div
        className="absolute inset-0 opacity-30"
        style={{ filter: 'url(#pencil-texture)' }}
      />
    </div>
  );
}

// --- 4. Hero Section with Live Drawing ---
export function Hero({
  stats,
  roomsLoading,
  onPrimaryAction,
  primaryLabel,
  onSecondaryAction,
}) {
  return (
    <section
      id="overview"
      className="relative flex min-h-screen flex-col items-center justify-center pt-24 pb-12 overflow-hidden px-4"
    >
      <div className="relative mb-6 text-center">
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.8, delay: 0.5, ease: 'circOut' }}
          className="absolute bottom-2 left-0 -z-10 h-6 w-full origin-left -rotate-1 rounded-sm bg-blue-300/50"
          style={{ filter: 'url(#squiggle)' }}
        />
        <span className="font-mono text-sm font-bold uppercase tracking-widest text-blue-600">
          CampusSync v.1.0
        </span>
      </div>

      <h1 className="relative text-center text-6xl font-black tracking-tight text-slate-900 md:text-8xl">
        Syncing{' '}
        <span className="relative inline-block text-red-500 italic">
          Campus Spaces
          <svg
            className="absolute -left-4 -top-6 h-[140%] w-[120%] overflow-visible text-red-500 pointer-events-none"
            style={{ filter: 'url(#squiggle)' }}
          >
            <motion.path
              d="M 10 30 C 50 10 150 10 170 30"
              fill="transparent"
              stroke="currentColor"
              strokeWidth="4"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1, delay: 1 }}
            />
          </svg>
        </span>{' '}
        <br />
        Into Reality.
      </h1>

      <p className="mt-8 max-w-lg text-center font-medium text-slate-500 text-lg leading-relaxed">
        CampusSync brings real-time campus resource intelligence to students,
        faculty, and admins. Track live availability, route to free spaces, and
        manage bookings without refresh.
      </p>

      <div className="mt-12 flex gap-6">
        <SketchButton onClick={onPrimaryAction}>
          {primaryLabel} <ArrowRight size={18} />
        </SketchButton>
        <button
          onClick={onSecondaryAction}
          className="px-6 py-3 font-mono text-sm font-bold text-slate-500 underline decoration-wavy underline-offset-4 hover:text-slate-900"
        >
          View Demo Flow
        </button>
      </div>

      <div className="mt-8 grid w-full max-w-3xl grid-cols-1 gap-4 sm:grid-cols-3">
        {[
          {
            label: 'Total Resources',
            value: roomsLoading ? '...' : String(stats.total),
            tone: 'bg-blue-100',
          },
          {
            label: 'Currently Free',
            value: roomsLoading ? '...' : String(stats.free),
            tone: 'bg-emerald-100',
          },
          {
            label: 'Busy or Reserved',
            value: roomsLoading
              ? '...'
              : String(stats.occupied + stats.reserved),
            tone: 'bg-rose-100',
          },
        ].map((item, idx) => (
          <motion.div
            key={item.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 + idx * 0.15, duration: 0.5 }}
            className={cn(
              'rounded-xl border-2 border-slate-900 p-4 text-left shadow-md',
              item.tone
            )}
            style={{ filter: 'url(#squiggle)' }}
          >
            <p className="font-mono text-[10px] uppercase tracking-widest text-slate-500">
              {item.label}
            </p>
            <p className="mt-2 text-3xl font-black text-slate-900">
              {item.value}
            </p>
          </motion.div>
        ))}
      </div>

      <div className="mt-20 w-full max-w-4xl">
        <div
          className="relative aspect-video w-full rounded-xl border-2 border-slate-900 bg-white p-4 shadow-xl"
          style={{ filter: 'url(#squiggle)' }}
        >
          <div className="flex items-center gap-2 border-b-2 border-slate-900 pb-4 mb-8">
            <div className="h-3 w-3 rounded-full border border-slate-900 bg-red-400" />
            <div className="h-3 w-3 rounded-full border border-slate-900 bg-yellow-400" />
            <div className="h-3 w-3 rounded-full border border-slate-900 bg-green-400" />
          </div>
          <div className="grid grid-cols-12 gap-4 h-64">
            <motion.div
              initial={{ height: 0 }}
              animate={{ height: '100%' }}
              transition={{ duration: 1, delay: 0.5 }}
              className="col-span-3 rounded-lg border-2 border-dashed border-slate-300 bg-slate-50"
            />
            <div className="col-span-9 flex flex-col gap-4">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: '100%' }}
                transition={{ duration: 0.8, delay: 1 }}
                className="h-32 w-full rounded-lg border-2 border-slate-900 bg-blue-50"
              />
              <div className="flex gap-4 h-full">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.5, delay: 1.8 }}
                  className="h-full w-1/2 rounded-lg border-2 border-slate-900 bg-yellow-50"
                />
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.5, delay: 2.0 }}
                  className="h-full w-1/2 rounded-lg border-2 border-slate-900 bg-pink-50"
                />
              </div>
            </div>
          </div>
          <motion.div
            initial={{ x: 0, y: 0, opacity: 0 }}
            animate={{
              x: [0, 200, 400, 300],
              y: [0, 100, 50, 200],
              opacity: 1,
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              repeatType: 'reverse',
            }}
            className="absolute top-0 left-0 pointer-events-none"
          >
            <PenTool
              className="h-8 w-8 text-slate-900 -rotate-12 drop-shadow-lg"
              fill="white"
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
}

// --- 5. Features (Sticky Notes Board) ---
export function FeatureBoard() {
  return (
    <section id="features" className="py-32 px-4 overflow-hidden relative">
      <div className="mx-auto max-w-6xl">
        <div className="mb-20 flex items-end justify-between border-b-2 border-slate-900 pb-4">
          <h2 className="text-4xl font-black text-slate-900">
            The{' '}
            <span className="text-blue-600 decoration-wavy underline italic">
              CampusSync
            </span>{' '}
            Stack.
          </h2>
          <Ruler className="text-slate-400" />
        </div>
        <div className="flex flex-wrap justify-center gap-12">
          {[
            {
              icon: <Layout />,
              color: 'bg-yellow-200',
              title: 'Live Resource Grid',
              desc: 'Labs, classrooms, library, seminar halls, and parking update in real time.',
            },
            {
              icon: <Shapes />,
              color: 'bg-blue-200',
              title: 'Role Enforcement',
              desc: 'Student, faculty, and admin permissions are enforced in UI and data rules.',
            },
            {
              icon: <PenTool />,
              color: 'bg-pink-200',
              title: 'QR Room Toggle',
              desc: 'Scan a room QR and jump directly into the faculty status toggle flow.',
            },
          ].map((f, i) => (
            <StickyNote key={i} rotate={i % 2 === 0 ? -2 : 2} color={f.color}>
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-full border-2 border-slate-800 bg-white">
                {f.icon}
              </div>
              <h3 className="font-bold text-xl mb-2">{f.title}</h3>
              <p className="text-sm">{f.desc}</p>
            </StickyNote>
          ))}
        </div>
      </div>
    </section>
  );
}

export function CampusPulseBoard({ rooms, logs, onNavigate }) {
  const [windowHours, setWindowHours] = useState(24);

  const statuses = useMemo(() => {
    const values = { free: 0, occupied: 0, reserved: 0 };
    rooms.forEach((room) => {
      const status = effectiveStatus(room);
      if (status === 'free') values.free += 1;
      else if (status === 'reserved') values.reserved += 1;
      else values.occupied += 1;
    });
    return values;
  }, [rooms]);

  const recentLogs = useMemo(() => {
    const now = Date.now();
    const threshold = now - windowHours * 60 * 60 * 1000;
    return (logs || []).filter((log) => {
      const ms = timestampToMs(log.timestamp);
      return ms && ms >= threshold;
    });
  }, [logs, windowHours]);

  const actionBreakdown = useMemo(() => {
    const base = { occupied: 0, free: 0, reserved: 0, other: 0 };
    recentLogs.forEach((log) => {
      const action = String(log.action || '').toLowerCase();
      if (action in base) base[action] += 1;
      else base.other += 1;
    });
    return base;
  }, [recentLogs]);

  const hotspots = useMemo(() => {
    const hitMap = new Map();
    recentLogs.forEach((log) => {
      if (!log.roomId) return;
      hitMap.set(log.roomId, (hitMap.get(log.roomId) || 0) + 1);
    });

    return Array.from(hitMap.entries())
      .map(([roomId, count]) => {
        const room = rooms.find((entry) => entry.id === roomId);
        return {
          roomId,
          name: room?.name || roomId,
          count,
          status: room ? effectiveStatus(room) : 'unknown',
        };
      })
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
  }, [recentLogs, rooms]);

  const occupancyRate = useMemo(() => {
    if (rooms.length === 0) return 0;
    return Math.round(
      ((statuses.occupied + statuses.reserved) / rooms.length) * 100
    );
  }, [rooms.length, statuses.occupied, statuses.reserved]);

  const reservationRate = useMemo(() => {
    if (rooms.length === 0) return 0;
    return Math.round((statuses.reserved / rooms.length) * 100);
  }, [rooms.length, statuses.reserved]);

  const bars = useMemo(() => {
    const slots = Array.from({ length: 8 }, (_, idx) => {
      return {
        key: idx,
        from: Date.now() - (8 - idx) * 60 * 60 * 1000,
        to: Date.now() - (7 - idx) * 60 * 60 * 1000,
        count: 0,
      };
    });

    recentLogs.forEach((log) => {
      const ms = timestampToMs(log.timestamp);
      if (!ms) return;
      const slot = slots.find((entry) => ms >= entry.from && ms < entry.to);
      if (slot) slot.count += 1;
    });

    const peak = Math.max(1, ...slots.map((entry) => entry.count));
    return slots.map((entry) => ({
      ...entry,
      height: Math.max(8, Math.round((entry.count / peak) * 80)),
    }));
  }, [recentLogs]);

  return (
    <section
      id="pulse"
      className="py-20 px-4 bg-[#fffaf0] border-y-2 border-slate-900"
    >
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <h2 className="text-4xl font-black text-slate-900">
              Campus Pulse Board
            </h2>
            <p className="mt-2 text-sm font-medium text-slate-600">
              Live occupancy health, mutation heat, and room activity hotspots.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            {[1, 24, 168].map((hours) => (
              <button
                key={hours}
                onClick={() => setWindowHours(hours)}
                className={cn(
                  'rounded-full border-2 px-3 py-1.5 text-xs font-bold uppercase tracking-widest transition-colors',
                  windowHours === hours
                    ? 'border-slate-900 bg-slate-900 text-white'
                    : 'border-slate-900 bg-white text-slate-700 hover:bg-slate-100'
                )}
              >
                {hours === 168 ? '7d' : `${hours}h`}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
          {[
            {
              label: 'Occupancy',
              value: `${occupancyRate}%`,
              tone: 'bg-rose-100',
            },
            {
              label: 'Reserved Share',
              value: `${reservationRate}%`,
              tone: 'bg-amber-100',
            },
            {
              label: 'Mutations',
              value: String(recentLogs.length),
              tone: 'bg-blue-100',
            },
            {
              label: 'Resources',
              value: String(rooms.length),
              tone: 'bg-emerald-100',
            },
          ].map((card) => (
            <div
              key={card.label}
              className={cn(
                'rounded-2xl border-2 border-slate-900 p-4 shadow-[4px_4px_0px_0px_#000]',
                card.tone
              )}
              style={{ filter: 'url(#squiggle)' }}
            >
              <p className="font-mono text-[10px] uppercase tracking-widest text-slate-500">
                {card.label}
              </p>
              <p className="mt-2 text-3xl font-black text-slate-900">
                {card.value}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-6 grid grid-cols-1 gap-5 lg:grid-cols-3">
          <div className="rounded-2xl border-2 border-slate-900 bg-white p-5 shadow-[4px_4px_0px_0px_#000] lg:col-span-2">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-black text-slate-900">
                Mutation Rhythm (last 8 hours)
              </h3>
              <button
                onClick={() => onNavigate?.('live-demo')}
                className="rounded-md border border-slate-900 px-2 py-1 text-[11px] font-bold uppercase tracking-wide hover:bg-slate-900 hover:text-white"
              >
                Open Stream
              </button>
            </div>
            <div className="flex h-28 items-end gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2">
              {bars.map((bar) => (
                <div
                  key={bar.key}
                  className="flex flex-1 flex-col items-center gap-1"
                >
                  <div
                    className="w-full rounded-t-md border border-slate-900 bg-blue-300"
                    style={{ height: `${bar.height}px` }}
                  />
                  <span className="font-mono text-[9px] uppercase tracking-widest text-slate-500">
                    {new Date(bar.to).getHours()}:00
                  </span>
                </div>
              ))}
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              {Object.entries(actionBreakdown).map(([action, count]) => (
                <span
                  key={action}
                  className="rounded-md border border-slate-300 bg-slate-100 px-2 py-1 text-[11px] font-bold uppercase tracking-wider text-slate-700"
                >
                  {action}: {count}
                </span>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border-2 border-slate-900 bg-white p-5 shadow-[4px_4px_0px_0px_#000]">
            <h3 className="text-lg font-black text-slate-900">Hotspots</h3>
            <p className="mt-1 text-xs font-mono uppercase tracking-wider text-slate-500">
              Most active resources in selected window.
            </p>
            <div className="mt-4 space-y-2">
              {hotspots.length === 0 ? (
                <p className="rounded-lg border border-dashed border-slate-300 bg-slate-50 px-3 py-4 text-xs font-mono uppercase tracking-widest text-slate-500">
                  No hotspot data yet.
                </p>
              ) : (
                hotspots.map((spot) => (
                  <button
                    key={spot.roomId}
                    onClick={() => onNavigate?.('live-resources')}
                    className="flex w-full items-center justify-between rounded-lg border border-slate-300 bg-[#fdfbf7] px-3 py-2 text-left hover:border-slate-900"
                  >
                    <span className="text-sm font-bold text-slate-900">
                      {spot.name}
                    </span>
                    <span className="font-mono text-[10px] uppercase tracking-widest text-slate-500">
                      {spot.count} events
                    </span>
                  </button>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// --- 5.5. Live Resource Ledger (Transferred from previous dashboard data) ---
export function LiveResourceLedger({
  rooms,
  roomsLoading,
  authUser,
  onRequireAuth,
}) {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [busyByRoom, setBusyByRoom] = useState({});
  const [reservationMinutesByRoom, setReservationMinutesByRoom] = useState({});
  const [reservationNoteByRoom, setReservationNoteByRoom] = useState({});
  const [adminDraft, setAdminDraft] = useState({
    name: '',
    building: '',
    floor: '',
    type: 'classroom',
    capacity: 0,
    note: '',
    features: '',
  });
  const [adminBusy, setAdminBusy] = useState(false);
  const [sortBy, setSortBy] = useState('status');
  const [actionableOnly, setActionableOnly] = useState(false);
  const [selectedRoomId, setSelectedRoomId] = useState(null);

  const isAdmin = authUser?.role === 'admin';

  const setRoomBusy = (roomId, value) => {
    setBusyByRoom((prev) => ({ ...prev, [roomId]: value }));
  };

  const ensureAuth = () => {
    if (!authUser) {
      onRequireAuth?.();
      return false;
    }
    return true;
  };

  const handleToggle = async (room) => {
    if (!ensureAuth()) return;
    if (!canManageRoom(authUser, room.id)) {
      toast.error('Only faculty or admin can toggle room status');
      return;
    }

    setRoomBusy(room.id, true);
    try {
      await toggleRoomStatus(
        { ...room, status: effectiveStatus(room) },
        authUser.uid
      );
      toast.success(`${room.name} updated`);
    } catch (error) {
      toast.error(error.message || 'Failed to toggle status');
    } finally {
      setRoomBusy(room.id, false);
    }
  };

  const handleReserve = async (room) => {
    if (!ensureAuth()) return;
    if (!canManageRoom(authUser, room.id)) {
      toast.error('You are not assigned to reserve this resource');
      return;
    }

    const minutes = Number(reservationMinutesByRoom[room.id] || 30);
    const note = reservationNoteByRoom[room.id] || '';

    setRoomBusy(room.id, true);
    try {
      await reserveRoom({
        roomId: room.id,
        userId: authUser.uid,
        minutes,
        note,
      });
      toast.success(`Reserved ${room.name} for ${minutes}m`);
    } catch (error) {
      toast.error(error.message || 'Failed to reserve room');
    } finally {
      setRoomBusy(room.id, false);
    }
  };

  const handleClearReservation = async (room) => {
    if (!ensureAuth()) return;
    if (
      !canManageRoom(authUser, room.id) &&
      room.reservedBy !== authUser?.uid
    ) {
      toast.error('You are not assigned to clear this reservation');
      return;
    }

    setRoomBusy(room.id, true);
    try {
      await clearReservation({ roomId: room.id, userId: authUser.uid });
      toast.success(`Reservation cleared for ${room.name}`);
    } catch (error) {
      toast.error(error.message || 'Failed to clear reservation');
    } finally {
      setRoomBusy(room.id, false);
    }
  };

  const handleDeleteRoom = async (room) => {
    if (!ensureAuth()) return;
    if (!isAdmin) {
      toast.error('Only admin can delete resources');
      return;
    }

    const ok = window.confirm(`Delete ${room.name}?`);
    if (!ok) return;

    setRoomBusy(room.id, true);
    try {
      await deleteRoom(room.id);
      toast.success(`${room.name} deleted`);
    } catch (error) {
      toast.error(error.message || 'Failed to delete room');
    } finally {
      setRoomBusy(room.id, false);
    }
  };

  const handleAdminDraft = (key) => (event) => {
    const value = event.target.value;
    setAdminDraft((prev) => ({ ...prev, [key]: value }));
  };

  const handleAddRoom = async () => {
    if (!ensureAuth()) return;
    if (!isAdmin) {
      toast.error('Only admin can add resources');
      return;
    }
    if (!adminDraft.name.trim()) {
      toast.error('Room name is required');
      return;
    }

    setAdminBusy(true);
    try {
      await addRoom(adminDraft.name.trim(), {
        building: adminDraft.building.trim(),
        floor: adminDraft.floor.trim(),
        type: adminDraft.type,
        capacity: Number(adminDraft.capacity) || 0,
        note: adminDraft.note.trim(),
        features: adminDraft.features
          .split(',')
          .map((entry) => entry.trim())
          .filter(Boolean),
      });

      setAdminDraft({
        name: '',
        building: '',
        floor: '',
        type: 'classroom',
        capacity: 0,
        note: '',
        features: '',
      });
      toast.success('Resource added');
    } catch (error) {
      toast.error(error.message || 'Failed to add resource');
    } finally {
      setAdminBusy(false);
    }
  };

  const typeOptions = useMemo(() => {
    const values = [...new Set(rooms.map((room) => room.type).filter(Boolean))];
    return values.sort();
  }, [rooms]);

  const filteredRooms = useMemo(() => {
    return rooms.filter((room) => {
      const status = effectiveStatus(room);
      const normalizedQuery = search.trim().toLowerCase();
      const haystack = [
        room.name,
        room.building,
        room.floor,
        room.type,
        ...(room.features || []),
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();
      const matchesSearch = haystack.includes(normalizedQuery);
      const matchesStatus = statusFilter === 'all' || status === statusFilter;
      const matchesType = typeFilter === 'all' || room.type === typeFilter;
      const canAct = status === 'free' || isReservationActive(room);
      const matchesActionable = !actionableOnly || canAct;
      return matchesSearch && matchesStatus && matchesType && matchesActionable;
    });
  }, [rooms, search, statusFilter, typeFilter, actionableOnly]);

  const statusSummary = useMemo(() => {
    const base = {
      total: filteredRooms.length,
      free: 0,
      occupied: 0,
      reserved: 0,
    };
    filteredRooms.forEach((room) => {
      const status = effectiveStatus(room);
      if (status === 'free') base.free += 1;
      else if (status === 'reserved') base.reserved += 1;
      else base.occupied += 1;
    });
    return base;
  }, [filteredRooms]);

  const sortedRooms = useMemo(() => {
    const list = [...filteredRooms];
    const statusOrder = { reserved: 0, occupied: 1, free: 2 };

    list.sort((a, b) => {
      if (sortBy === 'capacity') return (b.capacity || 0) - (a.capacity || 0);
      if (sortBy === 'updated') {
        return (
          (timestampToMs(b.updatedAt) || 0) - (timestampToMs(a.updatedAt) || 0)
        );
      }
      if (sortBy === 'name') {
        return String(a.name || '').localeCompare(String(b.name || ''));
      }

      const aStatus = effectiveStatus(a);
      const bStatus = effectiveStatus(b);
      return (statusOrder[aStatus] ?? 99) - (statusOrder[bStatus] ?? 99);
    });

    return list;
  }, [filteredRooms, sortBy]);

  const selectedRoom = useMemo(() => {
    if (!selectedRoomId) return sortedRooms[0] || null;
    return sortedRooms.find((room) => room.id === selectedRoomId) || null;
  }, [sortedRooms, selectedRoomId]);

  const statusClasses = {
    free: 'bg-emerald-100 text-emerald-700 border-emerald-300',
    occupied: 'bg-rose-100 text-rose-700 border-rose-300',
    reserved: 'bg-amber-100 text-amber-700 border-amber-300',
  };

  return (
    <section
      id="live-resources"
      className="py-24 px-4 bg-white border-y-2 border-slate-900"
    >
      <div className="mx-auto max-w-7xl">
        <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <h2 className="text-4xl font-black text-slate-900">
              Live Campus Resources
            </h2>
            <p className="mt-2 text-sm font-medium text-slate-500">
              Real-time room status, capacity, notes, and equipment from
              CampusSync data.
            </p>
          </div>

          <div className="grid w-full max-w-5xl grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5">
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search room"
              className="rounded-xl border-2 border-slate-900 bg-[#fdfbf7] px-3 py-2 text-sm font-medium text-slate-700 outline-none"
            />
            <select
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value)}
              className="rounded-xl border-2 border-slate-900 bg-[#fdfbf7] px-3 py-2 text-sm font-medium text-slate-700 outline-none"
            >
              <option value="all">All status</option>
              <option value="free">Free</option>
              <option value="occupied">Occupied</option>
              <option value="reserved">Reserved</option>
            </select>
            <select
              value={typeFilter}
              onChange={(event) => setTypeFilter(event.target.value)}
              className="rounded-xl border-2 border-slate-900 bg-[#fdfbf7] px-3 py-2 text-sm font-medium text-slate-700 outline-none"
            >
              <option value="all">All types</option>
              {typeOptions.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
            <select
              value={sortBy}
              onChange={(event) => setSortBy(event.target.value)}
              className="rounded-xl border-2 border-slate-900 bg-[#fdfbf7] px-3 py-2 text-sm font-medium text-slate-700 outline-none"
            >
              <option value="status">Sort: Status</option>
              <option value="updated">Sort: Recently Updated</option>
              <option value="capacity">Sort: Capacity</option>
              <option value="name">Sort: Name</option>
            </select>
            <label className="inline-flex items-center justify-center gap-2 rounded-xl border-2 border-slate-900 bg-[#fdfbf7] px-3 py-2 text-xs font-bold uppercase tracking-widest text-slate-700">
              <input
                type="checkbox"
                checked={actionableOnly}
                onChange={(event) => setActionableOnly(event.target.checked)}
              />
              Actionable
            </label>
          </div>
        </div>

        {!roomsLoading && (
          <div className="mb-4 flex flex-wrap gap-2">
            {[
              { key: 'all', label: 'All', count: statusSummary.total },
              { key: 'free', label: 'Free', count: statusSummary.free },
              {
                key: 'occupied',
                label: 'Occupied',
                count: statusSummary.occupied,
              },
              {
                key: 'reserved',
                label: 'Reserved',
                count: statusSummary.reserved,
              },
            ].map((chip) => (
              <button
                key={chip.key}
                onClick={() => setStatusFilter(chip.key)}
                className={cn(
                  'rounded-full border px-3 py-1 text-[11px] font-black uppercase tracking-wider transition-colors',
                  statusFilter === chip.key
                    ? 'border-slate-900 bg-slate-900 text-white'
                    : 'border-slate-300 bg-white text-slate-600 hover:border-slate-900'
                )}
              >
                {chip.label} ({chip.count})
              </button>
            ))}
          </div>
        )}

        {roomsLoading ? (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {[...Array(6)].map((_, index) => (
              <div
                key={index}
                className="h-44 animate-pulse rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50"
              />
            ))}
          </div>
        ) : sortedRooms.length === 0 ? (
          <div className="rounded-2xl border-2 border-slate-900 bg-[#fdfbf7] p-10 text-center font-mono text-sm uppercase tracking-widest text-slate-500">
            No resources match this filter set.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {sortedRooms.map((room) => {
              const status = effectiveStatus(room);
              const reservationActive = isReservationActive(room);
              const reservedByMe = authUser && room.reservedBy === authUser.uid;
              const canClearReservation =
                reservationActive &&
                (reservedByMe || canManageRoom(authUser, room.id));
              const canReserve = !reservationActive && status === 'free';
              const roomBusy = Boolean(busyByRoom[room.id]);

              return (
                <motion.div
                  key={room.id}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                  onClick={() => setSelectedRoomId(room.id)}
                  className={cn(
                    'cursor-pointer rounded-2xl border-2 border-slate-900 bg-[#fdfbf7] p-5 shadow-[4px_4px_0px_0px_#000] transition-transform hover:-translate-y-0.5',
                    selectedRoom?.id === room.id && 'ring-2 ring-blue-500'
                  )}
                  style={{ filter: 'url(#squiggle)' }}
                >
                  <div className="mb-4 flex items-start justify-between gap-3">
                    <div>
                      <h3 className="text-2xl font-black text-slate-900">
                        {room.name}
                      </h3>
                      <p className="font-mono text-[11px] uppercase tracking-widest text-slate-500">
                        {room.type || 'resource'} / {room.building || 'N/A'} /
                        floor {room.floor || 'N/A'}
                      </p>
                    </div>
                    <span
                      className={cn(
                        'rounded-full border px-2.5 py-1 text-xs font-black uppercase tracking-wider',
                        statusClasses[status] ||
                          'bg-slate-100 text-slate-700 border-slate-300'
                      )}
                    >
                      {status}
                    </span>
                  </div>

                  <div className="mb-3 flex flex-wrap gap-2 text-xs font-semibold text-slate-600">
                    <span className="rounded-md border border-slate-300 bg-white px-2 py-1">
                      Capacity: {room.capacity || 0}
                    </span>
                    {room.features?.slice(0, 2).map((feature) => (
                      <span
                        key={feature}
                        className="rounded-md border border-slate-300 bg-white px-2 py-1 uppercase"
                      >
                        {feature}
                      </span>
                    ))}
                  </div>

                  <p className="line-clamp-2 text-sm font-medium text-slate-600">
                    {room.note || 'No active note for this resource.'}
                  </p>

                  {reservationActive && (
                    <p className="mt-2 rounded-md border border-amber-300 bg-amber-100 px-2 py-1 text-xs font-bold uppercase tracking-wide text-amber-700">
                      Reservation ends in {timeUntil(room.reservedUntil)}
                    </p>
                  )}

                  <div className="mt-3 space-y-2">
                    <input
                      value={reservationNoteByRoom[room.id] || ''}
                      onChange={(event) =>
                        setReservationNoteByRoom((prev) => ({
                          ...prev,
                          [room.id]: event.target.value,
                        }))
                      }
                      placeholder="Optional note"
                      className="w-full rounded-md border border-slate-300 bg-white px-2 py-1.5 text-xs font-medium text-slate-700 outline-none"
                    />

                    <div className="flex items-center gap-2">
                      <select
                        value={reservationMinutesByRoom[room.id] || 30}
                        onChange={(event) =>
                          setReservationMinutesByRoom((prev) => ({
                            ...prev,
                            [room.id]: Number(event.target.value),
                          }))
                        }
                        className="w-full rounded-md border border-slate-300 bg-white px-2 py-1.5 text-xs font-semibold text-slate-700 outline-none"
                      >
                        <option value={30}>30 minutes</option>
                        <option value={60}>1 hour</option>
                        <option value={120}>2 hours</option>
                        <option value={180}>3 hours</option>
                      </select>

                      {canManageRoom(authUser, room.id) && (
                        <button
                          onClick={() => handleToggle(room)}
                          disabled={roomBusy}
                          className="rounded-md border border-slate-900 bg-slate-900 px-2 py-1.5 text-[11px] font-bold uppercase tracking-wide text-white disabled:opacity-60"
                        >
                          {roomBusy
                            ? '...'
                            : status === 'free'
                              ? 'Start'
                              : 'End'}
                        </button>
                      )}
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() =>
                          canReserve ? handleReserve(room) : onRequireAuth?.()
                        }
                        disabled={!canReserve || roomBusy}
                        className="w-full rounded-md border border-emerald-600 bg-emerald-100 px-2 py-1.5 text-[11px] font-bold uppercase tracking-wide text-emerald-700 disabled:opacity-50"
                      >
                        Reserve
                      </button>
                      <button
                        onClick={() =>
                          canClearReservation
                            ? handleClearReservation(room)
                            : onRequireAuth?.()
                        }
                        disabled={!canClearReservation || roomBusy}
                        className="w-full rounded-md border border-amber-600 bg-amber-100 px-2 py-1.5 text-[11px] font-bold uppercase tracking-wide text-amber-700 disabled:opacity-50"
                      >
                        Clear
                      </button>

                      {isAdmin && (
                        <button
                          onClick={() => handleDeleteRoom(room)}
                          disabled={roomBusy}
                          className="rounded-md border border-rose-700 bg-rose-100 px-2 py-1.5 text-[11px] font-bold uppercase tracking-wide text-rose-700 disabled:opacity-50"
                        >
                          Delete
                        </button>
                      )}

                      <button
                        onClick={() => setSelectedRoomId(room.id)}
                        className="rounded-md border border-blue-700 bg-blue-100 px-2 py-1.5 text-[11px] font-bold uppercase tracking-wide text-blue-700"
                      >
                        Details
                      </button>
                    </div>
                  </div>

                  <p className="mt-4 font-mono text-[10px] uppercase tracking-widest text-slate-500">
                    Updated {timeAgo(room.updatedAt)}
                  </p>
                </motion.div>
              );
            })}
          </div>
        )}

        {selectedRoom && !roomsLoading && (
          <div className="mt-6 rounded-2xl border-2 border-slate-900 bg-[#fffaf0] p-5 shadow-[4px_4px_0px_0px_#000]">
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div>
                <h3 className="text-2xl font-black text-slate-900">
                  Focused Resource: {selectedRoom.name}
                </h3>
                <p className="mt-1 font-mono text-[11px] uppercase tracking-widest text-slate-500">
                  {selectedRoom.type || 'resource'} /{' '}
                  {selectedRoom.building || 'N/A'} / floor{' '}
                  {selectedRoom.floor || 'N/A'}
                </p>
              </div>
              <span
                className={cn(
                  'rounded-full border px-3 py-1 text-xs font-black uppercase tracking-wider',
                  statusClasses[effectiveStatus(selectedRoom)] ||
                    'bg-slate-100 text-slate-700 border-slate-300'
                )}
              >
                {effectiveStatus(selectedRoom)}
              </span>
            </div>
            <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-3">
              <div className="rounded-xl border border-slate-300 bg-white p-3">
                <p className="font-mono text-[10px] uppercase tracking-widest text-slate-500">
                  Capacity
                </p>
                <p className="mt-1 text-2xl font-black text-slate-900">
                  {selectedRoom.capacity || 0}
                </p>
              </div>
              <div className="rounded-xl border border-slate-300 bg-white p-3">
                <p className="font-mono text-[10px] uppercase tracking-widest text-slate-500">
                  Reservation
                </p>
                <p className="mt-1 text-sm font-bold text-slate-900">
                  {isReservationActive(selectedRoom)
                    ? `Ends in ${timeUntil(selectedRoom.reservedUntil)}`
                    : 'No active reservation'}
                </p>
              </div>
              <div className="rounded-xl border border-slate-300 bg-white p-3">
                <p className="font-mono text-[10px] uppercase tracking-widest text-slate-500">
                  Last Update
                </p>
                <p className="mt-1 text-sm font-bold text-slate-900">
                  {timeAgo(selectedRoom.updatedAt)}
                </p>
              </div>
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              {(selectedRoom.features || []).length === 0 ? (
                <span className="rounded-md border border-dashed border-slate-300 px-2 py-1 text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                  No equipment tags
                </span>
              ) : (
                selectedRoom.features.map((feature) => (
                  <span
                    key={feature}
                    className="rounded-md border border-slate-300 bg-white px-2 py-1 text-[11px] font-bold uppercase tracking-wide text-slate-700"
                  >
                    {feature}
                  </span>
                ))
              )}
            </div>
          </div>
        )}

        {isAdmin && (
          <div className="mt-10 rounded-2xl border-2 border-slate-900 bg-[#fdfbf7] p-5 shadow-[4px_4px_0px_0px_#000]">
            <h3 className="text-xl font-black text-slate-900">
              Admin Resource Forge
            </h3>
            <p className="mt-1 text-xs font-mono uppercase tracking-wider text-slate-500">
              Add new resources directly from this sketchy control panel.
            </p>

            <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-3">
              <input
                value={adminDraft.name}
                onChange={handleAdminDraft('name')}
                placeholder="Room Name"
                className="rounded-md border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 outline-none"
              />
              <input
                value={adminDraft.building}
                onChange={handleAdminDraft('building')}
                placeholder="Building"
                className="rounded-md border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 outline-none"
              />
              <input
                value={adminDraft.floor}
                onChange={handleAdminDraft('floor')}
                placeholder="Floor"
                className="rounded-md border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 outline-none"
              />
              <input
                value={adminDraft.type}
                onChange={handleAdminDraft('type')}
                placeholder="Type"
                className="rounded-md border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 outline-none"
              />
              <input
                value={adminDraft.capacity}
                onChange={handleAdminDraft('capacity')}
                type="number"
                min={0}
                placeholder="Capacity"
                className="rounded-md border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 outline-none"
              />
              <input
                value={adminDraft.features}
                onChange={handleAdminDraft('features')}
                placeholder="Features (comma separated)"
                className="rounded-md border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 outline-none"
              />
              <input
                value={adminDraft.note}
                onChange={handleAdminDraft('note')}
                placeholder="Optional note"
                className="md:col-span-2 rounded-md border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 outline-none"
              />
              <button
                onClick={handleAddRoom}
                disabled={adminBusy}
                className="rounded-md border border-slate-900 bg-slate-900 px-3 py-2 text-sm font-bold uppercase tracking-wider text-white disabled:opacity-60"
              >
                {adminBusy ? 'Adding...' : 'Add Resource'}
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

// --- 6. Sketchbook Showcase (Horizontal Scroll) ---
export function SketchbookShowcase({ rooms }) {
  const sectionRef = useRef(null);
  const triggerRef = useRef(null);

  useLayoutEffect(() => {
    if (!sectionRef.current || !triggerRef.current) return;

    const pin = gsap.to(sectionRef.current, {
      x: '-66%',
      ease: 'none',
      scrollTrigger: {
        trigger: triggerRef.current,
        pin: true,
        scrub: 1,
        end: () => `+=${sectionRef.current.offsetWidth}`,
      },
    });

    return () => {
      if (pin) pin.kill();
    };
  }, []);

  const projects = useMemo(() => {
    const palette = {
      free: 'bg-emerald-50',
      occupied: 'bg-rose-50',
      reserved: 'bg-amber-50',
    };

    const mapped = rooms.slice(0, 3).map((room) => {
      const status = effectiveStatus(room);
      return {
        title: room.name,
        tag: `#${room.type || 'resource'}`,
        color: palette[status] || 'bg-blue-50',
        details: `${room.building || 'N/A'} / floor ${room.floor || 'N/A'} / cap ${room.capacity || 0}`,
        status,
      };
    });

    while (mapped.length < 3) {
      mapped.push({
        title: `Resource ${mapped.length + 1}`,
        tag: '#pending',
        color: 'bg-slate-50',
        details: 'Awaiting seeded room data',
        status: 'pending',
      });
    }

    return mapped;
  }, [rooms]);

  return (
    <section
      id="modules"
      ref={triggerRef}
      className="overflow-hidden bg-[#fdfbf7] border-y-2 border-slate-900"
    >
      <div ref={sectionRef} className="flex w-[300%] h-screen">
        {projects.map((p, i) => (
          <div
            key={i}
            className="w-screen h-full flex items-center justify-center p-20 relative border-r-2 border-slate-200"
          >
            <div className="absolute top-10 left-10 text-8xl font-black text-slate-100 uppercase pointer-events-none">
              Module {i + 1}
            </div>
            <div
              className={cn(
                'w-full max-w-4xl aspect-[4/3] border-4 border-slate-900 rounded-2xl shadow-2xl p-8 flex flex-col gap-6',
                p.color
              )}
              style={{ filter: 'url(#squiggle)' }}
            >
              <div className="flex-1 border-2 border-dashed border-slate-400 rounded-xl flex items-center justify-center bg-white/50">
                <div className="text-center">
                  <PenTool size={80} className="mx-auto text-slate-200" />
                  <p className="mt-4 font-mono text-xs uppercase tracking-widest text-slate-500">
                    {p.status}
                  </p>
                </div>
              </div>
              <div className="flex justify-between items-end">
                <div>
                  <span className="font-mono text-xs uppercase text-slate-400">
                    {p.tag}
                  </span>
                  <h3 className="text-4xl font-black text-slate-900">
                    {p.title}
                  </h3>
                  <p className="mt-1 text-sm font-medium text-slate-500">
                    {p.details}
                  </p>
                </div>
                <SketchButton className="bg-white">Live Card</SketchButton>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

// --- 7. Process Path (Scroll-Driven Path) ---
export function ProcessPath() {
  const container = useRef(null);
  const pathRef = useRef(null);

  useLayoutEffect(() => {
    const path = pathRef.current;
    if (!path) return;

    const totalLength = path.getTotalLength();

    gsap.set(path, {
      strokeDasharray: totalLength,
      strokeDashoffset: totalLength,
    });

    gsap.to(path, {
      strokeDashoffset: 0,
      ease: 'none',
      scrollTrigger: {
        trigger: container.current,
        start: 'top center',
        end: 'bottom center',
        scrub: 1,
      },
    });
  }, []);

  const steps = [
    { title: 'Observe', icon: <Shapes /> },
    { title: 'Predict', icon: <Layout /> },
    { title: 'Reserve', icon: <PenTool /> },
    { title: 'Coordinate', icon: <Zap /> },
  ];

  return (
    <section
      id="process-path"
      ref={container}
      className="py-48 px-4 bg-white relative"
    >
      <div className="mx-auto max-w-4xl relative">
        <svg
          className="absolute left-[50px] top-0 h-full w-[100px] overflow-visible pointer-events-none"
          viewBox="0 0 100 1000"
          preserveAspectRatio="none"
        >
          <path
            ref={pathRef}
            d="M 50 0 Q 100 250 50 500 T 50 1000"
            fill="transparent"
            stroke="#cbd5e1"
            strokeWidth="8"
            style={{ filter: 'url(#squiggle)' }}
          />
        </svg>

        <div className="space-y-48 relative z-10">
          {steps.map((s, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="flex items-center gap-12 group"
            >
              <div
                className="h-28 w-28 rounded-full border-4 border-slate-900 bg-white flex items-center justify-center group-hover:bg-yellow-300 transition-colors shadow-xl"
                style={{ filter: 'url(#squiggle)' }}
              >
                {React.cloneElement(s.icon, { size: 40 })}
              </div>
              <div
                className="p-8 border-2 border-slate-900 rounded-2xl bg-white shadow-lg flex-1"
                style={{ filter: 'url(#squiggle)' }}
              >
                <h3 className="text-3xl font-black text-slate-900 mb-2">
                  {s.title}
                </h3>
                <p className="text-slate-500 font-medium">
                  Firestore streams status updates, prediction learns by slot,
                  and booking closes the decision loop.
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// --- 8. Client Scribbles (Masonry Testimonials) ---
export function ClientScribbles({ logs, roomsById, rooms, userDirectory }) {
  const entries = useMemo(() => {
    const mapped = (logs || []).slice(0, 8).map((log) => {
      const room = roomsById.get(log.roomId);
      const action = (log.action || 'updated').toLowerCase();
      const roomName = room?.name || log.roomId || 'Unknown room';
      const profile = log.userId ? userDirectory?.[log.userId] : null;
      const roleLabel = profile?.role || 'member';

      return {
        text: `${roomName} was marked ${action}${log.note ? ` (${log.note})` : ''}.`,
        author:
          profile?.name ||
          (log.userId ? `user ${String(log.userId).slice(0, 6)}` : 'system'),
        context: `${roleLabel}${room?.building ? ` · ${room.building}` : ''} · ${timeAgo(log.timestamp)}`,
        color:
          action === 'free'
            ? 'bg-emerald-100'
            : action === 'occupied'
              ? 'bg-rose-100'
              : action === 'reserved'
                ? 'bg-amber-100'
                : 'bg-blue-100',
      };
    });

    const roomHits = new Map();
    (logs || []).forEach((log) => {
      if (!log.roomId) return;
      roomHits.set(log.roomId, (roomHits.get(log.roomId) || 0) + 1);
    });

    let busiestRoom = null;
    roomHits.forEach((count, roomId) => {
      if (!busiestRoom || count > busiestRoom.count) {
        const room = roomsById.get(roomId);
        busiestRoom = {
          count,
          name: room?.name || roomId,
        };
      }
    });

    const totalRooms = rooms?.length || 0;
    const freeRooms = (rooms || []).filter(
      (room) => effectiveStatus(room) === 'free'
    ).length;

    const insights = [
      {
        text:
          totalRooms > 0
            ? `${freeRooms} out of ${totalRooms} resources are currently free for immediate use.`
            : 'Campus resource availability stream is active and ready for live feedback.',
        author: 'system insight',
        color: 'bg-emerald-100',
        context: 'live occupancy snapshot',
      },
      busiestRoom
        ? {
            text: `${busiestRoom.name} is the busiest zone in the current activity stream with ${busiestRoom.count} updates.`,
            author: 'system insight',
            color: 'bg-blue-100',
            context: 'derived from recent logs',
          }
        : null,
      {
        text: 'Live status updates are syncing across rooms, helping students and faculty make faster decisions.',
        author: 'campus operations',
        color: 'bg-yellow-100',
        context: 'realtime coordination layer',
      },
    ].filter(Boolean);

    if (mapped.length >= 6) return mapped;
    if (mapped.length > 0) {
      return [...mapped, ...insights].slice(0, 8);
    }

    return insights;
  }, [logs, roomsById, rooms, userDirectory]);

  const feedbackMetrics = useMemo(() => {
    const counts = { free: 0, occupied: 0, reserved: 0 };
    let updates24h = 0;
    const contributors = new Set();
    const threshold = Date.now() - 24 * 60 * 60 * 1000;

    (logs || []).forEach((log) => {
      const action = String(log.action || '').toLowerCase();
      if (action in counts) counts[action] += 1;

      const timestamp = timestampToMs(log.timestamp);
      if (timestamp && timestamp >= threshold) updates24h += 1;

      if (log.userId) contributors.add(String(log.userId).slice(0, 6));
    });

    const totalRooms = rooms?.length || 0;
    const busyRooms = (rooms || []).filter((room) => {
      const status = effectiveStatus(room);
      return status === 'occupied' || status === 'reserved';
    }).length;
    const liveReserved = (rooms || []).filter(
      (room) => effectiveStatus(room) === 'reserved'
    ).length;
    const occupancyRate = totalRooms
      ? `${Math.round((busyRooms / totalRooms) * 100)}%`
      : '0%';

    return [
      {
        label: 'updates in 24h',
        value: String(updates24h),
        tone: 'bg-blue-100 border-blue-300 text-blue-700',
      },
      {
        label: 'active contributors',
        value: String(contributors.size),
        tone: 'bg-emerald-100 border-emerald-300 text-emerald-700',
      },
      {
        label: 'occupancy rate',
        value: occupancyRate,
        tone: 'bg-yellow-100 border-yellow-300 text-yellow-700',
      },
      {
        label: 'live reservations',
        value: String(liveReserved),
        tone: 'bg-amber-100 border-amber-300 text-amber-700',
      },
      {
        label: 'free status logs',
        value: String(counts.free),
        tone: 'bg-slate-100 border-slate-300 text-slate-700',
      },
    ];
  }, [logs, rooms]);

  return (
    <section
      id="testimonials"
      className="py-32 bg-[#f8fafc] border-y-2 border-slate-900"
    >
      <div className="mx-auto max-w-7xl px-4">
        <div className="text-center mb-24">
          <h2 className="text-5xl font-black text-slate-900 italic">
            Campus Feedback
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-sm font-medium text-slate-600">
            Live reflections from how CampusSync improves room discovery,
            faculty coordination, and admin planning across the day.
          </p>
          <div
            className="h-1 w-24 bg-red-400 mx-auto mt-4"
            style={{ filter: 'url(#squiggle)' }}
          />
        </div>

        <div className="mb-10 grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-5">
          {feedbackMetrics.map((metric) => (
            <div
              key={metric.label}
              className={cn(
                'rounded-xl border p-3 text-left shadow-[3px_3px_0px_0px_#000]',
                metric.tone
              )}
              style={{ filter: 'url(#squiggle)' }}
            >
              <p className="font-mono text-[10px] uppercase tracking-widest">
                {metric.label}
              </p>
              <p className="mt-1 text-3xl font-black">{metric.value}</p>
            </div>
          ))}
        </div>

        <div className="columns-1 md:columns-2 lg:columns-3 gap-8 space-y-8">
          {entries.map((t, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              className={cn(
                'break-inside-avoid p-8 border-2 border-slate-900 rounded-3xl shadow-lg relative h-auto inline-block w-full text-slate-900',
                t.color
              )}
              style={{ filter: 'url(#squiggle)' }}
            >
              <MessageCircle className="absolute -top-4 -right-4 h-10 w-10 text-slate-900 bg-white rounded-full p-2 border-2 border-slate-900" />
              <p className="font-handwriting text-2xl mb-6 text-slate-800 leading-relaxed">
                "{t.text}"
              </p>
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-full border-2 border-slate-900 bg-white flex items-center justify-center">
                  <User size={20} />
                </div>
                <div>
                  <span className="font-black text-slate-900 uppercase tracking-widest text-xs block">
                    - {t.author}
                  </span>
                  <span className="font-mono text-[10px] uppercase tracking-widest text-slate-500 block">
                    {t.context}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function ActivityStream({ logs, roomsById }) {
  const [query, setQuery] = useState('');
  const [actionFilter, setActionFilter] = useState('all');
  const [rows, setRows] = useState(12);

  const items = useMemo(() => {
    return (logs || []).map((log) => {
      const room = roomsById.get(log.roomId);
      const roomName = room?.name || log.roomId || 'Unknown room';
      return {
        id: log.id,
        roomName,
        action: (log.action || 'updated').toUpperCase(),
        note: log.note || 'No note',
        actor: log.userId ? `user-${String(log.userId).slice(0, 6)}` : 'system',
        when: timeAgo(log.timestamp),
      };
    });
  }, [logs, roomsById]);

  const visibleItems = useMemo(() => {
    return items
      .filter((item) => {
        const matchesAction =
          actionFilter === 'all' || item.action.toLowerCase() === actionFilter;
        const q = query.trim().toLowerCase();
        const matchesQuery =
          q.length === 0 ||
          item.roomName.toLowerCase().includes(q) ||
          item.note.toLowerCase().includes(q) ||
          item.actor.toLowerCase().includes(q);
        return matchesAction && matchesQuery;
      })
      .slice(0, rows);
  }, [items, actionFilter, query, rows]);

  const actionCounts = useMemo(() => {
    return items.reduce(
      (acc, item) => {
        const key = item.action.toLowerCase();
        acc[key] = (acc[key] || 0) + 1;
        return acc;
      },
      { occupied: 0, free: 0, reserved: 0 }
    );
  }, [items]);

  return (
    <section id="live-demo" className="py-20 px-4 bg-[#fdfbf7]">
      <div className="mx-auto max-w-7xl rounded-2xl border-2 border-slate-900 bg-white p-6 shadow-[5px_5px_0px_0px_#000]">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-2xl font-black text-slate-900">
            Realtime Activity Stream
          </h3>
          <span className="rounded-full border border-slate-900 bg-blue-100 px-3 py-1 font-mono text-[10px] font-bold uppercase tracking-widest text-blue-700">
            activityLogs
          </span>
        </div>

        <div className="mb-4 grid grid-cols-1 gap-3 lg:grid-cols-5">
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search activity"
            className="lg:col-span-2 rounded-xl border-2 border-slate-900 bg-[#fdfbf7] px-3 py-2 text-sm font-medium text-slate-700 outline-none"
          />
          <select
            value={actionFilter}
            onChange={(event) => setActionFilter(event.target.value)}
            className="rounded-xl border-2 border-slate-900 bg-[#fdfbf7] px-3 py-2 text-sm font-medium text-slate-700 outline-none"
          >
            <option value="all">All actions</option>
            <option value="occupied">Occupied</option>
            <option value="free">Free</option>
            <option value="reserved">Reserved</option>
          </select>
          <select
            value={rows}
            onChange={(event) => setRows(Number(event.target.value))}
            className="rounded-xl border-2 border-slate-900 bg-[#fdfbf7] px-3 py-2 text-sm font-medium text-slate-700 outline-none"
          >
            <option value={8}>8 rows</option>
            <option value={12}>12 rows</option>
            <option value={20}>20 rows</option>
            <option value={30}>30 rows</option>
          </select>
          <div className="rounded-xl border-2 border-slate-900 bg-white px-3 py-2 text-xs font-mono uppercase tracking-wider text-slate-600">
            total: {items.length}
          </div>
        </div>

        <div className="mb-4 flex flex-wrap gap-2">
          {Object.entries(actionCounts).map(([action, count]) => (
            <button
              key={action}
              onClick={() => setActionFilter(action)}
              className={cn(
                'rounded-full border px-3 py-1 text-[11px] font-black uppercase tracking-wide',
                actionFilter === action
                  ? 'border-slate-900 bg-slate-900 text-white'
                  : 'border-slate-300 bg-slate-100 text-slate-700 hover:border-slate-900'
              )}
            >
              {action} ({count})
            </button>
          ))}
          <button
            onClick={() => setActionFilter('all')}
            className={cn(
              'rounded-full border px-3 py-1 text-[11px] font-black uppercase tracking-wide',
              actionFilter === 'all'
                ? 'border-slate-900 bg-slate-900 text-white'
                : 'border-slate-300 bg-slate-100 text-slate-700 hover:border-slate-900'
            )}
          >
            reset
          </button>
        </div>

        {visibleItems.length === 0 ? (
          <p className="rounded-xl border border-dashed border-slate-300 bg-slate-50 px-4 py-8 text-center font-mono text-xs uppercase tracking-widest text-slate-500">
            Waiting for first status mutation...
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] border-collapse text-left">
              <thead>
                <tr className="border-b border-slate-200 text-xs uppercase tracking-widest text-slate-500">
                  <th className="py-2 pr-4">Resource</th>
                  <th className="py-2 pr-4">Action</th>
                  <th className="py-2 pr-4">Note</th>
                  <th className="py-2 pr-4">Actor</th>
                  <th className="py-2">Time</th>
                </tr>
              </thead>
              <tbody>
                {visibleItems.map((item) => (
                  <tr
                    key={item.id}
                    className="border-b border-slate-100 text-sm text-slate-700"
                  >
                    <td className="py-3 pr-4 font-semibold text-slate-900">
                      {item.roomName}
                    </td>
                    <td className="py-3 pr-4">
                      <span className="rounded-md border border-slate-300 bg-slate-100 px-2 py-1 text-[11px] font-bold uppercase tracking-wide">
                        {item.action}
                      </span>
                    </td>
                    <td className="py-3 pr-4 text-slate-600">{item.note}</td>
                    <td className="py-3 pr-4 font-mono text-xs uppercase tracking-wider text-slate-500">
                      {item.actor}
                    </td>
                    <td className="py-3 font-mono text-xs uppercase tracking-wider text-slate-500">
                      {item.when}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  );
}

// --- 9. Rough Pricing (Scribble Cards) ---
export function PricingDrafts() {
  return (
    <section id="rollout" className="py-48 px-4 bg-white">
      <div className="mx-auto max-w-6xl">
        <div className="text-center mb-24">
          <span className="font-mono text-blue-600 font-bold uppercase tracking-widest bg-blue-50 px-3 py-1 rounded">
            Rollout Tracks
          </span>
          <h2 className="text-6xl font-black text-slate-900 mt-4">
            Deploy Your{' '}
            <span className="text-red-500 underline decoration-wavy">
              Campus
            </span>
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {[
            {
              title: 'Pilot',
              price: '$0',
              features: [
                'Up to 6 resources',
                'Student and faculty roles',
                'Realtime status + QR',
              ],
            },
            {
              title: 'Department',
              price: '$49',
              features: [
                'Unlimited resources',
                'Bookings + prediction',
                'Admin analytics',
              ],
            },
            {
              title: 'University',
              price: '$149',
              features: [
                'Multi-building rollout',
                'Advanced usage reporting',
                'Priority integration support',
              ],
            },
          ].map((p, i) => (
            <motion.div
              key={i}
              whileHover={{ y: -10 }}
              className="bg-white border-4 border-slate-900 rounded-[40px] p-12 shadow-2xl relative overflow-hidden group text-slate-900"
              style={{ filter: 'url(#squiggle)' }}
            >
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-100 transition-opacity">
                <Star
                  size={40}
                  className="text-yellow-400 group-hover:rotate-45 transition-transform duration-500"
                />
              </div>
              <h3 className="text-2xl font-black text-slate-400 uppercase tracking-widest mb-4">
                {p.title}
              </h3>
              <div className="flex items-baseline gap-2 mb-10">
                <span className="text-6xl font-black text-slate-900">
                  {p.price}
                </span>
                <span className="font-mono text-slate-400">/mo</span>
              </div>
              <ul className="space-y-6 mb-12">
                {p.features.map((f, j) => (
                  <li
                    key={j}
                    className="flex items-center gap-3 font-bold text-slate-600"
                  >
                    <div className="h-2 w-2 rounded-full bg-slate-900" />
                    {f}
                  </li>
                ))}
              </ul>
              <SketchButton className="w-full bg-slate-900 text-white hover:text-slate-900">
                Choose Track
              </SketchButton>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// --- 10. Blueprint Footer ---
export function BlueprintFooter({ onNavigate, onOpenExternal }) {
  return (
    <footer
      id="footer"
      className="bg-slate-900 pt-48 pb-20 px-4 text-[#fdfbf7] relative overflow-hidden"
    >
      <div
        className="absolute inset-0 opacity-5 pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }}
      />
      <div className="mx-auto max-w-7xl relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-32 mb-32">
          <div>
            <h2 className="text-[10vw] lg:text-[7vw] font-black leading-none uppercase mb-8 italic">
              Let's <br /> <span className="text-yellow-300">Sync</span>.
            </h2>
            <p className="text-2xl font-medium text-slate-400 max-w-md">
              Campus decisions should happen in real time. CampusSync is the
              live layer for rooms, labs, library seats, and parking.
            </p>
          </div>
          <div className="flex flex-col justify-end items-end gap-12">
            <div className="grid grid-cols-2 gap-12 text-sm font-mono uppercase tracking-widest">
              <ul className="space-y-4">
                <li className="text-slate-500">Navigation</li>
                <li>
                  <button
                    onClick={() => onNavigate?.('live-resources')}
                    className="hover:text-yellow-300"
                  >
                    Dashboard
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => onNavigate?.('process-path')}
                    className="hover:text-yellow-300"
                  >
                    Faculty
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => onNavigate?.('live-demo')}
                    className="hover:text-yellow-300"
                  >
                    Admin
                  </button>
                </li>
              </ul>
              <ul className="space-y-4">
                <li className="text-slate-500">Stack</li>
                <li>
                  <button
                    onClick={() => onOpenExternal?.('https://react.dev')}
                    className="hover:text-yellow-300"
                  >
                    React + Vite
                  </button>
                </li>
                <li>
                  <button
                    onClick={() =>
                      onOpenExternal?.('https://firebase.google.com/docs')
                    }
                    className="hover:text-yellow-300"
                  >
                    Firebase
                  </button>
                </li>
                <li>
                  <button
                    onClick={() =>
                      onOpenExternal?.(
                        'https://firebase.google.com/docs/firestore/security/get-started'
                      )
                    }
                    className="hover:text-yellow-300"
                  >
                    Firestore Rules
                  </button>
                </li>
              </ul>
            </div>
            <div className="h-32 w-full max-w-sm border-2 border-dashed border-slate-700 rounded-xl flex items-center justify-center p-8 text-center text-xs font-mono opacity-40">
              Realtime Feed: <br /> Rooms / Logs / Bookings
            </div>
          </div>
        </div>
        <div className="flex flex-col md:flex-row justify-between items-center pt-16 border-t border-slate-800 font-mono text-xs uppercase tracking-[0.3em] text-slate-500 gap-8">
          <span>CampusSync Team Databytes</span>
          <div className="flex gap-12">
            <span>Legal / Build v1.0</span>
            <span>Privacy Policy</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

// --- 11. Marquee (Handwritten Tape) ---
export function TapeMarquee() {
  return (
    <div
      id="tape-marquee"
      className="relative -rotate-2 bg-slate-900 py-6 overflow-hidden shadow-xl"
      style={{ filter: 'url(#squiggle)' }}
    >
      <motion.div
        animate={{ x: ['0%', '-50%'] }}
        transition={{ duration: 20, ease: 'linear', repeat: Infinity }}
        className="flex whitespace-nowrap"
      >
        {[...Array(10)].map((_, i) => (
          <div key={i} className="flex items-center gap-8 mx-8">
            <span className="text-3xl font-black text-[#fdfbf7] uppercase tracking-widest font-handwriting">
              Realtime Campus Status
            </span>
            <Circle className="h-4 w-4 fill-blue-500 text-blue-500" />
          </div>
        ))}
      </motion.div>
    </div>
  );
}

// --- Main Layout ---
export default function SketchyPage() {
  const navigate = useNavigate();
  const authUser = useStore((s) => s.authUser);
  const setAuthUser = useStore((s) => s.setAuthUser);
  const clearAuth = useStore((s) => s.clearAuth);
  const rooms = useStore((s) => s.rooms);
  const roomsLoading = useStore((s) => s.roomsLoading);
  const theme = useStore((s) => s.theme);
  const isDark = theme === 'dark';
  const logs = useActivityLogs(20, Boolean(authUser));

  const [authOpen, setAuthOpen] = useState(false);
  const [mode, setMode] = useState('login');
  const [submitting, setSubmitting] = useState(false);
  const [activeSection, setActiveSection] = useState('overview');
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [form, setForm] = useState({
    email: '',
    password: '',
    name: '',
    role: 'student',
  });
  const [userDirectory, setUserDirectory] = useState({});

  const stats = useMemo(() => {
    const base = { total: rooms.length, free: 0, occupied: 0, reserved: 0 };
    rooms.forEach((room) => {
      const status = effectiveStatus(room);
      if (status === 'free') base.free += 1;
      else if (status === 'reserved') base.reserved += 1;
      else base.occupied += 1;
    });
    return base;
  }, [rooms]);

  const navLinks = useMemo(
    () => [
      { id: 'overview', label: 'Campus Overview' },
      { id: 'live-resources', label: 'Resource Ledger' },
      { id: 'pulse', label: 'Pulse Board' },
      { id: 'live-demo', label: 'Activity Logs' },
    ],
    []
  );

  const navSnapshot = useMemo(() => {
    return {
      resources: roomsLoading ? '...' : String(stats.total),
      free: roomsLoading ? '...' : String(stats.free),
      events: String(logs.length),
    };
  }, [logs.length, roomsLoading, stats.free, stats.total]);

  const navSectionMap = useMemo(
    () => ({
      overview: 'overview',
      features: 'overview',
      'live-resources': 'live-resources',
      modules: 'live-resources',
      pulse: 'pulse',
      'process-path': 'live-demo',
      testimonials: 'live-demo',
      'live-demo': 'live-demo',
      rollout: 'live-demo',
      footer: 'live-demo',
    }),
    []
  );

  const roomsById = useMemo(() => {
    return new Map(rooms.map((room) => [room.id, room]));
  }, [rooms]);

  const userIds = useMemo(() => {
    return [...new Set((logs || []).map((log) => log.userId).filter(Boolean))];
  }, [logs]);

  const handleField = (key) => (event) => {
    const value = event.target.value;
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const resetForm = () => {
    setForm({ email: '', password: '', name: '', role: 'student' });
  };

  const handleAuthSubmit = async () => {
    if (!form.email.trim() || !form.password.trim()) {
      toast.error('Email and password are required');
      return;
    }

    if (mode === 'register' && !form.name.trim()) {
      toast.error('Name is required for registration');
      return;
    }

    setSubmitting(true);
    try {
      let user;
      if (mode === 'login') {
        user = await loginUser(form.email.trim(), form.password);
      } else {
        if (!['student', 'faculty', 'admin'].includes(form.role)) {
          toast.error('Invalid role selected');
          return;
        }

        user = await registerUser(
          form.name.trim(),
          form.email.trim(),
          form.password,
          form.role
        );
      }

      setAuthUser(user);
      toast.success(`Welcome ${user.name || 'to CampusSync'}`);
      setAuthOpen(false);
      resetForm();
    } catch (error) {
      toast.error(error.message || 'Authentication failed');
    } finally {
      setSubmitting(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logoutUser();
      clearAuth();
      toast.success('Signed out');
    } catch (error) {
      toast.error(error.message || 'Failed to sign out');
    }
  };

  const handlePrimaryAction = () => {
    if (authUser) {
      // Navigate to role-based dashboard
      if (authUser.role === 'admin') {
        navigate('/admin');
      } else if (authUser.role === 'faculty') {
        navigate('/faculty');
      } else {
        navigate('/dashboard');
      }
      return;
    }
    // Open auth modal for login/register
    setMode('login');
    setAuthOpen(true);
  };

  const handleSecondaryAction = () => {
    if (authUser) {
      navigate('/dashboard');
    } else {
      setMode('register');
      setAuthOpen(true);
    }
  };

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (!element) {
      // If section doesn't exist, scroll to top
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    setActiveSection(navSectionMap[sectionId] || sectionId);
    setMobileNavOpen(false);

    const y = element.getBoundingClientRect().top + window.scrollY - 132;
    window.scrollTo({ top: Math.max(0, y), behavior: 'smooth' });
  };

  const openExternal = (url) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  useEffect(() => {
    const missingIds = userIds.filter((uid) => !userDirectory[uid]);
    if (missingIds.length === 0) return;

    if (!authUser || authUser.role !== 'admin') {
      setUserDirectory((prev) => ({
        ...prev,
        ...Object.fromEntries(
          missingIds.map((uid) => [
            uid,
            {
              name: `user-${String(uid).slice(0, 6)}`,
              role: 'member',
            },
          ])
        ),
      }));
      return;
    }

    let cancelled = false;

    const loadUserProfiles = async () => {
      const fetched = await Promise.all(
        missingIds.map(async (uid) => {
          try {
            const snap = await getDoc(doc(db, 'users', uid));
            if (snap.exists()) {
              const data = snap.data();
              return [
                uid,
                {
                  name: data.name || `user-${String(uid).slice(0, 6)}`,
                  role: data.role || 'member',
                },
              ];
            }
          } catch (error) {
            console.warn('Failed to load user profile for activity log actor', {
              uid,
              error,
            });
            // Use fallback values if profile lookup fails.
          }

          return [
            uid,
            {
              name: `user-${String(uid).slice(0, 6)}`,
              role: 'member',
            },
          ];
        })
      );

      if (cancelled) return;
      setUserDirectory((prev) => ({ ...prev, ...Object.fromEntries(fetched) }));
    };

    loadUserProfiles();

    return () => {
      cancelled = true;
    };
  }, [authUser, userDirectory, userIds]);

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
    });

    lenis.on('scroll', ScrollTrigger.update);

    const raf = (time) => {
      lenis.raf(time * 1000);
    };

    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);

    return () => {
      lenis.destroy();
      gsap.ticker.remove(raf);
    };
  }, []);

  useEffect(() => {
    const trackedIds = Object.keys(navSectionMap);

    const calculateActiveSection = () => {
      const offsetY = window.scrollY + 180;
      let nextActive = 'overview';

      trackedIds.forEach((id) => {
        const section = document.getElementById(id);
        if (!section) return;
        if (section.offsetTop <= offsetY) {
          nextActive = navSectionMap[id] || nextActive;
        }
      });

      setActiveSection((prev) => (prev === nextActive ? prev : nextActive));
    };

    let rafId = null;
    const onScroll = () => {
      if (rafId) return;
      rafId = window.requestAnimationFrame(() => {
        calculateActiveSection();
        rafId = null;
      });
    };

    calculateActiveSection();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);

    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (rafId) window.cancelAnimationFrame(rafId);
    };
  }, [navSectionMap]);

  return (
    <main
      className={`relative min-h-screen w-full text-slate-800 overflow-x-hidden font-sans selection:bg-yellow-300 selection:text-black ${isDark ? 'bg-[#1a1a1a]' : 'bg-[#fdfbf7]'}`}
    >
      <SquiggleFilter />
      <GraphPaper />

      <nav
        className={`fixed top-0 left-0 right-0 z-50 border-b ${isDark ? 'border-slate-700 bg-[#1a1a1a]/95' : 'border-slate-200 bg-[#fdfbf7]/95'} px-4 backdrop-blur-sm`}
      >
        <div className="mx-auto w-full max-w-7xl">
          <div className="flex items-center justify-between gap-3 py-4">
            <div className="flex items-center gap-3">
              <button
                onClick={() => scrollToSection('overview')}
                className="flex items-center gap-3 text-left"
              >
                <CampusSyncLogo />
                <div>
                  <p className="text-xl font-black tracking-tighter text-slate-900">
                    CampusSync
                  </p>
                  <p className="font-mono text-[10px] uppercase tracking-widest text-slate-500">
                    Live Campus Resource Intelligence
                  </p>
                </div>
              </button>
            </div>

            <div className="flex items-center gap-2">
              {authUser ? (
                <>
                  <span className="hidden rounded-full border-2 border-slate-900 bg-yellow-100 px-3 py-1 font-mono text-[10px] font-bold uppercase tracking-widest md:inline-flex">
                    {authUser.role}
                  </span>
                  <button
                    onClick={handleLogout}
                    className="rounded-full border-2 border-slate-900 bg-white px-4 py-2 font-bold text-xs uppercase tracking-widest hover:bg-slate-900 hover:text-white transition-all shadow-[4px_4px_0px_0px_#000] active:translate-y-1 active:shadow-none"
                  >
                    <span className="inline-flex items-center gap-2">
                      <LogOut size={14} /> Logout
                    </span>
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setAuthOpen(true)}
                  className="rounded-full border-2 border-slate-900 bg-white px-5 py-2 font-bold text-xs uppercase tracking-widest hover:bg-slate-900 hover:text-white transition-all shadow-[4px_4px_0px_0px_#000] active:translate-y-1 active:shadow-none"
                >
                  Sign In
                </button>
              )}

              <button
                onClick={() => setMobileNavOpen((prev) => !prev)}
                className="inline-flex h-9 w-9 items-center justify-center rounded-full border-2 border-slate-900 bg-white text-slate-900 md:hidden"
                aria-label="Toggle navigation menu"
                aria-expanded={mobileNavOpen}
                aria-controls="campussync-mobile-nav"
              >
                {mobileNavOpen ? <X size={16} /> : <Menu size={16} />}
              </button>
            </div>
          </div>

          <div className="hidden items-center justify-between gap-2 pb-3 md:flex">
            <div
              role="navigation"
              aria-label="CampusSync primary navigation"
              className="flex items-center gap-2 overflow-x-auto [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            >
              {navLinks.map((item) => (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  aria-current={
                    activeSection === item.id ? 'location' : undefined
                  }
                  className={cn(
                    'whitespace-nowrap rounded-full border px-3 py-1.5 font-mono text-[11px] font-bold uppercase tracking-widest transition-colors',
                    activeSection === item.id
                      ? 'border-slate-900 bg-slate-900 text-white shadow-[3px_3px_0px_0px_#000]'
                      : 'border-slate-300 bg-white text-slate-700 hover:border-slate-900 hover:bg-slate-900 hover:text-white'
                  )}
                >
                  {item.label}
                </button>
              ))}
            </div>

            <p className="hidden rounded-full border border-slate-300 bg-white px-3 py-1.5 font-mono text-[10px] font-bold uppercase tracking-widest text-slate-600 md:block">
              resources {navSnapshot.resources} · free {navSnapshot.free} ·
              events {navSnapshot.events}
            </p>
          </div>

          <div className="pb-3 md:hidden">
            <p className="rounded-full border border-slate-300 bg-white px-3 py-1.5 font-mono text-[10px] font-bold uppercase tracking-widest text-slate-600">
              resources {navSnapshot.resources} · free {navSnapshot.free} ·
              events {navSnapshot.events}
            </p>

            {mobileNavOpen && (
              <div
                id="campussync-mobile-nav"
                role="navigation"
                aria-label="CampusSync mobile navigation"
                className="mt-2 grid grid-cols-1 gap-2"
              >
                {navLinks.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => scrollToSection(item.id)}
                    aria-current={
                      activeSection === item.id ? 'location' : undefined
                    }
                    className={cn(
                      'rounded-xl border px-3 py-2 text-left font-mono text-[11px] font-bold uppercase tracking-widest transition-colors',
                      activeSection === item.id
                        ? 'border-slate-900 bg-slate-900 text-white'
                        : 'border-slate-300 bg-white text-slate-700'
                    )}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </nav>

      <Hero
        stats={stats}
        roomsLoading={roomsLoading}
        onPrimaryAction={handlePrimaryAction}
        primaryLabel={authUser ? 'Open Dashboard' : 'Get Started'}
        onSecondaryAction={() => navigate('/login')}
      />
      <TapeMarquee />
      <FeatureBoard />
      <CampusPulseBoard
        rooms={rooms}
        logs={logs}
        onNavigate={(section) => {
          if (authUser) {
            navigate('/dashboard');
          } else {
            navigate('/login');
          }
        }}
      />
      <LiveResourceLedger
        rooms={rooms}
        roomsLoading={roomsLoading}
        authUser={authUser}
        onRequireAuth={() => {
          setMode('login');
          setAuthOpen(true);
        }}
      />
      <SketchbookShowcase rooms={rooms} />
      <ProcessPath />
      <ClientScribbles
        logs={logs}
        roomsById={roomsById}
        rooms={rooms}
        userDirectory={userDirectory}
      />
      <ActivityStream logs={logs} roomsById={roomsById} />
      <PricingDrafts />
      <BlueprintFooter
        onNavigate={(section) => {
          if (section === 'live-resources') {
            navigate('/login');
          } else if (section === 'process-path') {
            navigate('/login');
          } else if (section === 'live-demo') {
            navigate('/login');
          }
        }}
        onOpenExternal={openExternal}
      />

      {authOpen && (
        <div
          className="fixed inset-0 z-[70] flex items-center justify-center bg-black/35 px-4 backdrop-blur-sm"
          onClick={() => setAuthOpen(false)}
        >
          <div
            className="w-full max-w-md rounded-2xl border-2 border-slate-900 bg-[#fdfbf7] p-6 shadow-[8px_8px_0px_0px_#000]"
            style={{ filter: 'url(#squiggle)' }}
            onClick={(event) => event.stopPropagation()}
          >
            <div className="mb-5 flex items-center justify-between">
              <h3 className="text-xl font-black text-slate-900">
                {mode === 'login' ? 'Sign In' : 'Register'}
              </h3>
              <button
                onClick={() => setAuthOpen(false)}
                className="rounded-lg border-2 border-slate-900 px-2 py-1 text-xs font-bold uppercase"
              >
                Close
              </button>
            </div>

            <div className="mb-5 flex rounded-xl border-2 border-slate-900 bg-white p-1">
              <button
                onClick={() => setMode('login')}
                className={cn(
                  'w-1/2 rounded-lg px-3 py-2 text-xs font-bold uppercase tracking-widest transition-colors',
                  mode === 'login'
                    ? 'bg-slate-900 text-white'
                    : 'text-slate-600'
                )}
              >
                Login
              </button>
              <button
                onClick={() => setMode('register')}
                className={cn(
                  'w-1/2 rounded-lg px-3 py-2 text-xs font-bold uppercase tracking-widest transition-colors',
                  mode === 'register'
                    ? 'bg-slate-900 text-white'
                    : 'text-slate-600'
                )}
              >
                Register
              </button>
            </div>

            <div className="space-y-3">
              {mode === 'register' && (
                <input
                  value={form.name}
                  onChange={handleField('name')}
                  placeholder="Full Name"
                  className="w-full rounded-xl border-2 border-slate-900 bg-white px-4 py-3 text-sm font-medium text-slate-800 outline-none"
                />
              )}

              {mode === 'register' && (
                <select
                  value={form.role}
                  onChange={handleField('role')}
                  className="w-full rounded-xl border-2 border-slate-900 bg-white px-4 py-3 text-sm font-medium text-slate-800 outline-none"
                >
                  <option value="student">Student</option>
                  <option value="faculty">Faculty</option>
                  <option value="admin">Admin</option>
                </select>
              )}

              <input
                type="email"
                value={form.email}
                onChange={handleField('email')}
                placeholder="Email"
                className="w-full rounded-xl border-2 border-slate-900 bg-white px-4 py-3 text-sm font-medium text-slate-800 outline-none"
              />

              <input
                type="password"
                value={form.password}
                onChange={handleField('password')}
                placeholder="Password"
                className="w-full rounded-xl border-2 border-slate-900 bg-white px-4 py-3 text-sm font-medium text-slate-800 outline-none"
                onKeyDown={(event) => {
                  if (event.key === 'Enter') handleAuthSubmit();
                }}
              />

              <button
                onClick={handleAuthSubmit}
                disabled={submitting}
                className="w-full rounded-xl border-2 border-slate-900 bg-yellow-300 px-4 py-3 text-sm font-black uppercase tracking-widest text-slate-900 transition-colors hover:bg-yellow-200 disabled:opacity-60"
              >
                {submitting
                  ? 'Please wait...'
                  : mode === 'login'
                    ? 'Enter CampusSync'
                    : 'Create Account'}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
