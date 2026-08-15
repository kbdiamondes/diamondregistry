"use client";

interface ToastProps {
  message: string;
  onClose: () => void;
}

export function Toast({ message, onClose }: ToastProps) {
  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 toast-animate">
      <div className="bg-foreground text-background px-4 py-3 rounded-xl shadow-lg text-sm font-medium flex items-center gap-3 max-w-sm">
        <span>{message}</span>
        <button
          onClick={onClose}
          className="text-background/60 hover:text-background transition-colors shrink-0"
          aria-label="Dismiss"
        >
          ×
        </button>
      </div>
    </div>
  );
}
