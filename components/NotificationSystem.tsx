
import React, { useEffect } from 'react';
import { X, CheckCircle, Info, AlertCircle } from 'lucide-react';
import { Notification } from '../types';

interface NotificationSystemProps {
  notifications: Notification[];
  onDismiss: (id: string) => void;
}

const NotificationSystem: React.FC<NotificationSystemProps> = ({ notifications, onDismiss }) => {
  return (
    <div className="fixed top-4 right-4 z-[100] flex flex-col gap-3 pointer-events-none w-full max-w-sm">
      {notifications.map((note) => (
        <NotificationToast key={note.id} note={note} onDismiss={onDismiss} />
      ))}
    </div>
  );
};

const NotificationToast: React.FC<{ note: Notification; onDismiss: (id: string) => void }> = ({ note, onDismiss }) => {
  useEffect(() => {
    const timer = setTimeout(() => onDismiss(note.id), 5000);
    return () => clearTimeout(timer);
  }, [note.id, onDismiss]);

  const icons = {
    success: <CheckCircle className="w-5 h-5 text-green-500" />,
    info: <Info className="w-5 h-5 text-blue-500" />,
    warning: <AlertCircle className="w-5 h-5 text-amber-500" />,
  };

  const colors = {
    success: 'border-green-100 bg-green-50/90',
    info: 'border-blue-100 bg-blue-50/90',
    warning: 'border-amber-100 bg-amber-50/90',
  };

  return (
    <div className={`pointer-events-auto flex items-start gap-3 p-4 rounded-2xl border backdrop-blur-md shadow-lg animate-in slide-in-from-right duration-300 ${colors[note.type]}`}>
      <div className="mt-0.5">{icons[note.type]}</div>
      <div className="flex-1">
        <h4 className="text-sm font-bold text-slate-900">{note.title}</h4>
        <p className="text-xs text-slate-600 mt-0.5">{note.message}</p>
      </div>
      <button 
        onClick={() => onDismiss(note.id)}
        className="p-1 hover:bg-black/5 rounded-lg transition-colors"
      >
        <X className="w-4 h-4 text-slate-400" />
      </button>
    </div>
  );
};

export default NotificationSystem;
