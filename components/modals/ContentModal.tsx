"use client";

import { Modal } from "antd";

export interface ContentModalProps {
  /** Whether the modal is open */
  open: boolean;
  /** Called when the user closes the modal (X, mask, or escape) */
  onClose: () => void;
  /** Modal title */
  title?: string;
  /** Modal content */
  children: React.ReactNode;
  /** Modal width (number or string e.g. "90%", "720px") */
  width?: number | string;
  /** Whether clicking the mask closes the modal */
  maskClosable?: boolean;
  /** Whether escape key closes the modal */
  keyboard?: boolean;
  /** Optional class for the modal wrapper */
  className?: string;
}

export function ContentModal({
  open,
  onClose,
  title,
  children,
  width = 720,
  maskClosable = true,
  keyboard = true,
  className,
}: ContentModalProps) {
  return (
    <Modal
      title={title}
      open={open}
      onCancel={onClose}
      footer={null}
      width={width}
      destroyOnClose
      maskClosable={maskClosable}
      keyboard={keyboard}
      className={className}
      styles={{
        body: {
          maxHeight: "70vh",
          overflowY: "auto",
        },
      }}
    >
      {children}
    </Modal>
  );
}
