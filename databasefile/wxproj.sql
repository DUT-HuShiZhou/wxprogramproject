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
  `useropenid` varchar(500) NOT NULL DEFAULT '',
  `userid` int DEFAULT NULL,
  `username` varchar(100) DEFAULT NULL,
  `scoreuserget` int NOT NULL DEFAULT '0',
  `tooluserget` varchar(200) NOT NULL DEFAULT '',
  `userfirstlogintime` varchar(100) DEFAULT NULL,
  `pointusernowat` varchar(200) NOT NULL DEFAULT '动物园点位1',
  `routeid` int DEFAULT NULL,
  `dramascriptid` int DEFAULT NULL,
  `activityname` varchar(200) NOT NULL DEFAULT ''
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `activity1of2513677`
--

LOCK TABLES `activity1of2513677` WRITE;
/*!40000 ALTER TABLE `activity1of2513677` DISABLE KEYS */;
INSERT INTO `activity1of2513677` VALUES ('oJ0ig6eFCLI8eBTl7DC-E4iehNWw',NULL,'Eagle',0,'','2024-02-06T15:27:15.531Z','动物园点位1',NULL,NULL,'');
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
  `scoreuserneedtoget` int DEFAULT NULL,
  `routeid` int DEFAULT NULL,
  `dramascriptid` int DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `activitylistof2513677`
--

LOCK TABLES `activitylistof2513677` WRITE;
/*!40000 ALTER TABLE `activitylistof2513677` DISABLE KEYS */;
INSERT INTO `activitylistof2513677` VALUES (1,'活动一',NULL,NULL,NULL,NULL,NULL,45,1,1);
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
  `missiontype` tinyint(1) NOT NULL DEFAULT '1',
  `mediatype` varchar(50) DEFAULT NULL,
  `mediaaddress` varchar(200) DEFAULT NULL,
  `mediadescription` varchar(200) DEFAULT NULL,
  `questiontype` varchar(50) DEFAULT NULL,
  `questiondescription` varchar(200) DEFAULT NULL,
  `questioninfo` varchar(300) DEFAULT NULL,
  `questionanswerdescription` varchar(100) DEFAULT NULL,
  `status` tinyint(1) DEFAULT '0',
  `score` int NOT NULL DEFAULT '0',
  `hasbeforeoverlay` tinyint(1) DEFAULT '0',
  `beforeoverlayinfo` varchar(200) DEFAULT NULL,
  `beforeoverlayimageurl` varchar(200) NOT NULL DEFAULT ' ',
  `beforedialogaudiourllist` varchar(500) DEFAULT NULL,
  `hasafteroverlay` tinyint(1) DEFAULT '0',
  `afteroverlayinfo` varchar(200) DEFAULT NULL,
  `afteroverlayimageurl` varchar(200) DEFAULT NULL,
  `afterdialogaudiourllist` varchar(500) DEFAULT NULL,
  `pointid` int NOT NULL,
  `pointname` varchar(200) DEFAULT NULL,
  `falltoolornot` tinyint(1) DEFAULT '0',
  `falltoolname` varchar(200) DEFAULT NULL,
  `hasARornot` tinyint(1) DEFAULT '0',
  `ARmodelurl` varchar(500) NOT NULL DEFAULT '',
  `modeofAR` varchar(100) NOT NULL DEFAULT '',
  `2DMarkerimageurl` varchar(500) NOT NULL DEFAULT '',
  `3DMarkervideourl` varchar(500) NOT NULL DEFAULT '',
  `ARdescription` varchar(200) NOT NULL DEFAULT ''
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `dramascript1of2513677`
--

LOCK TABLES `dramascript1of2513677` WRITE;
/*!40000 ALTER TABLE `dramascript1of2513677` DISABLE KEYS */;
INSERT INTO `dramascript1of2513677` VALUES (1,'任务一',1,'photo','http://129.204.130.33:8080/image/artest.jpg','测试','selection','这是一段演示视频','A.测试;B.测试;C.测试;D.测试','A.测试',0,15,1,'这是第一段对话;这是第二段对话;这是第三段对话','http://129.204.130.33:8080/image/peter-griffin-139724.png','http://129.204.130.33:8080/audio/1.mp3;http://129.204.130.33:8080/audio/2.mp3;http://129.204.130.33:8080/audio/3.mp3',1,'这是后旁白第一段对话;这是后旁白第二段对话;这是后旁白第三段对话','http://129.204.130.33:8080/image/peter-griffin-139724.png','http://129.204.130.33:8080/audio/1.mp3;http://129.204.130.33:8080/audio/2.mp3;http://129.204.130.33:8080/audio/3.mp3',1,'动物园点位1',1,'猫粮',1,'http://129.204.130.33:8080/model/index.glb','2DMarker','http://129.204.130.33:8080/image/artest.jpg','','请扫描图片所示铜像'),(2,'任务二',1,'image','https://youimg1.c-ctrip.com/target/100e190000015nd637840.jpg','测试2','selection','这是一个演示图片','A.测试;B.测试;C.测试;D.测试','C.测试',0,10,0,NULL,' ',NULL,0,NULL,' ',NULL,2,'动物园点位2',0,NULL,0,'','','','',''),(3,'任务三',1,'audio','http://downsc.chinaz.net/Files/DownLoad/sound1/201906/11582.mp3','测试3','selection','这是一个演示音频','A.测试;B.测试;C.测试;D.测试','B.测试',0,20,0,NULL,' ',NULL,0,NULL,' ',NULL,3,'动物园点位3',0,NULL,0,'','','','','');
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
  `dramascriptname` varchar(100) DEFAULT NULL,
  `dramascriptdescription` varchar(500) DEFAULT '',
  `routeid` int DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `dramascriptlistof2513677`
