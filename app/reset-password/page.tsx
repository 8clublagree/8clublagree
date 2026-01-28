// app/forgot-password/page.tsx
"use client";

import { useState } from "react";
import UnauthenticatedLayout from "@/components/layout/UnauthenticatedLayout";
import { supabase } from "@/lib/supabase";
import { Button, Col, Form, Input, Row, Typography } from "antd";
import { MailOutlined } from "@ant-design/icons";
import { useManagePassword } from "@/lib/api";

const { Title, Text } = Typography;

export default function ResetPasswordPage() {
  const [changed, setChanged] = useState(false);
  const [form] = Form.useForm();
  const { sendResetLink, loading } = useManagePassword();

  const handleSubmit = async (values: { email: string }) => {
    const response = await sendResetLink({ email: values.email });
  };

  return (
    <div className="py-[150px] flex items-center justify-center px-4">
      <div className="w-full max-w-md sm:max-w-lg bg-white p-6 sm:p-8">
        <div className="text-center space-y-2">
          <Title level={3} className="!mb-0">
            Enter your new password
          </Title>
          <Text className="text-slate-500">
            You will be redirected to the login screen after a successful
            update.
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
              {/* New Password */}
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

              {/* Confirm Password */}
              <Col xs={24} sm={12}>
                <Form.Item
                  label="Confirm New Password"
                  name="confirm_new_password"
                  rules={[
                    {
                      required: true,
                      message: "Please confirm your new password",
                    },
                  ]}
                >
                  <Input.Password placeholder="Confirm New Password" />
                </Form.Item>
              </Col>
            </Row>

            <Button
              block
              loading={loading}
              disabled={loading}
              htmlType="submit"
              className={`${loading ? "!bg-slate-200 hover:!bg-slate-200" : "!bg-[#36013F] hover:!bg-[#4a0358]"} !border-none !text-white font-medium rounded-lg shadow-sm transition-transform duration-200 hover:scale-[1.02]`}
            >
              Change Password
            </Button>

            {changed && (
              <Text className="block text-center text-green-600 mt-4">
                Password reset email sent ✔
              </Text>
            )}
          </Form>
        </div>
      </div>
    </div>
  );
}
