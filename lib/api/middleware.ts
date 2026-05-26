import { NextResponse } from "next/server";
import { validateApiKey, ValidatedKey } from "./auth";
import { checkRateLimit, logUsage } from "./rateLimit";

export type ApiHandler = (
  request: Request,
  ctx: ValidatedKey,
  params?: Record<string, string>
) => Promise<NextResponse>;

export function withApiAuth(handler: ApiHandler) {
  return async function (request: Request, routeContext?: { params?: Record<string, string> }) {
    const start = Date.now();
    const url = new URL(request.url);
    const endpoint = url.pathname;

    const ctx = await validateApiKey(request);
    if (!ctx) {
      return NextResponse.json(
        { success: false, error: { code: "UNAUTHORIZED", message: "Valid API key required in Authorization: Bearer header" } },
        { status: 401 }
      );
    }

    const allowed = await checkRateLimit(ctx.apiKeyId, ctx.rateLimit);
    if (!allowed) {
      await logUsage(ctx.apiKeyId, endpoint, 429, Date.now() - start);
      return NextResponse.json(
        { success: false, error: { code: "RATE_LIMITED", message: `Rate limit exceeded: ${ctx.rateLimit} requests/day` } },
        { status: 429 }
      );
    }

    try {
      const response = await handler(request, ctx, routeContext?.params);
      await logUsage(ctx.apiKeyId, endpoint, response.status, Date.now() - start);
      return response;
    } catch (err) {
      await logUsage(ctx.apiKeyId, endpoint, 500, Date.now() - start);
      console.error("[API]", err);
      return NextResponse.json(
        { success: false, error: { code: "INTERNAL_ERROR", message: "Internal server error" } },
        { status: 500 }
      );
    }
  };
}

export function apiSuccess<T>(data: T, meta?: Record<string, unknown>) {
  return NextResponse.json({ success: true, data, ...(meta ? { meta } : {}) });
}

export function apiError(code: string, message: string, status = 400) {
  return NextResponse.json({ success: false, error: { code, message } }, { status });
}
