"use client";

import { useState, useEffect, useCallback } from "react";
import { Row, Button, Modal, Drawer, Form, Tabs } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import AdminAuthenticatedLayout from "@/components/layout/AdminAuthenticatedLayout";
import { CreatePackageProps, PromoCodeProps } from "@/lib/props";
import AdminPackageTable from "@/components/ui/admin-package-table";
import AdminPromoCodeTable from "@/components/ui/admin-promo-code-table";
import CreatePackageForm from "@/components/forms/CreatePackageForm";
import CreatePromoCodeForm from "@/components/forms/CreatePromoCodeForm";
import { usePackageManagement, usePromoCodeManagement } from "@/lib/api";
import { useAppMessage } from "@/components/ui/message-popup";
type ActiveManagementTab = "packages" | "promo-codes";

export default function PackageManagementPage() {
  const [packageForm] = Form.useForm();
  const [promoCodeForm] = Form.useForm();
  const [activeTab, setActiveTab] = useState<ActiveManagementTab>("packages");
  const [packages, setPackages] = useState<any[]>([]);
  const [promoCodes, setPromoCodes] = useState<PromoCodeProps[]>([]);
  const { showMessage, contextHolder } = useAppMessage();
  const {
    createPackage,
    updatePackage,
    fetchPackages,
    deletePackage,
    loading: packageLoading,
  } = usePackageManagement();
  const {
    createPromoCode,
    updatePromoCode,
    fetchPromoCodes,
    deletePromoCode,
    loading: promoCodeLoading,
  } = usePromoCodeManagement();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [editingRecord, setEditingRecord] = useState<CreatePackageProps | null>(
    null,
  );
  const [editingPromoCodeRecord, setEditingPromoCodeRecord] =
    useState<PromoCodeProps | null>(null);
  const isLoading = packageLoading || promoCodeLoading;
  const modalTitle =
    activeTab === "packages"
      ? editingRecord
        ? "Edit Package"
        : "Create New Package"
      : editingPromoCodeRecord
        ? "Edit Promo Code"
        : "Create New Promo Code";

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    // rAF throttle
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

  useEffect(() => {
    handleFetchPackages();
    handleFetchPromoCodes();
  }, []);

  const handleFetchPackages = async () => {
    const response = await fetchPackages({ isAdmin: true });

    if (response) {
      const mapped = response.map((pkg: any, index: number) => ({
        key: pkg.id,
        id: pkg.id,
        title: pkg.title,
        description: pkg.description,
        price: pkg.price,
        validity_period: pkg.validity_period,
        package_credits: pkg.package_credits,
        offered_for_clients: pkg.offered_for_clients,
        is_shareable: pkg.is_shareable,
        shareable_credits: pkg.shareable_credits,
        is_trial_package: pkg.is_trial_package,
      }));


      setPackages(mapped);
    }
  };

  const handleOpenModal = () => {
    if (activeTab === "packages") {
      setEditingRecord(null);
    } else {
      setEditingPromoCodeRecord(null);
    }
    setIsModalOpen(true);
  };

  const handleEdit = (record: CreatePackageProps) => {
    setEditingRecord(record);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingRecord(null);
    setEditingPromoCodeRecord(null);
  };

  const handleSubmit = async (values: CreatePackageProps) => {
    const formData = {
      title: values.name,
      price: values.price,
      package_type: "regular",
      description: values.description,
      package_credits: values.package_credits ?? null,
      validity_period: values.validity_period,
      offered_for_clients: values.offered_for_clients,
      is_shareable: values.is_shareable,
      shareable_credits: values.shareable_credits,
      is_trial_package: values.is_trial_package,
    };
    try {
      if (editingRecord) {
        await updatePackage({
          id: editingRecord?.key as string,
          values: formData,
        });
      } else {
        await createPackage({ values: formData });
      }

      setIsModalOpen(false);
      setEditingRecord(null);

      showMessage({
        type: "success",
        content: editingRecord
          ? "Successfully updated package"
          : "Successfully created new package",
      });
    } catch (error) {
      showMessage({
        type: "error",
        content: editingRecord
          ? "Error updating package"
          : "Error creating new package",
      });
      console.error("Error submitting package:", error);
    } finally {
      handleFetchPackages();
    }
  };

  const handleFetchPromoCodes = async () => {
    const response = await fetchPromoCodes();
    if (response) {
      const mapped: PromoCodeProps[] = response.map((promo: any) => ({
        key: promo.id,
        id: promo.id,
        code: promo.code,
        expiration_date: promo.expiration_date,
        status: promo.status,
        discount: Number(promo.discount),
        created_at: promo.created_at,
      }));
      setPromoCodes(mapped);
    }
  };

  const handleEditPromoCode = (record: PromoCodeProps) => {
    setEditingPromoCodeRecord(record);
    setIsModalOpen(true);
  };

  const handleSubmitPromoCode = async (values: PromoCodeProps) => {
    try {
      if (editingPromoCodeRecord?.id) {
        await updatePromoCode({
          id: editingPromoCodeRecord.id,
          values,
        });
      } else {
        await createPromoCode({ values });
      }

      setIsModalOpen(false);
      setEditingPromoCodeRecord(null);
      handleFetchPromoCodes();

      showMessage({
        type: "success",
        content: editingPromoCodeRecord
          ? "Successfully updated promo code"
          : "Successfully created promo code",
      });
    } catch {
      showMessage({
        type: "error",
        content: editingPromoCodeRecord
          ? "Error updating promo code"
          : "Error creating promo code",
      });
    }
  };

  const handleConfirmDelete = async (id: string) => {
    try {
      await deletePackage({ id: id as string });

      showMessage({
        type: "success",
        content: "Successfully deleted the package!",
      });

      handleFetchPackages();
    } catch (error) {
      showMessage({ type: "error", content: "Failed to delete the package" });
    }
  };

  const renderPromoCodeTable = useCallback(() => {
    return (
      <AdminPromoCodeTable
        loading={promoCodeLoading}
        data={[...promoCodes]}
        onEdit={handleEditPromoCode}
        onDelete={handleConfirmDeletePromoCode}
      />
    );
  }, [promoCodeLoading, promoCodes]);

  const renderPackageTable = useCallback(() => {
    return (
      <AdminPackageTable
        loading={packageLoading}
        data={[...packages]}
        onEdit={handleEdit}
        onDelete={handleConfirmDelete}
      />
    );
  }, [packageLoading, packages, handleEdit, handleConfirmDelete]);

  const handleConfirmDeletePromoCode = async (id: string) => {
    try {
      await deletePromoCode({ id });
      showMessage({
        type: "success",
        content: "Successfully deleted the promo code!",
      });
      handleFetchPromoCodes();
    } catch {
      showMessage({ type: "error", content: "Failed to delete the promo code" });
    }
  };

  return (
    <AdminAuthenticatedLayout>
      {contextHolder}
      <div className="space-y-6">
        <div>
          <Row className="mb-4 justify-end">
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={handleOpenModal}
              className={`bg-[#36013F] hover:!bg-[#36013F] !border-none !text-white font-medium rounded-lg shadow-sm transition-all duration-200 hover:scale-[1.03]`}
            >
              {activeTab === "packages" ? "Create Package" : "Create Promo Code"}
            </Button>
          </Row>
          <Tabs
            defaultActiveKey="packages"
            onChange={(key) => setActiveTab(key as ActiveManagementTab)}
            items={[
              {
                key: "packages",
                label: "Packages",
                children: renderPackageTable(),
              },
              {
                key: "promo-codes",
                label: "Promo Codes",
                children: renderPromoCodeTable(),
              },
            ]}
          />
        </div>
        {isMobile ? (
          <Drawer
            title={modalTitle}
            placement="right"
            onClose={handleCloseModal}
            open={isModalOpen}
            width={"100%"}
            styles={{
              body: { paddingTop: 24 },
            }}
            destroyOnHidden={true}
          >
            {activeTab === "packages" ? (
              <CreatePackageForm
                clearSignal={isModalOpen}
                form={packageForm}
                loading={isLoading}
                onSubmit={handleSubmit}
                onCancel={handleCloseModal}
                initialValues={editingRecord}
                isEdit={!!editingRecord}
              />
            ) : (
              <CreatePromoCodeForm
                clearSignal={isModalOpen}
                form={promoCodeForm}
                loading={isLoading}
                onSubmit={handleSubmitPromoCode}
                onCancel={handleCloseModal}
                initialValues={editingPromoCodeRecord}
                isEdit={!!editingPromoCodeRecord}
              />
            )}
          </Drawer>
        ) : (
          <Modal
            title={modalTitle}
            open={isModalOpen}
            onCancel={handleCloseModal}
            footer={null}
            width={600}
            destroyOnHidden={true}
          >
            <div className="pt-4">
              {activeTab === "packages" ? (
                <CreatePackageForm
                  clearSignal={isModalOpen}
                  form={packageForm}
                  loading={isLoading}
                  onSubmit={handleSubmit}
                  onCancel={handleCloseModal}
                  initialValues={editingRecord}
                  isEdit={!!editingRecord}
                />
              ) : (
                <CreatePromoCodeForm
                  clearSignal={isModalOpen}
                  form={promoCodeForm}
                  loading={isLoading}
                  onSubmit={handleSubmitPromoCode}
                  onCancel={handleCloseModal}
                  initialValues={editingPromoCodeRecord}
                  isEdit={!!editingPromoCodeRecord}
                />
              )}
            </div>
          </Modal>
        )}
      </div>
    </AdminAuthenticatedLayout>
  );
}
