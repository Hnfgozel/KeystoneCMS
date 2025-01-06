CREATE DATABASE mall_management;
USE mall_management;

-- Users table
CREATE TABLE `User` (
    `id` VARCHAR(36) PRIMARY KEY,
    `name` VARCHAR(255) NOT NULL,
    `email` VARCHAR(255) NOT NULL UNIQUE,
    `password` VARCHAR(255) NOT NULL,
    `createdAt` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `mallId` VARCHAR(36)
);

-- Malls table
CREATE TABLE `Mall` (
    `id` VARCHAR(36) PRIMARY KEY,
    `name` VARCHAR(255) NOT NULL,
    `address` TEXT NOT NULL,
    `province` VARCHAR(255) NOT NULL,
    `managerId` VARCHAR(36),
    `createdAt` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (`managerId`) REFERENCES `User`(`id`)
);

-- Clients table
CREATE TABLE `Client` (
    `id` VARCHAR(36) PRIMARY KEY,
    `name` VARCHAR(255) NOT NULL,
    `email` VARCHAR(255) NOT NULL UNIQUE,
    `phone` VARCHAR(50),
    `createdAt` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Stores table
CREATE TABLE `Store` (
    `id` VARCHAR(36) PRIMARY KEY,
    `name` VARCHAR(255) NOT NULL,
    `storeNumber` VARCHAR(50) NOT NULL,
    `floor` INT,
    `rentAmount` DECIMAL(10,2) NOT NULL,
    `status` ENUM('active', 'inactive') DEFAULT 'active',
    `mallId` VARCHAR(36) NOT NULL,
    `ownerId` VARCHAR(36) NOT NULL,
    `createdAt` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (`mallId`) REFERENCES `Mall`(`id`),
    FOREIGN KEY (`ownerId`) REFERENCES `Client`(`id`)
);

-- Payments table
CREATE TABLE `Payment` (
    `id` VARCHAR(36) PRIMARY KEY,
    `amount` DECIMAL(10,2) NOT NULL,
    `paymentDate` TIMESTAMP NOT NULL,
    `paymentMethod` ENUM('bank_transfer', 'cash', 'check') NOT NULL,
    `storeId` VARCHAR(36) NOT NULL,
    `receiptNumber` VARCHAR(255),
    `notes` TEXT,
    `createdAt` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (`storeId`) REFERENCES `Store`(`id`)
);

-- Add indexes
ALTER TABLE `Store` ADD INDEX `idx_store_mall` (`mallId`);
ALTER TABLE `Store` ADD INDEX `idx_store_owner` (`ownerId`);
ALTER TABLE `Payment` ADD INDEX `idx_payment_store` (`storeId`); 