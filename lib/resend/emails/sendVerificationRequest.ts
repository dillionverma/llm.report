import { SendVerificationRequestParams } from "next-auth/providers";
import { resend } from "..";
import Email from "../templates/LoginLink";

const sendVerificationRequest =
  (subject: string, from: string) =>
  async (params: SendVerificationRequestParams) => {
    try {
      await resend.sendEmail({
        from,
        to: params.identifier,
        subject,
        react: Email({
          loginLink: params.url,
        }),
      });
    } catch (error) {
      console.log({ error });
    }
  };

export const sendWebVerificationRequest = sendVerificationRequest(
  "Verify LLM.Report Login",
  process.env.RESEND_EMAIL_FROM_ADDRESS!
);
