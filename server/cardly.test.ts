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
      shippingAddress: { recipient: "Maya Chen", line1: "123 Member Lane", city: "Brooklyn", state: "NY", postal: "11211", country: "US" },
    })).resolves.toMatchObject({ created: true, status: "queued", organizationId: 1 });
  });

  it("accepts ZIP+4 addresses for U.S. territories", async () => {
    await expect(caller.orders.create({
      organizationId: 1,
      memberIds: [103],
      shippingAddress: { recipient: "Ari Rivera", line1: "10 Palm Way", city: "San Juan", state: "PR", postal: "00901-1234", country: "US" },
    })).resolves.toMatchObject({ created: true, status: "queued" });
  });

  it("rejects incomplete or non-U.S. shipping addresses", async () => {
    await expect(caller.orders.create({
      organizationId: 1,
      memberIds: [104],
      shippingAddress: { recipient: "", line1: "123 Member Lane", city: "Toronto", state: "ON", postal: "M5V 2T6", country: "US" },
    })).rejects.toThrow();
  });
});
