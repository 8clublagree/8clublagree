"use client";

import { Modal, Input, Row, Button, Typography } from "antd";
import { useEffect, useState } from "react";

export interface AdminPasswordConfirmModalProps {
  /** Whether the modal is open */
  open: boolean;
  /** Called when the user cancels or closes the modal */
  onCancel: () => void;
  /**
   * Called when the user submits the password.
   * Resolve to close and proceed; throw with an error message to show validation error.
   */
  onConfirm: (password: string) => Promise<void>;
  /** Modal title */
  title?: string;
  /** Short description shown above the password field */
  description?: string;
  /** Placeholder for the password input */
  placeholder?: string;
  /** Confirm button label */
  confirmLabel?: string;
  /** Cancel button label */
  cancelLabel?: string;
  /** Modal width (number or string e.g. "90%") */
  width?: number | string;
  /** Whether to center the modal */
  centered?: boolean;
  /** Optional class for the primary (confirm) button */
  confirmButtonClassName?: string;
  /** Use compact layout (e.g. for mobile) */
  compact?: boolean;
}

const DEFAULT_TITLE = "Confirm administrator password";
const DEFAULT_DESCRIPTION =
  "To confirm this transaction, please input the administrator password.";
const DEFAULT_PLACEHOLDER = "Administrator password";
const DEFAULT_CONFIRM_LABEL = "Confirm";
const DEFAULT_CANCEL_LABEL = "Cancel";

export function AdminPasswordConfirmModal({
  open,
  onCancel,
  onConfirm,
  title = DEFAULT_TITLE,
  description = DEFAULT_DESCRIPTION,
  placeholder = DEFAULT_PLACEHOLDER,
  confirmLabel = DEFAULT_CONFIRM_LABEL,
  cancelLabel = DEFAULT_CANCEL_LABEL,
  width = 440,
  centered = true,
  confirmButtonClassName,
  compact = false,
}: AdminPasswordConfirmModalProps) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const resetState = () => {
    setPassword("");
    setError("");
    setLoading(false);
  };

  useEffect(() => {
    if (!open) resetState();
  }, [open]);

  const handleCancel = () => {
    resetState();
    onCancel();
  };

  const handleSubmit = async () => {
    const trimmed = password.trim();
    if (!trimmed) {
      setError("Please enter your password.");
      return;
    }

    setError("");
    setLoading(true);
    try {
      await onConfirm(trimmed);
      resetState();
      onCancel();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Verification failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title={title}
      open={open}
      closable={false}
      maskClosable={false}
      keyboard={false}
      onCancel={handleCancel}
      destroyOnHidden
      width={compact ? "90%" : width}
      centered={centered}
      footer={
        <Row justify="end" gutter={8} className="gap-x-[10px]">
          <Button onClick={handleCancel}>{cancelLabel}</Button>
          <Button

            loading={loading}
            onClick={handleSubmit}
            className={confirmButtonClassName}
          >
            {confirmLabel}
          </Button>
        </Row>
      }
    >
      <Row className="gap-y-2 pt-2">
        <Typography.Text className={compact ? "text-sm" : undefined}>
          {description}
        </Typography.Text>
        <Input.Password
          placeholder={placeholder}
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
            setError("");
          }}
          status={error ? "error" : undefined}
          onPressEnter={handleSubmit}
          size={compact ? "middle" : "large"}
          className="mt-2 w-full"
        />
        {error && (
          <Typography.Text type="danger" className="text-sm">
            {error}
          </Typography.Text>
        )}
      </Row>
    </Modal>
  );
}
