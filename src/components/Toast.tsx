import React from 'react';

interface ToastProps {
  message: string;
  isVisible: boolean;
  onClose: () => void;
}

export const Toast: React.FC<ToastProps> = ({ message, isVisible, onClose }) => {
  return (
    <div
      className={`fixed bottom-6 inset-x-margin max-w-sm mx-auto bg-inverse-surface text-inverse-on-surface py-3 px-4 rounded-xl shadow-xl flex items-center justify-between gap-3 transform transition-all duration-300 z-50 ${
        isVisible ? 'translate-y-0 opacity-100' : 'translate-y-24 opacity-0 pointer-events-none'
      }`}
      role="alert"
    >
      <div className="flex items-center gap-2">
        <span className="material-symbols-outlined text-primary-fixed text-[20px]">
          check_circle
        </span>
        <span className="font-label-md text-label-md">{message}</span>
      </div>
      <button
        onClick={onClose}
        className="text-inverse-on-surface opacity-75 hover:opacity-100 transition-opacity p-1"
        aria-label="Close notification"
      >
        <span className="material-symbols-outlined text-[18px]">close</span>
      </button>
    </div>
  );
};
