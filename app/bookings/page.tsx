"use client";

import {
  Card,
  Row,
  Col,
  Statistic,
  Typography,
  Avatar,
  List,
  Button,
} from "antd";
import {
  CalendarOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
} from "@ant-design/icons";
import AuthenticatedLayout from "@/components/layout/AuthenticatedLayout";
import DatePickerCarousel from "@/components/ui/datepicker-carousel";
import dayjs from "dayjs";

const { Title } = Typography;

export default function BookingsPage() {
  const date = dayjs("2024-10-10");
  const data = [
    {
      time: "07:00AM",
      duration: "50 mins",
      date: dayjs("2024-10-10").format("MMM D, YYYY"),
      instructor: "Jane Doe",
      limit: 10,
      available: 3,
    },
    {
      time: "07:00AM",
      duration: "50 mins",
      date: dayjs("2024-10-10").format("MMM D, YYYY"),
      instructor: "Jane Doe",
      limit: 10,
      available: 0,
    },
    {
      time: "07:00AM",
      duration: "50 mins",
      date: dayjs("2024-10-10").format("MMM D, YYYY"),
      instructor: "Jane Doe",
      limit: 10,
      available: 1,
    },
    {
      time: "07:00AM",
      duration: "50 mins",
      date: dayjs("2024-10-10").format("MMM D, YYYY"),
      instructor: "Jane Doe",
      limit: 10,
      available: 7,
    },
  ];
  return (
    <AuthenticatedLayout>
      <div className="space-y-6">
        <div>
          <Title level={2} className="!mb-2">
            Join a Session
          </Title>
        </div>

        <Row className="wrap-none justify-center bg-transparent">
          <DatePickerCarousel onDateSelect={(e) => console.log(e)} />
        </Row>

        <Card className="shadow-sm">
          <List
            itemLayout="horizontal"
            dataSource={data}
            renderItem={(item, index) => (
              <List.Item
                actions={[
                  <Button
                    disabled={item.available === 0}
                    type="primary"
                    className={`bg-[#733AC6] ${
                      item.available === 0 ? "" : "hover:!bg-[#5B2CA8]"
                    } !border-none !text-white font-medium rounded-lg px-6 shadow-sm transition-all duration-200 hover:scale-[1.03]`}
                  >
                    Join
                  </Button>,
                ]}
              >
                <Row className="wrap-none items-center gap-4">
                  <Col>
                    <Avatar
                      className="border-gray-500 border"
                      size={60}
                      src={`https://api.dicebear.com/7.x/miniavs/svg?seed=${index}`}
                    />
                    <p>
                      <span className="font-light">{item.instructor}</span>
                    </p>
                  </Col>
                  <Col>
                    <p>
                      <span className="font-semibold">{item.time}</span>
                    </p>
                    <p>
                      <span className="font-light">{item.duration}</span>
                    </p>

                    <p>
                      <span
                        className={`${
                          item.available === 1 || item.available === 0
                            ? `text-red-500`
                            : ``
                        } font-semibold`}
                      >
                        {item.available === 1
                          ? `Last Slot`
                          : item.available > 1
                          ? `${item.available} slots left`
                          : ``}
                        {item.available <= 0 && `Full`}
                      </span>
                    </p>
                  </Col>
                </Row>
              </List.Item>
            )}
          />
          {data.length === 0 && (
            <div className="text-center py-12 text-slate-500">
              <CalendarOutlined className="text-4xl mb-4" />
              <p>No bookings yet. Start by creating your first booking.</p>
            </div>
          )}
        </Card>
      </div>
    </AuthenticatedLayout>
  );
}
