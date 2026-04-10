# CampusSync 🏫

Real-time campus room availability tracker. Built with React + Vite + Firebase (Firestore + Auth).

---

## Stack

| Layer | Tech |
|-------|------|
| Frontend | React 18, Vite |
| Styling | Tailwind CSS v3 |
| Routing | React Router v6 |
| State | Zustand (single store) |
| Charts | Recharts |
| Notifications | react-hot-toast |
| QR Codes | qrcode |
| Backend | Firebase Firestore + Auth |

---

## Folder Structure

```
campussync/
├── src/
│   ├── firebase/
│   │   ├── config.js        # Firebase init (replace with your config)
│   │   ├── auth.js          # Login / register / auth listener
│   │   └── rooms.js         # Firestore queries + onSnapshot
│   ├── store/
│   │   └── useStore.js      # Single Zustand store (authUser + rooms)
│   ├── hooks/
│   │   ├── useAuth.js       # Auth bootstrap hook
│   │   └── useRooms.js      # Single Firestore listener hook
│   ├── utils/
│   │   └── helpers.js       # effectiveStatus, timeAgo, roomUrl
│   ├── components/
│   │   ├── Navbar.jsx
│   │   ├── RoomCard.jsx
│   │   ├── ProtectedRoute.jsx
│   │   └── QRModal.jsx
│   ├── pages/
│   │   ├── Login.jsx
│   │   ├── Dashboard.jsx
│   │   ├── RoomPage.jsx     # /room/:roomId — also QR scan target
│   │   └── Admin.jsx
│   ├── App.jsx              # Routes + global hooks
│   ├── main.jsx
│   └── index.css
├── scripts/
│   └── seed.js              # One-time Firestore room seeder
├── firestore.rules          # Security rules (deploy to Firebase)
├── firestore.indexes.json
├── firebase.json            # Hosting + Firestore config
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
└── package.json
```

---

## Quick Start

### 1. Create a Firebase Project

1. Go to [console.firebase.google.com](https://console.firebase.google.com)
2. Create a new project
3. Enable **Authentication → Email/Password**
4. Create a **Firestore Database** (start in test mode, then apply rules)

### 2. Configure Firebase

Edit `src/firebase/config.js` and replace the placeholder values with your project's config:

```js
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  ...
};
```

Find these values in: Firebase Console → Project Settings → Your Apps → Web App.

### 3. Install & Run

```bash
npm install
npm run dev
```

### 4. Seed Demo Rooms (optional)

```bash
# Install admin SDK separately (not included in app deps)
npm install firebase-admin

# Set your service account key
export GOOGLE_APPLICATION_CREDENTIALS="/path/to/serviceAccountKey.json"

# Edit scripts/seed.js and set your projectId, then:
node scripts/seed.js
```

### 5. Deploy Security Rules

```bash
npm install -g firebase-tools
firebase login
firebase init   # select Firestore + Hosting
firebase deploy --only firestore:rules
```

### 6. Deploy to Firebase Hosting

```bash
npm run build
firebase deploy
```

---

## User Roles

| Role | Permissions |
|------|-------------|
| `student` | View room status (read-only) |
| `faculty` | View + toggle room status (free ↔ occupied) |
| `admin` | View + toggle + add/delete rooms + analytics |

Roles are set in the Firestore `users` collection. During registration via the UI, users can self-select a role (suitable for demo/MVP). For production, restrict role assignment to admin-only writes.

---

## Auto-Reset Logic

When faculty marks a room as **occupied**:
- `autoResetAt` is set to `now + 2 hours`
- The UI computes `effectiveStatus(room)` client-side
- If `autoResetAt < now`, the room **displays as free** without a DB write
- This avoids any backend/cloud function requirement for the MVP

---

## Realtime Architecture

```
Firestore /rooms  ──onSnapshot──▶  Zustand rooms[]  ──▶  All UI components
                   (1 listener)      (auto re-render)
```

- **One** listener, attached in `useRoomsListener` after auth resolves
- **Zero** polling, **zero** manual refresh
- Listener detaches automatically on auth logout

---

## Routes

| Path | Component | Access |
|------|-----------|--------|
| `/login` | Login | Public |
| `/dashboard` | Dashboard | All roles |
| `/room/:roomId` | RoomPage | All roles (toggle if faculty/admin) |
| `/admin` | Admin | Admin only |

---

## Firestore Data Model

### `rooms/{roomId}`
```json
{
  "id": "auto-generated",
  "name": "Computer Lab 101",
  "status": "free",
  "updatedAt": "<Timestamp>",
  "updatedBy": "<userId | null>",
  "autoResetAt": "<Timestamp | null>"
}
```

### `users/{userId}`
```json
{
  "id": "<Firebase Auth UID>",
  "name": "Jane Doe",
  "email": "jane@university.edu",
  "role": "faculty",
  "createdAt": "<Timestamp>"
}
```

### `logs/{logId}` *(optional analytics)*
```json
{
  "roomId": "<roomId>",
  "userId": "<userId>",
  "action": "occupied",
  "timestamp": "<Timestamp>"
}
```

---

## Performance Notes

- Single Firestore listener for all rooms (not per-room)
- Flat collections — no nested subcollections
- All computed values (effectiveStatus, timeAgo) derived in UI, not stored
- 1 action = 1 Firestore write
- Zustand store has no selectors overhead — components subscribe to minimal slices

---

## Production Checklist

- [ ] Replace `src/firebase/config.js` with real credentials
- [ ] Deploy `firestore.rules` (remove test mode)
- [ ] Restrict role self-selection in registration (admin-only role assignment)
- [ ] Add Firebase App Check for abuse prevention
- [ ] Consider Cloud Functions for reliable auto-reset (vs client-side)
- [ ] Add `logs` collection writes for full analytics
