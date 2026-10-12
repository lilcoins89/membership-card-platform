import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";

describe("Cardly public API", () => {
  const caller = appRouter.createCaller({ req: {} as never, res: {} as never });

  it("returns a dashboard summary without an auth token", async () => {
    await expect(caller.dashboard.summary({ organizationId: 1 })).resolves.toMatchObject({
      organizationId: 1,
      totalMembers: 0,
      activeShipments: 0,
    });
  });

  it("creates a queued fulfillment order from a delivery address", async () => {
    await expect(caller.orders.create({
      organizationId: 1,
      memberIds: [101, 102],
      shippingAddress: { recipient: "Maya Chen", line1: "123 Member Lane", city: "Brooklyn", postal: "11211" },
    })).resolves.toMatchObject({ created: true, status: "queued", organizationId: 1 });
  });
});
