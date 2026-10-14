# Cardly implementation plan

## Product scope
Cardly is a membership-card creation and fulfillment platform for organizations. The first slice delivers a polished public landing page and a working operations console with dashboard, member management, application tracking, a visual card designer, and order/shipping visibility. The backend foundation keeps organization accounts, membership records, card designs, generated card assets, applications, and orders ready for managed database persistence and future printer/courier/payment integrations.

## Implementation approach
- Keep the managed React/Express/tRPC/Drizzle starter and expose Cardly’s domain API as public procedures without application login or token authentication.
- Add Drizzle tables for organizations, members, card designs, applications, cards, and fulfillment orders with organization-scoped ownership fields.
- Add tRPC procedures for dashboard summaries, members, applications, card designs, and orders. The UI uses a clear demo dataset for the first product pass and is structured so procedures can replace the demo source without changing the screens.
- Build responsive routes for `/` landing page, `/dashboard` operations overview, `/members` searchable member management, `/applications` review queue, `/renewals` renewal operations, `/orders` fulfillment visibility, and `/designer` live card designer.
- Add `public/manus-routes.json` for the complete page route manifest.
- Keep printing, payments, and courier systems integration-ready through explicit status fields and adapter notes rather than pretending external integrations are connected.

## Design direction
- **Design movement:** editorial SaaS with a warm Swiss-modernist backbone: precise grids, oversized type, and tactile paper-like surfaces.
- **Core principles:** calm operational clarity, confident brand expression, visible progress, and low-friction actions.
- **Color philosophy:** Ink navy provides trust and contrast; bone and mist backgrounds feel like premium card stock; the signature electric lime is an ownable proof-of-action color for active states and primary CTAs; coral is reserved for attention and at-risk renewals.
- **Layout paradigm:** a left rail + asymmetric dashboard canvas. Key metrics form a horizontal “control strip,” while the card preview and operational queues create an intentional editorial split instead of a generic centered grid.
- **Signature elements:** lime “signal” dots, slim numbered section labels, and a physical-card preview with micro-details (chip, QR frame, expiry microtype).
- **Interaction philosophy:** every interactive surface previews the next operational step. Filters, tabs, and designer controls respond immediately; destructive or consequential actions are visually de-emphasized until needed.
- **Animation:** use short 160–220ms ease-out transitions; slide active nav underline; lift cards 2–4px on hover; use a subtle shimmer only for loading states, never for decoration.
- **Typography system:** Space Grotesk for headings and labels, Inter for body copy and data. Headings are compact and slightly tracked; labels are uppercase with generous tracking.
- **Brand essence:** “Membership infrastructure that feels as polished as the card in your wallet.” Personality: composed, tactile, capable.
- **Brand voice:** practical, concise, quietly premium. Examples: “Make every member feel expected.” and “Cards out, status clear.”
- **Wordmark & logo:** a compact “C” monogram built from two offset rounded rectangles, paired with the CARDLY wordmark in a custom-tracked grotesk.
- **Signature brand color:** signal lime `#C7F36B`.

## Project structure
- `client/src/pages/`: route-level landing, dashboard, members, and designer views.
- `client/src/components/`: shared app shell, status badges, data rows, and card preview components.
- `client/src/index.css`: global tokens, responsive layout, and component styling.
- `server/routers.ts`: typed tRPC surface for dashboard, members, applications, designs, and orders.
- `server/db.ts`: query helpers for the new organization-scoped records.
- `drizzle/schema.ts`: application tables and types.
- `drizzle/`: additive migrations.
- `public/manus-routes.json`: managed route manifest.

## Future production connections
- Card printer adapter: map `cards.productionStatus` and `orders.status` to a printer API webhook.
- Courier adapter: map `orders.trackingNumber` and `orders.shipmentStatus` to courier events.
- Payments: add Stripe only when checkout pricing and payment ownership are confirmed.
- Storage: member photos, organization logos, and print-ready files use stable `/manus-storage/` paths and database metadata.
