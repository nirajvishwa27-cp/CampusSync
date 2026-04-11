import { useState } from 'react';
import { useBookings } from '../features/bookings/useBookings';
import { updateBookingStatus } from '../features/bookings/bookingService';
import toast from 'react-hot-toast';
import useStore from '../store/useStore';
import { BOOKING_STATUS, ROLES } from '../lib/constants';
import { canManageRoom } from '../utils/helpers';

function BookingCard({ booking, onRespond }) {
  const authUser = useStore((s) => s.authUser);
  const theme = useStore((s) => s.theme);
  const isDark = theme === 'dark';

  const statusColors = {
    pending: isDark
      ? 'bg-yellow-900/30 text-yellow-400'
      : 'bg-yellow-100 text-yellow-700',
    approved: isDark
      ? 'bg-green-900/30 text-green-400'
      : 'bg-green-100 text-green-700',
    declined: isDark ? 'bg-red-900/30 text-red-400' : 'bg-red-100 text-red-700',
  };

  const canRespond =
    authUser?.role === ROLES.ADMIN ||
    canManageRoom(authUser, booking.resourceId);

  return (
    <div
      className="rounded-xl border p-3"
      style={{ borderColor: 'var(--border)', background: 'var(--bg-elevated)' }}
    >
      <div className="flex items-start justify-between">
        <div>
          <h4 className="font-semibold" style={{ color: 'var(--text)' }}>
            {booking.resourceName}
          </h4>
          <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
            {booking.date} • {booking.startTime} - {booking.endTime}
          </p>
          <p className="text-xs mt-1" style={{ color: 'var(--text-subtle)' }}>
            By: {booking.studentName}
          </p>
        </div>
        <span
          className={`rounded-full px-2 py-0.5 text-xs font-semibold ${statusColors[booking.status]}`}
        >
          {booking.status}
        </span>
      </div>

      {booking.purpose && (
        <p className="mt-2 text-sm" style={{ color: 'var(--text-muted)' }}>
          {booking.purpose}
        </p>
      )}

      {canRespond && booking.status === BOOKING_STATUS.PENDING && (
        <div className="mt-3 flex flex-col gap-2 sm:flex-row">
          <button
            onClick={() => onRespond(booking.id, BOOKING_STATUS.APPROVED)}
            className="flex-1 rounded-lg bg-green-500 py-2 text-xs font-semibold text-white hover:bg-green-600"
          >
            Approve
          </button>
          <button
            onClick={() => onRespond(booking.id, BOOKING_STATUS.DECLINED)}
            className="flex-1 rounded-lg bg-red-500 py-2 text-xs font-semibold text-white hover:bg-red-600"
          >
            Decline
          </button>
        </div>
      )}
    </div>
  );
}

export default function BookingList({ resourceId }) {
  const authUser = useStore((s) => s.authUser);
  const { bookings, loading } = useBookings({
    role: authUser?.role,
    studentId: authUser?.uid,
    resourceId,
  });

  const visibleBookings = resourceId
    ? bookings.filter((booking) => booking.resourceId === resourceId)
    : bookings;

  const handleRespond = async (bookingId, status) => {
    try {
      await updateBookingStatus(bookingId, status, '', authUser.uid);
      toast.success(`Booking ${status}`);
    } catch (error) {
      console.error('Failed to update booking status', error);
      toast.error(error?.message || 'Failed to respond');
    }
  };

  if (loading) {
    return (
      <div className="flex h-20 items-center justify-center">
        <div className="h-5 w-5 animate-spin rounded-full border-2 border-yellow-400 border-t-transparent" />
      </div>
    );
  }

  if (!visibleBookings.length) {
    return (
      <div
        className="rounded-xl border p-4 text-center"
        style={{ borderColor: 'var(--border)', background: 'var(--bg-soft)' }}
      >
        <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
          No booking requests
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {visibleBookings.map((booking) => (
        <BookingCard
          key={booking.id}
          booking={booking}
          onRespond={handleRespond}
        />
      ))}
    </div>
  );
}
