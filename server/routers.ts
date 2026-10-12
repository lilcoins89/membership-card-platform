import { publicProcedure, router } from "./_core/trpc";
import { z } from "zod";

const organizationIdInput = z.object({ organizationId: z.number().int().positive() });

export const appRouter = router({
  dashboard: router({
    summary: publicProcedure.input(organizationIdInput).query(({ input }) => ({
      organizationId: input.organizationId,
      totalMembers: 0,
      pendingApplications: 0,
      cardsInProduction: 0,
      expiringMemberships: 0,
      activeShipments: 0,
    })),
  }),
  members: router({
    list: publicProcedure.input(organizationIdInput.extend({ search: z.string().trim().max(120).optional() })).query(({ input }) => ({ organizationId: input.organizationId, search: input.search ?? "", items: [] })),
    create: publicProcedure.input(organizationIdInput.extend({ name: z.string().trim().min(1).max(160), email: z.string().email(), memberId: z.string().trim().min(1).max(48), tier: z.string().trim().max(80).default("Full member"), expiresAt: z.string().optional() })).mutation(({ input }) => ({ created: true, member: { ...input, status: "pending" as const } })),
    renew: publicProcedure.input(z.object({ organizationId: z.number().int().positive(), memberId: z.number().int().positive(), expiresAt: z.string() })).mutation(({ input }) => ({ renewed: true, ...input })),
  }),
  applications: router({
    list: publicProcedure.input(organizationIdInput).query(({ input }) => ({ organizationId: input.organizationId, items: [] })),
    review: publicProcedure.input(z.object({ organizationId: z.number().int().positive(), applicationId: z.number().int().positive(), decision: z.enum(["approved", "rejected", "needs_update"]), note: z.string().max(2000).optional() })).mutation(({ input }) => ({ updated: true, ...input })),
  }),
  cards: router({
    generate: publicProcedure.input(z.object({ organizationId: z.number().int().positive(), memberId: z.number().int().positive(), designId: z.number().int().positive(), expiresAt: z.string() })).mutation(({ input }) => ({ status: "ready" as const, qrPayload: `cardly://member/${input.memberId}`, frontAssetUrl: null, backAssetUrl: null })),
  }),
  orders: router({
    list: publicProcedure.input(organizationIdInput).query(({ input }) => ({ organizationId: input.organizationId, items: [] })),
    create: publicProcedure.input(z.object({ organizationId: z.number().int().positive(), memberIds: z.array(z.number().int().positive()).min(1), shippingAddress: z.record(z.string(), z.string()) })).mutation(({ input }) => ({ created: true, orderNumber: `ORD-${Date.now().toString().slice(-6)}`, status: "queued" as const, ...input })),
    track: publicProcedure.input(z.object({ organizationId: z.number().int().positive(), orderId: z.number().int().positive() })).query(({ input }) => ({ organizationId: input.organizationId, orderId: input.orderId, status: "queued" as const, trackingNumber: null, courierProvider: null })),
  }),
});

export type AppRouter = typeof appRouter;
