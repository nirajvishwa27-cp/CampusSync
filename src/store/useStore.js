// src/store/useStore.js
import { create } from 'zustand';

const useStore = create((set) => ({
  // ─── Auth ───────────────────────────────────────────────
  authUser: null, // { uid, name, email, role }
  authLoading: true, // true while Firebase resolves session
  setAuthUser: (user) => set({ authUser: user, authLoading: false }),
  clearAuth: () => set({ authUser: null, authLoading: false }),

  // ─── Rooms ──────────────────────────────────────────────
  rooms: [], // array of room documents
  roomsLoading: true,
  setRooms: (rooms) => set({ rooms, roomsLoading: false }),

  // ─── Theme ──────────────────────────────────────────────
  theme: 'light',
}));

export default useStore;
