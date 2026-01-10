"use client";

import { useEffect, useState } from "react";
import { Button, Card, Typography, Row, Col, Divider, Table } from "antd";
import { EnvironmentOutlined } from "@ant-design/icons";
import { supabase } from "@/lib/supabase";
import { Class, Trainer, Schedule, Testimonial } from "@/lib/props";
import { useRouter } from "next/navigation";
import UnauthenticatedLayout from "@/components/layout/unAuthenticatedLayout";
import { useAboutPageData } from "@/lib/api";

const { Title, Paragraph, Text } = Typography;

export default function About() {
  const router = useRouter();
  const { fetchPageData, loading } = useAboutPageData();
  const [classes, setClasses] = useState<Class[]>([]);
  const [trainers, setTrainers] = useState<Trainer[]>([]);
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const data = await fetchPageData();
    const { classesRes, trainersRes, schedulesRes } = data;

    if (classesRes.data) setClasses(classesRes.data);
    if (trainersRes.data) setTrainers(trainersRes.data);
    if (schedulesRes.data) setSchedules(schedulesRes.data);
    // if (testimonialsRes.data) setTestimonials(testimonialsRes.data);
  };

  const scheduleColumns = [
    {
      title: "Day",
      dataIndex: "day_of_week",
      key: "day",
      width: "15%",
    },
    {
      title: "Time",
      key: "time",
      width: "20%",
      render: (record: Schedule) =>
        `${record.start_time.slice(0, 5)} - ${record.end_time.slice(0, 5)}`,
    },
    {
      title: "Class",
      key: "class",
      render: (record: Schedule) => record.classes?.name || "",
    },
    {
      title: "Instructor",
      key: "instructor",
      render: (record: Schedule) => record.trainers?.name || "",
    },
  ];

  const daysOrder = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];
  const sortedSchedules = [...schedules].sort((a, b) => {
    const dayDiff =
      daysOrder.indexOf(a.day_of_week) - daysOrder.indexOf(b.day_of_week);
    if (dayDiff !== 0) return dayDiff;
    return a.start_time.localeCompare(b.start_time);
  });

  return (
    <UnauthenticatedLayout>
      {/* Hero Section */}
      <section
        style={{
          background: "#fff",
          padding: "270px 40px",
          textAlign: "center",
        }}
      >
        <div style={{ maxWidth: 800, margin: "0 auto" }}>
          <Title
            style={{
              fontSize: "3.5rem",
              fontWeight: 300,
              marginBottom: "24px",
              letterSpacing: "0.02em",
            }}
          >
            Welcome to 8Club
          </Title>
          <Paragraph
            style={{
              fontSize: "1.25rem",
              color: "#666",
              lineHeight: 1.8,
              fontWeight: 300,
            }}
          >
            Where strength meets mindfulness. Experience Lagree fitness in the
            heart of Cebu.
          </Paragraph>
        </div>
      </section>
      {/* What is Lagree */}
      <section
        id="about"
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          padding: "100px 40px",
        }}
      >
        <div style={{ maxWidth: 800, margin: "0 auto" }}>
          <Title
            level={2}
            style={{
              fontSize: "2rem",
              fontWeight: 300,
              marginBottom: "48px",
              textAlign: "center",
            }}
          >
            What is Lagree?
          </Title>

          <Paragraph className="text-[1.25rem] font-light mb-12 text-justify">
            Lagree is a full-body workout that is intense on the muscles, but
            safe on the joints.
          </Paragraph>

          <Paragraph className="text-[1.25rem] font-light mb-12 text-justify">
            It builds strength, endurance, core stability, cardiovascular
            fitness, and flexibility through slow, controlled, resistance-based
            movements on the signature Megaformer.
          </Paragraph>

          <Paragraph className="text-[1.25rem] font-light mb-12 text-justify">
            Each 50-minute class is designed to challenge both body and
            mind—combining precise, time-under-tension training with immersive
            music and intentional programming. The result is a workout that
            makes you shake, sweat, and get stronger, without compromising joint
            health.
          </Paragraph>
        </div>
      </section>
      <Divider style={{ margin: "60px 0", borderColor: "#e8e8e8" }} />
      {/* Classes */}
      {/* <section
        id="classes"
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          padding: "100px 40px",
        }}
      >
        <Title
          level={2}
          style={{
            fontSize: "2rem",
            fontWeight: 300,
            marginBottom: "48px",
            textAlign: "center",
          }}
        >
          Our Classes
        </Title>

        <Row gutter={[48, 48]}>
          {classes.map((cls) => (
            <Col xs={24} md={12} key={cls.id}>
              <Card
                bordered={false}
                style={{
                  height: "100%",
                  background: "#fff",
                  boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
                }}
              >
                <Title
                  level={4}
                  style={{ fontWeight: 400, marginBottom: "16px" }}
                >
                  {cls.name}
                </Title>
                <Text
                  type="secondary"
                  style={{
                    fontSize: "0.875rem",
                    textTransform: "uppercase",
                    letterSpacing: "0.1em",
                    display: "block",
                    marginBottom: "16px",
                  }}
                >
                  {cls.intensity_level}
                </Text>
                <Paragraph
                  style={{ color: "#666", lineHeight: 1.8, fontWeight: 300 }}
                >
                  {cls.description}
                </Paragraph>
              </Card>
            </Col>
          ))}
        </Row>
      </section>
      <Divider style={{ margin: "60px 0", borderColor: "#e8e8e8" }} /> */}
      {/* Trainers */}
      <section
        id="trainers"
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          padding: "100px 40px",
        }}
      >
        <Title
          level={2}
          style={{
            fontSize: "2rem",
            fontWeight: 300,
            marginBottom: "24px",
            textAlign: "center",
          }}
        >
          Our Trainers
        </Title>
        <Paragraph
          style={{
            textAlign: "center",
            color: "#666",
            marginBottom: "48px",
            fontSize: "1rem",
            fontWeight: 300,
          }}
        >
          Expert guidance. Proven results. Your safety is our priority.
        </Paragraph>

        <Row gutter={[48, 48]}>
          {trainers.map((trainer) => (
            <Col xs={24} md={12} key={trainer.id}>
              <Card
                bordered={false}
                style={{
                  height: "100%",
                  background: "#fff",
                  boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
                }}
              >
                <div
                  style={{
                    width: 120,
                    height: 120,
                    background: "#f0f0f0",
                    borderRadius: "50%",
                    margin: "0 auto 24px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "2.5rem",
                    color: "#999",
                  }}
                >
                  {trainer.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </div>
                <Title
                  level={4}
                  style={{
                    fontWeight: 400,
                    marginBottom: "8px",
                    textAlign: "center",
                  }}
                >
                  {trainer.name}
                </Title>
                <Text
                  type="secondary"
                  style={{
                    display: "block",
                    textAlign: "center",
                    marginBottom: "16px",
                    fontWeight: 300,
                  }}
                >
                  {trainer.role}
                </Text>
                <div
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: "8px",
                    justifyContent: "center",
                    marginBottom: "16px",
                  }}
                >
                  {trainer.certifications.map((cert, idx) => (
                    <span
                      key={idx}
                      style={{
                        padding: "4px 12px",
                        background: "#f5f5f5",
                        borderRadius: "4px",
                        fontSize: "0.75rem",
                        color: "#666",
                      }}
                    >
                      {cert}
                    </span>
                  ))}
                </div>
                <Paragraph
                  style={{
                    color: "#666",
                    lineHeight: 1.8,
                    textAlign: "center",
                    fontWeight: 300,
                  }}
                >
                  {trainer.approach}
                </Paragraph>
              </Card>
            </Col>
          ))}
        </Row>
      </section>
      <Divider style={{ margin: "60px 0", borderColor: "#e8e8e8" }} />
      {/* Schedule */}
      <section
        id="schedule"
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          padding: "100px 40px",
        }}
      >
        <Title
          level={2}
          style={{
            fontSize: "2rem",
            fontWeight: 300,
            marginBottom: "24px",
            textAlign: "center",
          }}
        >
          Class Schedule
        </Title>
        <Paragraph
          style={{
            textAlign: "center",
            color: "#666",
            marginBottom: "48px",
            fontSize: "1rem",
            fontWeight: 300,
          }}
        >
          View our weekly schedule below. Create an account to book a class.
        </Paragraph>

        <div
          style={{ background: "#fff", padding: "32px", borderRadius: "4px" }}
        >
          <Table
            dataSource={sortedSchedules}
            columns={scheduleColumns}
            pagination={false}
            rowKey="id"
            style={{ fontWeight: 300 }}
          />
        </div>
      </section>
      <Divider style={{ margin: "60px 0", borderColor: "#e8e8e8" }} />
      {/* Location */}
      <section
        id="location"
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          padding: "100px 40px",
        }}
      >
        <Title
          level={2}
          style={{
            fontSize: "2rem",
            fontWeight: 300,
            marginBottom: "48px",
            textAlign: "center",
          }}
        >
          Visit Us
        </Title>

        <Row gutter={[48, 48]} align="middle">
          <Col xs={24} md={12}>
            <div
              style={{
                background: "#f5f5f5",
                height: 400,
                borderRadius: "4px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#999",
              }}
            >
              <EnvironmentOutlined style={{ fontSize: "4rem" }} />
            </div>
          </Col>
          <Col xs={24} md={12}>
            <Title level={4} style={{ fontWeight: 400, marginBottom: "24px" }}>
              Streetscape Mall Banilad
            </Title>
            <Paragraph
              style={{
                color: "#666",
                lineHeight: 1.8,
                fontWeight: 300,
                fontSize: "1rem",
              }}
            >
              Maria Luisa Road
              <br />
              Cebu City, Cebu 6000
              <br />
              Philippines
            </Paragraph>
            <Paragraph
              style={{
                color: "#666",
                lineHeight: 1.8,
                fontWeight: 300,
                marginTop: "24px",
              }}
            >
              Located in the walkable Streetscape Mall, surrounded by cafés and
              lifestyle shops. A safe, accessible community space designed for
              wellness.
            </Paragraph>
            <Paragraph
              style={{
                color: "#666",
                lineHeight: 1.8,
                fontWeight: 300,
                marginTop: "16px",
              }}
            >
              Parking available at the mall.
            </Paragraph>
          </Col>
        </Row>
      </section>
      <Divider style={{ margin: "60px 0", borderColor: "#e8e8e8" }} />
      {/* Community / Testimonials */}
      <section
        id="community"
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          padding: "100px 40px",
        }}
      >
        <Title
          level={2}
          style={{
            fontSize: "2rem",
            fontWeight: 300,
            marginBottom: "24px",
            textAlign: "center",
          }}
        >
          Our Community
        </Title>
        <Paragraph
          style={{
            textAlign: "center",
            color: "#666",
            marginBottom: "48px",
            fontSize: "1rem",
            fontWeight: 300,
          }}
        >
          Real stories from real members.
        </Paragraph>

        <Row gutter={[32, 32]}>
          {testimonials.map((testimonial) => (
            <Col xs={24} md={8} key={testimonial.id}>
              <Card
                bordered={false}
                style={{
                  height: "100%",
                  background: "#fff",
                  boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
                  textAlign: "center",
                }}
              >
                <Paragraph
                  style={{
                    fontSize: "1rem",
                    lineHeight: 1.8,
                    color: "#333",
                    fontStyle: "italic",
                    marginBottom: "16px",
                    fontWeight: 300,
                  }}
                >
                  "{testimonial.quote}"
                </Paragraph>
                <Text
                  style={{
                    fontSize: "0.875rem",
                    color: "#999",
                    fontWeight: 400,
                  }}
                >
                  — {testimonial.client_name}
                </Text>
              </Card>
            </Col>
          ))}
        </Row>
      </section>
    </UnauthenticatedLayout>
  );
}
