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
-- Table structure for table `activity1of2513677`
--

DROP TABLE IF EXISTS `activity1of2513677`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `activity1of2513677` (
  `userid` int DEFAULT NULL,
  `username` varchar(100) DEFAULT NULL,
  `scoreuserget` int DEFAULT NULL,
  `tooluserget` varchar(200) DEFAULT NULL,
  `userfirstlogintime` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `activity1of2513677`
--

LOCK TABLES `activity1of2513677` WRITE;
/*!40000 ALTER TABLE `activity1of2513677` DISABLE KEYS */;
INSERT INTO `activity1of2513677` VALUES (1,'Eagle',55,'test','Fri Dec 22 2023 18:06:05 GMT+0800 (中国标准时间)');
/*!40000 ALTER TABLE `activity1of2513677` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `activitylistof2513677`
--

DROP TABLE IF EXISTS `activitylistof2513677`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `activitylistof2513677` (
  `activityid` int DEFAULT NULL,
  `activityname` varchar(100) DEFAULT NULL,
  `testQRCodeurl` varchar(100) DEFAULT NULL,
  `formalQRCodeurl` varchar(100) DEFAULT NULL,
  `totalParticipateNum` int DEFAULT NULL,
  `avarageParticipateTime` int DEFAULT NULL,
  `dramascriptnamebindto` varchar(100) DEFAULT NULL,
  `scoreuserneedtoget` int DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `activitylistof2513677`
--

LOCK TABLES `activitylistof2513677` WRITE;
/*!40000 ALTER TABLE `activitylistof2513677` DISABLE KEYS */;
INSERT INTO `activitylistof2513677` VALUES (1,'testactivity',NULL,NULL,NULL,NULL,NULL,45);
/*!40000 ALTER TABLE `activitylistof2513677` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `dramascript1of2513677`
--

DROP TABLE IF EXISTS `dramascript1of2513677`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `dramascript1of2513677` (
  `missionid` int unsigned DEFAULT NULL,
  `missionname` varchar(100) DEFAULT NULL,
  `mediatype` varchar(50) DEFAULT NULL,
  `mediaaddress` varchar(200) DEFAULT NULL,
  `mediadescription` varchar(200) DEFAULT NULL,
  `questiontype` varchar(50) DEFAULT NULL,
  `questiondescription` varchar(200) DEFAULT NULL,
  `questioninfo` varchar(300) DEFAULT NULL,
  `questionanswerdescription` varchar(100) DEFAULT NULL,
  `status` tinyint(1) DEFAULT '0',
  `score` int DEFAULT NULL,
  `hasoverlay` tinyint(1) DEFAULT '0',
  `overlayinfo` varchar(200) DEFAULT NULL,
  `overlayimageurl` varchar(200) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `dramascript1of2513677`
--

LOCK TABLES `dramascript1of2513677` WRITE;
/*!40000 ALTER TABLE `dramascript1of2513677` DISABLE KEYS */;
INSERT INTO `dramascript1of2513677` VALUES (1,'任务一','video','http://clips.vorwaerts-gmbh.de/big_buck_bunny.mp4','测试','selection','这是一个演示视频','A.测试;B.测试;C.测试;D.测试','A.测试',0,15,1,NULL,NULL),(2,'任务二','image','https://youimg1.c-ctrip.com/target/100e190000015nd637840.jpg','测试2','selection','这是一个演示图片','A.测试;B.测试;C.测试;D.测试','C.测试',0,10,0,NULL,NULL),(3,'任务三','audio','http://downsc.chinaz.net/Files/DownLoad/sound1/201906/11582.mp3','测试3','selection','这是一个演示音频','A.测试;B.测试;C.测试;D.测试','B.测试',0,20,0,NULL,NULL);
/*!40000 ALTER TABLE `dramascript1of2513677` ENABLE KEYS */;
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
INSERT INTO `dramascriptlistof2513677` VALUES (1,'这是一段测试');
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
  `latitude` float DEFAULT NULL,
  `pointName` varchar(100) DEFAULT NULL,
  `pointDescription` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `route1of2513677`
--

LOCK TABLES `route1of2513677` WRITE;
/*!40000 ALTER TABLE `route1of2513677` DISABLE KEYS */;
INSERT INTO `route1of2513677` VALUES (1,38.8788,121.601,'point1','i\'m lazzy'),(2,38.8793,121.602,'point2','i\'m lazzy'),(3,38.8816,121.603,'point3','i\'m lazzy'),(4,38.8849,121.606,'point4','i\'m lazzy'),(5,38.8863,121.605,'point5','i\'m lazzy'),(6,38.9,121.65,'point6','i\'m lazzy');
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
INSERT INTO `route2of2513677` VALUES (1,38.879,121.601),(2,38.8793,121.602),(3,38.8816,121.603),(4,38.8849,121.606),(5,38.8863,121.605),(6,38.9,121.65);
/*!40000 ALTER TABLE `route2of2513677` ENABLE KEYS */;
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
INSERT INTO `routelistof2513677` VALUES (1,'测试路线1'),(2,'null');
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

-- Dump completed on 2023-12-28 10:31:39
