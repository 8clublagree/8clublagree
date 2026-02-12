"use client";
export const dynamic = "force-dynamic";

import AdminAuthenticatedLayout from "@/components/layout/AdminAuthenticatedLayout";
import { Row, Typography, Spin, Drawer, Segmented } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import {
  useDeleteUser,
  useManageCredits,
  useManageImage,
  useSearchUser,
  useUpdateUser,
} from "@/lib/api";
import { useEffect, useRef, useState } from "react";
import EditClientForm from "@/components/forms/EditClientForm";
import { supabase } from "@/lib/supabase";
import AdminClientTable from "@/components/ui/admin-client-table";
import { omit } from "lodash";
import UserBookingHistory from "@/components/ui/user-booking-history";
import { useAppMessage } from "@/components/ui/message-popup";
import UserPurchaseHistory from "@/components/ui/user-purchase-history";
import dayjs from "dayjs";
import axios from "axios";
import axiosApi from "@/lib/axiosConfig";

const { Title, Text } = Typography;

export default function ClientManagementPage() {
  const [isEditing, setIsEditing] = useState(false);
  const [isViewingHistory, setIsViewingHistory] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isProcessingData, setIsProcessingData] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<any | null>(null);
  const [clients, setClients] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchField, setSearchField] = useState<
    "full_name" | "email" | "contact_number" | undefined
  >(undefined);
  const [searchValue, setSearchValue] = useState("");
  const ignoreNextPaginationChangeRef = useRef(false);
  const { updateUserCredits } = useManageCredits();
  const { fetchClients, loading } = useSearchUser();
  const { updateUser, loading: updating } = useUpdateUser();
  const { showMessage, contextHolder } = useAppMessage();
  const [historyTab, setHistoryTab] = useState<
    // "Bookings" | "Purchases" | "Payments"
    "Bookings" | "Purchases"
  >("Bookings");
  const { deleteUser } = useDeleteUser();
  const { fetchImage } = useManageImage();

  useEffect(() => {
    handleSearchClients();
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

  const handleSearchClients = async (opts?: {
    page?: number;
    pageSize?: number;
    searchField?: "full_name" | "email" | "contact_number";
    searchValue?: string;
  }) => {
    const page = opts?.page ?? currentPage;
    const size = opts?.pageSize ?? pageSize;
    const field = opts?.searchField ?? searchField;
    const value = opts?.searchValue ?? searchValue;

    const params: Record<string, string | number | undefined> = {
      page,
      pageSize: size,
    };
    if (field && value) {
      if (field === "full_name") params.name = value;
      else if (field === "email") params.email = value;
      else if (field === "contact_number") params.contact_number = value;
    }

    const result = await fetchClients(params);

    try {
      if (result?.data) {
        setIsProcessingData(true)
        const mapped = await Promise.all(
          result.data.map(async (user: any) => {
            let mappedClientPackages: any[] = [];
            let classBookings: any[] = [];
            let signedUrl: string | undefined = "";

            const activePackage = user.client_packages.find(
              (x: any) => x.status === "active",
            );

            let clientPackage =
              !!user.client_packages.length && activePackage
                ? activePackage
                : null;

            //if user has an avatar
            if (user.avatar_path !== null) {
              const signedURL = await fetchImage({
                avatarPath: user?.avatar_path,
              });

              signedUrl = signedURL;
            }

            //if user has bookings
            if (!!user.class_bookings.length) {
              classBookings = user.class_bookings.map((classBooking: any) => {
                return {
                  id: classBooking.id,
                  attendance: classBooking.attendance_status,
                  classDate: classBooking.class_date,

                  classDetails: {
                    id: classBooking.classes.id,
                    instructor: classBooking.classes.instructor_name,
                    startTime: classBooking.classes.start_time,
                    endTime: classBooking.classes.end_time,
                  },
                };
              });
            }

            if (clientPackage) {
              clientPackage = {
                clientPackageID: clientPackage.id,
                status: clientPackage.status,
                packages: {
                  title: clientPackage.package_name,
                },
                packageCredits: clientPackage.package_credits,
                validityPeriod: clientPackage.validity_period,
                purchaseDate: clientPackage.purchase_date,
                expirationDate: clientPackage.expiration_date,
              };
            }

            if (!!user.client_packages.length) {
              mappedClientPackages = user.client_packages
                .map((x: any) => {
                  return {
                    packages: {
                      title: x.package_name,
                    },
                    status: x.status,
                    packageCredits: x.package_credits,
                    validityPeriod: x.validity_period,
                    purchaseDate: x.purchase_date,
                    expiration_date: x.expiration_date,
                  };
                })
                .sort(
                  (a: any, b: any) =>
                    dayjs(b.purchaseDate).toDate().getTime() -
                    dayjs(a.purchaseDate).toDate().getTime(),
                );
            }

            return {
              ...user,
              clientPackage,
              client_packages: mappedClientPackages,
              key: user.id,
              avatar_url: signedUrl,
              bookingHistory: classBookings,
              credits: user?.user_credits?.[0]?.credits ?? null,
            };
          }),
        );

        setClients(mapped);
        setTotal(result.total);
        if (opts?.page !== undefined) setCurrentPage(opts.page);
        if (opts?.pageSize !== undefined) setPageSize(opts.pageSize);
        if (opts?.searchField !== undefined) setSearchField(opts.searchField);
        if (opts?.searchValue !== undefined)
          setSearchValue(opts.searchValue);
        setIsProcessingData(false)
      }
    } catch (error) {
      showMessage({
        type: "error",
        content: "Please try refreshing the website",
      });
      setIsProcessingData(false)
      console.log("error: ", error);
    }
    setIsProcessingData(false)
  };

  const handleCloseModal = () => {
    setIsEditing(false);
    setSelectedRecord(null);
  };

  const handleEdit = (record: any) => {
    setSelectedRecord(record);
    setIsEditing(true);
  };

  const handleViewBookingHistory = (record: any) => {
    setSelectedRecord(record);
    setIsViewingHistory(true);
  };
  const handleCloseBookingHistory = (record: any) => {
    setSelectedRecord(record);
    setIsViewingHistory(false);
    setHistoryTab("Bookings");
  };

  const handleSubmit = async (values: any) => {
    try {
      if (selectedRecord) {
        let promises = [
          updateUser({
            id: selectedRecord.id,
            values: omit(values, ["credits"]),
          }),
        ];

        const { data } = await axiosApi.post("/update-user-email", {
          id: selectedRecord.id,
          email: values.email,
        });

        if (!data) {
          showMessage({
            type: "error",
            content: "Error updating email",
          });
        }

        if (!isNaN(values.credits)) {
          promises.push(
            updateUserCredits({
              userID: selectedRecord?.id as string,
              values: { credits: values.credits },
            }),
          );
        }
        await Promise.all(promises);

        setIsEditing(false);
        setSelectedRecord(null);
        console.log('1')
        handleSearchClients();

        showMessage({
          type: "success",
          content: "Successfully updated client!",
        });
      }
    } catch (error) {
      showMessage({ type: "error", content: "Error updating client" });
    }
  };

  const handleDeleteUser = async (id: string) => {
    try {
      await deleteUser({ id: id });
      showMessage({ type: "success", content: "Successfully deleted client!" });
    } catch (error) {
      showMessage({ type: "error", content: "Error deleting client" });
    }
  };

  return (
    <AdminAuthenticatedLayout>
      {contextHolder}
      <div className="space-y-6">


        <div className="w-full">

          <AdminClientTable
            loading={loading || isProcessingData}
            data={[...clients]}
            onEdit={handleEdit}
            deleteUser={handleDeleteUser}
            viewBookingHistory={handleViewBookingHistory}
            refetch={() => handleSearchClients()}
            total={total}
            currentPage={currentPage}
            pageSize={pageSize}
            onPaginationChange={(page, size) => {
              if (ignoreNextPaginationChangeRef.current) {
                ignoreNextPaginationChangeRef.current = false;
                return;
              }
              handleSearchClients({ page, pageSize: size });
            }}
            onSearch={(field, value) => {
              ignoreNextPaginationChangeRef.current = true;
              const searchable = ["full_name", "email", "contact_number"];
              const safeField = searchable.includes(field)
                ? (field as "full_name" | "email" | "contact_number")
                : undefined;
              handleSearchClients({
                page: 1,
                searchField: value ? safeField : undefined,
                searchValue: value,
              });
            }}
            searchField={searchField}
            searchValue={searchValue}
          />
        </div>
      </div>

      {isMobile ? (
        <Drawer
          destroyOnHidden={true}
          maskClosable={false}
          placement="right"
          onClose={handleCloseModal}
          open={isEditing}
          width={"100%"}
          styles={{
            body: { paddingTop: 24 },
          }}
        >
          {isEditing && (
            <EditClientForm
              refetch={handleSearchClients}
              loading={updating}
              onSubmit={handleSubmit}
              onCancel={handleCloseModal}
              initialValues={selectedRecord}
              isEdit={!!selectedRecord}
            />
          )}
        </Drawer>
      ) : (
        <Drawer
          destroyOnHidden={true}
          maskClosable={false}
          open={isEditing}
          width={"35%"}
          onClose={handleCloseModal}
          footer={null}
          styles={{
            body: { paddingTop: 10 },
          }}
        >
          <div className="pt-4">
            {isEditing && (
              <EditClientForm
                refetch={handleSearchClients}
                loading={updating}
                onSubmit={handleSubmit}
                onCancel={handleCloseModal}
                initialValues={selectedRecord}
                isEdit={!!selectedRecord}
              />
            )}
          </div>
        </Drawer>
      )}

      <Drawer
        destroyOnHidden={true}
        title={"History"}
        maskClosable={false}
        open={isViewingHistory}
        width={isMobile ? "100%" : "35%"}
        keyboard={false}
        onClose={handleCloseBookingHistory}
        footer={null}
        styles={{
          body: { paddingTop: 10 },
        }}
      >
        <Segmented
          value={historyTab}
          options={["Bookings", "Purchases"]}
          // options={["Bookings", "Purchases", "Payments"]}
          // onChange={(e: "Bookings" | "Purchases" | "Payments") =>
          onChange={(e: "Bookings" | "Purchases") =>
            setHistoryTab(e)
          }
          block
        />
        {historyTab === "Bookings" && (
          <div className="pt-4">
            <UserBookingHistory
              bookingHistory={selectedRecord?.bookingHistory ?? []}
            />
          </div>
        )}
        {historyTab === "Purchases" && (
          <div className="pt-4">
            <UserPurchaseHistory
              purchaseHistory={selectedRecord?.client_packages ?? []}
            />
          </div>
        )}
      </Drawer>
    </AdminAuthenticatedLayout>
  );
}
