
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
  `titel` VARCHAR(45) NULL,
  `description` VARCHAR(45) NULL,
  `creator_id` VARCHAR(45) NULL,
  `agent_id` INT NULL,
  `created` TIMESTAMP NULL,
  `processed` TIMESTAMP NULL,
  `closed` TIMESTAMP NULL,
  `solved` TINYINT NULL,
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
    p_title VARCHAR(45),
    P_description VARCHAR(150)

)
BEGIN
INSERT INTO `tickets` (
  `idTickets`, 
  `category_id`, 
  `titel`, 
  `description`, 
  `creator_id`, 
  `agent_id`, 
  `created`, 
  `processed`, 
  `closed`, 
  `solved`, 
  `department`
) VALUES (
  NULL,                  -- Assuming `idTickets` is an auto-incrementing primary key
  NULL,                  -- `category_id` can be set to NULL if not available
  p_title,     -- Replace with actual title
  P_description, -- Replace with actual description
  p_user_id,   -- Replace with actual user_id (creator_id)
  NULL,                  -- `agent_id` can be set to NULL if not assigned yet
  NOW(),                 -- `created` timestamp (current time)
  NULL,                  -- `processed` timestamp (NULL if not processed yet)
  NULL,                  -- `closed` timestamp (NULL if not closed yet)
  0,                     -- `solved` (0 for not solved, adjust as needed)
  NULL                   -- `department` can be set to NULL if not specified
);
END;;


DELIMITER ;


DROP PROCEDURE IF EXISTS show_tickets;

DELIMITER ;;

CREATE PROCEDURE show_tickets(
  p_id VARCHAR(45)
)
    Select *
    FROM `tickets` 
    WHERE
    p_id = "" OR creator_id = p_id

;;

DELIMITER ;
