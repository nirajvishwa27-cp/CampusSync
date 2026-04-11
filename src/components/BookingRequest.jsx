import { useState } from 'react';
import { createBooking } from '../features/bookings/bookingService';
import toast from 'react-hot-toast';
import useStore from '../store/useStore';

export default function BookingRequest({ room }) {
  const authUser = useStore((s) => s.authUser);
  const [loading, setLoading] = useState(false);
  const [date, setDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [purpose, setPurpose] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!authUser || !date || !startTime || !endTime) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (startTime >= endTime) {
      toast.error('End time must be after start time');
      return;
    }

    setLoading(true);
    try {
      await createBooking({
        resourceId: room.id,
        resourceName: room.name,
        studentId: authUser.uid,
        studentName: authUser.name || authUser.email,
        date,
        startTime,
        endTime,
        purpose,
      });
      toast.success('Booking request submitted');
      setDate('');
      setStartTime('');
      setEndTime('');
      setPurpose('');
    } catch (error) {
      console.error('Booking request submission failed', error);
      toast.error(error?.message || 'Failed to submit booking request');
    } finally {
      setLoading(false);
    }
  };

  const inputClassName =
    'w-full rounded-lg border px-3 py-2.5 text-base sm:text-sm outline-none transition-colors';
  const labelClassName =
    'block text-xs font-semibold uppercase tracking-wide mb-1';

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 rounded-xl border p-4"
      style={{ borderColor: 'var(--border)', background: 'var(--bg-soft)' }}
    >
      <h3 className="text-sm font-semibold" style={{ color: 'var(--text)' }}>
        Request Booking
      </h3>

      <div>
        <label
          className={labelClassName}
          style={{ color: 'var(--text-muted)' }}
        >
          Date *
        </label>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          disabled={loading}
          className={inputClassName}
          style={{
            borderColor: 'var(--border)',
            background: 'var(--bg-elevated)',
            color: 'var(--text)',
          }}
          min={new Date().toISOString().split('T')[0]}
        />
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div>
          <label
            className={labelClassName}
            style={{ color: 'var(--text-muted)' }}
          >
            Start Time *
          </label>
          <input
            type="time"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            disabled={loading}
            className={inputClassName}
            style={{
              borderColor: 'var(--border)',
              background: 'var(--bg-elevated)',
              color: 'var(--text)',
            }}
          />
        </div>
        <div>
          <label
            className={labelClassName}
            style={{ color: 'var(--text-muted)' }}
          >
            End Time *
          </label>
          <input
            type="time"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
            disabled={loading}
            className={inputClassName}
            style={{
              borderColor: 'var(--border)',
              background: 'var(--bg-elevated)',
              color: 'var(--text)',
            }}
          />
        </div>
      </div>

      <div>
        <label
          className={labelClassName}
          style={{ color: 'var(--text-muted)' }}
        >
          Purpose
        </label>
        <textarea
          value={purpose}
          onChange={(e) => setPurpose(e.target.value)}
          disabled={loading}
          rows={2}
          placeholder="Why do you need this room?"
          className={inputClassName + ' resize-none'}
          style={{
            borderColor: 'var(--border)',
            background: 'var(--bg-elevated)',
            color: 'var(--text)',
          }}
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-xl border-2 border-slate-900 bg-yellow-400 py-2.5 text-sm font-bold transition-all hover:bg-yellow-300 active:scale-95 disabled:opacity-60"
      >
        {loading ? 'Submitting...' : 'Request Booking'}
      </button>
    </form>
  );
}
