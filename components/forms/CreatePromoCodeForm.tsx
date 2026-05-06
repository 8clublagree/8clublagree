"use client";

import { useEffect, useRef } from "react";
import { Form, Input, InputNumber, DatePicker, Select, Button, Row, Col, FormInstance } from "antd";
import dayjs, { Dayjs } from "dayjs";
import { PromoCodeProps } from "@/lib/props";

interface CreatePromoCodeFormProps {
  onSubmit: (values: PromoCodeProps) => void;
  onCancel: () => void;
  loading?: boolean;
  initialValues?: PromoCodeProps | null;
  isEdit?: boolean;
  form: FormInstance;
  clearSignal?: boolean;
}

export default function CreatePromoCodeForm({
  onSubmit,
  onCancel,
  loading = false,
  initialValues = null,
  isEdit = false,
  form,
  clearSignal,
}: CreatePromoCodeFormProps) {
  const initialRef = useRef<any>(null);

  useEffect(() => {
    if (initialRef.current) {
      form.setFieldsValue(initialRef.current);
    }
  }, [clearSignal, form]);

  useEffect(() => {
    if (initialValues) {
      const initial = {
        code: initialValues.code,
        discount: initialValues.discount,
        status: initialValues.status,
        expiration_date: initialValues.expiration_date
          ? dayjs(initialValues.expiration_date)
          : null,
      };
      initialRef.current = initial;
      form.setFieldsValue(initial);
      return;
    }

    form.setFieldsValue({
      status: "active",
      expiration_date: null,
    });
  }, [initialValues, form]);

  const handleFinish = (values: {
    code: string;
    discount: number;
    status: string;
    expiration_date: Dayjs;
  }) => {
    const payload: PromoCodeProps = {
      code: values.code?.trim().toUpperCase(),
      discount: values.discount,
      status: values.status,
      expiration_date: values.expiration_date?.toISOString(),
    };

    onSubmit(payload);

    if (!isEdit) {
      form.resetFields();
      form.setFieldValue("status", "active");
    }
  };

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={handleFinish}
      requiredMark="optional"
      className="w-full"
    >
      <Row gutter={[16, 0]}>
        <Col xs={24} sm={24}>
          <Form.Item
            name="code"
            label="Promo Code"
            rules={[
              { required: true, message: "Please enter a promo code" },
              { min: 3, message: "Promo code should be at least 3 characters" },
            ]}
          >
            <Input
              size="large"
              placeholder="e.g. MAY20"
              onChange={(e) => {
                form.setFieldValue("code", e.target.value.toUpperCase());
              }}
            />
          </Form.Item>
        </Col>

        <Col xs={24} sm={12}>
          <Form.Item
            name="discount"
            label="Discount (%)"
            rules={[
              { required: true, message: "Please enter discount percentage" },
              { type: "number", min: 1, max: 100, message: "Discount should be between 1 and 100" },
            ]}
          >
            <InputNumber
              size="large"
              className="w-full"
              min={1}
              max={100}
              precision={2}
              placeholder="Discount percentage"
            />
          </Form.Item>
        </Col>

        <Col xs={24} sm={12}>
          <Form.Item
            name="status"
            label="Status"
            rules={[{ required: true, message: "Please select a status" }]}
          >
            <Select
              size="large"
              options={[
                { label: "Active", value: "active" },
                { label: "Expired", value: "expired" },
              ]}
            />
          </Form.Item>
        </Col>

        <Col xs={24}>
          <Form.Item
            name="expiration_date"
            label="Expiration Date"
            rules={[{ required: true, message: "Please select expiration date" }]}
          >
            <DatePicker
              size="large"
              className="w-full"
              placeholder="Select expiration date"
            />
          </Form.Item>
        </Col>
      </Row>

      <Form.Item className="mb-0 mt-6">
        <Row gutter={12} className="flex-row justify-end">
          <Col xs={12} sm={8}>
            <Button size="large" onClick={onCancel} disabled={loading} block>
              Cancel
            </Button>
          </Col>
          <Col xs={12} sm={8}>
            <Button
              type="primary"
              htmlType="submit"
              size="large"
              loading={loading}
              disabled={loading}
              block
              className="bg-[#36013F] hover:!bg-[#36013F] !border-none"
            >
              {isEdit ? "Update" : "Create"}
            </Button>
          </Col>
        </Row>
      </Form.Item>
    </Form>
  );
}
