
-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

-- -----------------------------------------------------
-- Schema ticket_system
-- -----------------------------------------------------

-- -----------------------------------------------------
-- Schema ticket_system
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `ticket_system` DEFAULT CHARACTER SET utf8 ;
USE ticket_system ;

-- -----------------------------------------------------
-- Table `ticket_system`.`categories`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `ticket_system`.`categories` (
  `idCategory` INT NOT NULL AUTO_INCREMENT,
  `category_name` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`idCategory`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `ticket_system`.`tickets`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `ticket_system`.`tickets` (
  `idTickets` INT NOT NULL AUTO_INCREMENT,
  `category_id` INT NULL,
  `title` VARCHAR(200) NULL,
  `description` VARCHAR(2000) NULL,
  `creator_id` VARCHAR(45) NULL,
  `creator_name` VARCHAR(45) NULL,
  `creator_email` VARCHAR(45) NULL,
  `agent_id` VARCHAR(45) NULL,
  `agent_name` VARCHAR(45) NULL,
  `agent_email` VARCHAR(45) NULL,
  `created` TIMESTAMP, 
  `updated` TIMESTAMP,
  `status` VARCHAR(50),
  `status_timestamp` TIMESTAMP,
  `agent_notification` TINYINT,
  `user_notification` TINYINT,
  PRIMARY KEY (`idTickets`),
  INDEX `category_id_idx` (`category_id` ASC) VISIBLE,
  CONSTRAINT `category_id`
    FOREIGN KEY (`category_id`)
    REFERENCES `ticket_system`.`categories` (`idCategory`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `ticket_system`.`Comments`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `ticket_system`.`comments` (
  `idComments` INT NOT NULL AUTO_INCREMENT,
  `text` VARCHAR(2000) NULL,
  `description` VARCHAR(2000) NULL,
  `user_name` VARCHAR(45) NOT NULL,
  `ticket_id` INT NOT NULL,
  `user_access` TINYINT NOT NULL,
  `user_role` VARCHAR(45) NULL,
  `time` TIMESTAMP NULL,
  PRIMARY KEY (`idComments`));


-- -----------------------------------------------------
-- Table `ticket_system`.`Knowledge`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `ticket_system`.`Knowledge` (
  `idKnowledge` INT NOT NULL AUTO_INCREMENT,
  `title` VARCHAR(200) NULL,
  `description` VARCHAR(2000) NULL,
  `user_name` VARCHAR(45) NOT NULL,
  `category_id` INT NOT NULL,
  `time` TIMESTAMP NULL,
  PRIMARY KEY (`idKnowledge`),
  FOREIGN KEY (`category_id`) REFERENCES `ticket_system`.`categories` (`idCategory`) ON DELETE CASCADE ON UPDATE CASCADE);

-- -----------------------------------------------------
-- Table `ticket_system`.`account_requests`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `ticket_system`.`account_requests` (
  `idrequests` INT NOT NULL AUTO_INCREMENT,
  `email` VARCHAR(45) NULL,
  PRIMARY KEY (`idrequests`)
  )
ENGINE = InnoDB;

-- -----------------------------------------------------
-- Table `ticket_system`.`Attachments`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `ticket_system`.`attachments` (
  `idAttachments` INT NOT NULL AUTO_INCREMENT,
  `file_name` VARCHAR(200) NULL,
  `ticket_id` INT NULL,
  PRIMARY KEY (`idAttachments`),
  INDEX `ticket_id_idx` (`ticket_id` ASC) VISIBLE,
  CONSTRAINT `fk_attachments_ticket_id`
    FOREIGN KEY (`ticket_id`)
    REFERENCES `ticket_system`.`tickets` (`idTickets`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;


DROP PROCEDURE IF EXISTS add_ticket;

DELIMITER ;;

CREATE PROCEDURE add_ticket(
    p_user_id VARCHAR(45),
    p_category_id INT,

    p_user_name VARCHAR(45),
    p_user_email VARCHAR(45),
    p_title VARCHAR(200),
    P_description VARCHAR(2000)

)
BEGIN
INSERT INTO `tickets` (
  `idTickets`, 
  `category_id`, 
  `title`, 
  `description`, 
  `creator_id`,
  `creator_name`,
  `creator_email`, 
  `agent_id`,
  `agent_name`,
  `agent_email`,
  `status`,
  `status_timestamp`, 
  `created`, 
  `updated`,
  `agent_notification`,
  `user_notification`
) VALUES (
  NULL,                  -- Assuming `idTickets` is an auto-incrementing primary key
  p_category_id,                  -- `category_id` can be set to NULL if not available
  p_title,     -- Replace with actual title
  P_description, -- Replace with actual description
  p_user_id,   -- Replace with actual user_id (creator_id)
  p_user_name,
  p_user_email,
  NULL,                  -- `agent_id` can be set to NULL if not assigned yet
  NULL,
  NULL,                 -- `created` timestamp (current time)
  "Created",                  -- `processed` timestamp (NULL if not processed yet)
  NOW(),                  -- `closed` timestamp (NULL if not closed yet)
  NOW(),                     -- `solved` (0 for not solved, adjust as needed)
  NULL,             -- `department` can be set to NULL if not specified
  1,
  0                   
);
    SELECT LAST_INSERT_ID() AS ticket_id; 
END;;


DELIMITER ;


DROP PROCEDURE IF EXISTS show_tickets;

DELIMITER ;;

CREATE PROCEDURE show_tickets(
  p_id VARCHAR(45)
)
SELECT 
    t.idTickets,
    c.category_name,
    t.title,
    t.description,
    t.creator_name,
    t.agent_name,
    DATE_FORMAT(t.created, '%Y-%m-%d %H:%i:%s') AS created_datetime,
    CASE
        WHEN TIMESTAMPDIFF(SECOND, IFNULL(t.updated, t.created), NOW()) < 60 THEN CONCAT(TIMESTAMPDIFF(SECOND, IFNULL(t.updated, t.created), NOW()), ' seconds ago')
        WHEN TIMESTAMPDIFF(MINUTE, IFNULL(t.updated, t.created), NOW()) < 60 THEN CONCAT(TIMESTAMPDIFF(MINUTE, IFNULL(t.updated, t.created), NOW()), ' minutes ago')
        WHEN TIMESTAMPDIFF(HOUR, IFNULL(t.updated, t.created), NOW()) < 24 THEN CONCAT(TIMESTAMPDIFF(HOUR, IFNULL(t.updated, t.created), NOW()), ' hours ago')
        WHEN TIMESTAMPDIFF(DAY, IFNULL(t.updated, t.created), NOW()) < 30 THEN CONCAT(TIMESTAMPDIFF(DAY, IFNULL(t.updated, t.created), NOW()), ' days ago')
        WHEN TIMESTAMPDIFF(MONTH, IFNULL(t.updated, t.created), NOW()) < 12 THEN CONCAT(TIMESTAMPDIFF(MONTH, IFNULL(t.updated, t.created), NOW()), ' months ago')
        ELSE CONCAT(TIMESTAMPDIFF(YEAR, IFNULL(t.updated, t.created), NOW()), ' years ago')
    END AS updated_datetime,
    t.status,
    DATE_FORMAT(t.status_timestamp, '%Y-%m-%d %H:%i:%s') as status_timestamp,
    t.agent_notification,
    t.user_notification
FROM 
    tickets t
  LEFT JOIN 
    categories c ON t.category_id = c.idCategory
WHERE 
    p_id = "" OR t.creator_id = p_id
ORDER BY t.created DESC;

;;

DELIMITER ;

DROP PROCEDURE IF EXISTS get_ticket;

DELIMITER ;;

CREATE PROCEDURE get_ticket(
  p_id VARCHAR(45)
)
SELECT 
    t.idTickets,
    c.category_name,
    t.category_id,
    t.title,
    t.description,
    t.creator_id,
    t.creator_name,
    t.creator_email,
    t.agent_id,
    t.agent_name,
    t.agent_email,
    DATE_FORMAT(t.created, '%Y-%m-%d %H:%i:%s') AS created_datetime,
    DATE_FORMAT(t.updated, '%Y-%m-%d %H:%i:%s') AS updated_datetime,
    t.status,
    DATE_FORMAT(t.status_timestamp, '%Y-%m-%d %H:%i:%s') as status_timestamp,
    t.agent_notification,
    t.user_notification
FROM 
    tickets t
    LEFT JOIN 
    categories c ON t.category_id = c.idCategory
WHERE 
    t.idTickets = p_id

;;

DELIMITER ;


DROP PROCEDURE IF EXISTS claim_ticket;

DELIMITER ;;

CREATE PROCEDURE claim_ticket(
  p_id VARCHAR(45),
  p_agent_id VARCHAR(45),
  p_agent_name VARCHAR(45),
  p_agent_email VARCHAR(45)

)
UPDATE tickets
SET agent_id = p_agent_id, agent_name = p_agent_name, agent_email = p_agent_email, updated = NOW()
WHERE idTickets = p_id;

;;

DELIMITER ;

DROP PROCEDURE IF EXISTS add_comment;

DELIMITER ;;

CREATE PROCEDURE add_comment(
  p_ticket_id VARCHAR(45),
  p_user_name VARCHAR(45),
  p_text VARCHAR(2000),
  p_access TINYINT,
  p_role VARCHAR(45)

)
BEGIN
UPDATE tickets
  SET updated = NOW()  
  WHERE idTickets = p_ticket_id;

INSERT INTO `comments` (
  `idComments`, 
  `text`, 
  `user_name`, 
  `ticket_id`, 
  `user_access`,
  `user_role`,
  `time`
) VALUES (
  NULL,                  
  p_text,
  p_user_name,
  p_ticket_id,
  p_access,
  p_role,
  NOW()
);
END;;
;;

DELIMITER ;


DROP PROCEDURE IF EXISTS show_comments;

DELIMITER ;;

CREATE PROCEDURE show_comments(
  p_id INT,
  p_access TINYINT
)
BEGIN

  SELECT
    user_name, 
    text,
    DATE_FORMAT(time, '%Y-%m-%d %H:%i:%s') AS time_datetime,
    user_access,
    user_role
  FROM 
    comments
  WHERE 
    ticket_id = p_id AND (p_access = 1 OR user_access = 0)
    ORDER BY time_datetime DESC;

    END;;


;;

DELIMITER ;

DROP PROCEDURE IF EXISTS close_ticket;

DELIMITER ;;

CREATE PROCEDURE close_ticket(
  p_id VARCHAR(45)

)
UPDATE tickets
SET status = "closed"
WHERE idTickets = p_id;

;;

DELIMITER ;

DROP PROCEDURE IF EXISTS change_status;

DELIMITER ;;

CREATE PROCEDURE change_status(
  p_id VARCHAR(45),
  p_status VARCHAR(45)

)
      UPDATE tickets
        SET `status` = p_status, `status_timestamp` = NOW() ,`updated` = NOW() 
        WHERE idTickets = p_id;
        
;;


DELIMITER ;

DROP PROCEDURE IF EXISTS delete_ticket;

DELIMITER ;;

CREATE PROCEDURE delete_ticket(
  p_id VARCHAR(45)

)
BEGIN
  -- Declare variables to hold the data you want to return before deletion
  DECLARE v_title VARCHAR(255);
  DECLARE v_creator_email VARCHAR(100);

  -- Fetch the data you want to return from the ticket before deleting it
  SELECT title,creator_email
  INTO v_title, v_creator_email
  FROM tickets
  WHERE idTickets = p_id;

  -- Return the data (e.g., using SELECT)
  SELECT v_title AS title, 
         v_creator_email AS creator_email;

  DELETE FROM attachments WHERE ticket_id = p_id;

  -- Delete the ticket
  DELETE FROM tickets
  WHERE idTickets = p_id;

END ;;

;;

DELIMITER ;


DROP PROCEDURE IF EXISTS add_category;

DELIMITER ;;

CREATE PROCEDURE add_category(
  p_name VARCHAR(45)

)
BEGIN
INSERT INTO `categories` (
  `category_name`
) VALUES (
  p_name
);
END;;

;;

DELIMITER ;

DROP PROCEDURE IF EXISTS show_categories;

DELIMITER ;;

CREATE PROCEDURE show_categories(

)
BEGIN
SELECT * from `categories`;
END;;

;;

DELIMITER ;

DROP PROCEDURE IF EXISTS delete_category;

DELIMITER ;;

CREATE PROCEDURE delete_category(
p_id INT
)
BEGIN
UPDATE tickets
SET category_id = (SELECT idCategory FROM categories WHERE category_name = 'Uncategorized')
WHERE category_id = p_id;
  DELETE FROM `categories`
  WHERE `idCategory` = p_id;
END;;

;;

DELIMITER ;

DROP PROCEDURE IF EXISTS add_file_fo_ticket;

DELIMITER ;;

CREATE PROCEDURE add_file_fo_ticket(
p_id INT,
p_file_name VARCHAR(200)
)
BEGIN
INSERT INTO `Attachments` (
  `file_name`,
  `ticket_id`
) VALUES (
  p_file_name,
  p_id
);
END;;

;;

DELIMITER ;

DROP PROCEDURE IF EXISTS get_attachments;

DELIMITER ;;

CREATE PROCEDURE get_attachments(
p_id INT
)
BEGIN
SELECT file_name FROM attachments WHERE ticket_id = p_id;
END;;

;;

DELIMITER ;

DROP PROCEDURE IF EXISTS change_category;

DELIMITER ;;

CREATE PROCEDURE change_category(
  p_category_id INT,
  p_ticket_id INT


)
UPDATE tickets
SET category_id = p_category_id,`updated` = NOW()
WHERE idTickets = p_ticket_id;

;;

DELIMITER ;



DROP PROCEDURE IF EXISTS create_account_request;

DELIMITER ;;

CREATE PROCEDURE create_account_request(
  p_email VARCHAR(45)


)
INSERT INTO `account_requests` (
  `email`
) VALUES (
  p_email
);

;;

DELIMITER ;

DROP PROCEDURE IF EXISTS get_requested_accounts;

DELIMITER ;;

CREATE PROCEDURE get_requested_accounts()
SELECT * FROM `account_requests`;

;;

DELIMITER ;

DROP PROCEDURE IF EXISTS remove_account_request;

DELIMITER ;;

CREATE PROCEDURE remove_account_request(
  p_id INT
)
DELETE FROM `account_requests`
  WHERE `idrequests` = p_id;

;;

DELIMITER ;

DROP PROCEDURE IF EXISTS show_old_tickets;

DELIMITER ;;

CREATE PROCEDURE show_old_tickets(

)

SELECT 
    t.idTickets,
    c.category_name,
    t.title,
    t.description,
    t.creator_name,
    t.agent_name,
    DATE_FORMAT(t.created, '%Y-%m-%d %H:%i:%s') AS created_datetime,
    CASE
        WHEN TIMESTAMPDIFF(SECOND, IFNULL(t.updated, t.created), NOW()) < 60 THEN CONCAT(TIMESTAMPDIFF(SECOND, IFNULL(t.updated, t.created), NOW()), ' seconds ago')
        WHEN TIMESTAMPDIFF(MINUTE, IFNULL(t.updated, t.created), NOW()) < 60 THEN CONCAT(TIMESTAMPDIFF(MINUTE, IFNULL(t.updated, t.created), NOW()), ' minutes ago')
        WHEN TIMESTAMPDIFF(HOUR, IFNULL(t.updated, t.created), NOW()) < 24 THEN CONCAT(TIMESTAMPDIFF(HOUR, IFNULL(t.updated, t.created), NOW()), ' hours ago')
        WHEN TIMESTAMPDIFF(DAY, IFNULL(t.updated, t.created), NOW()) < 30 THEN CONCAT(TIMESTAMPDIFF(DAY, IFNULL(t.updated, t.created), NOW()), ' days ago')
        WHEN TIMESTAMPDIFF(MONTH, IFNULL(t.updated, t.created), NOW()) < 12 THEN CONCAT(TIMESTAMPDIFF(MONTH, IFNULL(t.updated, t.created), NOW()), ' months ago')
        ELSE CONCAT(TIMESTAMPDIFF(YEAR, IFNULL(t.updated, t.created), NOW()), ' years ago')
    END AS updated_datetime,
    t.status,
    DATE_FORMAT(t.status_timestamp, '%Y-%m-%d %H:%i:%s') as status_timestamp
FROM 
    tickets t
  LEFT JOIN 
    categories c ON t.category_id = c.idCategory
WHERE 
    t.status != 'Solved' 
    AND t.status != 'Closed' AND TIMESTAMPDIFF(DAY, IFNULL(t.updated, t.created), NOW()) >= 3;

;;

DELIMITER ;

DROP PROCEDURE IF EXISTS add_knowledge;

DELIMITER ;;

CREATE PROCEDURE add_knowledge(
  p_title VARCHAR(200),
  P_description VARCHAR(2000),
  p_category_id INT,
  p_user_name VARCHAR(45)

)
INSERT INTO `Knowledge` (
  `idKnowledge`,
  `title`,
  `description`,
  `user_name`,
  `category_id`,
  `time`
) VALUES (
  NULL,                  
  p_title,
  P_description,
  p_user_name,
  p_category_id,
  NOW()
);
;;

DELIMITER ;


DROP PROCEDURE IF EXISTS show_knowleges;

DELIMITER ;;

CREATE PROCEDURE show_knowleges(
p_category_id INT
)
SELECT 
  k.idKnowledge,
  k.title,
  k.description,
  k.user_name,
  k.category_id,
  c.category_name,
DATE_FORMAT(k.time, '%Y-%m-%d %H:%i:%s') as time 
From Knowledge k
  LEFT JOIN 
    categories c ON k.category_id = c.idCategory
WHERE (p_category_id IS NULL OR k.category_id = p_category_id);
;;

DELIMITER ;


DELIMITER ;;

CREATE PROCEDURE system_statistics(

  )
BEGIN
    SELECT 
        COUNT(*) AS total_tickets, 
        COALESCE(SUM(CASE 
            WHEN `status` != 'Solved' AND `status` != 'Closed' AND TIMESTAMPDIFF(DAY, IFNULL(updated, created), NOW()) >= 3 
            THEN 1 
            ELSE 0 
        END),0) AS total_old_tickets,
        (SELECT COUNT(*) FROM `ticket_system`.`categories`) AS total_categories,
        (SELECT COUNT(*) FROM `ticket_system`.`account_requests`) AS total_account_requests
        FROM `ticket_system`.`tickets`;


END ;;

DELIMITER ;

DROP PROCEDURE IF EXISTS change_notification;

DELIMITER ;;

CREATE PROCEDURE change_notification(
  p_id VARCHAR(45),
  p_agent TINYINT,
  p_user TINYINT

)
BEGIN
  -- Check if p_agent is 1
  IF p_agent = 1 THEN
    -- Set agent_notification to 1 and user_notification to 0
    UPDATE tickets
    SET agent_notification = 1
    WHERE idTickets = p_id;
    END IF;

  IF p_user = 1 THEN
    -- Set agent_notification to 0 and user_notification to 1
    UPDATE tickets
    SET user_notification = 1
    WHERE idTickets = p_id;
    END IF;

      IF p_agent = 0 THEN
    -- Set agent_notification to 1 and user_notification to 0
    UPDATE tickets
    SET agent_notification = 0
    WHERE idTickets = p_id;
    END IF;

  IF p_user = 0 THEN
    -- Set agent_notification to 0 and user_notification to 1
    UPDATE tickets
    SET user_notification = 0
    WHERE idTickets = p_id;
  END IF;
END;;

DELIMITER ;

