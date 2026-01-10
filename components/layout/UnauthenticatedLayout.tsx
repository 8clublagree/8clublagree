import { Button, Row, Typography } from "antd";
import { useRouter } from "next/navigation";

interface LayoutProps {
  children: React.ReactNode;
}

const { Title, Text, Paragraph } = Typography;

export default function UnauthenticatedLayout({ children }: LayoutProps) {
  const router = useRouter();
  return (
    <div className="h-[100vh]">
      <header className="sticky top-0 z-[100] bg-white border-b border-[#e8e8e8]">
        <Row
          wrap={false}
          className="max-w-[1200px] mx-auto flex items-center justify-between px-4 py-3 sm:px-6 sm:py-4 lg:px-10 lg:py-5"
        >
          {/* Logo */}
          <Title
            level={3}
            className="!m-0 tracking-[0.1em] whitespace-nowrap font-normal text-base sm:text-lg sm:font-light lg:text-xl"
          >
            8CLUB
          </Title>

          {/* Actions */}
          <div className="flex items-center gap-2 sm:gap-4">
            <Button
              type="text"
              className="px-2 sm:px-3 text-sm sm:text-base font-normal"
              onClick={() => router.push("/about")}
            >
              Home
            </Button>

            <Button
              type="text"
              className="px-2 sm:px-3 text-sm sm:text-base font-normal"
              onClick={() => router.push("/login")}
            >
              Login
            </Button>

            <Button
              type="primary"
              className="bg-[#36013F] border-[#36013F] text-sm sm:text-base font-medium px-3 sm:px-4"
            >
              Join the 8Club
            </Button>
          </div>
        </Row>
      </header>

      <div>{children}</div>

      {/* Footer */}
      <footer className="bg-[#36013F] text-white px-10 py-[60px] mt-[100px]">
        <div className="max-w-[1200px] mx-auto text-center">
          <Title
            level={3}
            className="text-white font-light mb-6 tracking-[0.1em]"
          >
            8CLUB
          </Title>
          <Paragraph style={{ color: "#999", fontWeight: 300 }}>
            Streetscape Mall Banilad, Maria Luisa Road
            <br />
            Cebu City, Cebu 6000
          </Paragraph>
          <Paragraph
            style={{ color: "#666", fontSize: "0.875rem", marginTop: "32px" }}
          >
            © 2024 8Club. All rights reserved.
          </Paragraph>
        </div>
      </footer>
    </div>
  );
}
