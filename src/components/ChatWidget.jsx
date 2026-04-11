import { useState, useEffect, useMemo, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import useStore from '../store/useStore';
import { MessageCircle, X, HelpCircle, Send, Loader2 } from 'lucide-react';
import { askCampusAssistant } from '../features/chat/geminiService';
import { getBookingsForStudent } from '../features/bookings/bookingService';
import { BOOKING_STATUS, STATUS } from '../lib/constants';

const starterPrompts = [
  'How do I book a room?',
  'What do room statuses mean?',
  'Who can approve bookings?',
  'How do I use the floor plan?',
];

const NEEDS_ROOM_DATA_REGEX =
  /\b(room|rooms|lab|classroom|availability|available|free|occupied|status|capacity|building|floor)\b/i;
const NEEDS_BOOKING_DATA_REGEX =
  /\b(book|booking|bookings|request|requests|pending|approved|declined|reservation)\b/i;

const makeMessage = (role, text, isError = false) => ({
  id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
  role,
  text,
  isError,
});

const summarizeRoomsForChat = (rooms = [], queryText = '') => {
  if (!Array.isArray(rooms) || rooms.length === 0) {
    return { roomDataNote: 'Room data is not loaded yet.' };
  }

  const loweredQuery = String(queryText || '').toLowerCase();
  const summary = {
    totalRooms: rooms.length,
    freeRooms: rooms.filter((room) => room.status === STATUS.FREE).length,
    occupiedRooms: rooms.filter((room) => room.status === STATUS.OCCUPIED)
      .length,
    reservedRooms: rooms.filter((room) => room.status === STATUS.RESERVED)
      .length,
    partialRooms: rooms.filter((room) => room.status === STATUS.PARTIAL).length,
    sampleFreeRooms: rooms
      .filter((room) => room.status === STATUS.FREE)
      .slice(0, 6)
      .map((room) => room.name),
  };

  const matchedRoom = rooms.find((room) =>
    loweredQuery.includes(String(room.name || '').toLowerCase())
  );

  if (matchedRoom) {
    summary.focusRoom = {
      name: matchedRoom.name || 'Unknown',
      status: matchedRoom.status || 'unknown',
      capacity: matchedRoom.capacity ?? null,
      building: matchedRoom.building || '',
      floor: matchedRoom.floor || '',
      note: matchedRoom.note || '',
    };
  }

  return summary;
};

const summarizeBookingsForChat = (bookings = []) => {
  if (!Array.isArray(bookings) || bookings.length === 0) {
    return {
      total: 0,
      pending: 0,
      approved: 0,
      declined: 0,
      recent: [],
    };
  }

  return {
    total: bookings.length,
    pending: bookings.filter((item) => item.status === BOOKING_STATUS.PENDING)
      .length,
    approved: bookings.filter((item) => item.status === BOOKING_STATUS.APPROVED)
      .length,
    declined: bookings.filter((item) => item.status === BOOKING_STATUS.DECLINED)
      .length,
    recent: bookings.slice(0, 5).map((item) => ({
      resourceName: item.resourceName || 'Unknown room',
      status: item.status || 'unknown',
      date: item.date || '',
      startTime: item.startTime || '',
      endTime: item.endTime || '',
    })),
  };
};

function ChatMessage({ message }) {
  const theme = useStore((s) => s.theme);
  const isDark = theme === 'dark';
  const isBot = message.role === 'assistant';

  return (
    <div className={`flex ${isBot ? 'justify-start' : 'justify-end'} mb-3`}>
      <div
        className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm ${
          isBot
            ? `${
                message.isError
                  ? isDark
                    ? 'bg-red-950'
                    : 'bg-red-50'
                  : isDark
                    ? 'bg-slate-800'
                    : 'bg-white'
              } border-2 ${isDark ? 'border-slate-600' : 'border-slate-900'}`
            : `border-2 ${isDark ? 'border-slate-600' : 'border-slate-900'} ${
                isDark ? 'bg-yellow-700' : 'bg-yellow-400'
              }`
        }`}
        style={
          isBot
            ? { color: isDark ? '#f0e7dc' : '#201a15' }
            : { color: isDark ? '#1a1a1a' : '#1a1a1a' }
        }
      >
        <div className="flex items-start gap-2">
          {isBot && (
            <HelpCircle
              className="mt-0.5 h-4 w-4 flex-shrink-0"
              style={{
                color: message.isError
                  ? isDark
                    ? '#ef4444'
                    : '#dc2626'
                  : isDark
                    ? '#f59e0b'
                    : '#d97706',
              }}
            />
          )}
          <p className="whitespace-pre-wrap break-all leading-relaxed">
            {message.text}
          </p>
        </div>
      </div>
    </div>
  );
}

function SuggestedButton({ text, onClick }) {
  const theme = useStore((s) => s.theme);
  const isDark = theme === 'dark';

  return (
    <button
      onClick={() => onClick(text)}
      className={`rounded-full border-2 px-3 py-1.5 text-xs font-bold transition-all hover:scale-105 ${
        isDark
          ? 'border-slate-600 bg-slate-800 text-slate-300 hover:bg-slate-700'
          : 'border-slate-900 bg-white text-slate-700 hover:bg-yellow-400'
      }`}
    >
      {text}
    </button>
  );
}

export default function ChatWidget() {
  const theme = useStore((s) => s.theme);
  const isDark = theme === 'dark';
  const authUser = useStore((s) => s.authUser);
  const rooms = useStore((s) => s.rooms);
  const location = useLocation();

  const [isOpen, setIsOpen] = useState(false);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState(() => [
    makeMessage(
      'assistant',
      "Hi! I'm CampusSync Assistant. Ask me anything about bookings, rooms, approvals, and navigation."
    ),
  ]);
  const messagesEndRef = useRef(null);

  const historyForRequest = useMemo(
    () =>
      messages.slice(-8).map((message) => ({
        role: message.role,
        content: message.text,
      })),
    [messages]
  );

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({
      behavior: window.innerWidth < 640 ? 'auto' : 'smooth',
    });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const sendMessage = async (text) => {
    const cleanText = text.trim();
    if (!cleanText || isLoading) return;

    const userMessage = makeMessage('user', cleanText);
    setMessages((prev) => [...prev, userMessage]);
    setInputText('');
    setIsLoading(true);

    try {
      const needsRoomData = NEEDS_ROOM_DATA_REGEX.test(cleanText);
      const needsBookingData = NEEDS_BOOKING_DATA_REGEX.test(cleanText);

      const liveData = {};
      if (needsRoomData) {
        liveData.rooms = summarizeRoomsForChat(rooms, cleanText);
      }

      if (needsBookingData && authUser?.uid && authUser?.role === 'student') {
        try {
          const myBookings = await getBookingsForStudent(authUser.uid);
          liveData.myBookings = summarizeBookingsForChat(myBookings);
        } catch (bookingError) {
          liveData.bookingDataNote =
            bookingError?.message || 'Could not fetch booking data right now.';
        }
      }

      const reply = await askCampusAssistant({
        message: cleanText,
        history: historyForRequest,
        context: {
          route: location.pathname,
          role: authUser?.role || 'unknown',
          liveData,
        },
      });

      setMessages((prev) => [...prev, makeMessage('assistant', reply)]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        makeMessage(
          'assistant',
          error?.message ||
            'Assistant is currently unavailable. Please try again.',
          true
        ),
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePromptClick = (prompt) => {
    sendMessage(prompt);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    await sendMessage(inputText);
  };

  if (!authUser) return null;

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed bottom-4 right-4 z-50 flex h-14 w-14 items-center justify-center rounded-full border-2 border-slate-900 transition-all hover:scale-110 hover:rotate-3 sm:bottom-6 sm:right-6 ${
          isDark ? 'bg-yellow-600' : 'bg-yellow-400'
        }`}
        style={{
          boxShadow: isDark
            ? '4px 4px 0px 0px #000000'
            : '4px 4px 0px 0px #0f172a',
        }}
      >
        {isOpen ? (
          <X className="h-6 w-6 text-slate-900" />
        ) : (
          <MessageCircle className="h-6 w-6 text-slate-900" />
        )}
      </button>

      {/* Chat Panel */}
      {isOpen && (
        <div
          className={`fixed bottom-20 left-2 right-2 z-40 flex max-h-[calc(100vh-5rem)] flex-col overflow-hidden rounded-2xl border-2 sm:bottom-24 sm:left-auto sm:right-6 sm:w-[350px] sm:max-w-[calc(100vw-48px)] ${
            isDark
              ? 'border-slate-700 bg-[#1a1a1a]'
              : 'border-slate-900 bg-white'
          } shadow-[6px_6px_0px_0px_#0f172a]`}
          style={isDark ? { boxShadow: '6px 6px 0px 0px #000000' } : {}}
        >
          {/* Header */}
          <div
            className={`flex items-center justify-between rounded-t-xl border-b-2 px-4 py-4 ${
              isDark ? 'border-slate-700' : 'border-slate-900'
            }`}
          >
            <div className="flex items-center gap-2">
              <HelpCircle
                className="h-5 w-5"
                style={{ color: isDark ? '#f59e0b' : '#d97706' }}
              />
              <span
                className="font-black"
                style={{ color: isDark ? '#f0e7dc' : '#201a15' }}
              >
                CampusSync Help
              </span>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className={`rounded-lg p-1 ${
                isDark ? 'hover:bg-slate-800' : 'hover:bg-slate-100'
              }`}
            >
              <X
                className="h-4 w-4"
                style={{ color: isDark ? '#a0a0a0' : '#625041' }}
              />
            </button>
          </div>

          {/* Messages */}
          <div className="min-h-32 max-h-[45vh] overflow-y-auto p-4 sm:h-72 sm:max-h-none">
            {messages.map((msg) => (
              <ChatMessage key={msg.id} message={msg} />
            ))}
            {isLoading && (
              <div className="mb-2 flex justify-start">
                <div
                  className={`inline-flex items-center gap-2 rounded-2xl border-2 px-3 py-2 text-xs ${
                    isDark
                      ? 'border-slate-600 bg-slate-800 text-slate-300'
                      : 'border-slate-900 bg-white text-slate-700'
                  }`}
                >
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  Thinking...
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Prompt Buttons */}
          <div className="flex flex-wrap gap-2 px-4 pb-2">
            {starterPrompts.map((prompt, idx) => (
              <SuggestedButton
                key={idx}
                text={prompt}
                onClick={handlePromptClick}
              />
            ))}
          </div>

          {/* Input */}
          <form onSubmit={handleSubmit} className="px-4 pb-2">
            <div
              className={`flex items-center gap-2 rounded-xl border-2 p-2 ${
                isDark
                  ? 'border-slate-700 bg-slate-900'
                  : 'border-slate-900 bg-white'
              }`}
            >
              <input
                value={inputText}
                onChange={(event) => setInputText(event.target.value)}
                placeholder="Ask about bookings, rooms, approvals..."
                className={`w-full bg-transparent px-2 py-1.5 text-sm outline-none ${
                  isDark
                    ? 'text-slate-200 placeholder:text-slate-500'
                    : 'text-slate-800 placeholder:text-slate-400'
                }`}
                disabled={isLoading}
                maxLength={500}
              />
              <button
                type="submit"
                disabled={isLoading || !inputText.trim()}
                className={`rounded-lg border-2 border-slate-900 p-2 transition-all ${
                  isLoading || !inputText.trim()
                    ? isDark
                      ? 'cursor-not-allowed bg-slate-700 text-slate-500'
                      : 'cursor-not-allowed bg-slate-100 text-slate-400'
                    : isDark
                      ? 'bg-yellow-600 text-slate-900 hover:scale-105'
                      : 'bg-yellow-400 text-slate-900 hover:scale-105'
                }`}
                aria-label="Send message"
              >
                <Send className="h-4 w-4" />
              </button>
            </div>
          </form>

          {/* Close Button */}
          <div
            className={`flex justify-center rounded-b-xl border-t-2 p-3 ${
              isDark ? 'border-slate-700' : 'border-slate-900'
            }`}
          >
            <button
              onClick={() => setIsOpen(false)}
              className={`rounded-xl border-2 border-slate-900 px-6 py-2 font-bold transition-all ${
                isDark
                  ? 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                  : 'bg-white text-slate-700 hover:bg-yellow-400'
              }`}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
}
