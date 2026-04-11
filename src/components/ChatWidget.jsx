import { useState, useEffect, useRef } from 'react';
import useStore from '../store/useStore';
import { MessageCircle, X, HelpCircle } from 'lucide-react';

const faqData = [
  {
    question: 'How do I book a room?',
    answer:
      "Go to Dashboard → Select a Room → Click 'Request Booking' → Fill in the form → Submit. Wait for Faculty approval.",
  },
  {
    question: 'What do the room statuses mean?',
    answer:
      '🟢 FREE = Room is available\n🟡 RESERVED = Room is booked temporarily\n🔴 OCCUPIED = Room is currently in use',
  },
  {
    question: 'Who can toggle room status?',
    answer:
      'Only Faculty and Admin users can toggle room status (Free ↔ Occupied).',
  },
  {
    question: 'How does the QR code work?',
    answer:
      "Click 'QR' on any room card to generate a QR code. Faculty can scan it to quickly toggle that room's status.",
  },
  {
    question: 'Can I see all rooms on a floor?',
    answer:
      "Yes! Click 'Floor Plan' in the navbar to view rooms organized by building and floor.",
  },
  {
    question: 'How do I login?',
    answer:
      'Use your registered email and password. Students, Faculty, and Admin have different dashboards.',
  },
  {
    question: 'What if a room is broken?',
    answer:
      'Contact your Admin or Faculty. They can note issues in the room status or report problems.',
  },
];

function ChatMessage({ message, isBot }) {
  const theme = useStore((s) => s.theme);
  const isDark = theme === 'dark';

  return (
    <div className={`flex ${isBot ? 'justify-start' : 'justify-end'} mb-3`}>
      <div
        className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm ${
          isBot
            ? `${isDark ? 'bg-slate-800' : 'bg-white'} border-2 ${
                isDark ? 'border-slate-600' : 'border-slate-900'
              }`
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
              style={{ color: isDark ? '#f59e0b' : '#d97706' }}
            />
          )}
          <p className="whitespace-pre-wrap leading-relaxed">{message}</p>
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

  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      text: "Hi! I'm the CampusSync Help Assistant. Click a question below to get answers!",
      isBot: true,
    },
  ]);
  const messagesEndRef = useRef(null);

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

  const handleQuestionClick = (clickedQuestion) => {
    const faq = faqData.find((f) => f.question === clickedQuestion);
    if (faq) {
      setMessages((prev) => [
        ...prev,
        { text: faq.question, isBot: false },
        { text: faq.answer, isBot: true },
      ]);
    }
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
            {messages.map((msg, idx) => (
              <ChatMessage key={idx} message={msg.text} isBot={msg.isBot} />
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* FAQ Buttons */}
          <div className="flex flex-wrap gap-2 px-4 pb-2">
            {faqData.slice(0, 4).map((faq, idx) => (
              <SuggestedButton
                key={idx}
                text={faq.question}
                onClick={handleQuestionClick}
              />
            ))}
          </div>

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
