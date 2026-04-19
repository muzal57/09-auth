"use client";

import { useEffect } from "react";
import { createPortal } from "react-dom";
import css from "./Modal.module.css";

interface ModalProps {
  title: string;
  children: React.ReactNode;
  onClose: () => void;
}

const Modal = ({ title, children, onClose }: ModalProps) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const modalLayout = (
    <div className={css.overlay} onClick={handleBackdropClick}>
      <div className={css.modal} role="dialog" aria-modal="true">
        <div className={css.header}>
          <h2>{title}</h2>
          <button
            onClick={onClose}
            className={css.close}
            aria-label="Close modal"
          >
            ×
          </button>
        </div>
        <div className={css.body}>{children}</div>
      </div>
    </div>
  );

  return createPortal(modalLayout, document.body);
};

export default Modal;
