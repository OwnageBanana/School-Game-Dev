-- phpMyAdmin SQL Dump
-- version 4.8.5
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Mar 27, 2019 at 02:19 AM
-- Server version: 10.1.38-MariaDB
-- PHP Version: 7.3.2

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `a3`
--

-- --------------------------------------------------------

--
-- Table structure for table `scores`
--

CREATE TABLE `scores` (
  `Id` int(11) NOT NULL,
  `Score` int(11) NOT NULL,
  `Level` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `scores`
--

INSERT INTO `scores` (`Id`, `Score`, `Level`) VALUES
(1, 1000, 2),
(2, 1000, 2),
(3, 10000, 2),
(4, 10000, 1),
(5, 5400, 2),
(6, 132650, 3),
(7, 1150, 1),
(8, 120200, 3),
(9, 100, 1),
(10, 66550, 5),
(11, 11000, 2),
(12, 11000, 2),
(13, 65000, 5),
(14, 0, 1),
(15, 567300, 5),
(16, 65000, 5),
(17, 65000, 5),
(18, 5300, 1),
(19, 156300, 2),
(20, 0, 1),
(21, 179350, 3),
(22, 0, 1),
(23, 3200, 1),
(24, 15550, 1),
(25, 8350, 1),
(26, 1100, 1),
(27, 6650, 1),
(28, 1000, 1),
(29, 8900, 1),
(30, 188900, 2),
(31, 26600, 3),
(32, 20350, 1),
(33, 629300, 2),
(34, 6550, 1),
(35, 10100, 1),
(36, 2100, 1),
(37, 3300, 1),
(38, 401800, 3),
(39, 388650, 4),
(40, 1950, 1),
(41, 3650, 1),
(42, 7650, 1),
(43, 7650, 1),
(44, 7650, 1),
(45, 1100, 1),
(46, 170250, 2),
(47, 41650, 1),
(48, 0, 1),
(49, 0, 1),
(50, 0, 1),
(51, 0, 1),
(52, 0, 1),
(53, 0, 1),
(54, 0, 1),
(55, 467950, 4),
(56, 1158500, 5),
(57, 1000, 1),
(58, 1000, 1),
(59, 1418700, 5),
(60, 1600, 1),
(61, 0, 1),
(62, 200, 1),
(63, 441700, 5);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `scores`
--
ALTER TABLE `scores`
  ADD PRIMARY KEY (`Id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `scores`
--
ALTER TABLE `scores`
  MODIFY `Id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=64;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
