import { useRef, useState, useEffect, useMemo } from "react";
import { SearchOutlined } from "@ant-design/icons";
import type { InputRef, TableColumnsType, TableColumnType } from "antd";
import { Button, Input, Row, Space, Table, Modal, Typography, Tag } from "antd";
import type { FilterDropdownProps } from "antd/es/table/interface";
import Highlighter from "react-highlight-words";
import dayjs from "dayjs";
import { PromoCodeProps } from "@/lib/props";
import { MdDelete, MdEdit } from "react-icons/md";

type DataIndex = keyof PromoCodeProps;

const { Text } = Typography;

interface AdminPromoCodeTableProps {
    data: PromoCodeProps[];
    loading?: boolean;
    onEdit: (record: PromoCodeProps) => void;
    onDelete: (id: string) => void;
}

const AdminPromoCodeTable = ({
    data,
    onEdit,
    loading = false,
    onDelete,
}: AdminPromoCodeTableProps) => {
    const [searchText, setSearchText] = useState("");
    const [searchedColumn, setSearchedColumn] = useState("");
    const [isMobile, setIsMobile] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedRecordToDelete, setSelectedRecordToDelete] =
        useState<PromoCodeProps | null>(null);
    const searchInput = useRef<InputRef>(null);

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

    const handleSearch = (
        selectedKeys: string[],
        confirm: FilterDropdownProps["confirm"],
        dataIndex: DataIndex,
    ) => {
        confirm();
        setSearchText(selectedKeys[0]);
        setSearchedColumn(dataIndex);
    };

    const handleReset = (clearFilters: () => void) => {
        clearFilters();
        setSearchText("");
    };

    const getColumnSearchProps = (
        dataIndex: DataIndex,
    ): TableColumnType<PromoCodeProps> => ({
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
                    placeholder={`Search ${String(dataIndex)}`}
                    value={selectedKeys[0]}
                    onChange={(e) =>
                        setSelectedKeys(e.target.value ? [e.target.value] : [])
                    }
                    onPressEnter={() =>
                        handleSearch(selectedKeys as string[], confirm, dataIndex)
                    }
                    style={{ marginBottom: 8, display: "block" }}
                />
                <Space>
                    <Button
                        type="primary"
                        onClick={() =>
                            handleSearch(selectedKeys as string[], confirm, dataIndex)
                        }
                        icon={<SearchOutlined />}
                        size="small"
                        style={{ width: 90 }}
                    >
                        Search
                    </Button>
                    <Button
                        onClick={() => clearFilters && handleReset(clearFilters)}
                        size="small"
                        style={{ width: 90 }}
                    >
                        Reset
                    </Button>
                    <Button
                        type="link"
                        size="small"
                        onClick={() => {
                            confirm({ closeDropdown: false });
                            setSearchText((selectedKeys as string[])[0]);
                            setSearchedColumn(String(dataIndex));
                        }}
                    >
                        Filter
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
        onFilter: (value, record) =>
            record?.[dataIndex]
                ?.toString()
                ?.toLowerCase()
                ?.includes((value as string).toLowerCase()) ?? false,
        filterDropdownProps: {
            onOpenChange(open) {
                if (open) {
                    setTimeout(() => searchInput.current?.select(), 100);
                }
            },
        },
        render: (text) =>
            searchedColumn === dataIndex ? (
                <Highlighter
                    highlightStyle={{ backgroundColor: "#ffc069", padding: 0 }}
                    searchWords={[searchText]}
                    autoEscape
                    textToHighlight={text ? text.toString() : ""}
                />
            ) : (
                text
            ),
    });

    const showDeleteConfirm = (record: PromoCodeProps) => {
        setSelectedRecordToDelete(record);
        setIsDeleteModalOpen(true);
    };

    const handleConfirmDelete = () => {
        if (selectedRecordToDelete?.id) {
            onDelete(selectedRecordToDelete.id);
        }
        setIsDeleteModalOpen(false);
        setSelectedRecordToDelete(null);
    };

    const handleCancelDelete = () => {
        setIsDeleteModalOpen(false);
        setSelectedRecordToDelete(null);
    };

    const columns = useMemo<TableColumnsType<PromoCodeProps>>(
        () => [
            {
                title: "Code",
                dataIndex: "code",
                key: "code",
                ...getColumnSearchProps("code"),
                render: (value) => (
                    <Row>
                        <Text className="font-bold">{value}</Text>
                    </Row>
                ),
            },
            {
                title: "Discount",
                dataIndex: "discount",
                key: "discount",
                width: isMobile ? undefined : 130,
                render: (value) => <Text>{value}%</Text>,
            },
            {
                title: "Expiration Date",
                dataIndex: "expiration_date",
                key: "expiration_date",
                width: isMobile ? undefined : 220,
                render: (value) => (
                    <Text>
                        {value ? dayjs(value).format("MMM D") : "-"}
                    </Text>
                ),
            },
            {
                title: "Status",
                dataIndex: "status",
                key: "status",
                width: isMobile ? undefined : 120,
                ...getColumnSearchProps("status"),
                render: (value) => {
                    const normalized = String(value ?? "").toLowerCase();
                    const color =
                        normalized === "active"
                            ? "green"
                            : normalized === "expired"
                                ? "red"
                                : "default";
                    return <Tag color={color}>{value}</Tag>;
                },
            },
            {
                title: "Action",
                key: "action",
                width: isMobile ? undefined : 90,
                fixed: isMobile ? undefined : "right",
                render: (_, record) => (
                    <Row className="justify-center cursor-pointer gap-3">
                        <MdEdit size={20} color="#733AC6" onClick={() => onEdit(record)} />
                        <MdDelete
                            size={20}
                            color="red"
                            onClick={() => showDeleteConfirm(record)}
                        />
                    </Row>
                ),
            },
        ],
        [isMobile, searchedColumn, searchText, onEdit],
    );

    return (
        <>
            <Table<PromoCodeProps>
                loading={loading}
                columns={columns}
                dataSource={data}
                scroll={{ x: isMobile ? 800 : undefined }}
                pagination={{
                    defaultPageSize: 10,
                    showSizeChanger: true,
                    pageSizeOptions: ["10", "20", "50"],
                    responsive: true,
                    showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`,
                }}
                size={isMobile ? "small" : "middle"}
                className="admin-booking-table"
            />
            <Modal
                title="Delete Promo Code"
                open={isDeleteModalOpen}
                onOk={handleConfirmDelete}
                onCancel={handleCancelDelete}
                okText="Delete"
                okType="danger"
                cancelText="Cancel"
                width={isMobile ? "90%" : 430}
            >
                <Row className="py-[20px]">
                    <Text>Are you sure you want to delete this promo code?</Text>
                </Row>
            </Modal>
        </>
    );
};

export default AdminPromoCodeTable;
