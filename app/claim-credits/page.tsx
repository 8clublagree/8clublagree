"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Card, Typography, Button, Spin, Row } from "antd";
import { CheckCircleOutlined, CloseCircleOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import axiosApi from "@/lib/axiosConfig";

const { Title, Text } = Typography;

export default function ClaimCreditsPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
          <Spin size="large" />
        </div>
      }
    >
      <ClaimCreditsContent />
    </Suspense>
  );
}

function ClaimCreditsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token");

  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [claimData, setClaimData] = useState<{
    recipientName: string;
    creditsAmount: number;
    expirationDate: string;
  } | null>(null);

  useEffect(() => {
    if (token) {
      handleClaim();
    } else {
      setLoading(false);
      setErrorMessage("No token provided.");
    }
  }, [token]);

  const handleClaim = async () => {
    try {
      const response = await axiosApi.post("/credits/claim-shared-credits", {
        token,
      });

      const data = response?.data?.data;
      if (data) {
        setClaimData(data);
        setSuccess(true);
      } else {
        setErrorMessage("Something went wrong while claiming your credits.");
      }
    } catch (err: any) {
      const message =
        err?.response?.data?.error ?? "Something went wrong. Please try again.";
      setErrorMessage(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="shadow-md max-w-md w-full text-center" styles={{ body: { padding: 40 } }}>
        {loading && (
          <div className="py-12">
            <Spin size="large" />
            <Text className="block mt-4 text-gray-500">Claiming your credits...</Text>
          </div>
        )}

        {!loading && success && claimData && (
          <div className="space-y-4">
            <CheckCircleOutlined className="text-green-500 text-5xl" />
            <Title level={3} className="!mt-4">
              Hey {claimData.recipientName}!
            </Title>
            <Text className="text-lg block">
              <strong>{claimData.creditsAmount}</strong> credit
              {claimData.creditsAmount > 1 ? "s have" : " has"} been added to
              your account!
            </Text>
            <Text className="text-sm text-gray-400 block">
              {claimData.expirationDate &&
                `These credits expire on ${dayjs(claimData.expirationDate).format("MMMM D, YYYY")}.`}
            </Text>
          </div>
        )}

        {!loading && !success && (
          <div className="space-y-4">
            <CloseCircleOutlined className="text-red-500 text-5xl" />
            <Title level={3} className="!mt-4">
              Unable to Claim
            </Title>
            <Text className="text-base block text-gray-600">{errorMessage}</Text>
            <Row justify="center" className="mt-6">
              <Button
                type="primary"
                size="large"
                onClick={() => router.push("/")}
                className="!bg-[#800020] hover:!bg-[#800020]/80 !border-none"
              >
                Go Home
              </Button>
            </Row>
          </div>
        )}
      </Card>
    </div>
  );
}
