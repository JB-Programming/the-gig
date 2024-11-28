-- MySQL dump 10.13  Distrib 8.0.40, for Win64 (x86_64)
--
-- Host: localhost    Database: hillmann_und_geitz_db
-- ------------------------------------------------------
-- Server version	8.0.40

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
-- Table structure for table `auth_group`
--

DROP TABLE IF EXISTS `auth_group`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `auth_group` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(150) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `auth_group`
--

LOCK TABLES `auth_group` WRITE;
/*!40000 ALTER TABLE `auth_group` DISABLE KEYS */;
/*!40000 ALTER TABLE `auth_group` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `auth_group_permissions`
--

DROP TABLE IF EXISTS `auth_group_permissions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `auth_group_permissions` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `group_id` int NOT NULL,
  `permission_id` int NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `auth_group_permissions_group_id_permission_id_0cd325b0_uniq` (`group_id`,`permission_id`),
  KEY `auth_group_permissio_permission_id_84c5c92e_fk_auth_perm` (`permission_id`),
  CONSTRAINT `auth_group_permissio_permission_id_84c5c92e_fk_auth_perm` FOREIGN KEY (`permission_id`) REFERENCES `auth_permission` (`id`),
  CONSTRAINT `auth_group_permissions_group_id_b120cbf9_fk_auth_group_id` FOREIGN KEY (`group_id`) REFERENCES `auth_group` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `auth_group_permissions`
--

LOCK TABLES `auth_group_permissions` WRITE;
/*!40000 ALTER TABLE `auth_group_permissions` DISABLE KEYS */;
/*!40000 ALTER TABLE `auth_group_permissions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `auth_permission`
--

DROP TABLE IF EXISTS `auth_permission`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `auth_permission` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `content_type_id` int NOT NULL,
  `codename` varchar(100) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `auth_permission_content_type_id_codename_01ab375a_uniq` (`content_type_id`,`codename`),
  CONSTRAINT `auth_permission_content_type_id_2f476e4b_fk_django_co` FOREIGN KEY (`content_type_id`) REFERENCES `django_content_type` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=33 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `auth_permission`
--

LOCK TABLES `auth_permission` WRITE;
/*!40000 ALTER TABLE `auth_permission` DISABLE KEYS */;
INSERT INTO `auth_permission` VALUES (1,'Can add log entry',1,'add_logentry'),(2,'Can change log entry',1,'change_logentry'),(3,'Can delete log entry',1,'delete_logentry'),(4,'Can view log entry',1,'view_logentry'),(5,'Can add permission',2,'add_permission'),(6,'Can change permission',2,'change_permission'),(7,'Can delete permission',2,'delete_permission'),(8,'Can view permission',2,'view_permission'),(9,'Can add group',3,'add_group'),(10,'Can change group',3,'change_group'),(11,'Can delete group',3,'delete_group'),(12,'Can view group',3,'view_group'),(13,'Can add user',4,'add_user'),(14,'Can change user',4,'change_user'),(15,'Can delete user',4,'delete_user'),(16,'Can view user',4,'view_user'),(17,'Can add content type',5,'add_contenttype'),(18,'Can change content type',5,'change_contenttype'),(19,'Can delete content type',5,'delete_contenttype'),(20,'Can view content type',5,'view_contenttype'),(21,'Can add session',6,'add_session'),(22,'Can change session',6,'change_session'),(23,'Can delete session',6,'delete_session'),(24,'Can view session',6,'view_session'),(25,'Can add Token',7,'add_token'),(26,'Can change Token',7,'change_token'),(27,'Can delete Token',7,'delete_token'),(28,'Can view Token',7,'view_token'),(29,'Can add Token',8,'add_tokenproxy'),(30,'Can change Token',8,'change_tokenproxy'),(31,'Can delete Token',8,'delete_tokenproxy'),(32,'Can view Token',8,'view_tokenproxy');
/*!40000 ALTER TABLE `auth_permission` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `auth_user`
--

DROP TABLE IF EXISTS `auth_user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `auth_user` (
  `id` int NOT NULL AUTO_INCREMENT,
  `password` varchar(128) NOT NULL,
  `last_login` datetime(6) DEFAULT NULL,
  `is_superuser` tinyint(1) NOT NULL,
  `username` varchar(150) NOT NULL,
  `first_name` varchar(150) NOT NULL,
  `last_name` varchar(150) NOT NULL,
  `email` varchar(254) NOT NULL,
  `is_staff` tinyint(1) NOT NULL,
  `is_active` tinyint(1) NOT NULL,
  `date_joined` datetime(6) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `auth_user`
--

LOCK TABLES `auth_user` WRITE;
/*!40000 ALTER TABLE `auth_user` DISABLE KEYS */;
INSERT INTO `auth_user` VALUES (1,'pbkdf2_sha256$870000$JYFrF4aHdV23E0cnvHD0fX$a7ZePNxolZeFLwVrIFIB9h7MxNT+jg5Uu3/4tlTKn9I=','2024-10-17 14:28:26.064869',1,'test_user','','','',1,1,'2024-10-17 11:18:00.715325'),(2,'pbkdf2_sha256$870000$xLT0jAiqlZk7KRdgtBQw8H$tPGqjS4TZtRPhWwQWkXiT4BdHqj5gzjawU1Q0sF4kH8=',NULL,0,'29855','Heiko','Dähnenkamp','abc@abc.de',0,1,'2024-10-17 13:43:04.000000');
/*!40000 ALTER TABLE `auth_user` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `auth_user_groups`
--

DROP TABLE IF EXISTS `auth_user_groups`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `auth_user_groups` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `group_id` int NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `auth_user_groups_user_id_group_id_94350c0c_uniq` (`user_id`,`group_id`),
  KEY `auth_user_groups_group_id_97559544_fk_auth_group_id` (`group_id`),
  CONSTRAINT `auth_user_groups_group_id_97559544_fk_auth_group_id` FOREIGN KEY (`group_id`) REFERENCES `auth_group` (`id`),
  CONSTRAINT `auth_user_groups_user_id_6a12ed8b_fk_auth_user_id` FOREIGN KEY (`user_id`) REFERENCES `auth_user` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `auth_user_groups`
--

LOCK TABLES `auth_user_groups` WRITE;
/*!40000 ALTER TABLE `auth_user_groups` DISABLE KEYS */;
/*!40000 ALTER TABLE `auth_user_groups` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `auth_user_user_permissions`
--

DROP TABLE IF EXISTS `auth_user_user_permissions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `auth_user_user_permissions` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `permission_id` int NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `auth_user_user_permissions_user_id_permission_id_14a6b632_uniq` (`user_id`,`permission_id`),
  KEY `auth_user_user_permi_permission_id_1fbb5f2c_fk_auth_perm` (`permission_id`),
  CONSTRAINT `auth_user_user_permi_permission_id_1fbb5f2c_fk_auth_perm` FOREIGN KEY (`permission_id`) REFERENCES `auth_permission` (`id`),
  CONSTRAINT `auth_user_user_permissions_user_id_a95ead1b_fk_auth_user_id` FOREIGN KEY (`user_id`) REFERENCES `auth_user` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `auth_user_user_permissions`
--

LOCK TABLES `auth_user_user_permissions` WRITE;
/*!40000 ALTER TABLE `auth_user_user_permissions` DISABLE KEYS */;
/*!40000 ALTER TABLE `auth_user_user_permissions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `authtoken_token`
--

DROP TABLE IF EXISTS `authtoken_token`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `authtoken_token` (
  `key` varchar(40) NOT NULL,
  `created` datetime(6) NOT NULL,
  `user_id` int NOT NULL,
  PRIMARY KEY (`key`),
  UNIQUE KEY `user_id` (`user_id`),
  CONSTRAINT `authtoken_token_user_id_35299eff_fk_auth_user_id` FOREIGN KEY (`user_id`) REFERENCES `auth_user` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `authtoken_token`
--

LOCK TABLES `authtoken_token` WRITE;
/*!40000 ALTER TABLE `authtoken_token` DISABLE KEYS */;
INSERT INTO `authtoken_token` VALUES ('1b54833142fdcffc050bf74aa13e34cc48870a44','2024-10-17 15:27:51.770647',2),('78682025f7596f2d46dc204df56b19031b48dd53','2024-10-17 14:56:49.477529',1);
/*!40000 ALTER TABLE `authtoken_token` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `django_admin_log`
--

DROP TABLE IF EXISTS `django_admin_log`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `django_admin_log` (
  `id` int NOT NULL AUTO_INCREMENT,
  `action_time` datetime(6) NOT NULL,
  `object_id` longtext,
  `object_repr` varchar(200) NOT NULL,
  `action_flag` smallint unsigned NOT NULL,
  `change_message` longtext NOT NULL,
  `content_type_id` int DEFAULT NULL,
  `user_id` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `django_admin_log_content_type_id_c4bce8eb_fk_django_co` (`content_type_id`),
  KEY `django_admin_log_user_id_c564eba6_fk_auth_user_id` (`user_id`),
  CONSTRAINT `django_admin_log_content_type_id_c4bce8eb_fk_django_co` FOREIGN KEY (`content_type_id`) REFERENCES `django_content_type` (`id`),
  CONSTRAINT `django_admin_log_user_id_c564eba6_fk_auth_user_id` FOREIGN KEY (`user_id`) REFERENCES `auth_user` (`id`),
  CONSTRAINT `django_admin_log_chk_1` CHECK ((`action_flag` >= 0))
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `django_admin_log`
--

LOCK TABLES `django_admin_log` WRITE;
/*!40000 ALTER TABLE `django_admin_log` DISABLE KEYS */;
INSERT INTO `django_admin_log` VALUES (1,'2024-10-17 13:43:06.608800','2','29855',1,'[{\"added\": {}}]',4,1),(2,'2024-10-17 15:27:27.048458','2','29855',2,'[{\"changed\": {\"fields\": [\"First name\", \"Last name\", \"Last login\"]}}]',4,1),(3,'2024-10-17 15:33:52.383695','2','29855',2,'[{\"changed\": {\"fields\": [\"Email address\"]}}]',4,1);
/*!40000 ALTER TABLE `django_admin_log` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `django_content_type`
--

DROP TABLE IF EXISTS `django_content_type`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `django_content_type` (
  `id` int NOT NULL AUTO_INCREMENT,
  `app_label` varchar(100) NOT NULL,
  `model` varchar(100) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `django_content_type_app_label_model_76bd3d3b_uniq` (`app_label`,`model`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `django_content_type`
--

LOCK TABLES `django_content_type` WRITE;
/*!40000 ALTER TABLE `django_content_type` DISABLE KEYS */;
INSERT INTO `django_content_type` VALUES (1,'admin','logentry'),(3,'auth','group'),(2,'auth','permission'),(4,'auth','user'),(7,'authtoken','token'),(8,'authtoken','tokenproxy'),(5,'contenttypes','contenttype'),(6,'sessions','session');
/*!40000 ALTER TABLE `django_content_type` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `django_migrations`
--

DROP TABLE IF EXISTS `django_migrations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `django_migrations` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `app` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `applied` datetime(6) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=23 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `django_migrations`
--

LOCK TABLES `django_migrations` WRITE;
/*!40000 ALTER TABLE `django_migrations` DISABLE KEYS */;
INSERT INTO `django_migrations` VALUES (1,'contenttypes','0001_initial','2024-10-17 11:12:02.538900'),(2,'auth','0001_initial','2024-10-17 11:12:03.745141'),(3,'admin','0001_initial','2024-10-17 11:12:04.003535'),(4,'admin','0002_logentry_remove_auto_add','2024-10-17 11:12:04.019990'),(5,'admin','0003_logentry_add_action_flag_choices','2024-10-17 11:12:04.033266'),(6,'contenttypes','0002_remove_content_type_name','2024-10-17 11:12:04.163028'),(7,'auth','0002_alter_permission_name_max_length','2024-10-17 11:12:04.265780'),(8,'auth','0003_alter_user_email_max_length','2024-10-17 11:12:04.295594'),(9,'auth','0004_alter_user_username_opts','2024-10-17 11:12:04.305534'),(10,'auth','0005_alter_user_last_login_null','2024-10-17 11:12:04.392434'),(11,'auth','0006_require_contenttypes_0002','2024-10-17 11:12:04.400405'),(12,'auth','0007_alter_validators_add_error_messages','2024-10-17 11:12:04.410147'),(13,'auth','0008_alter_user_username_max_length','2024-10-17 11:12:04.516995'),(14,'auth','0009_alter_user_last_name_max_length','2024-10-17 11:12:04.633306'),(15,'auth','0010_alter_group_name_max_length','2024-10-17 11:12:04.660058'),(16,'auth','0011_update_proxy_permissions','2024-10-17 11:12:04.670954'),(17,'auth','0012_alter_user_first_name_max_length','2024-10-17 11:12:04.773628'),(18,'sessions','0001_initial','2024-10-17 11:12:04.842394'),(19,'authtoken','0001_initial','2024-10-17 14:56:13.995619'),(20,'authtoken','0002_auto_20160226_1747','2024-10-17 14:56:14.019608'),(21,'authtoken','0003_tokenproxy','2024-10-17 14:56:14.023716'),(22,'authtoken','0004_alter_tokenproxy_options','2024-10-17 14:56:14.028583');
/*!40000 ALTER TABLE `django_migrations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `django_session`
--

DROP TABLE IF EXISTS `django_session`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `django_session` (
  `session_key` varchar(40) NOT NULL,
  `session_data` longtext NOT NULL,
  `expire_date` datetime(6) NOT NULL,
  PRIMARY KEY (`session_key`),
  KEY `django_session_expire_date_a5c62663` (`expire_date`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `django_session`
--

LOCK TABLES `django_session` WRITE;
/*!40000 ALTER TABLE `django_session` DISABLE KEYS */;
INSERT INTO `django_session` VALUES ('0a2wi758t7aba800gbnlro8b1h63lrfj','.eJxVjDsOgzAQRO_iOrKM2cV2yvScwdr1JyaJjIShinL3gESRdKN5b-YtPG1r8VtLi5-iuIpOXH47pvBM9QDxQfU-yzDXdZlYHoo8aZPjHNPrdrp_B4Va2deYkR3ZXne2ZzI2B-00QyJlLFqFREzAkJOBQQ17ihg0ugwJdHTsxOcL4B032w:1t1RIw:Yz1Y857qMRn8Dtbt3RW0wEGCYVM1ZCT1bCUAr0N-xW0','2024-10-31 14:16:42.734284'),('3qiqmqzxferlwtem3pgcm3u7cyw858n0','.eJxVjDsOwjAQBe_iGlnrX_BS0ucM1tpr4wBypDipEHeHSCmgfTPzXiLQttaw9byEicVFaHH63SKlR2474Du12yzT3NZlinJX5EG7HGfOz-vh_h1U6vVbK10UlGxctNYpTpwHOmMmBUZpRGs8YIxAHkGlRIXcUBxEy2CMtejF-wPY8jdd:1t1RFw:ZX6LbfvyeXsSMfjvHOEkoL1VVuBFYS_5kK4q5twLBcE','2024-10-31 14:13:36.758872'),('8zhm2nrz2f7vptagit4c3gft1a3xbnqd','.eJxVjDsOgzAQRO_iOrKM2cV2yvScwdr1JyaJjIShinL3gESRdKN5b-YtPG1r8VtLi5-iuIpOXH47pvBM9QDxQfU-yzDXdZlYHoo8aZPjHNPrdrp_B4Va2deYkR3ZXne2ZzI2B-00QyJlLFqFREzAkJOBQQ17ihg0ugwJdHTsxOcL4B032w:1t1RQZ:RfbG470kOXeSmu5gDJzTJJxWIyucTndYkBMj3fWpUoE','2024-10-31 14:24:35.500678'),('d1otq52ye4tepznb4hihf4m4omgvgywt','.eJxVjDsOwjAQBe_iGlnrX_BS0ucM1tpr4wBypDipEHeHSCmgfTPzXiLQttaw9byEicVFaHH63SKlR2474Du12yzT3NZlinJX5EG7HGfOz-vh_h1U6vVbK10UlGxctNYpTpwHOmMmBUZpRGs8YIxAHkGlRIXcUBxEy2CMtejF-wPY8jdd:1t1QnH:N2VyRuszY5NE7FUDRk5eNjugxk1QtEH6yRVBIigTrtU','2024-10-31 13:43:59.288275'),('h1gdtb68stcpzf5zrnej8gltl3s0izpj','.eJxVjDsOgzAQRO_iOrKM2cV2yvScwdr1JyaJjIShinL3gESRdKN5b-YtPG1r8VtLi5-iuIpOXH47pvBM9QDxQfU-yzDXdZlYHoo8aZPjHNPrdrp_B4Va2deYkR3ZXne2ZzI2B-00QyJlLFqFREzAkJOBQQ17ihg0ugwJdHTsxOcL4B032w:1t1Qif:VDizo2Wy5HMJuzSwV1Q2JvNYDB0ANyuy-ZcsvDfYwGs','2024-10-31 13:39:13.348877'),('pvl3y7o7yz0xyifbozx5uzs2dl31u2x7','.eJxVjDsOgzAQRO_iOrKM2cV2yvScwdr1JyaJjIShinL3gESRdKN5b-YtPG1r8VtLi5-iuIpOXH47pvBM9QDxQfU-yzDXdZlYHoo8aZPjHNPrdrp_B4Va2deYkR3ZXne2ZzI2B-00QyJlLFqFREzAkJOBQQ17ihg0ugwJdHTsxOcL4B032w:1t1RHZ:GlYlYQEvWXfrR3ROik-WUNK_JIhMmU2pWOZCgrObSRE','2024-10-31 14:15:17.552784'),('vrfgab2er0bi7o2jsie6jar9oxmfx1s5','.eJxVjDsOwjAQBe_iGlnrX_BS0ucM1tpr4wBypDipEHeHSCmgfTPzXiLQttaw9byEicVFaHH63SKlR2474Du12yzT3NZlinJX5EG7HGfOz-vh_h1U6vVbK10UlGxctNYpTpwHOmMmBUZpRGs8YIxAHkGlRIXcUBxEy2CMtejF-wPY8jdd:1t1RH6:sZd8yAvmTJ0IlkpTkIVW4a21y79V5vJgqI8cT0z5UlU','2024-10-31 14:14:48.271707'),('ydbhhdma8i118buzks1386uvfg48rfmy','.eJxVjDsOgzAQRO_iOrKM2cV2yvScwdr1JyaJjIShinL3gESRdKN5b-YtPG1r8VtLi5-iuIpOXH47pvBM9QDxQfU-yzDXdZlYHoo8aZPjHNPrdrp_B4Va2deYkR3ZXne2ZzI2B-00QyJlLFqFREzAkJOBQQ17ihg0ugwJdHTsxOcL4B032w:1t1Pvy:bv2mAxJkPytWJ8HfqT9qwXGKNh_iT_pJzcbMrciy6lM','2024-10-31 12:48:54.473508'),('zym10i787eml597jtoyizy3f10lvd28e','.eJxVjDsOgzAQRO_iOrKM2cV2yvScwdr1JyaJjIShinL3gESRdKN5b-YtPG1r8VtLi5-iuIpOXH47pvBM9QDxQfU-yzDXdZlYHoo8aZPjHNPrdrp_B4Va2deYkR3ZXne2ZzI2B-00QyJlLFqFREzAkJOBQQ17ihg0ugwJdHTsxOcL4B032w:1t1RUI:D27Tf14b2THy2ETodZqaQrPd4Hy5lin6A_hOqURA_gA','2024-10-31 14:28:26.068856');
/*!40000 ALTER TABLE `django_session` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `mitarbeiter_stammdaten`
--

DROP TABLE IF EXISTS `mitarbeiter_stammdaten`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `mitarbeiter_stammdaten` (
  `id` int NOT NULL AUTO_INCREMENT,
  `mitarbeiter_aktiv` tinyint(1) DEFAULT NULL,
  `login_gesperrt` tinyint(1) DEFAULT NULL,
  `vorname` text,
  `nachname` text,
  `zusatz` mediumtext,
  `bemerkung` mediumtext,
  `standort` text,
  `beginn_betriebszugehoerigkeit` date DEFAULT NULL,
  `ende_betriebszugehoerigkeit` date DEFAULT NULL,
  `startbetrag_konto` decimal(15,2) DEFAULT NULL,
  `daten_bmg` tinyint(1) DEFAULT NULL,
  `spalte_gehalt` tinyint(1) DEFAULT NULL,
  `spalte_festbetrag` tinyint(1) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `mitarbeiter_stammdaten`
--

LOCK TABLES `mitarbeiter_stammdaten` WRITE;
/*!40000 ALTER TABLE `mitarbeiter_stammdaten` DISABLE KEYS */;
INSERT INTO `mitarbeiter_stammdaten` VALUES (1,1,0,'Noradenn','Aoulad-Ali','','','','1900-01-01',NULL,0.00,1,1,1),(2,1,0,'Ralf','Borchers','','-10% bei Stunden (Urlaub zusätzlich) 35 h/Woche Anteil 0,9','','1900-01-01',NULL,0.00,1,1,1),(3,1,0,'Tamara','Diego Felipe Cruz','','','','1900-01-01',NULL,0.00,1,1,1),(4,1,0,'Stefan','Gill','','','','1900-01-01',NULL,0.00,1,1,1),(5,1,0,'Matthias','Harms','','','','1900-01-01',NULL,0.00,1,1,1),(6,1,0,'Svenja','Harneit','','','','1900-01-01',NULL,0.00,1,1,1),(7,1,0,'Stefan','Heuermann','','','','1900-01-01',NULL,0.00,1,1,1),(8,1,0,'Stefanie','Humann','','','','1900-01-01',NULL,0.00,1,1,1),(9,1,0,'Dieter','Küpker','','','','1900-01-01',NULL,0.00,1,1,1),(10,1,0,'Andreas','Meyer','','','','1900-01-01',NULL,0.00,1,1,1),(11,1,0,'Alexander','Nielsen','','','','1900-01-01',NULL,0.00,1,1,1),(12,1,0,'Michael','Renken','','','','1900-01-01',NULL,0.00,1,1,1),(13,1,0,'Phillip','Schröder','','','','1900-01-01',NULL,0.00,1,1,1),(14,1,0,'Johanna','Skora','','','','1900-01-01',NULL,0.00,1,1,1),(15,1,0,'Michael','Skora','','','','1900-01-01',NULL,0.00,1,1,1),(16,1,0,'N.N.','N.N',NULL,NULL,NULL,'1900-01-01',NULL,0.00,NULL,NULL,NULL);
/*!40000 ALTER TABLE `mitarbeiter_stammdaten` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `mitarbeiter_stammdaten_jahr`
--

DROP TABLE IF EXISTS `mitarbeiter_stammdaten_jahr`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `mitarbeiter_stammdaten_jahr` (
  `jahr` year NOT NULL,
  `id` int NOT NULL,
  `fixum` decimal(10,2) DEFAULT NULL,
  `festbetrag` decimal(10,2) DEFAULT NULL,
  `malus_fehlbetrag` decimal(10,2) DEFAULT NULL,
  `uebertrag_vorjahr` decimal(10,2) DEFAULT NULL,
  PRIMARY KEY (`jahr`,`id`),
  KEY `mitarbeiter_stammdaten_jahr_ibfk_1` (`id`),
  CONSTRAINT `mitarbeiter_stammdaten_jahr_ibfk_1` FOREIGN KEY (`id`) REFERENCES `mitarbeiter_stammdaten` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `mitarbeiter_stammdaten_jahr`
--

LOCK TABLES `mitarbeiter_stammdaten_jahr` WRITE;
/*!40000 ALTER TABLE `mitarbeiter_stammdaten_jahr` DISABLE KEYS */;
INSERT INTO `mitarbeiter_stammdaten_jahr` VALUES (2024,1,3900.00,3900.00,0.00,0.00),(2024,2,3259.00,3259.00,0.00,0.00),(2024,3,2335.00,2335.00,0.00,0.00),(2024,4,2780.00,2780.00,0.00,0.00),(2024,5,3395.00,3395.00,0.00,0.00),(2024,6,3100.00,3100.00,0.00,0.00),(2024,7,5200.00,5200.00,0.00,0.00),(2024,8,3000.00,3000.00,0.00,0.00),(2024,9,3350.00,3350.00,0.00,0.00),(2024,10,5400.00,5400.00,0.00,0.00),(2024,11,3550.00,3550.00,0.00,0.00),(2024,12,2921.51,2921.51,0.00,0.00),(2024,13,3100.00,3100.00,0.00,0.00),(2024,14,2170.00,2170.00,0.00,0.00),(2024,15,5800.00,5800.00,0.00,0.00);
/*!40000 ALTER TABLE `mitarbeiter_stammdaten_jahr` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `monatsdaten_personen`
--

DROP TABLE IF EXISTS `monatsdaten_personen`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `monatsdaten_personen` (
  `jahr_und_monat` date NOT NULL,
  `mitarbeiter_id` int NOT NULL,
  `festbetrag` decimal(10,2) DEFAULT NULL,
  `fixum` decimal(10,2) DEFAULT NULL,
  `fehltage` int DEFAULT NULL,
  `teiler` int DEFAULT NULL,
  PRIMARY KEY (`jahr_und_monat`,`mitarbeiter_id`),
  KEY `mitarbeiter_id` (`mitarbeiter_id`),
  CONSTRAINT `monatsdaten_personen_ibfk_1` FOREIGN KEY (`mitarbeiter_id`) REFERENCES `mitarbeiter_stammdaten` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `monatsdaten_personen`
--

LOCK TABLES `monatsdaten_personen` WRITE;
/*!40000 ALTER TABLE `monatsdaten_personen` DISABLE KEYS */;
INSERT INTO `monatsdaten_personen` VALUES ('2024-09-01',1,3900.00,3900.00,0,1),('2024-09-01',2,3259.00,3259.00,0,1),('2024-09-01',3,2335.00,2335.00,0,1),('2024-09-01',4,2780.00,2780.00,0,1),('2024-09-01',5,3395.00,3395.00,0,1),('2024-09-01',6,3100.00,3100.00,0,1),('2024-09-01',7,5200.00,5200.00,0,1),('2024-09-01',8,3000.00,3000.00,0,1),('2024-09-01',9,3350.00,3350.00,0,1),('2024-09-01',10,5400.00,5400.00,0,1),('2024-09-01',11,3550.00,3550.00,0,1),('2024-09-01',12,2922.00,2922.00,0,1),('2024-09-01',13,3100.00,3100.00,0,1),('2024-09-01',14,2170.00,2170.00,0,1),('2024-09-01',15,5800.00,5800.00,0,1);
/*!40000 ALTER TABLE `monatsdaten_personen` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `monatsdaten_teams`
--

DROP TABLE IF EXISTS `monatsdaten_teams`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `monatsdaten_teams` (
  `jahr_und_monat` date NOT NULL,
  `primaerteam_id` int NOT NULL,
  `umsatz` decimal(10,2) DEFAULT NULL,
  `db_ist` decimal(6,4) DEFAULT NULL,
  `teamanpassung` int DEFAULT NULL,
  PRIMARY KEY (`jahr_und_monat`,`primaerteam_id`),
  KEY `primaerteam_id` (`primaerteam_id`),
  CONSTRAINT `monatsdaten_teams_ibfk_1` FOREIGN KEY (`primaerteam_id`) REFERENCES `primärteam_stammdaten` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `monatsdaten_teams`
--

LOCK TABLES `monatsdaten_teams` WRITE;
/*!40000 ALTER TABLE `monatsdaten_teams` DISABLE KEYS */;
INSERT INTO `monatsdaten_teams` VALUES ('2024-09-01',1,651281.00,25.5600,0),('2024-09-01',2,553897.00,25.3700,0),('2024-09-01',3,97384.00,26.6300,0),('2024-09-01',4,150431.00,27.2600,0),('2024-09-01',5,0.00,0.0000,0),('2024-09-01',6,112196.00,24.8800,0),('2024-09-01',7,0.00,0.0000,0),('2024-09-01',8,65109.00,29.2800,0),('2024-09-01',9,0.00,0.0000,0);
/*!40000 ALTER TABLE `monatsdaten_teams` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ordner_stammdaten`
--

DROP TABLE IF EXISTS `ordner_stammdaten`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ordner_stammdaten` (
  `id` int NOT NULL AUTO_INCREMENT,
  `bezeichnung` text,
  `notiz` text,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ordner_stammdaten`
--

LOCK TABLES `ordner_stammdaten` WRITE;
/*!40000 ALTER TABLE `ordner_stammdaten` DISABLE KEYS */;
INSERT INTO `ordner_stammdaten` VALUES (1,'Monatspflege','38,5 Stunden/ Woche'),(2,'Administratoren',''),(3,'Personen','');
/*!40000 ALTER TABLE `ordner_stammdaten` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `primärteam_plan`
--

DROP TABLE IF EXISTS `primärteam_plan`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `primärteam_plan` (
  `jahr` year NOT NULL,
  `primärteam_id` int NOT NULL,
  `umsatz_plan_jan` decimal(15,2) DEFAULT NULL,
  `umsatz_plan_feb` decimal(15,2) DEFAULT NULL,
  `umsatz_plan_mar` decimal(15,2) DEFAULT NULL,
  `umsatz_plan_apr` decimal(15,2) DEFAULT NULL,
  `umsatz_plan_mai` decimal(15,2) DEFAULT NULL,
  `umsatz_plan_jun` decimal(15,2) DEFAULT NULL,
  `umsatz_plan_jul` decimal(15,2) DEFAULT NULL,
  `umsatz_plan_aug` decimal(15,2) DEFAULT NULL,
  `umsatz_plan_sep` decimal(15,2) DEFAULT NULL,
  `umsatz_plan_okt` decimal(15,2) DEFAULT NULL,
  `umsatz_plan_nov` decimal(15,2) DEFAULT NULL,
  `umsatz_plan_dez` decimal(15,2) DEFAULT NULL,
  `db_plan_jan` decimal(6,4) DEFAULT NULL,
  `db_plan_feb` decimal(6,4) DEFAULT NULL,
  `db_plan_mar` decimal(6,4) DEFAULT NULL,
  `db_plan_apr` decimal(6,4) DEFAULT NULL,
  `db_plan_mai` decimal(6,4) DEFAULT NULL,
  `db_plan_jun` decimal(6,4) DEFAULT NULL,
  `db_plan_jul` decimal(6,4) DEFAULT NULL,
  `db_plan_aug` decimal(6,4) DEFAULT NULL,
  `db_plan_sep` decimal(6,4) DEFAULT NULL,
  `db_plan_okt` decimal(6,4) DEFAULT NULL,
  `db_plan_nov` decimal(6,4) DEFAULT NULL,
  `db_plan_dez` decimal(6,4) DEFAULT NULL,
  PRIMARY KEY (`jahr`,`primärteam_id`),
  KEY `primärteam_id` (`primärteam_id`),
  CONSTRAINT `primärteam_plan_ibfk_1` FOREIGN KEY (`primärteam_id`) REFERENCES `primärteam_stammdaten` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `primärteam_plan`
--

LOCK TABLES `primärteam_plan` WRITE;
/*!40000 ALTER TABLE `primärteam_plan` DISABLE KEYS */;
INSERT INTO `primärteam_plan` VALUES (2024,1,900000.00,761500.00,692300.00,900000.00,761700.00,761600.00,761500.00,761500.00,761500.00,692300.00,692300.00,553800.00,22.7035,22.7035,22.7035,22.7035,22.7035,22.7035,22.7035,22.7035,22.7035,22.7035,22.7035,22.7035),(2024,2,649552.00,649552.00,649552.00,649552.00,649552.00,649552.00,649552.00,649552.00,649552.00,649552.00,649552.00,454686.00,22.1508,22.1508,22.1508,22.1508,22.1508,22.1508,22.1508,22.1508,22.1508,22.1508,22.1508,22.1508),(2024,3,147338.00,147338.00,147338.00,147338.00,147338.00,147338.00,147338.00,147338.00,147338.00,147338.00,147338.00,103137.00,25.1662,25.1662,25.1662,25.1662,25.1662,25.1662,25.1662,25.1662,25.1662,25.1662,25.1662,25.1662),(2024,4,168358.00,168358.00,168358.00,168358.00,168358.00,168358.00,168358.00,168358.00,168358.00,168358.00,168358.00,117752.00,26.7585,26.7585,26.7585,26.7585,26.7585,26.7585,26.7585,26.7585,26.7585,26.7585,26.7585,26.7585),(2024,5,16840.00,16840.00,16840.00,16840.00,16840.00,16840.00,16840.00,16840.00,16840.00,16840.00,16840.00,11775.00,26.7585,26.7585,26.7585,26.7585,26.7585,26.7585,26.7585,26.7585,26.7585,26.7585,26.7585,26.7585),(2024,6,134465.00,134465.00,134465.00,134465.00,134465.00,134465.00,134465.00,134465.00,134465.00,134465.00,134465.00,94125.00,22.5840,22.5840,22.5840,22.5840,22.5840,22.5840,22.5840,22.5840,22.5840,22.5840,22.5840,22.5840),(2024,7,13446.00,13446.00,13446.00,13446.00,13446.00,13446.00,13446.00,13446.00,13446.00,13446.00,13446.00,9412.00,22.5840,22.5840,22.5840,22.5840,22.5840,22.5840,22.5840,22.5840,22.5840,22.5840,22.5840,22.5840),(2024,8,118808.00,118808.00,118808.00,118808.00,118808.00,118808.00,118808.00,118808.00,118808.00,118808.00,118808.00,83166.00,23.8192,23.8192,23.8192,23.8192,23.8192,23.8192,23.8192,23.8192,23.8192,23.8192,23.8192,23.8192),(2024,9,11880.00,11880.00,11880.00,11880.00,11880.00,11880.00,11880.00,11880.00,11880.00,11880.00,11880.00,8316.00,23.8192,23.8192,23.8192,23.8192,23.8192,23.8192,23.8192,23.8192,23.8192,23.8192,23.8192,23.8192);
/*!40000 ALTER TABLE `primärteam_plan` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `primärteam_stammdaten`
--

DROP TABLE IF EXISTS `primärteam_stammdaten`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `primärteam_stammdaten` (
  `id` int NOT NULL AUTO_INCREMENT,
  `bezeichnung` text,
  `sortierfeld` int DEFAULT NULL,
  `notiz` text,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `primärteam_stammdaten`
--

LOCK TABLES `primärteam_stammdaten` WRITE;
/*!40000 ALTER TABLE `primärteam_stammdaten` DISABLE KEYS */;
INSERT INTO `primärteam_stammdaten` VALUES (1,'Hillmann & Geitz gesamt DB',1,''),(2,'DB alle AD Kunden',2,''),(3,'DB Kunden 03',3,''),(4,'DB AD Gebiet Meyer',4,''),(5,'DB Neukunden Meyer',5,''),(6,'DB Gebiet Küpker',6,''),(7,'DB Neukunden Küpker',7,''),(8,'DB Gebiet Harms',8,''),(9,'DB Neukunden Harms',9,'');
/*!40000 ALTER TABLE `primärteam_stammdaten` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `primärteam_stammdaten_jahr`
--

DROP TABLE IF EXISTS `primärteam_stammdaten_jahr`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `primärteam_stammdaten_jahr` (
  `jahr` year NOT NULL,
  `id` int NOT NULL,
  `plan_deckungsbeitrag` decimal(6,4) DEFAULT NULL,
  `teamanpassung` decimal(15,2) DEFAULT NULL,
  `teambeteiligung_deckungsbetrag` decimal(6,4) DEFAULT NULL,
  `teambeteiligung_umsatz` decimal(6,4) DEFAULT NULL,
  `schwellenwert_db` decimal(15,2) DEFAULT NULL,
  `jan_anteile` int DEFAULT NULL,
  `feb_anteile` int DEFAULT NULL,
  `mar_anteile` int DEFAULT NULL,
  `apr_anteile` int DEFAULT NULL,
  `mai_anteile` int DEFAULT NULL,
  `jun_anteile` int DEFAULT NULL,
  `jul_anteile` int DEFAULT NULL,
  `aug_anteile` int DEFAULT NULL,
  `sep_anteile` int DEFAULT NULL,
  `okt_anteile` int DEFAULT NULL,
  `nov_anteile` int DEFAULT NULL,
  `dez_anteile` int DEFAULT NULL,
  PRIMARY KEY (`jahr`,`id`),
  KEY `id` (`id`),
  CONSTRAINT `primärteam_stammdaten_jahr_ibfk_1` FOREIGN KEY (`id`) REFERENCES `primärteam_stammdaten` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `primärteam_stammdaten_jahr`
--

LOCK TABLES `primärteam_stammdaten_jahr` WRITE;
/*!40000 ALTER TABLE `primärteam_stammdaten_jahr` DISABLE KEYS */;
INSERT INTO `primärteam_stammdaten_jahr` VALUES (2024,1,22.7035,0.00,13.8000,0.0000,1900000.00,1900000,1607692,1461538,1900000,1607692,1607692,1607692,1607692,1607692,1461538,1461538,1169320),(2024,2,22.1508,0.00,7.0000,0.0000,1530372.00,1308010,1308010,1308010,1308010,1308010,1308010,1308010,1308010,1308010,1308010,1308010,915607),(2024,3,25.1662,0.00,8.0000,0.0000,394390.00,337085,337085,337085,337085,337085,337085,337085,337085,337085,337085,337085,235959),(2024,4,26.7585,0.00,2.0000,0.0000,479000.00,409401,409401,409401,409401,409401,409401,409401,409401,409401,409401,409401,286581),(2024,5,26.7585,0.00,5.0000,0.0000,0.00,10,10,10,10,10,10,10,10,10,10,10,7),(2024,6,22.5840,0.00,3.0000,0.0000,323000.00,276068,276068,276068,276068,276068,276068,276068,276068,276068,276068,276068,193247),(2024,7,22.5840,0.00,5.0000,0.0000,0.00,10,10,10,10,10,10,10,10,10,10,10,7),(2024,8,23.8192,0.00,2.0000,0.0000,301000.00,257264,257264,257264,257264,257264,257264,257264,257264,257264,257264,257264,180085),(2024,9,23.8192,0.00,5.0000,0.0000,0.00,10,10,10,10,10,10,10,10,10,10,10,7);
/*!40000 ALTER TABLE `primärteam_stammdaten_jahr` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `struktur`
--

DROP TABLE IF EXISTS `struktur`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `struktur` (
  `struktur_id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(20) NOT NULL,
  `child_id` int DEFAULT NULL,
  `parent` int DEFAULT NULL,
  PRIMARY KEY (`struktur_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `struktur`
--

LOCK TABLES `struktur` WRITE;
/*!40000 ALTER TABLE `struktur` DISABLE KEYS */;
/*!40000 ALTER TABLE `struktur` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `team_stammdaten`
--

DROP TABLE IF EXISTS `team_stammdaten`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `team_stammdaten` (
  `id` int NOT NULL AUTO_INCREMENT,
  `bezeichnung` text,
  `notiz` text,
  `anteile` int DEFAULT NULL,
  `anteile_verbergen` tinyint(1) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `team_stammdaten`
--

LOCK TABLES `team_stammdaten` WRITE;
/*!40000 ALTER TABLE `team_stammdaten` DISABLE KEYS */;
INSERT INTO `team_stammdaten` VALUES (1,'Prokurist','',NULL,0),(2,'Verkaufsteam','',NULL,0),(3,'Buchhaltung','',NULL,0),(4,'Verwaltung','',NULL,0),(5,'Marketing','',NULL,0),(6,'Lager Team','',NULL,0),(7,'Teamleitung Lager','',NULL,0),(8,'Innendienst Team','',NULL,0),(9,'Team Kunden 03','',NULL,0),(10,'AD Meyer','',NULL,0),(11,'Neukunden AD Meyer','',NULL,0),(12,'AD Küpker','',NULL,0),(13,'Neukunden AD Küpker','',NULL,0),(14,'AD Harms','',NULL,0),(15,'Neukunden AD Harms','',NULL,0);
/*!40000 ALTER TABLE `team_stammdaten` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `teamschlüssel`
--

DROP TABLE IF EXISTS `teamschlüssel`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `teamschlüssel` (
  `id` int NOT NULL AUTO_INCREMENT,
  `primaerteam_id` int DEFAULT NULL,
  `team_id` int DEFAULT NULL,
  `personen_id` int DEFAULT NULL,
  `provisionssatz` decimal(6,4) DEFAULT NULL,
  `anteil` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_primärteam_idx` (`primaerteam_id`),
  KEY `fk_team_idx` (`team_id`),
  KEY `fk_person_idx` (`personen_id`),
  CONSTRAINT `fk_person` FOREIGN KEY (`personen_id`) REFERENCES `mitarbeiter_stammdaten` (`id`),
  CONSTRAINT `fk_primärteam` FOREIGN KEY (`primaerteam_id`) REFERENCES `primärteam_stammdaten` (`id`),
  CONSTRAINT `fk_team` FOREIGN KEY (`team_id`) REFERENCES `team_stammdaten` (`id`),
  CONSTRAINT `one_null` CHECK ((((`primaerteam_id` is null) and (`team_id` is not null) and (`personen_id` is not null)) or ((`primaerteam_id` is not null) and (`team_id` is null) and (`personen_id` is not null)) or ((`primaerteam_id` is not null) and (`team_id` is not null) and (`personen_id` is null))))
) ENGINE=InnoDB AUTO_INCREMENT=57 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `teamschlüssel`
--

LOCK TABLES `teamschlüssel` WRITE;
/*!40000 ALTER TABLE `teamschlüssel` DISABLE KEYS */;
INSERT INTO `teamschlüssel` VALUES (1,1,1,NULL,1.0000,NULL),(2,1,2,NULL,5.0000,NULL),(3,1,3,NULL,1.5000,NULL),(4,1,4,NULL,1.0000,NULL),(5,1,5,NULL,0.5000,NULL),(6,1,6,NULL,4.0000,NULL),(7,1,7,NULL,0.8000,NULL),(8,2,8,NULL,7.0000,NULL),(9,3,9,NULL,8.0000,NULL),(10,4,10,NULL,2.0000,NULL),(11,5,11,NULL,5.0000,NULL),(12,6,12,NULL,3.0000,NULL),(13,7,13,NULL,5.0000,NULL),(14,8,14,NULL,2.0000,NULL),(15,9,15,NULL,5.0000,NULL),(16,NULL,1,15,NULL,100),(17,NULL,2,2,NULL,90),(18,NULL,2,5,NULL,100),(19,NULL,2,6,NULL,100),(20,NULL,2,8,NULL,100),(21,NULL,2,9,NULL,100),(22,NULL,2,10,NULL,100),(23,NULL,2,16,NULL,100),(24,NULL,2,11,NULL,100),(25,NULL,2,13,NULL,100),(26,NULL,2,14,NULL,52),(27,NULL,2,15,NULL,100),(28,NULL,3,7,NULL,100),(29,NULL,4,4,NULL,100),(30,NULL,5,14,NULL,100),(31,NULL,6,1,NULL,50),(32,NULL,6,3,NULL,100),(33,NULL,6,16,NULL,150),(34,NULL,6,12,NULL,100),(35,NULL,7,1,NULL,50),(36,NULL,8,2,NULL,90),(37,NULL,8,6,NULL,100),(38,NULL,8,8,NULL,100),(39,NULL,8,16,NULL,100),(40,NULL,8,11,NULL,100),(41,NULL,8,13,NULL,100),(42,NULL,8,15,NULL,100),(43,NULL,9,2,NULL,90),(44,NULL,9,6,NULL,100),(45,NULL,9,8,NULL,100),(46,NULL,9,16,NULL,100),(47,NULL,9,11,NULL,100),(48,NULL,9,13,NULL,100),(49,NULL,9,15,NULL,100),(50,NULL,10,10,NULL,100),(51,NULL,11,10,NULL,100),(52,NULL,12,9,NULL,100),(53,NULL,13,9,NULL,100),(54,NULL,14,5,NULL,100),(55,NULL,15,5,NULL,100);
/*!40000 ALTER TABLE `teamschlüssel` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `unternehmen_stammdaten`
--

DROP TABLE IF EXISTS `unternehmen_stammdaten`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `unternehmen_stammdaten` (
  `id` int NOT NULL AUTO_INCREMENT,
  `bezeichnung` text,
  `notiz` text,
  `plandaten_freigeben_bis` date DEFAULT NULL,
  `monatsabschluss_sichtbar_bis` date DEFAULT NULL,
  `geschaeftsjahr_beginnt` date DEFAULT NULL,
  `bmg_verbergen` tinyint(1) DEFAULT NULL,
  `gehalt_verbergen` tinyint(1) DEFAULT NULL,
  `festbetrag_verbergen` tinyint(1) DEFAULT NULL,
  `gehalt_13` tinyint(1) DEFAULT NULL,
  `gehalt_14` tinyint(1) DEFAULT NULL,
  `gehalt_13_in_prozent` tinyint(1) DEFAULT NULL,
  `gehalt_14_in_prozent` tinyint(1) DEFAULT NULL,
  `gehalt_13_prozent` decimal(5,2) DEFAULT NULL,
  `gehalt_14_prozent` decimal(5,2) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `unternehmen_stammdaten`
--

LOCK TABLES `unternehmen_stammdaten` WRITE;
/*!40000 ALTER TABLE `unternehmen_stammdaten` DISABLE KEYS */;
INSERT INTO `unternehmen_stammdaten` VALUES (1,'Hillmann & Geitz','',NULL,NULL,'1900-01-01',0,0,0,0,0,0,0,0.00,0.00);
/*!40000 ALTER TABLE `unternehmen_stammdaten` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `änderungslog`
--

DROP TABLE IF EXISTS `änderungslog`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `änderungslog` (
  `id` int NOT NULL AUTO_INCREMENT,
  `entität` text,
  `typ` text,
  `gueltigkeit` date DEFAULT NULL,
  `aenderung` text,
  `zeitpunkt` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `geaendert_von` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `geaendert_von` (`geaendert_von`),
  CONSTRAINT `änderungslog_ibfk_1` FOREIGN KEY (`geaendert_von`) REFERENCES `mitarbeiter_stammdaten` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `änderungslog`
--

LOCK TABLES `änderungslog` WRITE;
/*!40000 ALTER TABLE `änderungslog` DISABLE KEYS */;
/*!40000 ALTER TABLE `änderungslog` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-11-10 12:38:27
