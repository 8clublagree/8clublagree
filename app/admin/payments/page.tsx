"use client";

import AdminAuthenticatedLayout from "@/components/layout/AdminAuthenticatedLayout";
import { AdminPasswordConfirmModal } from "@/components/modals/AdminPasswordConfirmModal";
import { useAppMessage } from "@/components/ui/message-popup";
import {
  useManageCredits,
  useManageOrders,
  useManagePassword,
  usePackageManagement,
} from "@/lib/api";
import axiosApi from "@/lib/axiosConfig";
import { setUser } from "@/lib/features/authSlice";
import { useAppSelector } from "@/lib/hooks";
import { formatPrice } from "@/lib/utils";
import {
  Drawer,
  Row,
  Table,
  Tag,
  Typography,
  Descriptions,
  Image,
  Button,
  Empty,
} from "antd";
import { ColumnsType } from "antd/es/table";
import dayjs from "dayjs";
import { useCallback, useEffect, useMemo, useState } from "react";
import { IoEye } from "react-icons/io5";
import { useDispatch } from "react-redux";

const { Title } = Typography;

interface OrdersTableType {
  key: string;
  id?: string;
  package_id?: string;
  payment_proof_path?: string;
  avatar_url?: string;
  uploaded_at?: string;
  payment_method?: string;
  status?: "PENDING" | "SUCCESSFUL" | "MAYA CHECKOUT" | "FAILED" | "CANCELLED" | "EXPIRED";
  approved_at?: string;
  package_title?: string;
  package_price?: string;
  package_validity_period?: string;
  created_at?: string;
  reference_id?: string;
  currentActivePackage?: any;
  package_credits?: number;
  user_profiles?: any;
  userCredits?: number;
}

