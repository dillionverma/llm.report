import { env } from "@/env.mjs";
import { Resend } from "resend";

export const resend = env.RESEND_API_KEY
  ? new Resend(env.RESEND_API_KEY)
  : null;
