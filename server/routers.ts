import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { protectedProcedure, publicProcedure, router } from "./_core/trpc";
import { z } from "zod";

const organizationIdInput = z.object({ organizationId: z.number().int().positive() });

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return { success: true } as const;
    }),
  }),
  dashboard: router({
    summary: protectedProcedure.input(organizationIdInput).query(({ input }) => ({
      organizationId: input.organizationId,
      totalMembers: 0,
      pendingApplications: 0,
      cardsInProduction: 0,
      expiringMemberships: 0,
      activeShipments: 0,
    })),
  }),
  members: router({
    list: protectedProcedure.input(organizationIdInput.extend({ search: z.string().trim().max(120).optional() })).query(({ input }) => ({ organizationId: input.organizationId, search: input.search ?? "", items: [] })),
    create: protectedProcedure.input(organizationIdInput.extend({ name: z.string().trim().min(1).max(160), email: z.string().email(), memberId: z.string().trim().min(1).max(48), tier: z.string().trim().max(80).default("Full member"), expiresAt: z.string().optional() })).mutation(({ input }) => ({ created: true, member: { ...input, status: "pending" as const } })),
    renew: protectedProcedure.input(z.object({ organizationId: z.number().int().positive(), memberId: z.number().int().positive(), expiresAt: z.string() })).mutation(({ input }) => ({ renewed: true, ...input })),
  }),
  applications: router({
    list: protectedProcedure.input(organizationIdInput).query(({ input }) => ({ organizationId: input.organizationId, items: [] })),
    review: protectedProcedure.input(z.object({ organizationId: z.number().int().positive(), applicationId: z.number().int().positive(), decision: z.enum(["approved", "rejected", "needs_update"]), note: z.string().max(2000).optional() })).mutation(({ input }) => ({ updated: true, ...input })),
  }),
  cards: router({
    generate: protectedProcedure.input(z.object({ organizationId: z.number().int().positive(), memberId: z.number().int().positive(), designId: z.number().int().positive(), expiresAt: z.string() })).mutation(({ input }) => ({ status: "ready" as const, qrPayload: `cardly://member/${input.memberId}`, frontAssetUrl: null, backAssetUrl: null })),
  }),
  orders: router({
    list: protectedProcedure.input(organizationIdInput).query(({ input }) => ({ organizationId: input.organizationId, items: [] })),
    create: protectedProcedure.input(z.object({ organizationId: z.number().int().positive(), memberIds: z.array(z.number().int().positive()).min(1), shippingAddress: z.record(z.string(), z.string()) })).mutation(({ input }) => ({ created: true, orderNumber: `ORD-${Date.now().toString().slice(-6)}`, status: "queued" as const, ...input })),
    track: protectedProcedure.input(z.object({ organizationId: z.number().int().positive(), orderId: z.number().int().positive() })).query(({ input }) => ({ organizationId: input.organizationId, orderId: input.orderId, status: "queued" as const, trackingNumber: null, courierProvider: null })),
  }),
});

export type AppRouter = typeof appRouter;
