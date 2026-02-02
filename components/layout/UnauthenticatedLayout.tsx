import { Button, Drawer, Layout, Row, Typography } from "antd";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { MenuOutlined } from "@ant-design/icons";
import Image from "next/image";

interface LayoutProps {
  children: React.ReactNode;
}

const { Title, Text, Paragraph } = Typography;
const { Content } = Layout;

export default function UnauthenticatedLayout({ children }: LayoutProps) {
  const router = useRouter();
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const handleResize = () => {
    setIsMobile(window.innerWidth < 768); // md breakpoint = 768px
  };

  useEffect(() => {
    handleResize(); // initial check
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  const menuItems = [
    { label: "Home", href: "/about", primary: false },
    { label: "Login", href: "/login", primary: false },
    { label: "JOIN THE 8CLUB", href: "/signup", primary: true },
  ];
  return (
    <div className="h-[100vh]">
      <header className="sticky top-0 z-[100] bg-white border-b border-[#e8e8e8]">
        <div className="max-w-[1200px] mx-auto flex items-center justify-between px-4 py-3 sm:px-6 sm:py-4 lg:px-10 lg:py-5">
          {/* Logo */}
          {/* <Title
            onClick={() => router.push("/about")}
            level={3}
            className="!m-0 tracking-[0.1em] whitespace-nowrap font-normal text-base sm:text-lg sm:font-light lg:text-xl"
          >
            8CLUBLAGREE
          </Title> */}
          <Row className="justify-center">
            <Image
              onClick={() => router.push("/about")}
              src="/images/main-logo.png"
              alt="Logo"
              width={130}
              height={130}
            />
          </Row>

          {/* Conditional Rendering */}
          {isMobile ? (
            <>
              <Row wrap={false} className="gap-x-[5px]">
                <Button
                  type={"primary"}
                  className={`bg-[#800020] border-[#800020] text-white hover:!bg-[#800020] font-medium w-fit`}
                  onClick={() => {
                    router.push("/signup");
                    setDrawerVisible(false);
                  }}
                >
                  JOIN THE 8CLUB
                </Button>
                {/* Hamburger Icon */}
                <Button
                  type="text"
                  icon={<MenuOutlined />}
                  onClick={() => setDrawerVisible(true)}
                />
              </Row>
              {/* Drawer */}

              <Drawer
                width={"100%"}
                title="Menu"
                placement="right"
                onClose={() => setDrawerVisible(false)}
                open={drawerVisible}
                bodyStyle={{ padding: 0 }}
              >
                <div className="flex flex-col p-4 gap-3">
                  {menuItems.map((item) => (
                    <Button
                      key={item.label}
                      type={item?.primary ? "primary" : "text"}
                      className={`${item?.primary
                        ? "bg-[#800020] border-[#800020] text-white hover:!bg-[#800020] font-medium w-full"
                        : "px-2 py-3 text-left text-sm font-normal w-full"
                        }`}
                      onClick={() => {
                        router.push(item.href);
                        setDrawerVisible(false);
                      }}
                    >
                      {item.label}
                    </Button>
                  ))}
                </div>
              </Drawer>
            </>
          ) : (
            // Desktop Menu
            <div className="flex items-center gap-2 sm:gap-4">
              {menuItems.map((item) => (
                <Button
                  key={item.label}
                  type={item?.primary ? "primary" : "text"}
                  className={`${item?.primary
                    ? "bg-[#800020] border-[#800020] text-white hover:!bg-[#800020] font-medium px-3 sm:px-4"
                    : "px-2 sm:px-3 text-sm sm:text-base font-normal"
                    }`}
                  onClick={() => router.push(item.href)}
                >
                  {item.label}
                </Button>
              ))}
            </div>
          )}
        </div>
      </header>

      <Content className="justify-between flex-1 min-h-0 overflow-auto pb-0 bg-slate-50">
        <div>{children}</div>
      </Content>

      {/* Footer */}
      <footer className="flex-shrink-0 bg-[#800020] text-white px-3 sm:px-6 md:px-16 lg:px-24 py-5 sm:py-8">
        <div className="max-w-[1200px] mx-auto flex flex-col md:flex-row md:justify-between md:items-start gap-5 sm:gap-8 md:gap-16">
          <div className="flex-1 flex flex-col items-center md:items-start">
            <Title
              level={3}
              className="!text-white !mb-1 !mt-0 font-light tracking-[0.1em] text-center md:text-left !text-[1.35rem] sm:!text-2xl"
            >
              8CLUBLAGREE
            </Title>
            <Paragraph
              className="!text-white"
              style={{
                fontWeight: 300,
                fontSize: "0.95rem",
                lineHeight: "1.3rem",
                marginBottom: 0,
                marginTop: 0,
              }}
            >
              Streetscape Mall Banilad, Maria Luisa Road
              <br />
              Cebu City, Cebu 6000
            </Paragraph>
          </div>

          <div className="flex-1 flex flex-col items-center md:items-start mt-4 sm:mt-6 md:mt-0">
            <Title
              level={5}
              className="!text-white !mb-1 font-normal uppercase tracking-wide text-xs sm:text-sm"
            >
              Interested in the website?
            </Title>
            <Paragraph className="text-white/80 text-xs sm:text-sm space-y-1 !mb-0 !mt-0">
              <a
                href="https://julianchiongbian.vercel.app/"
                target="_blank"
                rel="noopener noreferrer"
                className="!text-white/90 hover:!text-white underline transition-colors text-sm sm:text-sm"
              >
                Let's connect
              </a>
            </Paragraph>
          </div>

          <div className="flex-1 flex flex-col items-center md:items-start mt-4 sm:mt-6 md:mt-0">
            <Title
              level={5}
              className="!text-white !mb-1 font-normal uppercase tracking-wide text-xs sm:text-sm"
            >
              Contact Us
            </Title>
            <Paragraph className="text-white/80 text-xs sm:text-sm space-y-1 !mb-0 !mt-0">
              <a
                href="mailto:8clublagree@gmail.com"
                className="!text-white/90 hover:!text-white underline transition-colors text-sm sm:text-sm"
              >
                Email
              </a>
              <br />
              <a
                href="https://www.instagram.com/8clublagree"
                target="_blank"
                rel="noopener noreferrer"
                className="!text-white/90 hover:!text-white underline transition-colors text-sm sm:text-sm"
              >
                Instagram
              </a>
            </Paragraph>
          </div>
        </div>
        <Paragraph
          style={{
            color: "white",
            fontSize: "0.72rem",
            fontWeight: 300,
          }}
          className="text-[0.72rem] sm:text-xs !mt-[10px] text-center"
        >
          © 2026 8ClubLagree. All rights reserved.
        </Paragraph>

        {/* <div className="max-w-[1200px] mx-auto border-t border-white/20 mt-5 sm:mt-8 pt-4 sm:pt-6 text-center">
          </div> */}
      </footer>
    </div>
  );
}
