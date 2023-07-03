-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jun 29, 2023 at 10:34 AM
-- Server version: 10.4.28-MariaDB
-- PHP Version: 8.2.4

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `crud`
--

-- --------------------------------------------------------

--
-- Table structure for table `images`
--

CREATE TABLE `images` (
  `id` int(11) NOT NULL,
  `file_src` text DEFAULT NULL,
  `created_at` bigint(20) DEFAULT NULL,
  `updated_at` bigint(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `images`
--

INSERT INTO `images` (`id`, `file_src`, `created_at`, `updated_at`) VALUES
(113, 'image_1686985863761_516551379.png', 1686985385217, 1686985863777),
(114, 'image_1687509363464_664441957.png', 1687509363558, NULL),
(115, 'image_1687854834014_240569425.png', 1687854834036, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `tbl_admin`
--

CREATE TABLE `tbl_admin` (
  `id` int(10) UNSIGNED NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `account` varchar(255) DEFAULT NULL,
  `type` tinyint(1) DEFAULT NULL,
  `role_id` int(11) DEFAULT NULL,
  `refresh_token` varchar(255) DEFAULT NULL,
  `active` tinyint(1) DEFAULT NULL,
  `expired_on` bigint(20) DEFAULT NULL,
  `created_at` bigint(20) DEFAULT NULL,
  `updated_at` bigint(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tbl_admin`
--

INSERT INTO `tbl_admin` (`id`, `name`, `password`, `email`, `account`, `type`, `role_id`, `refresh_token`, `active`, `expired_on`, `created_at`, `updated_at`) VALUES
(9, 'devdest8', '$2b$10$GyV.02TvhRsgCHuDSqBQueDycnaa7nPWwsYlRtAIXrK6y6/bDJsAW', 'admin2034@gmail.com', 'Devde@st8', 0, 4, '0', 0, NULL, 1686552419646, 1686560823683),
(10, 'DevTest5', '$2b$10$Iyax2DqEssgfNYhW2mMUJ.Qa7zKc754g.5TDXBlv17DO7ege./YgS', 'devtest5@gmail.com', 'DevTest5', 0, 1, '0', 1, NULL, 1686552443891, NULL),
(11, 'DevTest@#!6', '$2b$10$p3IReC3v/UTrTzbEyMmHoeWXOnpPqyecBAtfNVtXkqU.ZuCS5036y', 'devtest6@gmail.com', 'DevTest@#!6', 0, 1, '0', 1, NULL, 1686552461424, NULL),
(12, 'DevTest@#!7', '$2b$10$M6ceMnIhxZNn0RD5cPNt2.kEw7n6gJOttqVOgmST.4llyaJmnVMc6', 'devtest7@gmail.com', 'DevTest@#!7', 0, 1, '0', 1, NULL, 1686552727600, NULL),
(13, 'devdest8', '$2b$10$erEebqJGoU3dHbqMqWm3w.b2x4lgGzUMBBwRtRxZZPN7px3pkqn/G', 'devtest8@gmail.com', 'devdest8', 0, 1, '0', 1, NULL, 1686552752982, NULL),
(14, 'Devdest@10', '$2b$10$1jlqsg4ME3yhCQvwuBzvguTuGJaJhmEHSDDfV.96trXbKP9sAiQka', 'devtest10@gmail.com', 'Devdest@10', 0, 1, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjE0LCJuYW1lIjoiRGV2ZGVzdEAxMCIsImlhdCI6MTY4Nzg1MTk5MywiZXhwIjoxNjg3ODUyNTkzfQ.EHGNKiD5adx2DBk-L3d9jpxQeG1e-V96d0sqfj8Z4TQ', 1, NULL, 1686552844960, NULL),
(305, 'Hoàng', '$2b$10$4U1LBXKNEjpv/SwUhllp7OlvMv1ebzT5Dbr54QcJqr3vK95aU8H3i', 'Hoàng@gmai.com', 'Hoàng@123', NULL, NULL, NULL, 1, NULL, 1686985323630, NULL),
(306, 'Nam', '$2b$10$5wEdvPNTlvhI32k5wFcxquzMXBvGfjDkrKFLBbTsHKGfiW2FwyCE6', 'Nam@gmai.com', 'Nam@123', NULL, NULL, NULL, 0, NULL, 1686985323688, NULL),
(307, 'Hà', '$2b$10$VS8U1jk204LIdxGD/jI62ut0aQcCwiZgbDO2KLce6NOw7i5VnjCxW', 'Hà @gmai.com', 'Hà @123', NULL, NULL, NULL, 1, NULL, 1686985323755, NULL),
(308, 'Huy', '$2b$10$3Zw9Fd5tBSOXYk35WmCqfeeEmg/CXBIfgfwgRxEGynB3fMAo8gzze', 'Huy@gmail.com', 'Huy@123', NULL, NULL, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMwOCwibmFtZSI6Ikh1eSIsImlhdCI6MTY4ODAwNTQxMCwiZXhwIjoxNjg4MDA2MDEwfQ.1cOCjOEANfflW0O3xgoy-uMIHbgv6IZ2q4MJ2xZf-2o', 1, NULL, 1686985323813, NULL),
(309, 'Hương', '$2b$10$2NPBk4jLJzS0wj35yY0kTuffbxQZ0nzK.FMH.NvrE7QYupLiH3UC6', 'Hương@gmai.com', 'Hương@123', NULL, NULL, NULL, 1, NULL, 1686985323870, NULL),
(310, 'Nhi', '$2b$10$/KzbKekRPlvqx8qzrVWcou2Yy4J2mdYmh.bGR1PlZyiqn/8ZxSCUK', 'Nhi@gmai.com', 'Nhi@123', NULL, NULL, NULL, 0, NULL, 1686985323930, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `tbl_items`
--

CREATE TABLE `tbl_items` (
  `id` int(10) UNSIGNED NOT NULL,
  `itemName` varchar(255) NOT NULL,
  `price` int(11) DEFAULT NULL,
  `created_at` bigint(20) DEFAULT NULL,
  `updated_at` bigint(20) DEFAULT NULL,
  `stock` int(11) DEFAULT NULL,
  `category` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- Dumping data for table `tbl_items`
--

INSERT INTO `tbl_items` (`id`, `itemName`, `price`, `created_at`, `updated_at`, `stock`, `category`) VALUES
(1, 'Product A', 11, NULL, NULL, 50, 'Category 1'),
(2, 'Product B', 16, NULL, NULL, 100, 'Category 2'),
(3, 'Product C', 6, NULL, NULL, 75, 'Category 1'),
(4, 'Product D', 21, NULL, NULL, 30, 'Category 3'),
(5, 'Product E', 9, NULL, NULL, 90, 'Category 2'),
(6, 'Product F', 13, NULL, NULL, 60, 'Category 1'),
(7, 'Product G', 8, NULL, NULL, 25, 'Category 3'),
(8, 'Product H', 19, NULL, NULL, 70, 'Category 2'),
(9, 'Product I', 10, NULL, NULL, 40, 'Category 1'),
(10, 'Product J', 15, NULL, NULL, 80, 'Category 3');

-- --------------------------------------------------------

--
-- Table structure for table `tbl_order`
--

CREATE TABLE `tbl_order` (
  `id` int(10) UNSIGNED NOT NULL,
  `userId` int(11) DEFAULT NULL,
  `created_at` bigint(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- Dumping data for table `tbl_order`
--

INSERT INTO `tbl_order` (`id`, `userId`, `created_at`) VALUES
(1, 9, NULL),
(2, 9, NULL),
(3, 9, NULL),
(4, 9, NULL),
(5, 9, NULL),
(6, 9, NULL),
(7, 9, NULL),
(8, 10, NULL),
(9, 10, NULL),
(10, 10, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `tbl_order_product`
--

CREATE TABLE `tbl_order_product` (
  `orderId` int(11) NOT NULL,
  `itemId` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tbl_order_product`
--

INSERT INTO `tbl_order_product` (`orderId`, `itemId`) VALUES
(1, 2),
(1, 3),
(1, 4),
(1, 7),
(2, 6),
(10, 8),
(10, 9);

-- --------------------------------------------------------

--
-- Table structure for table `tbl_payment`
--

CREATE TABLE `tbl_payment` (
  `id` int(11) NOT NULL,
  `bankName` varchar(255) DEFAULT NULL,
  `cardName` varchar(255) DEFAULT NULL,
  `cardNumber` varchar(255) DEFAULT NULL,
  `bankBranch` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- Dumping data for table `tbl_payment`
--

INSERT INTO `tbl_payment` (`id`, `bankName`, `cardName`, `cardNumber`, `bankBranch`) VALUES
(1, 'Bank A', 'John Doe', '1234 5678 9012 3456', 'Branch A'),
(2, 'Bank B', 'Jane Smith', '9876 5432 1098 7654', 'Branch B');

-- --------------------------------------------------------

--
-- Table structure for table `tbl_receipt`
--

CREATE TABLE `tbl_receipt` (
  `id` int(10) UNSIGNED NOT NULL,
  `itemtId` int(11) DEFAULT NULL,
  `orderId` int(11) DEFAULT NULL,
  `paymentId` int(11) DEFAULT NULL,
  `totalPrice` int(11) DEFAULT NULL,
  `receiptName` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `created_at` bigint(22) DEFAULT NULL,
  `updated_at` bigint(22) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- Dumping data for table `tbl_receipt`
--

INSERT INTO `tbl_receipt` (`id`, `itemtId`, `orderId`, `paymentId`, `totalPrice`, `receiptName`, `description`, `created_at`, `updated_at`) VALUES
(1, 1, 2001, 1, 50, 'John Doe', NULL, NULL, NULL),
(2, 2, 2002, 2, 75, 'Jane Smith', NULL, NULL, NULL),
(3, 3, 2003, 1, 30, 'Bob Johnson', NULL, NULL, NULL),
(4, 4, 2004, 1, 45, 'Alice Williams', NULL, NULL, NULL),
(5, 1, 2005, 2, 60, 'David Brown', NULL, NULL, NULL),
(6, 1, 2006, 2, 80, 'Sarah Davis', NULL, NULL, NULL),
(7, 3, 2007, 1, 25, 'Michael Miller', NULL, NULL, NULL),
(8, 3, 2008, 2, 35, 'Emily Wilson', NULL, NULL, NULL),
(9, 3, 2009, 1, 55, 'Daniel Anderson', NULL, NULL, NULL),
(10, 4, 2010, 2, 70, 'Olivia Taylor', NULL, NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `tbl_role`
--

CREATE TABLE `tbl_role` (
  `id` int(10) UNSIGNED NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  `publish` tinyint(1) DEFAULT NULL,
  `created_at` bigint(20) DEFAULT NULL,
  `updated_at` bigint(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tbl_role`
--

INSERT INTO `tbl_role` (`id`, `name`, `publish`, `created_at`, `updated_at`) VALUES
(4, 'admin', 1, 1686313965384, 1686315306229),
(5, 'Customer', 1, 1686313975015, NULL);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `images`
--
ALTER TABLE `images`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `tbl_admin`
--
ALTER TABLE `tbl_admin`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `tbl_items`
--
ALTER TABLE `tbl_items`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `tbl_order`
--
ALTER TABLE `tbl_order`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `tbl_order_product`
--
ALTER TABLE `tbl_order_product`
  ADD PRIMARY KEY (`orderId`,`itemId`);

--
-- Indexes for table `tbl_payment`
--
ALTER TABLE `tbl_payment`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `tbl_receipt`
--
ALTER TABLE `tbl_receipt`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `tbl_role`
--
ALTER TABLE `tbl_role`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `images`
--
ALTER TABLE `images`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=116;

--
-- AUTO_INCREMENT for table `tbl_admin`
--
ALTER TABLE `tbl_admin`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=311;

--
-- AUTO_INCREMENT for table `tbl_items`
--
ALTER TABLE `tbl_items`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `tbl_payment`
--
ALTER TABLE `tbl_payment`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `tbl_receipt`
--
ALTER TABLE `tbl_receipt`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `tbl_role`
--
ALTER TABLE `tbl_role`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
