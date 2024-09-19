
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
-- Table `ticket_system`.`categorys`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `ticket_system`.`categorys` (
  `idCategorys` INT NOT NULL,
  `name` VARCHAR(45) NULL,
  PRIMARY KEY (`idCategorys`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `ticket_system`.`tickets`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `ticket_system`.`tickets` (
  `idTickets` INT NOT NULL AUTO_INCREMENT,
  `category_id` INT NULL,
  `title` VARCHAR(150) NULL,
  `description` VARCHAR(300) NULL,
  `creator_id` VARCHAR(45) NULL,
  `creator_name` VARCHAR(45) NULL,
  `creator_email` VARCHAR(45) NULL,
  `agent_id` INT NULL,
  `agent_name` VARCHAR(45) NULL,
  `agent_email` VARCHAR(45) NULL,
  `created` TIMESTAMP NULL,
  `processed` TIMESTAMP NULL,
  `updated` TIMESTAMP NULL,
  `closed` TIMESTAMP NULL,
  `solved` INT NULL,
  `department` VARCHAR(45) NULL,
  PRIMARY KEY (`idTickets`),
  INDEX `category_id_idx` (`category_id` ASC) VISIBLE,
  CONSTRAINT `category_id`
    FOREIGN KEY (`category_id`)
    REFERENCES `ticket_system`.`categorys` (`idCategorys`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `ticket_system`.`Comments`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `ticket_system`.`comments` (
  `idComments` INT NOT NULL,
  `text` VARCHAR(45) NULL,
  `user_id` INT NOT NULL,
  `ticket_id` INT NOT NULL,
  `accsess` VARCHAR(45) NOT NULL,
  `time` TIMESTAMP NULL,
  PRIMARY KEY (`idComments`),
  INDEX `user_id_idx` (`user_id` ASC) VISIBLE,
  CONSTRAINT `fk_Comments_user_id`
    FOREIGN KEY (`user_id`)
    REFERENCES `ticket_system`.`Users` (`idUsers`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `ticket_system`.`Comments_Tickets`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `ticket_system`.`comments_tickets` (
  `idComments_Tickets` INT NOT NULL,
  `comment_id` INT NULL,
  `ticket_id` INT NULL,
  PRIMARY KEY (`idComments_Tickets`),
  INDEX `comment_id_idx` (`comment_id` ASC) VISIBLE,
  INDEX `ticket_id_idx` (`ticket_id` ASC) VISIBLE,
  CONSTRAINT `comment_id`
    FOREIGN KEY (`comment_id`)
    REFERENCES `ticket_system`.`comments` (`idComments`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_ticket_id`
    FOREIGN KEY (`ticket_id`)
    REFERENCES `ticket_system`.`tickets` (`idTickets`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `ticket_system`.`Attachments`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `ticket_system`.`attachments` (
  `idAttachments` INT NOT NULL,
  `file_name` VARCHAR(45) NULL,
  `file_type` VARCHAR(45) NULL,
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
    p_user_name VARCHAR(45),
    p_user_email VARCHAR(45),
    p_title VARCHAR(150),
    P_description VARCHAR(300)

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
  `created`, 
  `processed`,
  `updated`, 
  `closed`, 
  `solved`, 
  `department`
) VALUES (
  NULL,                  -- Assuming `idTickets` is an auto-incrementing primary key
  NULL,                  -- `category_id` can be set to NULL if not available
  p_title,     -- Replace with actual title
  P_description, -- Replace with actual description
  p_user_id,   -- Replace with actual user_id (creator_id)
  p_user_name,
  p_user_email,
  NULL,                  -- `agent_id` can be set to NULL if not assigned yet
  NULL,
  NULL,
  NOW(),                 -- `created` timestamp (current time)
  NULL,
  NUll,                  -- `processed` timestamp (NULL if not processed yet)
  NULL,                  -- `closed` timestamp (NULL if not closed yet)
  NULL,                     -- `solved` (0 for not solved, adjust as needed)
  NULL                   -- `department` can be set to NULL if not specified
);
END;;


DELIMITER ;


DROP PROCEDURE IF EXISTS show_tickets;

DELIMITER ;;

CREATE PROCEDURE show_tickets(
  p_id VARCHAR(45)
)
SELECT 
    idTickets,
    category_id,
    title,
    description,
    creator_name,
    agent_name,
    DATE_FORMAT(created, '%Y-%m-%d %H:%i:%s') AS created_datetime,
    department,
    CASE
        WHEN solved IS NOT NULL THEN 'Solved'
        WHEN closed IS NOT NULL THEN 'Closed'
        WHEN processed IS NOT NULL THEN 'Processed'
        WHEN created IS NOT NULL THEN 'Created'
        ELSE 'Unknown'
    END AS status
FROM 
    tickets
WHERE 
    p_id = "" OR creator_id = p_id
ORDER BY created DESC;

;;

DELIMITER ;

DROP PROCEDURE IF EXISTS get_ticket;

DELIMITER ;;

CREATE PROCEDURE get_ticket(
  p_id VARCHAR(45)
)
SELECT 
    idTickets,
    category_id,
    title,
    description,
    creator_id,
    creator_name,
    creator_email,
    agent_id,
    agent_name,
    agent_email,
    DATE_FORMAT(created, '%Y-%m-%d %H:%i:%s') AS created_datetime,
    DATE_FORMAT(processed, '%Y-%m-%d %H:%i:%s') AS processed_datetime,
    DATE_FORMAT(closed, '%Y-%m-%d %H:%i:%s') AS closed_datetime,
    DATE_FORMAT(updated, '%Y-%m-%d %H:%i:%s') AS updated_datetime,

    solved,
    department,
    CASE
        WHEN solved IS NOT NULL THEN 'Solved'
        WHEN closed IS NOT NULL THEN 'Closed'
        WHEN processed IS NOT NULL THEN 'Processed'
        WHEN created IS NOT NULL THEN 'Created'
        ELSE 'Unknown'
    END AS status
FROM 
    tickets
WHERE 
    idTickets = p_id

;;

DELIMITER ;
