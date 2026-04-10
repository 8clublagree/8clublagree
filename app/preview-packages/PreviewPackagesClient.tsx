"use client";

import {
    Card,
    Row,
    Col,
    Typography,
    Avatar,
    Button,
    Drawer,
    Divider,
    Carousel,
    Spin,
} from "antd";
import { CalendarOutlined } from "@ant-design/icons";
import { formatPrice } from "@/lib/utils";
import { useEffect, useRef, useState } from "react";
import { X } from "lucide-react";
import { usePackageManagement } from "@/lib/api";
import { PackageProps } from "@/lib/props";
import { useRouter } from "next/navigation";
const { Title } = Typography;

function PreviewPackageCard({
    item,
    onView,
    ...props
}: {
    item: any;
    onView: () => void;
    [key: string]: any;
}) {
    return (
        <Col
            xs={24}
            sm={12}
            md={12}
            lg={8}
            xl={6}
            className="flex justify-center"
            {...props}
        >
            <Card
                title={
                    <span className="halyard font-semibold text-2xl sm:text-3xl xl:text-4xl tracking-tight">
                        {item.packageCredits
                            ? `${item.packageCredits + (item?.shareable_credits ?? 0)}`
                            : "Unlimited"}
                    </span>
                }
                styles={{
                    title: {
                        textAlign: "center",
                        marginInline: "auto",
                    },
                    header: {
                        backgroundColor: "#0a0a0a",
                        color: "white",
                        textAlign: "center",
                        minHeight: 100,
                        paddingBlock: "20px",
                        borderBottom: "none",
                    },
                    body: {
                        padding: "20px 20px 24px",
                        display: "flex",
                        flexDirection: "column",
                        minHeight: 220,
                    },
                }}
                className="w-full border border-slate-200/80 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 flex flex-col overflow-hidden hover:-translate-y-0.5"
            >
                <div className="flex flex-col flex-1 justify-between gap-4">
                    <div className="space-y-1.5">
                        <p className="halyard font-bold text-lg sm:text-xl text-slate-800 w-full truncate">
                            {item.title}
                        </p>
                        <p className="text-slate-600 text-sm sm:text-base font-light">
                            {item.packageCredits
                                ? `${item.packageCredits + (item?.shareable_credits ?? 0)} sessions`
                                : "Unlimited Sessions"}
                        </p>
                        <p className="text-slate-600 text-sm sm:text-base font-light">
                            Valid for{" "}
                            <span className="font-semibold text-slate-800">
                                {item.validityPeriod}
                            </span>{" "}
                            days
                        </p>
                        <p className="text-slate-800 text-base sm:text-lg font-medium pt-1">
                            PHP {formatPrice(item.price)}
                        </p>
                    </div>

                    <Button
                        onClick={onView}
                        className={`w-full h-11 rounded-xl font-medium text-base shadow-sm transition-all duration-200 !bg-[#800020] !border-[#800020] hover:!bg-[#800020] hover:!text-[white] text-[white] hover:scale-[1.02] active:scale-[0.99]"}`}
                    >
                        View
                    </Button>
                </div>
            </Card>
        </Col>
    );
}

export default function PreviewPackagesClient() {
    const carouselRef = useRef<any>(null);
    const router = useRouter();

    const {
        loading: packageLoading,
        fetchPreviewPackages,
    } = usePackageManagement();

    const [isMobile, setIsMobile] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [packages, setPackages] = useState<PackageProps[]>();
    const [selectedRecord, setSelectedRecord] = useState<any>(null);

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

    useEffect(() => {
        handleFetchPackages();
    }, []);

    const handleFetchPackages = async () => {
        const response = await fetchPreviewPackages({ isAdmin: false });

        const mapped = response?.map((data: any) => {
            return {
                ...data,
                validityPeriod: data.validity_period,
                packageType: data.package_type,
                packageCredits: data.package_credits,
                offeredForClients: data.offered_for_clients,
            };
        });

        setPackages(mapped);
    };

    const handleOpenModal = (item: any) => {
        setSelectedRecord(item);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    return (
        <>
            {packageLoading && (
                <Row wrap={false} className="justify-center py-[100px]">
                    <Spin spinning={true} />
                </Row>
            )}

            {!packageLoading && (
                <div className="space-y-6 p-[20px]">
                    <Row gutter={[16, 24]} className="w-full">
                        {packages &&
                            packages.map((item, index) => (
                                <PreviewPackageCard
                                    key={index}
                                    item={item}
                                    onView={() => handleOpenModal(item)}
                                />
                            ))}
                    </Row>

                    {packages && packages.length === 0 && (
                        <Card className="shadow-sm">
                            <div className="text-center py-12 text-slate-500">
                                <CalendarOutlined className="text-4xl mb-4" />
                                <p>No packages are being offered at this time.</p>
                            </div>
                        </Card>
                    )}
                </div>
            )}

            <Drawer
                keyboard={false}
                closeIcon={<X />}
                maskClosable={false}
                placement="right"
                onClose={handleCloseModal}
                open={isModalOpen}
                width={isMobile ? "100%" : "33%"}
                styles={{
                    body: {
                        paddingTop: 24,
                        overflow: "auto",
                    },
                }}
            >
                <div className="flex-1 overflow-hidden">
                    <Carousel
                        ref={carouselRef}
                        autoplay={false}
                        infinite={false}
                        dots={false}
                        initialSlide={0}
                        className="h-full"
                        swipeToSlide={false}
                        swipe={false}
                        draggable={false}
                        accessibility={false}
                    >
                        <div className="flex flex-col items-center h-full overflow-y-hidden">
                            <Row className="w-full justify-center">
                                <Avatar
                                    className="halyard !text-[60px] bg-[#0a0a0a] border w-full"
                                    size={200}
                                >
                                    {selectedRecord?.packageCredits + (selectedRecord?.shareable_credits ?? 0)}
                                </Avatar>
                            </Row>
                            <Divider />

                            <div className="items-start w-full">
                                <Row wrap={false} className="mb-[10px] items-start w-full">
                                    <Title level={5}>
                                        Package:{" "}
                                        <span className="font-normal">{selectedRecord?.title}</span>
                                    </Title>
                                </Row>
                                <Row wrap={false} className="mb-[15px] items-center w-full">
                                    <Title level={5} className="!mb-0">
                                        Number of Sessions:{" "}
                                        <span className="font-normal">
                                            {selectedRecord?.packageCredits ? (selectedRecord?.packageCredits + (selectedRecord?.shareable_credits ?? 0)) : "Unlimited"}
                                        </span>
                                    </Title>
                                </Row>

                                <Row wrap={false} className="mb-[10px] items-start w-full">
                                    <Title level={5}>
                                        Validity Period:{" "}
                                        <span className="font-normal">
                                            {selectedRecord?.validityPeriod} days
                                        </span>
                                    </Title>
                                </Row>
                                <Row wrap={false} className="mb-[10px] items-start w-full">
                                    <Title level={5}>
                                        Price:{" "}
                                        <span className="font-normal">
                                            PHP {formatPrice(selectedRecord?.price)}
                                        </span>
                                    </Title>
                                </Row>
                            </div>

                            <Button
                                onClick={() => router.push("/login")}
                                className={`bg-[#800020] hover:!bg-[#800020] !border-none !text-white font-medium rounded-lg px-6 shadow-sm transition-all duration-200 w-full h-[50px]`}
                            >
                                Join the Club
                            </Button>
                        </div>
                    </Carousel>
                </div>
            </Drawer>
        </>
    );
}
