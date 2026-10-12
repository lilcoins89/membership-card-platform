CREATE TABLE `organizations` (
  `id` int AUTO_INCREMENT PRIMARY KEY NOT NULL,
  `ownerUserId` int NOT NULL,
  `name` varchar(160) NOT NULL,
  `slug` varchar(96) NOT NULL,
  `logoUrl` text,
  `brandColor` varchar(16) NOT NULL DEFAULT '#c7f36b',
  `createdAt` timestamp NOT NULL DEFAULT (now()),
  `updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE now(),
  CONSTRAINT `organizations_slug_unique` UNIQUE(`slug`)
);
CREATE INDEX `organizations_owner_idx` ON `organizations` (`ownerUserId`);

CREATE TABLE `members` (
  `id` int AUTO_INCREMENT PRIMARY KEY NOT NULL,
  `organizationId` int NOT NULL,
  `memberId` varchar(48) NOT NULL,
  `name` varchar(160) NOT NULL,
  `email` varchar(320) NOT NULL,
  `photoUrl` text,
  `tier` varchar(80) NOT NULL DEFAULT 'Full member',
  `status` enum('active','expiring','pending','paused') NOT NULL DEFAULT 'pending',
  `joinedAt` date,
  `expiresAt` date,
  `deliveryAddress` json,
  `createdAt` timestamp NOT NULL DEFAULT (now()),
  `updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE now()
);
CREATE INDEX `members_org_idx` ON `members` (`organizationId`);
CREATE INDEX `members_member_id_idx` ON `members` (`memberId`);

CREATE TABLE `cardDesigns` (
  `id` int AUTO_INCREMENT PRIMARY KEY NOT NULL,
  `organizationId` int NOT NULL,
  `name` varchar(120) NOT NULL,
  `version` varchar(20) NOT NULL DEFAULT '1.0',
  `brandColor` varchar(16) NOT NULL DEFAULT '#c7f36b',
  `logoUrl` text,
  `frontLayout` json NOT NULL,
  `backLayout` json,
  `isDefault` int NOT NULL DEFAULT 0,
  `createdAt` timestamp NOT NULL DEFAULT (now()),
  `updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE now()
);
CREATE INDEX `card_designs_org_idx` ON `cardDesigns` (`organizationId`);

CREATE TABLE `applications` (
  `id` int AUTO_INCREMENT PRIMARY KEY NOT NULL,
  `organizationId` int NOT NULL,
  `memberId` int,
  `applicantName` varchar(160) NOT NULL,
  `applicantEmail` varchar(320) NOT NULL,
  `status` enum('submitted','needs_update','approved','rejected') NOT NULL DEFAULT 'submitted',
  `reviewNote` text,
  `submittedAt` timestamp NOT NULL DEFAULT (now()),
  `reviewedAt` timestamp
);
CREATE INDEX `applications_org_idx` ON `applications` (`organizationId`);
CREATE INDEX `applications_status_idx` ON `applications` (`status`);

CREATE TABLE `membershipCards` (
  `id` int AUTO_INCREMENT PRIMARY KEY NOT NULL,
  `organizationId` int NOT NULL,
  `memberId` int NOT NULL,
  `designId` int NOT NULL,
  `qrPayload` varchar(500) NOT NULL,
  `frontAssetUrl` text,
  `backAssetUrl` text,
  `productionStatus` enum('draft','ready','in_production','printed','shipped','delivered') NOT NULL DEFAULT 'draft',
  `issuedAt` timestamp,
  `expiresAt` date,
  `createdAt` timestamp NOT NULL DEFAULT (now()),
  `updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE now()
);
CREATE INDEX `membership_cards_org_idx` ON `membershipCards` (`organizationId`);
CREATE INDEX `membership_cards_member_idx` ON `membershipCards` (`memberId`);

CREATE TABLE `fulfillmentOrders` (
  `id` int AUTO_INCREMENT PRIMARY KEY NOT NULL,
  `organizationId` int NOT NULL,
  `orderNumber` varchar(48) NOT NULL,
  `memberIds` json NOT NULL,
  `shippingAddress` json NOT NULL,
  `status` enum('queued','in_production','shipped','delivered','exception') NOT NULL DEFAULT 'queued',
  `printerProvider` varchar(80),
  `courierProvider` varchar(80),
  `trackingNumber` varchar(120),
  `shipmentStatus` varchar(80),
  `createdAt` timestamp NOT NULL DEFAULT (now()),
  `updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE now()
);
CREATE INDEX `fulfillment_orders_org_idx` ON `fulfillmentOrders` (`organizationId`);
CREATE INDEX `fulfillment_orders_number_idx` ON `fulfillmentOrders` (`orderNumber`);