const PaymentsPage = () => {
  const [confirmingPayment, setIsConfirmingPayment] = useState<boolean>(false);
  const {
    fetchCustomerPayments,
    loading,
    updatePaymentStatus,
    handleViewPayment: fetchPayment,
  } = useManageOrders();
  const { showMessage, contextHolder } = useAppMessage();
  const [payments, setPayments] = useState<OrdersTableType[]>([]);
  const [total, setTotal] = useState(0);
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10 });
  const [selectedPayment, setSelectedPayment] =
    useState<OrdersTableType | null>(null);
  const [isReviewingPayment, setIsReviewingPayment] = useState<boolean>(false);
  const user = useAppSelector((state) => state.auth.user);
  const [isMobile, setIsMobile] = useState(false);
  const { updateUserCredits, loading: updatingCredits } = useManageCredits();

  const {
    purchasePackage,
    updateClientPackage,
    loading: modifyingPackage,
  } = usePackageManagement();
  const { validatePassword } = useManagePassword();

  const [adminConfirmModalOpen, setAdminConfirmModalOpen] = useState(false);

  useEffect(() => {
    handleFetchOrders();
  }, []);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    let rafId: number | null = null;
    const onResize = () => {
      if (rafId !== null) return;
      rafId = window.requestAnimationFrame(() => {
        rafId = null;
        handleResize();
      });
    };

    handleResize();
    window.addEventListener("resize", onResize);
    return () => {
      if (rafId !== null) cancelAnimationFrame(rafId);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  const columns = useMemo<ColumnsType<OrdersTableType>>(
    () => [
      {
        title: "Action",
        key: "action",
        width: isMobile ? undefined : "5%",
        fixed: isMobile ? undefined : "right",
        render: (_, record) => (
          <Row wrap={false} className="justify-center cursor-pointer gap-3">
            <IoEye size={20} onClick={() => handleViewPayment(record)} />
          </Row>
        ),
      },
      {
        title: "Method",
        dataIndex: "payment_method",
        key: "payment_method",
        width: "12%",
        ellipsis: true,
        filters: [
          { text: "Maya", value: "maya" },
          { text: "GCash", value: "gcash" },
          { text: "Bank Transfer", value: "bank_transfer" },
        ],
        onFilter: (value, record) => record.payment_method === value,
        filterDropdownClassName: "admin-payments-method-filter",
        render: (value) => {
          if (!value) return "";
          return (
            <Tag
              color={
                value === "maya"
                  ? "green"
                  : value === "gcash"
                    ? "blue"
                    : value === "bank_transfer"
                      ? "orange"
                      : "cyan"
              }
            >
              {value.toUpperCase()}
            </Tag>
          );
        },
      },
      {
        title: "Status",
        dataIndex: "status",
        key: "status",
        width: "12%",
        ellipsis: true,
        filters: [
          { text: "Successful", value: "SUCCESSFUL" },
          { text: "Failed", value: "FAILED" },
          { text: "Cancelled", value: "CANCELLED" },
          { text: "Pending", value: "PENDING" },
          { text: "Expired", value: "EXPIRED" },
          { text: "Maya Checkout", value: "MAYA CHECKOUT" },
        ],
        onFilter: (value, record) => record.status === value,
        filterDropdownClassName: "admin-payments-method-filter",
        render: (value) => {
          if (!value) return "";
          const color =
            value === "SUCCESSFUL"
              ? "green"
              : value === "FAILED"
                ? "red"
                : value === "CANCELLED"
                  ? "orange"
                  : value === "EXPIRED"
                    ? "default"
                    : "red";
          return (
            <Tag color={color}>
              {value.toUpperCase()}
            </Tag>
          );
        },
      },
      {
        title: "Customer Name",
        key: "customer_name",
        ellipsis: true,
        width: "12%",
        render: (_, record) => {
          if (!record) return "";
          return record.user_profiles?.full_name || "N/A";
        },
      },
      {
        title: "Email",
        key: "customer_email",
        ellipsis: true,
        width: "12%",
        render: (_, record) => {
          if (!record) return "";
          return record.user_profiles?.email || "N/A";
        },
      },
      {
        title: "Package Title",
        dataIndex: "package_title",
        key: "package_title",
        ellipsis: true,
        width: "12%",
      },
      {
        title: "Amount (PHP)",
        dataIndex: "package_price",
        key: "package_price",
        width: "12%",
        ellipsis: true,
        sorter: (a, b) =>
          (Number(a.package_price) || 0) - (Number(b.package_price) || 0),
        render: (value) => {
          return value !== undefined ? `${formatPrice(value)}` : "";
        },
      },
      {
        title: "Reference ID",
        dataIndex: "reference_id",
        key: "reference_id",
        ellipsis: true,
        width: "12%",
      },
      {
        title: "Approved Date",
        dataIndex: "approved_at",
        key: "approved_at",
        width: "12%",
        ellipsis: true,
        sorter: (a, b) =>
          dayjs(a.approved_at).toDate().getTime() -
          dayjs(b.approved_at).toDate().getTime(),
        render: (value) =>
          value ? dayjs(value).format("MMM DD YYYY (hh:mm A)") : "",
      },
      {
        title: "Proof Upload Date",
        dataIndex: "uploaded_at",
        key: "uploaded_at",
        width: "12%",
        ellipsis: true,
        sorter: (a, b) =>
          dayjs(a.uploaded_at).toDate().getTime() -
          dayjs(b.uploaded_at).toDate().getTime(),
        render: (value) =>
          value ? dayjs(value).format("MMM DD YYYY (hh:mm A)") : "",
      },
    ],
    [isMobile, payments],
  );

  const handleViewPayment = async (record: OrdersTableType) => {
    const id = record?.id;
    if (!id) return;
    const payment = await fetchPayment({ id });
    if (payment) {
      setSelectedPayment(payment);
      setIsReviewingPayment(true);
    } else {
      showMessage({ type: "error", content: "Failed to load payment details" });
    }
  };

  const handleFetchOrders = async (page?: number, pageSize?: number) => {
    const p = page ?? pagination.current;
    const ps = pageSize ?? pagination.pageSize;
    try {
      const response = await fetchCustomerPayments(p, ps);
      // Only clear list on success with a valid response; avoid clearing on
      // network/API errors so the user doesn’t see an empty table incorrectly.
      if (response?.data) {
        setPayments(response.data.payments ?? []);
        setTotal(response.data.total ?? 0);
        setPagination((prev) => ({ ...prev, current: p, pageSize: ps }));
      }
    } catch (error) {
      showMessage({ type: "error", content: "Error fetching orders" });
      console.log(error);
    }
  };

  const handleOpenAdminConfirmModal = () => setAdminConfirmModalOpen(true);

  const handleAdminConfirmSubmit = async (password: string) => {
    const adminEmail = user?.email;
    if (!adminEmail) {
      throw new Error("Unable to verify: no admin email.");
    }
    const valid = await validatePassword({
      email: adminEmail,
      currentPassword: password,
    });
    if (!valid) {
      throw new Error("Wrong password.");
    }

    await handleUpdatePaymentStatus("SUCCESSFUL");
  };

  const handleUpdatePaymentStatus = async (status: string) => {
    setIsConfirmingPayment(true);
    let paymentStatusResponse = null
    try {
      paymentStatusResponse = await updatePaymentStatus({
        status,
        id: selectedPayment?.id as string,
        approved_at: dayjs().toISOString(),
      })

    } catch (error) {
      showMessage({
        type: "error",
        content: "Error updating payment status",
      });
      setIsReviewingPayment(false);
      setIsConfirmingPayment(false);
    }

    if (paymentStatusResponse) {
      try {
        await Promise.all([
          handlePurchasePackage(),
          handleUpdateUserCredits({
            userID: selectedPayment!.user_profiles.id,
            credits: selectedPayment!.package_credits as number,
          }),
          handleSendConfirmationEmail(),
        ]);

        // if (response) await handleFetchOrders(1, pagination.pageSize);

        showMessage({
          type: "success",
          content: "You have confirmed this transaction",
        });
        setIsReviewingPayment(false);
        setIsConfirmingPayment(false);
      } catch (error) {
        showMessage({
          type: "error",
          content: "An error has occurred",
        });
        console.error(error);
        setIsReviewingPayment(false);
        setIsConfirmingPayment(false);
      }
    }
  };

  const handleSendConfirmationEmail = async () => {
    const res = await axiosApi.post("/send-email", {
      to: selectedPayment?.user_profiles.email,
      title: selectedPayment?.package_title,
      emailType: "package_purchase",
    });
    const data = await res.data;
  };

  const handleUpdateUserCredits = async ({
    userID,
    credits,
  }: {
    userID: string;
    credits: number;
  }) => {
    try {
      await updateUserCredits({
        userID: userID as string,
        values: { credits },
      });

    } catch (error) {
      console.log(error);
    }
  };

  const handlePurchasePackage = async () => {
    if (selectedPayment) {
      try {
        if (selectedPayment?.userCredits === 0) {
          await updateClientPackage({
            clientPackageID: selectedPayment.currentActivePackage?.id as string,
            values: { status: "expired", expirationDate: dayjs() },
          });
        }

        const response = await purchasePackage({
          userID: selectedPayment.user_profiles?.id as string,
          packageID: selectedPayment.package_id as string,
          paymentMethod: selectedPayment.payment_method as string,
          packageName: selectedPayment.package_title as string,
          validityPeriod: Number(selectedPayment.package_validity_period),
          packageCredits: selectedPayment.package_credits as number,
        });

        return response;
      } catch (error) {
        console.log(error);
      }
    }
  };

  const handleClose = () => {
    setIsReviewingPayment(false);
    setSelectedPayment(null);
  };

  return (
    <AdminAuthenticatedLayout>
      {contextHolder}
      <Table<OrdersTableType>
        rowKey={(record) => record.id ?? record.key ?? record.reference_id ?? String(record.created_at)}
        loading={
          loading || updatingCredits || modifyingPackage || confirmingPayment
        }
        scroll={{ x: true }}
        columns={columns}
        dataSource={payments}
        locale={{
          emptyText: <Empty description="No payments have been made yet" />,
        }}
        size={isMobile ? "small" : "middle"}
        pagination={{
          current: pagination.current,
          pageSize: pagination.pageSize,
          total,
          showSizeChanger: true,
          pageSizeOptions: [5, 10, 20, 50],
          showTotal: (t, range) =>
            `${range[0]}-${range[1]} of ${t} items`,
          responsive: true,
          hideOnSinglePage: false,
          onChange: async (page, pageSize) => {
            setPagination((prev) => ({
              ...prev,
              current: page,
              pageSize: pageSize ?? prev.pageSize,
            }));
            await handleFetchOrders(page, pageSize ?? pagination.pageSize);
          },
        }}
      />

      <Drawer
        keyboard={false}
        maskClosable={false}
        placement="right"
        title="Review Client Transaction"
        closable={
          !loading &&
          !updatingCredits &&
          !modifyingPackage &&
          !confirmingPayment
        }
        onClose={handleClose}
        open={isReviewingPayment}
        width={isMobile ? "100%" : "30%"}
        destroyOnHidden={true}
        styles={{
          body: {
            paddingTop: 24,
            overflow: "auto",
          },
        }}
      >
        {selectedPayment && (
          <div className="space-y-6">
            {!selectedPayment?.avatar_url && (
              <Row
                wrap={false}
                className="flex-col gap-y-[10px] bg-slate-200 p-[20px] rounded-[10px]"
              >
                <Title level={5}>
                  Proof is not available as payment was done through the Maya
                  Partner. Please check your Maya account for more details on
                  the transaction
                </Title>
              </Row>
            )}
            {selectedPayment?.avatar_url && (
              <Row wrap={false} className="flex-col gap-y-[10px]">
                <Row wrap={false} className="flex-col">
                  <Title level={5}>Payment Proof</Title>
                  <Image
                    src={selectedPayment?.avatar_url}
                    alt="Payment Proof"
                    className="w-full rounded-lg"
                    placeholder={true}
                  />
                </Row>
              </Row>
            )}
            <Row wrap={false} className="gap-x-[10px]" justify="center">
              <Button
                loading={
                  loading ||
                  updatingCredits ||
                  modifyingPackage ||
                  confirmingPayment
                }
                disabled={
                  confirmingPayment ||
                  loading ||
                  selectedPayment.status === "SUCCESSFUL" ||
                  selectedPayment.status === "MAYA CHECKOUT" ||
                  selectedPayment.status === "FAILED" ||
                  selectedPayment.status === "CANCELLED" ||
                  selectedPayment.status === "EXPIRED"
                }
                onClick={() => handleOpenAdminConfirmModal()}
                className={`${selectedPayment.status !== "SUCCESSFUL"
                  ? "hover:!bg-green-400 hover:!border-green-400 hover:!text-white bg-green-400"
                  : "hover:!bg-slate-200 hover:!border-slate-200 hover:!text-white bg-slate-200"
                  } h-[40px] rounded-[10px] text-white !border-none`}
              >
                {selectedPayment.status === "SUCCESSFUL"
                  ? "Confirmed"
                  : "Confirm Transaction"}
              </Button>
            </Row>
            <Descriptions
              title="Customer Information"
              bordered
              column={1}
              size="small"
            >
              <Descriptions.Item label="Name">
                {selectedPayment.user_profiles?.full_name || "N/A"}
              </Descriptions.Item>
              <Descriptions.Item label="Email">
                {selectedPayment.user_profiles?.email || "N/A"}
              </Descriptions.Item>
            </Descriptions>

            <Descriptions
              title="Package Details"
              bordered
              column={1}
              size="small"
            >
              <Descriptions.Item label="Package Title">
                {selectedPayment.package_title || "N/A"}
              </Descriptions.Item>
              <Descriptions.Item label="Package Credits">
                {selectedPayment.package_credits || "N/A"}
              </Descriptions.Item>
              <Descriptions.Item label="Price">
                {selectedPayment.package_price
                  ? `PHP ${formatPrice(selectedPayment.package_price)}`
                  : "N/A"}
              </Descriptions.Item>
              <Descriptions.Item label="Validity Period">
                {selectedPayment.package_validity_period || "N/A"}
              </Descriptions.Item>
            </Descriptions>

            <Descriptions
              title="Payment Information"
              bordered
              column={1}
              size="small"
            >
              <Descriptions.Item label="Status">
                <Tag
                  color={
                    selectedPayment.status === "SUCCESSFUL" ? "green" : "orange"
                  }
                >
                  {selectedPayment.status}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Payment Method">
                {selectedPayment.payment_method || "N/A"}
              </Descriptions.Item>
              <Descriptions.Item label="Uploaded At">
                {selectedPayment.uploaded_at
                  ? dayjs(selectedPayment.uploaded_at).format(
                    "MMM DD, YYYY (hh:mm A)",
                  )
                  : "N/A"}
              </Descriptions.Item>
              <Descriptions.Item label="Approved At">
                {selectedPayment.approved_at
                  ? dayjs(selectedPayment.approved_at).format(
                    "MMM DD, YYYY (hh:mm A)",
                  )
                  : "N/A"}
              </Descriptions.Item>
              <Descriptions.Item label="Reference ID">
                {selectedPayment.reference_id || "N/A"}
              </Descriptions.Item>
            </Descriptions>
          </div>
        )}
      </Drawer>

      <AdminPasswordConfirmModal
        open={adminConfirmModalOpen}
        onCancel={() => setAdminConfirmModalOpen(false)}
        onConfirm={handleAdminConfirmSubmit}
        compact={isMobile}
        confirmButtonClassName="!bg-green-400 hover:!bg-green-400 !border-none"
      />
    </AdminAuthenticatedLayout>
  );
};

export default PaymentsPage;
