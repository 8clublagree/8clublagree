import { attendanceStatus } from "@/lib/utils";
import { Col, Row, Typography } from "antd";
import dayjs from "dayjs";

const { Text } = Typography;

const UserBookingHistory = ({ bookingHistory }: { bookingHistory: any }) => {

  return (
    <>
      <Col className="flex flex-col gap-y-[10px] cursor-pointer">
        {bookingHistory.map((booking: any, index: number) => (
          <Row
            key={index}
            justify={"space-between"}
            className="border rounded-[10px] p-[10px] items-center"
          >
            <Col className="flex flex-col">
              <Row>
                <Text className="font-bold">
                  {dayjs(booking.classDate).format("MMM DD YYYY")} (
                  {dayjs(booking.classDetails.startTime).format("hh:mm A")} to{" "}
                  {dayjs(booking.classDetails.endTime).format("hh:mm A")})
                </Text>
              </Row>

              <Row>
                <Text>
                  Class with{" "}
                  <span className="text-red-400">
                    {booking.classDetails.instructor}
                  </span>
                </Text>
              </Row>
            </Col>
            {!dayjs(booking.classDate).isAfter(dayjs(), "day") && (
              <Row>
                <Text
                  strong
                  className={`text-[${attendanceStatus?.[booking.attendance]?.color
                    }]`}
                >
                  {attendanceStatus?.[booking.attendance]?.status ?? "No Show"}
                </Text>
              </Row>
            )}
            {dayjs(booking.classDate).isSameOrAfter(dayjs(), "day") && (
              <Row>
                <Text
                  strong
                  className={`text-slate-400`}
                >
                  Upcoming
                </Text>
              </Row>
            )}
          </Row>
        ))}
      </Col>

      {!bookingHistory.length && (
        <Row className="w-full p-[20px] justify-center">
          <Text strong>No booking history</Text>
        </Row>
      )}
    </>
  );
};

export default UserBookingHistory;
