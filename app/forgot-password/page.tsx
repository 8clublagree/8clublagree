// app/forgot-password/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import UnauthenticatedLayout from "@/components/layout/UnauthenticatedLayout";
import { Button, Form, Input, Typography } from "antd";
import { MailOutlined } from "@ant-design/icons";
import { useForgotPassword } from "@/lib/api";

const { Title, Text } = Typography;

type Step = "email" | "otp";

export default function ForgotPasswordPage() {
  const [step, setStep] = useState<Step>("email");
  const [email, setEmail] = useState("");
  const [form] = Form.useForm();
  const [otpForm] = Form.useForm();
  const { requestPasswordReset, verifyOtp, loading } = useForgotPassword();
  const router = useRouter();

  const handleEmailSubmit = async (values: { email: string }) => {
    const { data, error } = await requestPasswordReset({ email: values.email });
    if (error) {
      form.setFields([{ name: "email", errors: [error] }]);
      return;
    }
    setEmail(values.email.trim().toLowerCase());
    setStep("otp");
    otpForm.resetFields();
  };

  const handleOtpSubmit = async (values: { otp: string }) => {
    const otp = values.otp?.trim().replace(/\s/g, "") ?? "";
    const { data, error } = await verifyOtp({ email, otp });
    if (error) {
      otpForm.setFields([{ name: "otp", errors: [error] }]);
      return;
    }
    if (data?.redirectUrl) {
      router.push(data.redirectUrl);
    }
  };

  return (
    <UnauthenticatedLayout>
      <div className="py-[150px] flex items-center justify-center px-4">
        <div className="w-full max-w-md sm:max-w-lg bg-white p-6 sm:p-8">
          <div className="text-center space-y-2">
            <Title level={3} className="!mb-0">
              Forgot password?
            </Title>
            <Text className="text-slate-500">
              {step === "email"
                ? "Enter your email and we'll send you a 6-digit code."
                : "Enter the 6-digit code we sent to your email."}
            </Text>
          </div>

          <div className="mt-8">
            {step === "email" && (
              <Form
                form={form}
                name="forgot-password-email"
                onFinish={handleEmailSubmit}
                layout="vertical"
                size="large"
                requiredMark={false}
              >
                <Form.Item
                  name="email"
                  rules={[
                    { required: true, message: "Please enter your email" },
                    { type: "email", message: "Please enter a valid email" },
                  ]}
                >
                  <Input
                    prefix={<MailOutlined className="text-slate-400" />}
                    placeholder="Email"
                  />
                </Form.Item>

                <Form.Item>
                  <Button
                    block
                    loading={loading}
                    disabled={loading}
                    htmlType="submit"
                    className={`${loading ? "!bg-slate-200 hover:!bg-slate-200" : "!bg-[#800020] hover:!bg-[#800020]"} !border-none !text-white font-medium rounded-lg shadow-sm transition-transform duration-200 hover:scale-[1.02]`}
                  >
                    Send code
                  </Button>
                </Form.Item>
              </Form>
            )}

            {step === "otp" && (
              <Form
                form={otpForm}
                name="forgot-password-otp"
                onFinish={handleOtpSubmit}
                layout="vertical"
                size="large"
                requiredMark={false}
              >
                <Form.Item
                  name="otp"
                  rules={[
                    { required: true, message: "Please enter the code" },
                    {
                      pattern: /^\d{6}$/,
                      message: "Code must be 6 digits",
                    },
                  ]}
                >
                  <Input
                    placeholder="000000"
                    maxLength={6}
                    className="text-center text-2xl tracking-[0.5em] font-mono"
                    inputMode="numeric"
                    autoComplete="one-time-code"
                  />
                </Form.Item>

                <Button
                  block
                  loading={loading}
                  disabled={loading}
                  htmlType="submit"
                  className={`${loading ? "!bg-slate-200 hover:!bg-slate-200" : "!bg-[#800020] hover:!bg-[#800020]"} !border-none !text-white font-medium rounded-lg shadow-sm transition-transform duration-200 hover:scale-[1.02]`}
                >
                  Verify and continue
                </Button>

                <Button
                  type="link"
                  block
                  className="!text-slate-500 mt-2"
                  onClick={() => setStep("email")}
                  disabled={loading}
                >
                  Use a different email
                </Button>
              </Form>
            )}
          </div>
        </div>
      </div>
    </UnauthenticatedLayout>
  );
}
