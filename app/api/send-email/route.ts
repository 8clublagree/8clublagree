import nodemailer from "nodemailer";
import { NextRequest, NextResponse } from "next/server";
import { EMAIL_TEMPLATE } from "@/lib/email-templates";
import { MailtrapTransport } from "mailtrap";

type EmailTypes =
  | "package_purchase"
  | "package_pending_purchase"
  | "class_booking_confirmation";

export async function POST(req: NextRequest) {
  try {
    let body: any;
    let subject: any;
    let template: any;
    const request = await req.json();
    const {
      to,
      emailType,
      title: packageTitle,
      instructor,
      date,
      time,
      className,
    } = request;
    let recipients: string[] = [to];
    const apiToken =
      process.env.MAILTRAP_TOKEN!!
    const transport = nodemailer.createTransport(
      MailtrapTransport({ token: apiToken }),
    );
    let adminEmail: any = null
    let emailPromises: any = []

    if (!emailType) {
      return NextResponse.json(
        { message: "No email type provided" },
        { status: 500 },
      );
    }

    if (emailType === "package_purchase") {
      template = EMAIL_TEMPLATE[emailType];
      const { subject: templateSubject, body: templateBody } = template({
        packageTitle,
      });

      subject = templateSubject;
      body = templateBody;
    }

    if (emailType === "package_pending_purchase") {
      template = EMAIL_TEMPLATE[emailType];
      const adminTemplate = EMAIL_TEMPLATE['package_pending_purchase_admin'];
      const { subject: templateSubject, body: templateBody } = template({
        packageTitle,
      });

      const { subject: adminSubject, body: adminBody } = adminTemplate();

      adminEmail = transport.sendMail({
        from: "8 Club Lagree <noreply@8clublagree.com>",
        to: ['8clublagree@gmail.com'],
        subject: adminSubject,
        html: adminBody,
      })

      subject = templateSubject;
      body = templateBody;
    }

    if (emailType === "class_booking_confirmation") {
      template = EMAIL_TEMPLATE[emailType];
      const { subject: templateSubject, body: templateBody } = template({
        instructor,
        date,
        time,
        className,
      });

      subject = templateSubject;
      body = templateBody;
    }

    /**
     * SANDBOX SNIPPET START
     */

    // const transport = nodemailer.createTransport({
    //   host: process.env.MAILTRAP_HOST,
    //   port: Number(process.env.MAILTRAP_PORT) || 587,
    //   auth: {
    //     user: process.env.MAILTRAP_USERNAME,
    //     pass: process.env.MAILTRAP_PASSWORD,
    //   },
    // });

    // const info = await transport.sendMail({
    //   from: '"8ClubLagree" <8clublagree@gmail.com>',
    //   to,
    //   subject,
    //   html: body,
    // });

    /**
     * SANDBOX SNIPPET END
     */
    // ==========================================


    if (!apiToken?.trim()) {
      return NextResponse.json(
        {
          message:
            "Mailtrap API token missing. Set MAILTRAP_TOKEN or MAILTRAP_API_KEY in .env. Get a token at https://mailtrap.io/api-tokens (Email Sending permission, domain verified).",
        },
        { status: 500 },
      );
    }

    let info;

    if (adminEmail !== null) {
      emailPromises.push(adminEmail)
    }

    try {
      emailPromises.push(
        transport.sendMail({
          from: "8 Club Lagree <noreply@8clublagree.com>",
          to: recipients,
          subject,
          html: body,
        })
      )

      info = await Promise.all(emailPromises)

    } catch (sendError: any) {
      const isUnauthorized =
        sendError?.message?.includes("Unauthorized") ||
        sendError?.response?.status === 401 ||
        sendError?.code === "EAUTH";

      if (isUnauthorized) {
        console.error("Mailtrap Unauthorized:", sendError?.message ?? sendError);
        return NextResponse.json(
          {
            message:
              "Mailtrap authentication failed (401). Check: 1) Token is from Settings → API Tokens with Email Sending permission. 2) Token has Domain Admin for your sending domain. 3) Sending domain is verified. 4) Token was not reset (old token expires in 12h). See https://help.mailtrap.io/email-api-smtp/help/troubleshooting/unauthorized-401-error",
            error: "Unauthorized",
          },
          { status: 500 },
        );
      }
      throw sendError;
    }



    return NextResponse.json({ message: "Email sent", info });
  } catch (error) {
    console.error("send-email error:", error);
    return NextResponse.json(
      { message: "Error sending email", error: String(error) },
      { status: 500 },
    );
  }
}
