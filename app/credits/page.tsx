"use client";

import { Card, Row, Col, Typography, Button, List, Spin, Modal, Input, InputNumber, Form, Descriptions, Tooltip, Alert } from "antd";
import AuthenticatedLayout from "@/components/layout/AuthenticatedLayout";
import { useRouter } from "next/navigation";
import { MdErrorOutline } from "react-icons/md";
import { LiaCoinsSolid } from "react-icons/lia";
import { useEffect, useState } from "react";
import { useAppSelector } from "@/lib/hooks";
import { usePackageManagement, useSearchUser } from "@/lib/api";
import axiosApi from "@/lib/axiosConfig";
import { ClientPackageProps } from "@/lib/props";
import { TfiPackage } from "react-icons/tfi";
import { formatDate } from "@/lib/utils";
import { ImInfinite } from "react-icons/im";

import dayjs from "dayjs";

import { HiOutlineCalendarDateRange } from "react-icons/hi2";
import PackageHistoryCard from "@/components/ui/package-history-card";
import { Handshake } from "lucide-react";
import { useAppMessage } from "@/components/ui/message-popup";

const { Title, Text } = Typography;

export default function CreditsPage() {
  const router = useRouter();
  const [activePackage, setActivePackage] = useState<ClientPackageProps>();
  const [packages, setPackages] = useState<ClientPackageProps[]>([]);
  const user = useAppSelector((state) => state.auth.user);
  const { fetchClientPackages, loading: fetchingData } = usePackageManagement();
  const { validateEmail, loading: validatingEmail } = useSearchUser();
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [shareCreditsForm] = Form.useForm();
  const { showMessage, contextHolder } = useAppMessage();
  useEffect(() => {
    if (user?.id) {
      handleFetchClientPackages();
    }
  }, [user?.id]);

  const handleFetchClientPackages = async () => {
    let active: any;
    let mapped: any = [];
    if (user) {
      const response = await fetchClientPackages({
        clientID: user?.id as string,
      });


      const findActivePackage = response?.find((data: any) => data.status === "active" && data.is_shareable);


      if (response) {
        mapped = response?.map((data: any) => ({
          id: data.id,
          createdAt: data.created_at,
          packageId: data.package_id,
          userId: data.user_id,
          expirationDate: data.expiration_date,
          status: data.status,
          purchaseDate: data.purchase_date,
          paymentMethod: data.payment_method,
          packageCredits: data.package_credits,
          validityPeriod: data.validity_period,
          isShareable: data.is_shareable,
          shareableCredits: data?.packages?.shareable_credits ?? null,
          numberOfCreditsShared: data.number_of_credits_shared,
          numberOfSharedCreditsUsed: data.number_of_shared_credits_used,
          isShared: data.is_shared,

          packages: {
            id: data.packages?.id ? data.packages.id : null,
            price: data.packages?.price ? data.packages.price : "00000",
            title: data.packages?.title
              ? data.packages?.title
              : data.package_name,
            createdAt: data.packages?.created_at
              ? data.packages.created_at
              : data.created_at,
            packageCredits: data.packages?.package_credits
              ? data.packages.package_credits
              : data.package_credits,
            validityPeriod: data.packages?.validity_period
              ? data.packages.validity_period
              : data.validity_period,
          },
        }));

        active = mapped.find(
          (data: ClientPackageProps) => data.status === "active",
        );
      }

      // console.log('active: ', active)
      setActivePackage(active);
      setPackages(mapped);
    }
  };

  const [sharing, setSharing] = useState(false);

  const handleShareCredits = async ({ email, creditsAmount }: { email: string; creditsAmount: number }) => {
    const result = await validateEmail({ email });
    if (!result) {
      shareCreditsForm.setFields([
        { name: "email", errors: ["This person has not yet registered an account."] },
      ]);
      return;
    }

    try {
      setSharing(true);
      await axiosApi.post("/credits/share-credits", {
        senderID: user?.id,
        recipientEmail: email,
        creditsAmount,
      });

      shareCreditsForm.resetFields();
      setShareModalOpen(false);
      showMessage({ type: "success", content: "Credits shared! An email has been sent to the recipient." });

      setTimeout(() => {
        window.location.reload();
      }, 3000);
    } catch (err: any) {
      const message = err?.response?.data?.error ?? "Failed to share credits. Please try again.";
      shareCreditsForm.setFields([
        { name: "email", errors: [message] },
      ]);
    } finally {
      setSharing(false);
    }
  };


  return (
    <AuthenticatedLayout>
      {contextHolder}
      {fetchingData && (
        <Row wrap={false} className="justify-center">
          <Spin spinning={true} />
        </Row>
      )}

      {!fetchingData && (
        <div className="space-y-6">
          {/* <Alert message="Purchased credits and credits shared to you will now be shown as a total in your credit tracker." type="info" showIcon /> */}
          <Alert message="Bought a shareable package before March 18? Message us to unlock your shareable credits and bring a friend." type="success" showIcon />
          <Row gutter={[16, 16]} className="flex flex-wrap items-stretch">
            {/* Current Package */}
            <Col xs={24} sm={12} lg={6} className="flex">
              <Card className="shadow-sm transition-shadow flex flex-col justify-between w-full">
                <Row wrap={false} className="items-center gap-[10px] mb-4">
                  <TfiPackage size={25} className="flex-shrink-0" />
                  <Title level={3} className="halyard !m-0">Active Package</Title>
                </Row>

                <Row
                  justify={"start"}
                  className={`${!activePackage && "p-[10px] bg-slate-200"
                    } rounded-lg items-center gap-[10px] min-h-[60px]`}
                >
                  {activePackage ? (
                    <Row className="items-center gap-[10px]">
                      <Title level={4} className="!mb-0 !font-normal">
                        {activePackage.packages.title}
                      </Title>
                    </Row>
                  ) : (
                    <Row wrap={false} className="items-start gap-[10px]">
                      <MdErrorOutline size={30} className="flex-shrink-0 mt-1" />
                      <Text className="flex-1">
                        Package has expired or hasn&apos;t been purchased
                      </Text>
                    </Row>
                  )}
                </Row>
              </Card>
            </Col>

            {/* Credits */}
            <Col xs={24} sm={12} lg={6} className="flex">
              <Card className="shadow-sm transition-shadow flex flex-col justify-between w-full">
                <Row justify={"space-between"} className="mb-4 flex-wrap gap-y-2">
                  <Row wrap={false} className="items-center gap-[10px]">
                    <LiaCoinsSolid size={25} className="flex-shrink-0" />
                    <Title level={3} className="halyard !m-0">Credit Tracker</Title>
                  </Row>
                  {!!packages.length && user?.credits === 0 && (
                    <Button
                      onClick={() => router.push("/packages")}
                      className={`bg-[#800020] hover:!bg-[#800020] !border-none !text-white font-medium rounded-lg px-[15px] shadow-sm transition-all duration-200 hover:scale-[1.03]`}
                    >
                      Get Credits
                    </Button>
                  )}
                </Row>

                <Row
                  justify={"start"}
                  className={`${!activePackage && "p-[10px] bg-slate-200"
                    } rounded-lg items-center gap-[10px] min-h-[60px]`}
                >
                  {activePackage ? (
                    <Row className="items-center gap-x-[7px] flex-wrap">

                      {activePackage.packages.packageCredits &&
                        <Title level={4} className="!mb-0 !font-normal">
                          {`${(user?.credits ?? 0) + (user?.totalUsableSharedCredits ?? 0)} available credits`}
                        </Title>
                      }
                      {!activePackage.packages.packageCredits && (
                        <Row className="items-center gap-x-[10px]">
                          <ImInfinite size={25} className="!font-normal" />
                          <Title level={4} className="halyard !m-0">
                            Unlimited
                          </Title>
                        </Row>
                      )}
                      {/* {activePackage.packages.packageCredits && (
                        <Title
                          level={4}
                          className={`${user?.credits === 0 && "!text-red-400"
                            } !mb-0 !font-normal`}
                        >
                          {`${user?.credits} out of ${activePackage.packages.packageCredits}`}
                        </Title>
                      )} */}
                      {/* <Title level={4} className="!m-0 !font-normal">
                        sessions remaining
                      </Title> */}
                    </Row>
                  ) : (
                    <Row className="w-full justify-center">
                      <Text>No credits available</Text>
                    </Row>
                  )}
                </Row>
              </Card>
            </Col>

            {/* Expiration Date */}
            {/* <Col xs={24} sm={12} lg={6} className="flex">
              <Card className="shadow-sm transition-shadow flex flex-col justify-between w-full">
                <Row wrap={false} className="items-center gap-[10px] mb-4">
                  <HiOutlineCalendarDateRange size={30} className="flex-shrink-0" />
                  <Title level={3} className="halyard !m-0">Expiration Date</Title>
                </Row>

                <Row
                  justify={"start"}
                  className={`${!activePackage && "p-[10px] bg-slate-200"
                    } rounded-lg items-center gap-[10px] min-h-[60px]`}
                >
                  {activePackage ? (
                    <Title level={4} className="!mb-0 !font-normal">
                      {formatDate(dayjs(activePackage.expirationDate))} (
                      {formatDate(dayjs(activePackage.expirationDate), "dddd")})
                    </Title>
                  ) : (
                    <Row className="w-full justify-center">
                      <Text>No package</Text>
                    </Row>
                  )}
                </Row>
              </Card>
            </Col> */}

            {/* Shareable Credits */}

            <Col xs={24} sm={12} lg={6} className="flex">
              <Card className="shadow-sm transition-shadow flex flex-col justify-between w-full">
                <Row wrap={false} className="items-center gap-[10px] mb-4">
                  <Handshake size={30} className="flex-shrink-0" />
                  <Title level={3} className="halyard !m-0">Share Credits</Title>
                </Row>

                <Row
                  justify={"start"}
                  className={`${!activePackage && "p-[10px] bg-slate-200"
                    } rounded-lg items-center gap-[10px] min-h-[60px]`}
                >
                  {activePackage && activePackage.isShareable && (
                    <Row wrap={false} className="flex-col justify-center w-full">
                      <Title level={4} className="!mb-0 !font-normal">
                        {`${activePackage.shareableCredits - (activePackage?.numberOfCreditsShared ?? 0)} out of ${activePackage.shareableCredits} remaining`}
                      </Title>
                      <Button disabled={((activePackage.shareableCredits ?? 0) - (activePackage?.numberOfCreditsShared ?? 0)) === 0} onClick={() => setShareModalOpen(true)} className="!bg-[#800020] hover:!bg-[#800020] !border-none !text-white font-medium rounded-lg px-[15px] shadow-sm transition-all duration-200 hover:scale-[1.03]">Share</Button>
                    </Row>
                  )}
                  {activePackage && !activePackage.isShareable && (
                    <Row className="w-full justify-center">
                      <Text>Your purchased package does not come with shareable credits</Text>
                    </Row>)}
                </Row>
              </Card>
            </Col>

          </Row>

          <Card className="shadow-sm" title="Package History">
            <div className="overflow-y-auto pr-2 max-h-[60vh] sm:max-h-[70vh] md:max-h-[50vh]">
              <List
                grid={{
                  gutter: 16,
                  xs: 1, // Mobile: 1 per row
                  sm: 2,
                  md: 3,
                  lg: 3,
                  xl: 4,
                  xxl: 5,
                }}
                dataSource={packages}
                renderItem={(item) => (
                  <List.Item>
                    <PackageHistoryCard item={item} />
                  </List.Item>
                )}
                locale={{
                  emptyText: (
                    <div className="text-center py-12 text-slate-500">
                      <Row className="justify-center">
                        <Col className="flex flex-col justify-center items-center gap-y-[10px]">
                          <Text>You haven’t purchased any packages yet</Text>
                          <Button
                            type="primary"
                            onClick={() => router.push("/packages")}
                            className="w-fit !bg-[#800020] hover:!bg-[#800020] !border-none !text-white font-medium rounded-lg shadow-sm transition-all duration-200 hover:scale-[1.03]"
                          >
                            Purchase a package
                          </Button>
                        </Col>
                      </Row>
                    </div>
                  ),
                }}
              />
            </div>
          </Card>
        </div>
      )}
      <Modal
        title="Share Credits"
        open={shareModalOpen}
        onCancel={() => setShareModalOpen(false)}
        footer={null}
        height={400}
      >
        <Row className="flex-col mb-[10px]" wrap={false}>
          <Text>Enter the email of the person you want to share your credits with.</Text>
          <Text className="!text-red-500">Selected person must have an account to receive the credits.</Text>
        </Row>

        <Form form={shareCreditsForm} layout="vertical" onFinish={handleShareCredits} initialValues={{ creditsAmount: 1 }}>
          <Row className="flex-col sm:flex-row gap-x-3">
            <Form.Item className="mb-3 flex-1" name="email" label="Email address" rules={[{ required: true, message: "Please enter the email address." }, { type: "email", message: "Please enter a valid email address." }]}>
              <Input disabled={validatingEmail || sharing} placeholder="Enter email address" />
            </Form.Item>
            <Form.Item className="mb-3" name="creditsAmount" label="Credits to share" rules={[{ required: true, message: "Enter the number of credits." }]}>
              {/* <InputNumber disabled={validatingEmail || sharing} min={1} keyboard={false} controls className="!w-full sm:!w-[130px]" /> */}
              <InputNumber

                disabled={validatingEmail || sharing}
                placeholder="Credits to share"
                className="!w-full sm:!w-[130px]"
                min={1}
                max={(activePackage?.shareableCredits ?? 0) - (activePackage?.numberOfCreditsShared ?? 0)}
                precision={0}
                onKeyDown={(e) => {
                  // if (!/[0-9]/.test(e.key) && e.code !== "Backspace") {
                  e.preventDefault();
                  // }
                }}
                onPaste={(e) => {
                  const paste = e.clipboardData.getData("text");
                  if (!/^\d+$/.test(paste)) {
                    e.preventDefault();
                  }
                }}
              />
            </Form.Item>
          </Row>
          <Button disabled={validatingEmail || sharing} loading={validatingEmail || sharing} className="!bg-[#800020] hover:!bg-[#800020] !border-none !text-white font-medium rounded-lg px-[15px] shadow-sm transition-all duration-200 hover:scale-[1.03] w-full" htmlType="submit">Share</Button>
        </Form>
      </Modal>
    </AuthenticatedLayout>
  );
}
