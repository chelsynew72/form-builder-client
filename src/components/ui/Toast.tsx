import React, { useEffect, useState } from 'react';
import { cn } from '../../lib/utils';
import { CheckCircle, XCircle, Info, X } from 'lucide-react';

interface ToastProps {
  message: string;
  type?: 'success' | 'error' | 'info';
  duration?: number;
  onClose: () => void;
}

export function Toast({ message, type = 'info', duration = 3000, onClose }: ToastProps) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onClose, 300);
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const types = {
    success: {
      bg: 'bg-green-50 border-green-500',
      icon: CheckCircle,
      iconColor: 'text-green-500',
    },
    error: {
      bg: 'bg-red-50 border-red-500',
      icon: XCircle,
      iconColor: 'text-red-500',
    },
    info: {
      bg: 'bg-blue-50 border-blue-500',
      icon: Info,
      iconColor: 'text-blue-500',
    },
  };

  const config = types[type];
  const Icon = config.icon;

  return (
    <div
      className={cn(
        'fixed bottom-4 right-4 flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg border-l-4 transition-all duration-300 z-50',
        config.bg,
        isVisible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
      )}
    >
      <Icon className={cn('w-5 h-5', config.iconColor)} />
      <span className="text-sm font-medium text-gray-900">{message}</span>
      <button
        onClick={() => {
          setIsVisible(false);
          setTimeout(onClose, 300);
        }}
        className="text-gray-400 hover:text-gray-600 transition-colors ml-2"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}