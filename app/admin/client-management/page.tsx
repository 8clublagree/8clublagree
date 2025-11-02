"use client";
export const dynamic = "force-dynamic";

import AdminAuthenticatedLayout from "@/components/layout/AdminAuthenticatedLayout";
import { Card, Row, Col, Typography, Input, Spin, Drawer, Modal } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import { IoIosSearch } from "react-icons/io";
import { useSearchUser } from "@/lib/api";
import { useEffect, useState } from "react";
import useDebounce from "@/hooks/use-debounce";
import { User } from "lucide-react";

const { Title, Text } = Typography;

export default function ClientManagementPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [editingRecord, setEditingRecord] = useState<any | null>(null);
  const [clients, setClients] = useState<any[] | null>([]);
  const [input, setInput] = useState<string>("");
  const { debouncedValue } = useDebounce(input, 1000);
  const { searchClients, loading } = useSearchUser();

  useEffect(() => {
    handleSearchClients();
  }, []);

  useEffect(() => {
    handleSearchClients();
  }, [debouncedValue]);

  const handleOpenModal = () => {
    setEditingRecord(null);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingRecord(null);
  };

  const handleEdit = (record: any) => {
    setEditingRecord(record);
    setIsModalOpen(true);
  };

  const handleSubmit = (values: any) => {
    // if (editingRecord) {
    //   const index = data.findIndex((item) => item.key === editingRecord.key);
    //   if (index !== -1) {
    //     const currentSlots = data[index].slots.split("/")[0].trim();
    //     data[index] = {
    //       ...data[index],
    //       instructor: values.instructor,
    //       start_time: values.start_time,
    //       end_time: values.end_time,
    //       slots: `${currentSlots} / ${values.slots}`,
    //     };
    //   }
    // } else {
    //   data.push({
    //     key: (data.length + 1).toString(),
    //     instructor: values.instructor,
    //     start_time: values.start_time,
    //     end_time: values.end_time,
    //     slots: `0 / ${values.slots}`,
    //   });
    // }

    setIsModalOpen(false);
    setEditingRecord(null);
  };

  const handleSearchClients = async () => {
    const data = await searchClients({ name: debouncedValue });
    setClients(data);
  };

  return (
    <AdminAuthenticatedLayout>
      <div className="space-y-6">
        <div>
          <Row className="flex flex-col gap-y-[15px]">
            <Title level={2} className="!mb-0">
              Client Management
            </Title>
            <Input
              className="max-w-[300px]"
              placeholder="Search clients"
              prefix={<IoIosSearch />}
              onChange={(e) => setInput(e.target.value)}
            />
          </Row>
        </div>

        <Row gutter={[16, 16]}>
          {loading && (
            <Row className="w-full flex justify-center">
              <Spin
                indicator={<LoadingOutlined style={{ fontSize: 48 }} spin />}
                size="large"
              />
            </Row>
          )}
          {!loading &&
            clients &&
            clients.map((data, idx) => (
              <Col key={idx} xs={24} sm={12} md={8} lg={6} xl={6} xxl={6}>
                <Card
                  onClick={() => handleEdit(data)}
                  hoverable
                  cover={
                    <div
                      style={{
                        height: 200, // same height as an image cover
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        backgroundColor: "#f5f5f5", // optional: placeholder background
                      }}
                    >
                      {data?.avatar === undefined && (
                        <User style={{ fontSize: 64, color: "#999" }} />
                      )}
                      {data?.avatar && (
                        <img
                          src={data.avatar}
                          alt={data.full_name}
                          style={{
                            objectFit: "cover",
                            height: 200,
                            width: "100%",
                          }}
                        />
                      )}
                    </div>
                  }
                >
                  <Card.Meta
                    title={data.full_name}
                    // description={data.role}
                  />
                </Card>
              </Col>
            ))}

          {!loading && !clients?.length && (
            <Row className="w-full flex justify-center">
              <Text>No clients by that name</Text>
            </Row>
          )}
        </Row>
      </div>

      {isMobile ? (
        <Drawer
          title={"Edit Client"}
          placement="right"
          onClose={handleCloseModal}
          open={isModalOpen}
          width={"100%"}
          styles={{
            body: { paddingTop: 24 },
          }}
        >
          {/* <CreateInstructorForm
            onSubmit={handleSubmit}
            onCancel={handleCloseModal}
            initialValues={editingRecord}
            isEdit={!!editingRecord}
          /> */}
        </Drawer>
      ) : (
        <Modal
          title={"Edit Client"}
          open={isModalOpen}
          onCancel={handleCloseModal}
          footer={null}
          width={600}
        >
          <div className="pt-4">
            {/* <CreateInstructorForm
              onSubmit={handleSubmit}
              onCancel={handleCloseModal}
              initialValues={editingRecord}
              isEdit={!!editingRecord}
            /> */}
          </div>
        </Modal>
      )}
    </AdminAuthenticatedLayout>
  );
}
