import { Resend } from "resend";

export const resend = process.env.RESEND_WEB_APP_KEY
  ? new Resend(process.env.RESEND_WEB_APP_KEY)
  : null;
