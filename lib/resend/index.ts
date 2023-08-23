import { Resend } from "resend";
export const resend = new Resend(process.env.RESEND_WEB_APP_KEY);
