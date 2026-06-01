import React from "react";

interface Props {
  isOpen: boolean;
  title: string;
  onClose: () => void;
  children: React.ReactNode;
}

export function BaseModal({ isOpen, title, onClose, children }: Props) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-customblack/60 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-customgrey border border-customwhite/10 p-6 rounded-xl w-full max-w-lg max-h-[90vh] overflow-y-auto text-customwhite">
        <div className="flex justify-between mb-4">
          <h2 className="text-xl font-bold">{title}</h2>
          <button
            onClick={onClose}
            className="text-customgrey hover:text-customwhite text-xl"
          >
            ✕
          </button>
        </div>

        {children}
      </div>
    </div>
  );
}
