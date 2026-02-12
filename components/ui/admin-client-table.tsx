import { useRef, useState, useEffect, useMemo } from "react";
import { SearchOutlined } from "@ant-design/icons";
import type { InputRef, TableColumnsType, TableColumnType } from "antd";
import { Button, Input, Row, Space, Table, Image } from "antd";
import type { FilterDropdownProps } from "antd/es/table/interface";
import Highlighter from "react-highlight-words";
import { UserProps } from "@/lib/props";
import { MdDelete, MdEdit } from "react-icons/md";
import { UserIcon } from "lucide-react";
import { FaHistory } from "react-icons/fa";
import { useDeleteUser, useManagePassword } from "@/lib/api";
import { AdminPasswordConfirmModal } from "@/components/modals/AdminPasswordConfirmModal";
import { useAppSelector } from "@/lib/hooks";

type DataIndex = keyof UserProps;

interface AdminClientsTableProps {
  data: UserProps[];
  loading?: boolean;
  onEdit: (record: UserProps) => void;
  deleteUser: (id: string) => void | Promise<void>;
  viewBookingHistory: (event: UserProps) => void;
  refetch?: () => void | Promise<void>;
  /** Server-side pagination */
  total?: number;
  currentPage?: number;
  pageSize?: number;
  onPaginationChange?: (page: number, pageSize: number) => void;
}

const AdminClientTable = ({
  data,
  onEdit,
  loading = false,
  deleteUser,
  viewBookingHistory,
  refetch,
  total,
  currentPage = 1,
  pageSize: controlledPageSize = 10,
  onPaginationChange,
}: AdminClientsTableProps) => {
  const searchInput = useRef<InputRef>(null);
  const user = useAppSelector((state) => state.auth.user);
  const { validatePassword } = useManagePassword();
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const [isMobile, setIsMobile] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedRecordToDelete, setSelectedRecordToDelete] =
    useState<UserProps | null>(null);

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

  // replaced showDeleteConfirm to open our controlled Modal
  const showDeleteConfirm = (record: UserProps) => {
    setSelectedRecordToDelete(record);
    setIsDeleteModalOpen(true);
  };

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
    if (selectedRecordToDelete) {
      await deleteUser(selectedRecordToDelete.id as string);
      await refetch?.();
    }
    setIsDeleteModalOpen(false);
    setSelectedRecordToDelete(null);
  };

  const handleCancelDelete = () => {
    setIsDeleteModalOpen(false);
    setSelectedRecordToDelete(null);
  };

  const getColumnSearchProps = (
    dataIndex: DataIndex,
  ): TableColumnType<UserProps> => ({
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
          placeholder={`Search ${dataIndex}`}
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
              setSearchedColumn(dataIndex);
            }}
          >
            Filter
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              close();
            }}
          >
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

  const columns = useMemo<TableColumnsType<UserProps>>(
    () => [
      {
        dataIndex: "avatar_url",
        key: "avatar_url",
        width: isMobile ? undefined : "3%",
        render(_, record) {
          return (
            <Row className="justify-center">
              {!record.avatar_url && (
                <UserIcon
                  className="rounded-2xl !h-[35px] !w-[35px]"
                  size={30}
                />
              )}
              {record.avatar_url && (
                <Image
                  className="rounded-2xl !h-[35px] !w-[35px]"
                  alt={record.full_name}
                  src={record.avatar_url}
                />
              )}
            </Row>
          );
        },
      },
      {
        title: "Name",
        dataIndex: "full_name",
        key: "full_name",
        width: isMobile ? undefined : "15%",
        ...getColumnSearchProps("full_name"),
      },
      {
        title: "Email",
        dataIndex: "email",
        key: "email",
        width: isMobile ? undefined : "15%",
        ...getColumnSearchProps("email"),
      },
      {
        title: "Contact Number",
        dataIndex: "contact_number",
        key: "contact_number",
        width: isMobile ? undefined : "15%",
        ...getColumnSearchProps("contact_number"),
      },
      {
        title: "Action",
        key: "action",
        width: isMobile ? undefined : "5%",
        fixed: isMobile ? undefined : "right",
        render: (_, record) => (
          <Row wrap={false} className="justify-center cursor-pointer gap-3">
            <FaHistory size={20} onClick={() => viewBookingHistory(record)} />
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
    [isMobile, searchedColumn, searchText, data],
  );

  return (
    <>
      <Table<UserProps>
        loading={loading}
        columns={columns}
        dataSource={data}
        scroll={{ x: isMobile ? 600 : undefined }}
        pagination={
          total !== undefined && onPaginationChange
            ? {
              current: currentPage,
              pageSize: controlledPageSize,
              total,
              showSizeChanger: true,
              pageSizeOptions: ["10", "20", "50"],
              responsive: true,
              showTotal: (t, range) =>
                `${range[0]}-${range[1]} of ${t} items`,
              onChange: (page, pageSize) =>
                onPaginationChange(page, pageSize ?? controlledPageSize),
            }
            : {
              defaultPageSize: 10,
              showSizeChanger: true,
              pageSizeOptions: ["10", "20", "50"],
              responsive: true,
              showTotal: (t, range) =>
                `${range[0]}-${range[1]} of ${t} items`,
            }
        }
        size={isMobile ? "small" : "middle"}
        className="admin-client-table"
      />

      <AdminPasswordConfirmModal
        open={isDeleteModalOpen}
        onCancel={handleCancelDelete}
        onConfirm={handleAdminConfirmSubmit}
        compact={isMobile}
        title="Delete Client"
        description="To delete this client, please enter your administrator password."
        confirmLabel="Delete"
        confirmButtonClassName="!bg-red-500 !text-white hover:!text-white hover:!bg-red-500 !border-none"
      />
    </>
  );
};

export default AdminClientTable;
