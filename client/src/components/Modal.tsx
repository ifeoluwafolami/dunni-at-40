import React, { useEffect, useRef, type ReactNode } from "react";
import ReactDOM from "react-dom";
import { getFocusableElements, nextFocus, usePortal } from "./HelperFunctions";

interface FrameProps {
  closeOnClickOutside?: boolean;
  closeOnEsc?: boolean;
  onClose: () => void;
  open?: boolean;
  children: ReactNode;
}

export const ModalFrame: React.FC<FrameProps> = ({
  children,
  closeOnClickOutside = true,
  closeOnEsc = true,
  onClose,
  open = true,
}) => {
  const portal = usePortal();
  const previousFocus = useRef<HTMLElement | null>(null);
  const previousOverflow = useRef("");

  const container = useRef<HTMLDivElement | null>(null);

  // Close on click outside
  const onOverlayClick = (e: React.MouseEvent) => {
    if (!container.current?.contains(e.target as Node)) onClose();
  };

  // ESC + Tab key handling
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (!open) return;

      switch (e.key) {
        case "Escape":
          if (closeOnEsc) onClose();
          break;
        case "Tab":
          e.preventDefault();
          nextFocus(getFocusableElements(container.current), !e.shiftKey);
          break;
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [closeOnEsc, onClose, open]);

  // Scroll + focus lock
  useEffect(() => {
    document.getElementById("root")?.setAttribute("aria-hidden", open.toString());
    portal.current?.setAttribute("aria-hidden", (!open).toString());

    if (open) {
      previousOverflow.current = document.body.style.overflow;
      document.body.style.overflow = "hidden";

      previousFocus.current = document.activeElement as HTMLElement;
      nextFocus(getFocusableElements(container.current));
    } else {
      document.body.style.overflow = previousOverflow.current;
      previousFocus.current?.focus?.();
      previousFocus.current = null;
    }

    return () => {
      if (open) document.body.style.overflow = previousOverflow.current;
    };
  }, [open, portal]);

  return ReactDOM.createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 sm:p-6"
      onClick={closeOnClickOutside ? onOverlayClick : undefined}
      role="dialog"
      aria-modal="true"
    >
      <div
        ref={container}
        className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-xl bg-white p-6 shadow-xl sm:p-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          aria-label="Close modal"
          className="absolute top-4 right-4 text-2xl font-bold text-gray-500 hover:text-gray-800 focus:outline-none"
        >
          ×
        </button>

        {children}
      </div>
    </div>,
    portal.current
  );
};

// Subcomponents
interface SectionProps {
  children: ReactNode;
}

export const ModalHead: React.FC<SectionProps> = ({ children }) => (
  <div className="mb-4 text-xl font-bold text-gray-800">{children}</div>
);

export const ModalBody: React.FC<SectionProps> = ({ children }) => (
  <div className="text-gray-700 space-y-4">{children}</div>
);

export const ModalFooter: React.FC<SectionProps> = ({ children }) => (
  <div className="mt-6 flex flex-col sm:flex-row sm:justify-end gap-3">{children}</div>
);
