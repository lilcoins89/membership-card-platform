# Cardly delivery TODO

- [x] Public landing page explains Cardly’s card creation, membership management, production, and shipping workflow with clear sign-up calls to action.
- [x] Dashboard summarizes member counts, pending applications, cards awaiting production, expiring memberships, renewals, and active shipments.
- [x] Card designer supports name, member photo, member ID, expiry date, organization logo, branding, and QR code placement in a live card preview.
- [x] Card designer includes selectable branded membership card templates with live preview variants for Northstar Club, Kinship Access, and PACT / 24.
- [x] Card designer uses Konva for an interactive canvas with selectable/draggable text layers, transform handles, safe-area guidance, reset layout, and PNG export.
- [x] Member management provides searchable member records, profile details, membership status, issue and expiry dates, and card history.
- [x] Application tracking exposes review states and actions to approve, reject, or request updates before creating a membership card. The Applications workspace provides status filters, applicant detail review, import placeholder, and approve/reject/request-update actions that update the queue immediately.
- [x] Card generation is represented as a typed backend flow that merges member data into a selected design and produces front/back production asset placeholders with a scannable QR code payload.
- [x] Membership renewal workflow identifies expiring memberships, extends validity, updates expiry dates, and supports replacement card issuance. The Renewals workspace provides term selection, one-click renewal, replacement-card handling, reminder actions, and updated renewal states.
- [x] Order and delivery management collects shipping addresses, groups generated cards into fulfillment orders, and displays production and shipment statuses. The Orders & shipping workspace provides address capture, order creation, grouped card batches, order search, and shipment status/tracking display.
- [x] U.S.-wide shipping supports complete delivery addresses for all 50 states, D.C., and U.S. territories, including apartment/unit, state selection, 5-digit or ZIP+4 validation, coverage messaging, and server-side address validation.
- [x] Production and fulfillment are integration-ready with defined connection points for card printers and courier tracking services.
- [x] Repository is stored in the requested private GitHub repository and the implemented app passes typecheck/build validation.