--

LOCK TABLES `dramascriptlistof2513677` WRITE;
/*!40000 ALTER TABLE `dramascriptlistof2513677` DISABLE KEYS */;
INSERT INTO `dramascriptlistof2513677` VALUES (1,'后端测试剧本1','这是后端用于测试的剧本1',1);
/*!40000 ALTER TABLE `dramascriptlistof2513677` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `miniprogramuserinfo`
--

DROP TABLE IF EXISTS `miniprogramuserinfo`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `miniprogramuserinfo` (
  `useropenid` varchar(500) NOT NULL DEFAULT '',
  `username` varchar(200) NOT NULL DEFAULT '',
  `useravatarurl` varchar(500) NOT NULL DEFAULT '',
  `totalscoreuserget` int NOT NULL DEFAULT '0',
  `userprovince` varchar(200) NOT NULL DEFAULT '',
  `usercity` varchar(200) NOT NULL DEFAULT '',
  `activityuserparticipate` varchar(1000) NOT NULL DEFAULT ''
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `miniprogramuserinfo`
--

LOCK TABLES `miniprogramuserinfo` WRITE;
/*!40000 ALTER TABLE `miniprogramuserinfo` DISABLE KEYS */;
INSERT INTO `miniprogramuserinfo` VALUES ('oJ0ig6eFCLI8eBTl7DC-E4iehNWw','Eagle','http://localhost:8080/image/oJ0ig6eFCLI8eBTl7DC-E4iehNWw_avatar.jpeg',10,'云南','昆明','activity1of2513677');
/*!40000 ALTER TABLE `miniprogramuserinfo` ENABLE KEYS */;
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
-- Table structure for table `petlist`
--

DROP TABLE IF EXISTS `petlist`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `petlist` (
  `petid` int DEFAULT NULL,
  `name` varchar(150) DEFAULT NULL,
  `petname` varchar(200) DEFAULT NULL,
  `petfullbodyimageurl` varchar(500) DEFAULT NULL,
  `pettransparentimageurl` varchar(500) DEFAULT NULL,
  `petinhouseimageurl` varchar(500) DEFAULT NULL,
  `toolcanuse` varchar(500) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `petlist`
--

LOCK TABLES `petlist` WRITE;
/*!40000 ALTER TABLE `petlist` DISABLE KEYS */;
INSERT INTO `petlist` VALUES (1,'宠物一','猫','http://129.204.130.33:8080/image/image_of_cat.jpg',NULL,NULL,'猫粮'),(2,'宠物二','狗','http://129.204.130.33:8080/image/image_of_dog.jpg',NULL,NULL,'骨头');
/*!40000 ALTER TABLE `petlist` ENABLE KEYS */;
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
INSERT INTO `route1of2513677` VALUES (1,38.8788,121.601,'动物园点位1','i\'m lazzy'),(2,38.8793,121.602,'动物园点位2','i\'m lazzy'),(3,38.8816,121.603,'动物园点位3','i\'m lazzy'),(4,38.8849,121.606,'动物园点位4','i\'m lazzy'),(5,38.8863,121.605,'动物园点位5','i\'m lazzy'),(6,38.9,121.65,'动物园点位6','i\'m lazzy');
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
INSERT INTO `routelistof2513677` VALUES (1,'测试路线1'),(2,'测试路线2');
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
-- Table structure for table `toollist`
--

DROP TABLE IF EXISTS `toollist`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `toollist` (
  `id` int DEFAULT NULL,
  `toolname` varchar(200) DEFAULT NULL,
  `toolimageurl` varchar(400) DEFAULT NULL,
  `tooldescription` varchar(500) DEFAULT NULL,
  `canbuyornot` tinyint(1) DEFAULT '0',
  `toolanimationname` varchar(200) NOT NULL DEFAULT ' ',
  `scoreneedtobuy` int NOT NULL DEFAULT '0',
  `candirectlyuseornot` tinyint(1) NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `toollist`
--

LOCK TABLES `toollist` WRITE;
/*!40000 ALTER TABLE `toollist` DISABLE KEYS */;
INSERT INTO `toollist` VALUES (1,'钥匙','http://129.204.130.33:8080/image/key.png','使用该道具以通过一些特殊关卡（关卡还在开发中）',0,'key',0,0),(2,'宝箱','http://129.204.130.33:8080/image/treasure-box.png','通过关卡后有可能获得，打开会获得积分和道具',0,'treasurebox',0,0),(3,'猫粮','http://129.204.130.33:8080/image/catfood.png','小助手猫咪的生命源泉',1,' ',15,0),(4,'骨头','http://129.204.130.33:8080/image/bone.png','小助手狗狗的生命源泉',1,' ',15,0);
/*!40000 ALTER TABLE `toollist` ENABLE KEYS */;
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

-- Dump completed on 2024-02-29 23:25:11
