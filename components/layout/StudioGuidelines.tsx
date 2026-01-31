"use client";

import { Card, Typography } from "antd";
import { useCallback } from "react";

const { Title, Text, Paragraph } = Typography;

const StudioGuidelines = () => {
  const renderStudioGuidelines = useCallback(() => {
    return (
      <Card
        styles={{
          title: {
            textAlign: 'center'
          }
        }}
        className="max-w-3xl mx-auto mt-10 rounded-2xl shadow-sm py-6 px-0 text-justify"
        title={
          <Title level={2} className="halyard !mb-0">
            8 CLUB LAGREE STUDIO GUIDELINES
          </Title>
        }
      >
        <Text strong className="halyard text-[16px]" underline>
          Credit Usage and Validity Policy
        </Text>

        <Paragraph>
          <ul>
            <li>
              Each class session is equivalent to one (1) credit, which is
              automatically deducted from your account once a booking is
              confirmed.
            </li>
            <li>
              All credits are subject to an expiration date that varies depending
              on the package purchased. Upon expiry, unused credits will be
              forfeited and cannot be reinstated.
            </li>
            <li>
              Credits are strictly non-transferable, non-refundable, and may not
              be extended beyond their validity period.
            </li>
          </ul>
        </Paragraph>
        <Text strong className="halyard text-[16px]" underline>
          Payment Policy
        </Text>
        <Paragraph>
          <ul>
            <li>
              We accept debit cards, credit cards, Maya and GCash for all
              bookings.
            </li>
            <li>
              Sessions and packages must be fully paid prior to the scheduled
              class. All payments made are final, non-refundable, and
              non-transferable.
            </li>
            <li>
              Walk-in clients may pay in cash on the day of the class, subject to
              slot availability.
            </li>
          </ul>
        </Paragraph>
        <Text strong className="halyard text-[16px]" underline>
          Schedule Policy
        </Text>
        <Paragraph>
          <ul>
            <li>
              Kindly refer to the Schedule page for current instructor listings
              and class times. Please note that instructor assignments are subject
              to change without prior notice.
            </li>
          </ul>
        </Paragraph>
        <Text strong className="halyard text-[16px]" underline>
          Class Reschedule Policy
        </Text>
        <Paragraph>
          <ul>
            <li>
              We allow same-day class rescheduling only at least 3 hours&apos;
              notice, subject to slot availability. For evaluation and
              consideration by our team.
            </li>
            <li>
              Please contact us via phone number / instagram. We will be in touch.
            </li>
            <li>
              Requests made after 3 hours will be considered late cancellations,
              and your original scheduled class will be credited, whether attended
              or not.
            </li>
          </ul>
        </Paragraph>
        <Text strong className="halyard text-[16px]" underline>
          Cancellation Policy
        </Text>
        <Paragraph>
          <ul>
            <li>
              You may cancel at least 24 hours before your scheduled class through
              your online account to retain your credits. To accommodate more
              guests, a 24-hour cancellation notice is strictly enforced. Late
              cancellations will be credited.
            </li>
            <li>
              No-show clients will be considered as having attended the session,
              and your scheduled class will be credited
            </li>
            <li>
              In case of valid reasons, they may contact the receptionist and the
              reasons will be treated as case to case basis.
            </li>
            <li>
              In the event of a medical emergency, a valid medical certificate or
              supporting document may be submitted for evaluation and
              consideration.
            </li>
          </ul>
        </Paragraph>
        <Text strong className="halyard text-[16px]" underline>
          Arrival and Late Entry Policy
        </Text>
        <Paragraph>
          <ul>
            <li>
              Please arrive 10-15 minutes before your scheduled class to allow
              ample time for preparation, check-in, and a brief orientation on the
              Megaformer and proper equipment handling.
            </li>
            <li>
              A grace period of up to 10 minutes will be given for latecomers to
              join; however, once the grace period has passed, entry will no
              longer be permitted to ensure safety and avoid disruptions.
            </li>
            <li>
              Latecomers may be accommodated in the next available slot within the
              same day, subject to availability; otherwise, the session will be
              marked as attended and the credit forfeited.
            </li>
          </ul>
        </Paragraph>
        <Text strong className="halyard text-[16px]" underline>
          Participant and Age Eligibility Policy
        </Text>
        <Typography>
          <ul>
            <li>
              Lagree is a high-intensity workout and may not be suitable for individuals
              under 14 years of age.
              <ul>
                <li>
                  <Text strong>Ages 14–15</Text>: participants may join classes only when
                  accompanied by a parent or legal guardian.
                </li>
                <li>
                  <Text strong>Ages 16–17</Text>: may participate unaccompanied, provided a
                  parent or guardian has signed a consent and liability waiver prior
                  class.
                </li>
                <li>
                  <Text strong>Participants with injuries</Text>: guests with existing or
                  previous injuries must inform the instructor{" "}
                  <Text strong>prior to class</Text>.
                </li>
              </ul>
            </li>
          </ul>
        </Typography>

        <Text strong className="halyard text-[16px]" underline>
          Studio Dress Code Policy
        </Text>
        <Paragraph>
          <ul>
            <li>
              All guests are required to wear grip socks during classes to ensure
              both safety and hygiene. Participants may bring their own pair or
              purchase one at the front desk prior to the session. Bare feet or
              outdoor shoes are not allowed inside the studio.
            </li>
            <li>
              Athletic wear that allows comfortable movement is recommended.
            </li>
            <li>
              Guests are encouraged to bring a towel and water bottle to stay
              comfortable and hydrated throughout the session.
            </li>
          </ul>
        </Paragraph>
      </Card>
    )
  }, [])
  return renderStudioGuidelines()
};

export default StudioGuidelines;
