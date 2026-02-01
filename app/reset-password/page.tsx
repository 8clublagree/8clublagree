// app/reset-password/page.tsx
"use client";

import { Suspense, useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import UnauthenticatedLayout from "@/components/layout/UnauthenticatedLayout";
import { Button, Col, Form, Input, Row, Typography } from "antd";
import { useResetPasswordWithToken } from "@/lib/api";
import { supabase } from "@/lib/supabase";
import { useAppMessage } from "@/components/ui/message-popup";

const { Title, Text } = Typography;

const REDIRECT_DELAY_MS = 2500;

function ResetPasswordFallback() {
  return (
    <UnauthenticatedLayout>
      <div className="py-[150px] flex items-center justify-center px-4">
        <div className="w-full max-w-md text-center">
          <Text className="text-slate-500">Loading…</Text>
        </div>
      </div>
    </UnauthenticatedLayout>
  );
}

function ResetPasswordContent() {
  const [tokenValid, setTokenValid] = useState<boolean | null>(null);
  const [changed, setChanged] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token");
  const { showMessage, contextHolder } = useAppMessage();
  const { validateResetToken, resetPasswordWithToken, loading: tokenLoading } =
    useResetPasswordWithToken();

  useEffect(() => {
    if (!token) {
      setTokenValid(false);
      return;
    }
    validateResetToken(token).then(({ data }) => {
      setTokenValid(Boolean(data?.valid));
    });
  }, [token]);

  const handleSubmit = async (values: {
    new_password: string;
    confirm_new_password: string;
  }) => {
    setLoading(true);
    try {
      if (token && tokenValid) {
        const { error } = await resetPasswordWithToken({
          token,
          new_password: values.new_password,
        });
        if (error) {
          form.setFields([{ name: "new_password", errors: [error] }]);
          return;
        }
      } else {
        const { error } = await supabase.auth.updateUser({
          password: values.new_password,
        });
        if (error) {
          form.setFields([{ name: "new_password", errors: [error.message] }]);
          return;
        }
      }
      setChanged(true);
      showMessage({
        type: "success",
        content: "Password updated successfully. You'll be redirected to login.",
      });
      setTimeout(() => router.push("/login"), REDIRECT_DELAY_MS);
    } finally {
      setLoading(false);
    }
  };

  const isTokenFlow = token != null;
  const checkingToken = isTokenFlow && tokenValid === null;
  const showForm = !isTokenFlow || tokenValid === true;
  const showInvalidToken = isTokenFlow && tokenValid === false;

  if (checkingToken) {
    return (
      <UnauthenticatedLayout>
        {contextHolder}
        <div className="py-[150px] flex items-center justify-center px-4">
          <div className="w-full max-w-md text-center">
            <Text className="text-slate-500">Checking link…</Text>
          </div>
        </div>
      </UnauthenticatedLayout>
    );
  }

  if (showInvalidToken) {
    return (
      <UnauthenticatedLayout>
        {contextHolder}
        <div className="py-[150px] flex items-center justify-center px-4">
          <div className="w-full max-w-md sm:max-w-lg bg-white p-6 sm:p-8 text-center space-y-4">
            <Title level={3} className="!mb-0">
              Invalid or expired link
            </Title>
            <Text className="text-slate-500 block">
              This password reset link is invalid or has expired. Please request
              a new one.
            </Text>
            <Link href="/forgot-password">
              <Button
                type="primary"
                className="!bg-[#800020] hover:!bg-[#800020] !border-none"
              >
                Request new code
              </Button>
            </Link>
          </div>
        </div>
      </UnauthenticatedLayout>
    );
  }

  const submitLoading = loading || (isTokenFlow && tokenLoading);

  return (
    <UnauthenticatedLayout>
      {contextHolder}
      <div className="py-[150px] flex items-center justify-center px-4">
        <div className="w-full max-w-md sm:max-w-lg bg-white p-6 sm:p-8">
          <div className="text-center space-y-2">
            <Title level={3} className="!mb-0">
              Enter your new password
            </Title>
            <Text className="text-slate-500">
              {isTokenFlow
                ? "Choose a new password and confirm it below."
                : "You will be redirected to the login screen after a successful update."}
            </Text>
          </div>

          <div className="mt-8">
            <Form
              form={form}
              name="reset-password"
              onFinish={handleSubmit}
              layout="vertical"
              size="large"
              requiredMark={false}
            >
              <Row gutter={[16, 16]}>
                <Col xs={24} sm={12}>
                  <Form.Item
                    label="New Password"
                    name="new_password"
                    rules={[
                      {
                        required: true,
                        message: "Please enter your new password",
                      },
                      {
                        min: 6,
                        message: "Password must be at least 6 characters",
                      },
                    ]}
                  >
                    <Input.Password placeholder="New Password" />
                  </Form.Item>
                </Col>

                <Col xs={24} sm={12}>
                  <Form.Item
                    label="Confirm New Password"
                    name="confirm_new_password"
                    dependencies={["new_password"]}
                    rules={[
                      {
                        required: true,
                        message: "Please confirm your new password",
                      },
                      ({ getFieldValue }) => ({
                        validator(_, value) {
                          if (
                            !value ||
                            getFieldValue("new_password") === value
                          ) {
                            return Promise.resolve();
                          }
                          return Promise.reject(
                            new Error("Passwords do not match"),
                          );
                        },
                      }),
                    ]}
                  >
                    <Input.Password placeholder="Confirm New Password" />
                  </Form.Item>
                </Col>
              </Row>

              <Button
                block
                loading={submitLoading}
                disabled={submitLoading || changed}
                htmlType="submit"
                className={`${submitLoading
                  ? "!bg-slate-200 hover:!bg-slate-200"
                  : "!bg-[#800020] hover:!bg-[#800020]"
                  } !border-none !text-white font-medium rounded-lg shadow-sm transition-transform duration-200 hover:scale-[1.02]`}
              >
                {isTokenFlow ? "Save new password" : "Change Password"}
              </Button>

              {changed && (
                <Text className="block text-center text-green-600 mt-4">
                  Password updated successfully ✔
                </Text>
              )}
            </Form>
          </div>
        </div>
      </div>
    </UnauthenticatedLayout>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<ResetPasswordFallback />}>
      <ResetPasswordContent />
    </Suspense>
  );
}
