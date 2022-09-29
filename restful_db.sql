-- phpMyAdmin SQL Dump
-- version 4.1.14
-- http://www.phpmyadmin.net
--
-- Host: 127.0.0.1
-- Generation Time: 20 Jan 2019 pada 09.02
-- Versi Server: 5.6.17
-- PHP Version: 5.5.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;

--
-- Database: `restful_db`
--

-- --------------------------------------------------------

--
-- Struktur dari tabel `product`
--

CREATE TABLE IF NOT EXISTS `auth` (
  `auth_id` int(11) NOT NULL AUTO_INCREMENT,
  `username` varchar(200) DEFAULT NULL,
  `password` varchar(200) DEFAULT NULL,
  `user_id` int(200) DEFAULT NULL,
  PRIMARY KEY (`auth_id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=6 ;

--
-- Dumping data untuk tabel `product`
--

INSERT INTO `auth` (`auth_id`, `username`, `password`, `user_id`) VALUES
(1, 'agus', '5787be38ee03a9ae5360f54d9026465f', 1),
(2, 'memet', '5787be38ee03a9ae5360f54d9026465f', 2),
(3, 'inal', '5787be38ee03a9ae5360f54d9026465f', 3),
(4, 'bair', '5787be38ee03a9ae5360f54d9026465f', 4),
(5, 'agri', '5787be38ee03a9ae5360f54d9026465f', 5),
(6, 'noval', '5787be38ee03a9ae5360f54d9026465f', 6),
(7, 'eja', '5787be38ee03a9ae5360f54d9026465f', 7),
(8, 'mike', '5787be38ee03a9ae5360f54d9026465f', 8),
(9, 'fikri', '5787be38ee03a9ae5360f54d9026465f', 9),
(10, 'yusril', '5787be38ee03a9ae5360f54d9026465f', 10);


/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
