"use client";

import { message } from "antd";
import { useCallback } from "react";

type MessageType = "success" | "error" | "info" | "warning" | "loading";

export const useAppMessage = () => {
  const [messageApi, contextHolder] = message.useMessage();

  const showMessage = useCallback(
    ({
      type,
      content,
      duration = 5,
    }: {
      type: MessageType;
      content: string;
      duration?: number;
    }) => {
      messageApi.open({ type, content, duration });
    },
    [messageApi]
  );

  return { showMessage, contextHolder };
};
