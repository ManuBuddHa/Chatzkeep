"use client";

export default function NotificationPanel({ isOpen, notifications, onClose, onMarkAllRead }) {
  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 z-40" onClick={onClose} />
      <div className="absolute top-20 right-8 w-96 bg-white rounded-2xl shadow-xl border border-slate-200/80 z-50 overflow-hidden flex flex-col max-h-[500px]">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="font-bold text-slate-800 text-sm">Notifications</div>
          <button onClick={onMarkAllRead} className="text-xs font-bold text-healthcare-600 hover:text-healthcare-700 transition">
            Mark all read
          </button>
        </div>
        <div className="flex-1 overflow-y-auto divide-y divide-slate-50">
          {notifications.length === 0 ? (
            <div className="p-8 text-center text-xs text-slate-400 font-medium">No alerts found.</div>
          ) : (
            notifications.map(n => (
              <div key={n._id} className="p-4 flex gap-3 items-start hover:bg-slate-50">
                <div className="w-7 h-7 rounded-full bg-healthcare-100 text-healthcare-700 text-xs font-bold flex items-center justify-center shrink-0">H</div>
                <div>
                  <div className="text-xs font-bold text-slate-800">{n.title}</div>
                  <div className="text-[11px] text-slate-500 line-clamp-2">{n.body}</div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
}