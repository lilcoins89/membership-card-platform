# Cardly Membership Platform

Cardly is a membership-card creation and fulfillment workspace for organizations that want a polished member experience from application to delivery.

## Included in this first product slice

- Public landing page at `/` with the Cardly product story and workflow.
- Operations overview at `/dashboard` with member, application, production, renewal, and shipment signals.
- Searchable member management at `/members` with status filters and renewal-ready records.
- Live card designer at `/designer` with member name, member ID, expiry, brand color, logo state, and QR preview controls.
- Drizzle models and an additive migration for organizations, members, designs, applications, cards, and fulfillment orders.
- Typed tRPC endpoints for dashboard, member, application, card generation, and order workflows.
- Stable route manifest at `client/public/manus-routes.json`.

## Run locally

```bash
pnpm dev
```

The managed server listens on the configured `PORT` (3000 by default). Typecheck with `pnpm check` and build with `pnpm build`.

## Production connections

The data model includes explicit fields for stable card assets, printer providers, courier providers, tracking numbers, shipping addresses, and production statuses. Those are integration points for the next phase; no external payment, printer, or courier account is assumed or connected in this initial build.
