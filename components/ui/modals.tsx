'use client';

import { useEffect } from "react";

// Custom confirmation modal - lightweight, no heavy dependencies
export function ConfirmModal({ isOpen, onClose, onConfirm, title, message }: {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-2xl border border-white/10 bg-black/90 p-6 shadow-2xl">
        <h3 className="text-lg font-medium text-white mb-2">{title}</h3>
        <p className="text-white/60 text-sm mb-6">{message}</p>
        
        <div className="flex gap-3 justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-white/5 text-white/60 hover:bg-white/10 hover:text-white transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 rounded-lg bg-white text-black hover:bg-white/90 transition-colors"
          >
            Create New Session
          </button>
        </div>
      </div>
    </div>
  );
}

// Toast notification - lightweight
export function Toast({ message, isVisible, onClose }: {
  message: string;
  isVisible: boolean;
  onClose: () => void;
}) {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(onClose, 3000);
      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose]);

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-[100] animate-in fade-in slide-in-from-bottom-4 duration-300">
      <div className="rounded-lg border border-white/10 bg-black/90 backdrop-blur-sm px-4 py-3 shadow-lg">
        <p className="text-sm text-white">{message}</p>
      </div>
    </div>
  );
}

// Error Modal Component - lightweight
export function ErrorModal({ 
  isOpen, 
  onClose, 
  error 
}: { 
  isOpen: boolean; 
  onClose: () => void; 
  error: any;
}) {
  if (!isOpen || !error) return null;

  const getErrorTitle = () => {
    if (error.error === 'quota_exceeded') return 'Rate Limit Exceeded';
    if (error.errorType === 'connection_error') return 'Connection Error';
    if (error.errorType === 'send_error') return 'Send Error';
    return 'Error';
  };

  const getErrorMessage = () => {
    if (error.message) return error.message;
    if (error.error) return error.error;
    return 'An unexpected error occurred. Please try again.';
  };

  const getLimitInfo = () => {
    if (error.limit) {
      return (
        <div className="mt-4 p-3 bg-white/5 rounded-lg border border-white/10">
          <p className="text-sm text-white/60 mb-2">Rate Limit Info:</p>
          <div className="text-sm text-white/80 space-y-1">
            <p>• Used: {error.limit.used} / {error.limit.max}</p>
            <p>• Window: {error.limit.window}</p>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-2xl border border-white/10 bg-black/90 p-6 shadow-2xl">
        <h3 className="text-lg font-medium text-white mb-3">{getErrorTitle()}</h3>
        <p className="text-white/70 mb-4">{getErrorMessage()}</p>
        {getLimitInfo()}
        <div className="flex justify-end mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-white text-black hover:bg-white/90 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
