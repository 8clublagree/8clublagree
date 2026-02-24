"use client";

import { useState, useEffect } from "react";
import {
  Row,
  Modal,
  Drawer,
  Divider,
  Col,
  Typography,
  List,
  Select,
  Tooltip,
} from "antd";
import DatePickerCarousel from "@/components/ui/datepicker-carousel";
import dayjs, { Dayjs } from "dayjs";
import { CreateClassProps } from "@/lib/props";
import { useClassManagement } from "@/lib/api";
import { formatTime } from "@/lib/utils";
import utc from "dayjs/plugin/utc";
import { useAppSelector } from "@/lib/hooks";
import { useDispatch } from "react-redux";
import { setClickedDashboardDate } from "@/lib/features/paramSlice";
import { useAppMessage } from "@/components/ui/message-popup";
import InstructorAuthenticatedLayout from "@/components/layout/InstructorAuthenticatedLayout";
import InstructorScheduleTable from "@/components/ui/instructor-schedule-table";

dayjs.extend(utc);

const { Text } = Typography;

export default function ClassManagementPage() {
  const { loading, fetchClasses, markAttendance, fetchClassAttendees } =
    useClassManagement();
  const dispatch = useDispatch();
  const { showMessage, contextHolder } = useAppMessage();
  const param = useAppSelector((state) => state.param);
  const user = useAppSelector((state) => state.auth.user);
  const [classes, setClasses] = useState<any[]>([]);
  const [attendees, setAttendees] = useState<any[]>([]);

  const [isMobile, setIsMobile] = useState(false);
  const [viewModalOpen, setViewModalOpen] = useState(false);

  const [cannotMarkAttendance, setCannotMarkAttendance] =
    useState<boolean>(false);

  const [selectedDate, setSelectedDate] = useState<Dayjs>();
  const [selectedRecord, setSelectedRecord] = useState<any>(null);

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
    if (user?.id && selectedDate) {
      handleFetchClasses();
    }
  }, [user?.id, selectedDate]);

  const handleFetchClasses = async () => {
    try {
      let dateQuery = selectedDate;
      if (param?.clickedDashboardDate) {
        dateQuery = dayjs(param?.clickedDashboardDate);
      }

      const data = await fetchClasses({
        selectedDate: dateQuery as Dayjs,
        isInstructor: true,
        instructorId: user?.instructors?.[0]?.id,
      });

      if (data) {
        const mapped = data?.map((item: any, index: number) => {
          return {
            key: index,
            id: item.id,
            instructor_id: item?.instructor_id,
            instructor_name: item?.instructor_name,
            start_time: dayjs(item.start_time),
            end_time: dayjs(item.end_time),
            slots: `${item.taken_slots} / ${item.available_slots}`,
            taken_slots: item.taken_slots,
            available_slots: item.available_slots,
          };
        });

        setClasses(mapped);
      }

      if (param.clickedDashboardDate) {
        dispatch(setClickedDashboardDate(null));
      }
    } catch (error) {
      showMessage({
        type: "error",
        content: "Error fetching classes. Please try refreshing your browser",
      });
    }
  };

  const handleView = async (record: CreateClassProps) => {
    const response = await fetchClassAttendees({
      classID: record.id as string,
    });

    const mapped = response?.map((classBookings: any) => {
      return {
        ...selectedRecord,
        ...classBookings,
        attendanceStatus: classBookings.attendance_status,
        attendeeName: classBookings?.user_profiles
          ? classBookings?.user_profiles?.full_name
          : `${classBookings.walk_in_first_name} ${classBookings.walk_in_last_name}`,
      };
    });

    setSelectedRecord(record);
    setViewModalOpen(true);
    setAttendees(mapped as []);
  };

  const handleCloseView = () => {
    setAttendees([]);
    setViewModalOpen(false);
    setSelectedRecord(null);
  };

  const handleChange = async ({
    bookingID,
    status,
  }: {
    bookingID: string;
    status: string;
  }) => {
    try {
      await markAttendance({ bookingID, status });

      showMessage({ type: "success", content: "Marked Attendance" });
    } catch (error) {
      showMessage({ type: "error", content: "Error marking attendance" });
    }
  };

  const RenderViewClass = () => {
    const cannotMarkAttendance = dayjs(selectedDate).isAfter(selectedRecord?.end_time);

    const [notCancelledAttendees, cancelledAttendees] = attendees.reduce<[any[], any[]]>(
      ([active, cancelled], item: any) => {
        (item.attendance_status === 'cancelled' ? cancelled : active).push(item);
        return [active, cancelled];
      },
      [[], []]
    );
    return (
      <Col className="flex flex-col pt-0 space-y-4">
        <Row wrap={false} className="justify-between">
          <Text className="!mt-[10px]">
            <span className="font-semibold">Instructor:</span>{" "}
            {selectedRecord?.instructor_name}
          </Text>
          <Text className="!mt-[10px]">
            <span className="font-semibold">Time:</span>{" "}
            {`${formatTime(dayjs(selectedRecord?.start_time))} - ${formatTime(
              dayjs(selectedRecord?.end_time),
            )}`}
          </Text>
        </Row>

        <Divider />

        <Col>
          <Divider >Attendees</Divider>

          <div
            style={{
              overflowY: "auto",
              scrollbarWidth: "none",
              msOverflowStyle: "none",
            }}
            className="overflow-y-auto"
          >
            <List
              itemLayout="horizontal"
              dataSource={notCancelledAttendees}
              locale={{ emptyText: "Nobody has booked this class yet" }}
              loading={loading}
              renderItem={(item, index) => {
                return (
                  <Row
                    key={index}
                    wrap={false}
                    className={`${index !== notCancelledAttendees.length - 1 && notCancelledAttendees.length > 1 ? 'border-b border-slate-100' : ''} py-3 justify-between`}
                  >
                    <List.Item.Meta
                      title={`${index + 1}. ${item.attendeeName}`}
                      className="flex items-center"
                    />

                    <Tooltip
                      title={
                        cannotMarkAttendance &&
                        "Cannot modify the attendance of classes that are over, or clients who have cancelled."
                      }
                    >
                      <Select
                        disabled={cannotMarkAttendance}
                        defaultValue={item?.attendanceStatus}
                        placeholder="Status"
                        className="!outline-none"
                        style={{ width: 120 }}
                        onChange={(e) =>
                          handleChange({

                            bookingID: item.id,
                            status: e,
                          })
                        }
                        options={[
                          { value: "no-show", label: "No Show" },
                          { value: "attended", label: "Attended" },
                          { value: "cancelled", label: "Cancelled" },
                        ]}
                      />
                    </Tooltip>
                  </Row>
                );
              }}
            />
          </div>

          <Divider >Cancelled</Divider>

          <div
            style={{
              overflowY: "auto",
              scrollbarWidth: "none",
              msOverflowStyle: "none",
            }}
            className="overflow-y-auto"
          >
            <List
              itemLayout="horizontal"
              dataSource={cancelledAttendees}
              locale={{ emptyText: "Nobody has booked this class yet" }}
              loading={loading}
              renderItem={(item, index) => {
                return (
                  <Row
                    key={index}
                    wrap={false}
                    className={`${index !== cancelledAttendees.length - 1 || cancelledAttendees.length > 1 ? 'border-b border-slate-100' : ''} py-3 justify-between`}
                  >
                    <List.Item.Meta
                      title={`${index + 1}. ${item.attendeeName}`}
                      className="flex items-center"
                    />

                    <Tooltip
                      title={
                        cannotMarkAttendance &&
                        "Cannot modify the attendance of classes that are over, or clients who have cancelled."
                      }
                    >
                      <Select
                        disabled={
                          cannotMarkAttendance
                        }
                        defaultValue={item?.attendanceStatus}
                        placeholder="Status"
                        className="!outline-none"
                        style={{ width: 120 }}
                        onChange={(e) =>
                          handleChange({

                            bookingID: item.id,
                            status: e,
                          })
                        }
                        options={[
                          { value: "no-show", label: "No Show" },
                          { value: "attended", label: "Attended" },
                          { value: "cancelled", label: "Cancelled" },
                        ]}
                      />
                    </Tooltip>
                  </Row>
                );
              }}
            />
          </div>
        </Col>
      </Col>
    );
  };

  const handleSelectedDateChange = (date: any) => {
    if (param.clickedDashboardDate) {
      setSelectedDate(dayjs(param.clickedDashboardDate));
      setCannotMarkAttendance(
        dayjs(param.clickedDashboardDate).isBefore(dayjs().subtract(1, "day")),
      );
    } else {
      setSelectedDate(dayjs(date));
      setCannotMarkAttendance(dayjs(date).isBefore(dayjs().subtract(1, "day")));
    }
  };

  return (
    <InstructorAuthenticatedLayout>
      {contextHolder}
      <div className="space-y-6">
        <p className="!mb-0 !pb-0 text-[42px] font-[400]">
          {`${dayjs().format("MMMM YYYY").toUpperCase()}`}
        </p>
        <Divider className="m-0 pb-[10px]" />
        <Row className="wrap-none justify-center bg-transparent !mt-0">
          <DatePickerCarousel
            isAdmin={true}
            onDateSelect={handleSelectedDateChange}
          />
        </Row>

        <div>
          <Row className="mb-4 gap-2 justify-end">
            {/* <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={handleOpenModal}
              className={`bg-[#36013F] hover:!bg-[#36013F] !border-none !text-white font-medium rounded-lg shadow-sm transition-all duration-200 hover:scale-[1.03]`}
            >
              Create a Class
            </Button> */}
            {/* <Button
              disabled={
                cannotRebook || !classes?.length || !allBookings?.length
              }
              type="primary"
              icon={<HiOutlineSwitchHorizontal />}
              onClick={handleOpenRebookModal}
              className={`bg-[#36013F] ${
                !!allBookings?.length &&
                !!classes?.length &&
                !cannotRebook &&
                "hover:!bg-[#36013F]"
              } !border-none !text-white font-medium rounded-lg shadow-sm transition-all duration-200 hover:scale-[1.03]`}
            >
              Rebook Attendee
            </Button> */}
            {/* <Button
              type="primary"
              icon={<IoMdPersonAdd />}
              onClick={handleOpenBookingModal}
              className={`bg-[#36013F] hover:!bg-[#36013F] !border-none !text-white font-medium rounded-lg shadow-sm transition-all duration-200 hover:scale-[1.03]`}
            >
              Manual Booking
            </Button> */}
          </Row>
          <InstructorScheduleTable
            loading={loading}
            data={[...classes]}
            onView={handleView}
          />
        </div>

        {/* View class details */}
        {isMobile ? (
          <Drawer
            loading={loading}
            title="View Class Details"
            placement="right"
            onClose={handleCloseView}
            open={viewModalOpen}
            width="100%"
            maskClosable={false}
            styles={{
              body: { paddingTop: 24 },
            }}
          >
            {RenderViewClass()}
          </Drawer>
        ) : (
          <Modal
            loading={loading}
            title="View Class Details"
            open={viewModalOpen}
            onCancel={handleCloseView}
            footer={null}
            width={600}
            maskClosable={false}
          >
            {RenderViewClass()}
          </Modal>
        )}
      </div>
    </InstructorAuthenticatedLayout>
  );
}
