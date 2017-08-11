-- phpMyAdmin SQL Dump
-- version 4.7.0
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Aug 09, 2017 at 12:10 AM
-- Server version: 10.1.25-MariaDB
-- PHP Version: 7.1.7

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `triviamaster`
--

-- --------------------------------------------------------

--
-- Table structure for table `current_users`
--

CREATE TABLE `current_users` (
  `id` int(11) NOT NULL,
  `team_name` varchar(250) NOT NULL,
  `team_token` varchar(128) NOT NULL,
  `team_score` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `current_users`
--

INSERT INTO `current_users` (`id`, `team_name`, `team_token`, `team_score`) VALUES
(30, 'team1', '67ce9d6742e2647faa875620dffa3fef049389a6354f1ba5c0f4b638966707f50e090589117586bfc825496eadc87042366698485b5c00a7e2df554166998bbe', 0),
(31, 'Nexus', '88acd129e7e7498aa1e2b08481983b969b07b41e41b13a7b7b6d95a25eade1b1a7b71f0398d73bf4f6076fb1dbd800d698fe442ead883a86dc04ef7ed22fae45', 100),
(32, 'Nexusgggg', '9404c7a36a9e8ce39e8f7ade67475454a3befc861a6bef09c564da16619a7de01536f46e8e1e8cc01742a4019ed09553c5aa7cdf6c78fa19ad78ddcfba227cb8', 0),
(33, 'team2', '52b2ba26f87b9a4d01e51f617d9cc434b6afe8e54f3a7e74f4aa5f6cd6d096d96185a5df5f47eb1a34182c2efcf73639e7d53e1fd2985cec44df1f7262adea1e', 0),
(34, 'team3', 'cd319282dc337f06dfa4102f8c5ee002b745c2011c3393f3662483add7c24ddf28614cd7d105f4b1c6d8a4451dc500453310ea3d2d9c8ab792e4be88d5c129ac', 0);

-- --------------------------------------------------------

--
-- Table structure for table `games`
--

CREATE TABLE `games` (
  `game_id` int(11) NOT NULL,
  `game_name` varchar(200) NOT NULL,
  `game_date` date NOT NULL,
  `game_location` varchar(200) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `games`
--

INSERT INTO `games` (`game_id`, `game_name`, `game_date`, `game_location`) VALUES
(1, 'Flamin\' Joes Trivia Night ', '2017-08-30', 'Flamin\' Joe\'s North Division'),
(2, 'Swinging Doors Trivia Night', '2017-08-22', 'Swinging Doors West Francis Ave'),
(3, 'Happy', '2024-01-02', 'Places'),
(37, 'Jerry\'s Tuesday Thriller', '2017-08-15', 'Jerry\'s Tavern');

-- --------------------------------------------------------

--
-- Table structure for table `questions`
--

CREATE TABLE `questions` (
  `id` int(11) NOT NULL,
  `game_id` int(11) NOT NULL,
  `round` int(11) NOT NULL,
  `rank` int(11) NOT NULL,
  `prompt` varchar(1000) NOT NULL,
  `num_answers` int(11) NOT NULL,
  `answer1` varchar(100) NOT NULL,
  `answer2` varchar(100) NOT NULL,
  `answer3` varchar(100) NOT NULL,
  `answer4` varchar(100) NOT NULL,
  `answer5` varchar(100) NOT NULL,
  `answer6` varchar(100) NOT NULL,
  `answer7` varchar(100) NOT NULL,
  `answer8` varchar(100) NOT NULL,
  `answer9` varchar(100) NOT NULL,
  `answer10` varchar(100) NOT NULL,
  `explanation` varchar(1000) NOT NULL,
  `time_limit` int(11) NOT NULL,
  `num_choices` int(11) NOT NULL,
  `choice1` varchar(100) NOT NULL,
  `choice2` varchar(100) NOT NULL,
  `choice3` varchar(100) NOT NULL,
  `choice4` varchar(100) NOT NULL,
  `choice5` varchar(100) NOT NULL,
  `choice6` varchar(100) NOT NULL,
  `choice7` varchar(100) NOT NULL,
  `choice8` varchar(100) NOT NULL,
  `choice9` varchar(100) NOT NULL,
  `choice10` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `questions`
--

INSERT INTO `questions` (`id`, `game_id`, `round`, `rank`, `prompt`, `num_answers`, `answer1`, `answer2`, `answer3`, `answer4`, `answer5`, `answer6`, `answer7`, `answer8`, `answer9`, `answer10`, `explanation`, `time_limit`, `num_choices`, `choice1`, `choice2`, `choice3`, `choice4`, `choice5`, `choice6`, `choice7`, `choice8`, `choice9`, `choice10`) VALUES
(1, 1, 1, 1, 'What is the capital city of Nevada?', 0, 'Carson City', '', '', '', '', '', '', '', '', '', 'It\'s not Las Vegas, and not Reno...it\'s little old Carson City!', 30, 5, 'Las Vegas', 'Reno', 'Carson City', 'Roswell\r\n', 'Winamucka', '', '', '', '', ''),
(5, 1, 1, 2, 'What is the largest museum in the world?', 0, 'The Louvre, Paris France', '', '', '', '', '', '', '', '', '', 'Once a castle, the Louvre, in Paris, France comprises 555,000 sq ft of public exhibition! ', 30, 1, 'Museum of Modern Art (MOMA), New York City', 'The Louvre, Paris France', 'The National Museum of Art, Washington, DC', 'The Hermitage, St. Petersburg, Russia', '', '', '', '', '', ''),
(6, 2, 1, 1, 'In what year did Columbus \"sail the ocean blue\"?  ', 0, '1492', '', '', '', '', '', '', '', '', '', 'The first of Columbus\' voyages to the new world was in 1492.', 30, 0, '', '', '', '', '', '', '', '', '', ''),
(11, 3, 1, 4, 'What is the first element on the periodic table?', 1, 'Hydrogen', '', '', '', '', '', '', '', '', '', '', 20, 0, '', '', '', '', '', '', '', '', '', ''),
(13, 3, 1, 1, 'What is the capital of Oregon?', 1, 'Salem', '', '', '', '', '', '', '', '', '', '', 20, 0, '', '', '', '', '', '', '', '', '', ''),
(14, 3, 1, 2, 'What is the longest river in the world?', 1, 'Nile', '', '', '', '', '', '', '', '', '', '', 20, 0, '', '', '', '', '', '', '', '', '', ''),
(18, 0, 1, 2, 'Who succeeded Peter the Great of Russia?', 1, 'Catherine the Great', '', '', '', '', '', '', '', '', '', '', 30, 0, '', '', '', '', '', '', '', '', '', ''),
(21, 37, 1, 2, 'What number did Jackie Robinson wear?', 0, '42', '', '', '', '', '', '', '', '', '', '', 30, 0, '', '', '', '', '', '', '', '', '', ''),
(22, 1, 1, 3, 'Who was George Washingtons Vice President?', 1, 'John Adams', '', '', '', '', '', '', '', '', '', '', 30, 0, '', '', '', '', '', '', '', '', '', ''),
(23, 37, 1, 1, 'What is the capital of Minneapolis?', 1, 'Saint Paul', '', '', '', '', '', '', '', '', '', '', 30, 0, '', '', '', '', '', '', '', '', '', ''),
(24, 37, 2, 1, 'Who is the bishop of Rome?', 1, 'The Pope', '', '', '', '', '', '', '', '', '', '', 40, 0, '', '', '', '', '', '', '', '', '', '');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `current_users`
--
ALTER TABLE `current_users`
  ADD PRIMARY KEY (`id`),
  ADD KEY `team_name` (`team_name`);

--
-- Indexes for table `games`
--
ALTER TABLE `games`
  ADD PRIMARY KEY (`game_id`);

--
-- Indexes for table `questions`
--
ALTER TABLE `questions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `game_id` (`game_id`),
  ADD KEY `rank` (`rank`),
  ADD KEY `round` (`round`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `current_users`
--
ALTER TABLE `current_users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=35;
--
-- AUTO_INCREMENT for table `games`
--
ALTER TABLE `games`
  MODIFY `game_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=38;
--
-- AUTO_INCREMENT for table `questions`
--
ALTER TABLE `questions`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=25;COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
