"use client";
import { ReactNode } from "react";

type Props = {
  open: boolean;
  title?: string;
  message?: ReactNode;
  onConfirm: () => void;
  onCancel: () => void;
};

export default function ConfirmModal({ open, title, message, onConfirm, onCancel }: Props) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-lg p-6 max-w-md w-full">
        <h2 className="text-lg font-semibold mb-4">{title || "Confirmar ação"}</h2>
        <div className="mb-6 text-gray-700">{message || "Tens a certeza?"}</div>
        <div className="flex justify-end space-x-3">
          <button
            onClick={onCancel}
            className="px-4 py-2 rounded-lg border hover:bg-gray-100"
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600"
          >
            Eliminar
          </button>
        </div>
      </div>
    </div>
  );
}
