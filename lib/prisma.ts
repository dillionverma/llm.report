import { PrismaClient } from "@prisma/client";
import { calculateCost } from "./llm/calculateCost";

declare global {
  type ExtendedPrismaClient = PrismaClient & {
    $extends: {
      result: {
        request: {
          prompt: {
            needs: { url: true; request_body: true };
            compute: (log: any) => string;
          };
          cost: {
            needs: {
              prompt_tokens: true;
              completion_tokens: true;
              model: true;
            };
            compute: (log: any) => number;
          };
        };
      };
    };
  };
  var prisma: PrismaClient | ExtendedPrismaClient | any;
  // var prisma: PrismaClient | undefined | any;
}

const prisma =
  global.prisma ||
  new PrismaClient({
    log: [
      {
        emit: "stdout",
        level: "query",
      },
      {
        emit: "stdout",
        level: "error",
      },
      {
        emit: "stdout",
        level: "info",
      },
      {
        emit: "stdout",
        level: "warn",
      },
    ],
  }).$extends({
    result: {
      request: {
        prompt: {
          needs: { url: true, request_body: true },
          compute(log) {
            return new URL(log.url).pathname === "/v1/completions"
              ? `"${(log.request_body as any)?.prompt}"`
              : `"${(log.request_body as any)?.messages?.map(
                  (m: any) => `${m.role}:\n ${m.content}\n `
                )}"`.replace(/"/g, '""');
          },
        },
        cost: {
          needs: { prompt_tokens: true, completion_tokens: true, model: true },
          compute(log) {
            return calculateCost({
              model: log.model,
              input: log.prompt_tokens,
              output: log.completion_tokens,
            });
          },
        },
      },
    },
  });

if (process.env.NODE_ENV === "development") global.prisma = prisma;

export default prisma;
