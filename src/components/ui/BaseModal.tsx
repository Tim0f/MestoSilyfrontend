import React from "react";

interface BaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  width?: string;
  height?: string;
}

export default function BaseModal({
  isOpen,
  onClose,
  title,
  children,
  width = "max-w-2xl",
  height = "max-h-[90vh]",
}: BaseModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className={`bg-customgrey border border-white/10 rounded-xl w-full ${width} ${height} flex flex-col`}>
        
        {/* HEADER */}
        <div className="p-4 border-b border-white/10 flex justify-between items-center">
          <h2 className="text-xl font-bold text-white">{title}</h2>
          <button
            onClick={onClose}
            className="text-white text-2xl leading-none hover:text-customwhite"
          >
            ×
          </button>
        </div>

        {/* CONTENT (scrollable) */}
        <div className="overflow-y-auto p-6">{children}</div>
      </div>
    </div>
  );
}
