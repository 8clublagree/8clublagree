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
  Input,
  Space,
} from "antd";
import { SearchOutlined } from "@ant-design/icons";
import type { InputRef } from "antd";
import type { FilterDropdownProps } from "antd/es/table/interface";
import { ColumnsType } from "antd/es/table";
import Highlighter from "react-highlight-words";
import dayjs from "dayjs";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
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
  const searchInput = useRef<InputRef>(null);
  const searchTextRef = useRef("");
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const filtersRef = useRef<{ paymentMethod?: string[]; status?: string[] }>({});
  const [confirmingPayment, setIsConfirmingPayment] = useState<boolean>(false);
  const {
    loading,
    updatePaymentStatus,
    handleViewPayment: fetchPayment,
  } = useManageOrders();
  const [loadingPayments, setLoadingPayments] = useState(false);
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
        filterDropdown: ({
          setSelectedKeys,
          selectedKeys,
          confirm,
          clearFilters,
          close,
        }) => (
          <div style={{ padding: 8 }} onKeyDown={(e) => e.stopPropagation()}>
            <Input
              ref={searchInput}
              placeholder="Search customer"
              value={selectedKeys[0]}
              onChange={(e) =>
                setSelectedKeys(e.target.value ? [e.target.value] : [])
              }
              onPressEnter={() => {
                const value = (selectedKeys[0] as string) ?? "";
                setSearchText(value);
                setSearchedColumn("customer_name");
                confirm();

                handleFetchOrders(1, pagination.pageSize, value, false);
              }}
              style={{ marginBottom: 8, display: "block" }}
            />
            <Space>
              <Button
                className="!bg-[#800020] hover:!bg-[#800020] hover:!border-[#800020] hover:!text-white !text-white"
                onClick={() => {
                  const value = (selectedKeys[0] as string) ?? "";
                  setSearchText(value);
                  setSearchedColumn("customer_name");
                  confirm();

                  handleFetchOrders(1, pagination.pageSize, value, false);
                }}
                icon={<SearchOutlined />}
                size="small"
                style={{ width: 90 }}
              >
                Search
              </Button>
              <Button
                onClick={async () => {
                  clearFilters?.();
                  setSearchText("");
                  setSearchedColumn("");
                  confirm();

                  await handleFetchOrders(1, pagination.pageSize, "", true);
                }}
                size="small"
                style={{ width: 90 }}
              >
                Reset
              </Button>
              <Button type="link" size="small" onClick={() => close()}>
                close
              </Button>
            </Space>
          </div>
        ),
        filterIcon: (filtered: boolean) => (
          <SearchOutlined style={{ color: filtered ? "#1677ff" : undefined }} />
        ),
        filterDropdownProps: {
          onOpenChange(open: boolean) {
            if (open) {
              setTimeout(() => searchInput.current?.select(), 100);
            }
          },
        },
        render: (_, record) => {
          if (!record) return "";
          const name = record.user_profiles?.full_name || "N/A";
          return searchedColumn === "customer_name" ? (
            <Highlighter
              highlightStyle={{ backgroundColor: "#ffc069", padding: 0 }}
              searchWords={[searchText]}
              autoEscape
              textToHighlight={name}
            />
          ) : (
            name
          );
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

  const handleFetchOrders = async (page?: number, pageSize?: number, customerName?: string, reset?: boolean) => {
    const p = page ?? pagination.current;
    const ps = Math.min(100, Math.max(1, pageSize ?? pagination.pageSize));
    let name: any;
    if (reset === false) {
      name = customerName?.length ? customerName : searchText;
    }
    if (reset === true) {
      name = undefined;
    }

    const { paymentMethod, status } = filtersRef.current;

    setLoadingPayments(true);
    try {
      const response = await axiosApi.get("/admin/payments/fetch-orders", {
        params: {
          page: p,
          pageSize: ps,
          ...(name && { customerName: name }),
          ...(paymentMethod?.length && { paymentMethod: paymentMethod.join(",") }),
          ...(status?.length && { status: status.join(",") }),
        },
      });

      const list = response.data?.data ?? [];
      const total = response.data?.total ?? 0;

      const mapped = list.map((item: any) => {
        const profiles = item?.user_profiles;
        const active =
          profiles?.client_packages?.find?.(
            (pkg: { status: string }) => pkg?.status === "active",
          ) ?? null;
        return {
          ...item,
          currentActivePackage: active ?? null,
          userCredits: profiles?.user_credits?.[0]?.credits ?? null,
        };
      });

      setPayments(mapped);
      setTotal(total);
      setPagination((prev) => ({ ...prev, current: p, pageSize: ps }));
    } catch (error) {
      showMessage({ type: "error", content: "Error fetching orders" });
      console.error(error);
    } finally {
      setLoadingPayments(false);
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

    if (!selectedPayment) {
      showMessage({ type: "error", content: "Please try again." });
      setIsReviewingPayment(false);
      setIsConfirmingPayment(false);
      return;
    }

    try {
      const paymentStatusResponse = await updatePaymentStatus({
        status,
        id: selectedPayment.id as string,
        approved_at: dayjs().toISOString(),
        userID: selectedPayment.user_profiles.id,
        credits: selectedPayment.package_credits as number,
        clientPackageID: selectedPayment.currentActivePackage?.id as string,
        userCredits: selectedPayment.userCredits as number,
        packageID: selectedPayment.package_id as string,
        paymentMethod: selectedPayment.payment_method as string,
        packageName: selectedPayment.package_title as string,
        validityPeriod: Number(selectedPayment.package_validity_period),
        packageCredits: selectedPayment.package_credits as number,
      });

      if (!paymentStatusResponse?.data) {
        showMessage({ type: "error", content: "Error updating payment status" });
        setIsReviewingPayment(false);
        setIsConfirmingPayment(false);
        return;
      }

      showMessage({ type: "success", content: "You have confirmed this transaction" });
      setIsReviewingPayment(false);
      setIsConfirmingPayment(false);

      handleSendConfirmationEmail().catch((err) =>
        console.error("Email failed (non-blocking):", err)
      );

      handleFetchOrders(1, pagination.pageSize, "", false).catch((err) =>
        console.error("Re-fetch failed (non-blocking):", err)
      );
    } catch (error) {
      showMessage({ type: "error", content: "Error updating payment status" });
      setIsReviewingPayment(false);
      setIsConfirmingPayment(false);
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
          loadingPayments ||
          loading ||
          updatingCredits ||
          modifyingPackage ||
          confirmingPayment
        }
        scroll={{ x: true }}
        columns={columns}
        dataSource={payments}
        locale={{
          emptyText: <Empty description="No payments have been made yet" />,
        }}
        size={isMobile ? "small" : "middle"}
        onChange={(pag, filters) => {
          const newMethods = (filters.payment_method as string[] | null) ?? [];
          const newStatuses = (filters.status as string[] | null) ?? [];

          const methodsChanged =
            JSON.stringify(newMethods) !== JSON.stringify(filtersRef.current.paymentMethod ?? []);
          const statusesChanged =
            JSON.stringify(newStatuses) !== JSON.stringify(filtersRef.current.status ?? []);

          filtersRef.current = { paymentMethod: newMethods, status: newStatuses };

          if (methodsChanged || statusesChanged) {
            handleFetchOrders(1, pagination.pageSize, "", false);
            return;
          }

          const page = pag.current ?? pagination.current;
          const pageSize = pag.pageSize ?? pagination.pageSize;
          if (page !== pagination.current || pageSize !== pagination.pageSize) {
            setPagination((prev) => ({ ...prev, current: page, pageSize }));
            handleFetchOrders(page, pageSize, "", false);
          }
        }}
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
