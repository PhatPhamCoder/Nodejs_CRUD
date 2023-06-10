-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jun 10, 2023 at 07:46 AM
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
-- Table structure for table `tbl_admin`
--

CREATE TABLE `tbl_admin` (
  `id` int(11) UNSIGNED NOT NULL,
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
(1, 'DevTest2', '$2b$10$kkxY7Lp7nqyNbFj741U2y.c7oiO7ZPZeKYI07A7ycWO/TIHEh.E.q', 'admin2025@gmail.com', 'dev2025', 0, 4, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjowLCJpYXQiOjE2ODYzNzEyMTQsImV4cCI6MTY4NjYzMDQxNH0.gghDEzJ8yKOJ12CBUaE8UNVcj9BcEnKcANqZzZPJEhU', 0, NULL, 1686243222946, 1686371691670),
(3, 'Devtest', '$2b$10$H9tyR2f4BpFjzV15aB3KD.ycFfZTDbfIll5DQd9B34C9Q4OvC4meG', 'devtest@gmail.com', 'devtest', 0, 1, '0', 1, NULL, 1686371721869, NULL);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `tbl_admin`
--
ALTER TABLE `tbl_admin`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `tbl_admin`
--
ALTER TABLE `tbl_admin`
  MODIFY `id` int(11) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
