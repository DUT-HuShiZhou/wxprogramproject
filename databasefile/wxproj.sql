-- MySQL dump 10.13  Distrib 8.1.0, for Win64 (x86_64)
--
-- Host: localhost    Database: wxproj
-- ------------------------------------------------------
-- Server version	8.1.0

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `activitylistof2513677`
--

DROP TABLE IF EXISTS `activitylistof2513677`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `activitylistof2513677` (
  `activityname` varchar(100) DEFAULT NULL,
  `testQRCodeurl` varchar(100) DEFAULT NULL,
  `formalQRCodeurl` varchar(100) DEFAULT NULL,
  `totalParticipateNum` int DEFAULT NULL,
  `avarageParticipateTime` int DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `activitylistof2513677`
--

LOCK TABLES `activitylistof2513677` WRITE;
/*!40000 ALTER TABLE `activitylistof2513677` DISABLE KEYS */;
/*!40000 ALTER TABLE `activitylistof2513677` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `dramascriptlistof2513677`
--

DROP TABLE IF EXISTS `dramascriptlistof2513677`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `dramascriptlistof2513677` (
  `id` int DEFAULT NULL,
  `dramascriptname` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `dramascriptlistof2513677`
--

LOCK TABLES `dramascriptlistof2513677` WRITE;
/*!40000 ALTER TABLE `dramascriptlistof2513677` DISABLE KEYS */;
/*!40000 ALTER TABLE `dramascriptlistof2513677` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `pagetemplatelist`
--

DROP TABLE IF EXISTS `pagetemplatelist`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `pagetemplatelist` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `pagetemplatename` varchar(100) DEFAULT NULL,
  `widgetnum` int DEFAULT NULL,
  `pagedescirption` text,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `pagetemplatelist`
--

LOCK TABLES `pagetemplatelist` WRITE;
/*!40000 ALTER TABLE `pagetemplatelist` DISABLE KEYS */;
/*!40000 ALTER TABLE `pagetemplatelist` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `route1of2513677`
--

DROP TABLE IF EXISTS `route1of2513677`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `route1of2513677` (
  `pointID` int DEFAULT NULL,
  `longitude` float DEFAULT NULL,
  `latitude` float DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `route1of2513677`
--

LOCK TABLES `route1of2513677` WRITE;
/*!40000 ALTER TABLE `route1of2513677` DISABLE KEYS */;
INSERT INTO `route1of2513677` VALUES (1,12.12,12.13),(2,123.12,123.11);
/*!40000 ALTER TABLE `route1of2513677` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `route2of2513677`
--

DROP TABLE IF EXISTS `route2of2513677`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `route2of2513677` (
  `pointID` int DEFAULT NULL,
  `longitude` float DEFAULT NULL,
  `latitude` float DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `route2of2513677`
--

LOCK TABLES `route2of2513677` WRITE;
/*!40000 ALTER TABLE `route2of2513677` DISABLE KEYS */;
INSERT INTO `route2of2513677` VALUES (1,13.12,12.25),(2,123.22,124.11);
/*!40000 ALTER TABLE `route2of2513677` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `route3of2513677`
--

DROP TABLE IF EXISTS `route3of2513677`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `route3of2513677` (
  `pointID` int DEFAULT NULL,
  `longitude` float DEFAULT NULL,
  `latitude` float DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `route3of2513677`
--

LOCK TABLES `route3of2513677` WRITE;
/*!40000 ALTER TABLE `route3of2513677` DISABLE KEYS */;
INSERT INTO `route3of2513677` VALUES (1,13.12,12.25),(2,123.22,124.11),(3,25.11,36.05);
/*!40000 ALTER TABLE `route3of2513677` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `route4of2513677`
--

DROP TABLE IF EXISTS `route4of2513677`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `route4of2513677` (
  `pointID` int DEFAULT NULL,
  `longitude` float DEFAULT NULL,
  `latitude` float DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `route4of2513677`
--

LOCK TABLES `route4of2513677` WRITE;
/*!40000 ALTER TABLE `route4of2513677` DISABLE KEYS */;
INSERT INTO `route4of2513677` VALUES (1,13.12,12.25),(2,123.22,124.11),(3,25.11,36.05);
/*!40000 ALTER TABLE `route4of2513677` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `route5of2513677`
--

DROP TABLE IF EXISTS `route5of2513677`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `route5of2513677` (
  `pointID` int DEFAULT NULL,
  `longitude` float DEFAULT NULL,
  `latitude` float DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `route5of2513677`
--

LOCK TABLES `route5of2513677` WRITE;
/*!40000 ALTER TABLE `route5of2513677` DISABLE KEYS */;
INSERT INTO `route5of2513677` VALUES (1,13.12,12.25),(2,123.22,124.11);
/*!40000 ALTER TABLE `route5of2513677` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `route6of2513677`
--

DROP TABLE IF EXISTS `route6of2513677`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `route6of2513677` (
  `pointID` int DEFAULT NULL,
  `longitude` float DEFAULT NULL,
  `latitude` float DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `route6of2513677`
--

LOCK TABLES `route6of2513677` WRITE;
/*!40000 ALTER TABLE `route6of2513677` DISABLE KEYS */;
INSERT INTO `route6of2513677` VALUES (1,13.12,12.25),(2,123.22,124.11);
/*!40000 ALTER TABLE `route6of2513677` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `route7of2513677`
--

DROP TABLE IF EXISTS `route7of2513677`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `route7of2513677` (
  `pointID` int DEFAULT NULL,
  `longitude` float DEFAULT NULL,
  `latitude` float DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `route7of2513677`
--

LOCK TABLES `route7of2513677` WRITE;
/*!40000 ALTER TABLE `route7of2513677` DISABLE KEYS */;
INSERT INTO `route7of2513677` VALUES (1,12.123,12.123),(2,12.123,12.123);
/*!40000 ALTER TABLE `route7of2513677` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `routelistof2513677`
--

DROP TABLE IF EXISTS `routelistof2513677`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `routelistof2513677` (
  `id` int DEFAULT NULL,
  `routename` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `routelistof2513677`
--

LOCK TABLES `routelistof2513677` WRITE;
/*!40000 ALTER TABLE `routelistof2513677` DISABLE KEYS */;
INSERT INTO `routelistof2513677` VALUES (1,'测试路线1'),(2,'测试路线2'),(3,'测试路线3'),(4,'测试路线4'),(5,'测试路线5'),(6,'测试路线6'),(7,'test');
/*!40000 ALTER TABLE `routelistof2513677` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `script1of2513677`
--

DROP TABLE IF EXISTS `script1of2513677`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `script1of2513677` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `pagetemplatetype` varchar(100) DEFAULT NULL,
  `widgetdescription` text,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `script1of2513677`
--

LOCK TABLES `script1of2513677` WRITE;
/*!40000 ALTER TABLE `script1of2513677` DISABLE KEYS */;
/*!40000 ALTER TABLE `script1of2513677` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `userinfo`
--

DROP TABLE IF EXISTS `userinfo`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `userinfo` (
  `user_account` int DEFAULT NULL,
  `user_name` varchar(20) DEFAULT NULL,
  `user_password` varchar(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `userinfo`
--

LOCK TABLES `userinfo` WRITE;
/*!40000 ALTER TABLE `userinfo` DISABLE KEYS */;
INSERT INTO `userinfo` VALUES (2513677,'hushizhou','hsz040717');
/*!40000 ALTER TABLE `userinfo` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `widgetlist`
--

DROP TABLE IF EXISTS `widgetlist`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `widgetlist` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `widgetname` varchar(100) DEFAULT NULL,
  `widgetcode` text,
  `widgettemplatedescription` text,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `widgetlist`
--

LOCK TABLES `widgetlist` WRITE;
/*!40000 ALTER TABLE `widgetlist` DISABLE KEYS */;
/*!40000 ALTER TABLE `widgetlist` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2023-11-30 18:40:34
