
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
-- Table `ticket_system`.`Categorys`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `ticket_system`.`Categorys` (
  `idCategorys` INT NOT NULL,
  `name` VARCHAR(45) NULL,
  PRIMARY KEY (`idCategorys`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `ticket_system`.`Tickets`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `ticket_system`.`Tickets` (
  `idTickets` INT NOT NULL,
  `category_id` INT NULL,
  `titel` VARCHAR(45) NULL,
  `description` VARCHAR(45) NULL,
  `creator_id` INT NULL,
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
    REFERENCES `ticket_system`.`Categorys` (`idCategorys`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `ticket_system`.`Users_Tickets`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `ticket_system`.`Users_Tickets` (
  `idUser_Tickets` INT NOT NULL,
  `user_id` INT NULL,
  `ticket_id` INT NULL,
  PRIMARY KEY (`idUser_Tickets`),
  INDEX `user_id_idx` (`user_id` ASC) VISIBLE,
  INDEX `ticket_id_idx` (`ticket_id` ASC) VISIBLE,
  CONSTRAINT `user_id`
    FOREIGN KEY (`user_id`)
    REFERENCES `ticket_system`.`Users` (`idUsers`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `ticket_id`
    FOREIGN KEY (`ticket_id`)
    REFERENCES `ticket_system`.`Tickets` (`idTickets`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `ticket_system`.`Comments`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `ticket_system`.`Comments` (
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
CREATE TABLE IF NOT EXISTS `ticket_system`.`Comments_Tickets` (
  `idComments_Tickets` INT NOT NULL,
  `comment_id` INT NULL,
  `ticket_id` INT NULL,
  PRIMARY KEY (`idComments_Tickets`),
  INDEX `comment_id_idx` (`comment_id` ASC) VISIBLE,
  INDEX `ticket_id_idx` (`ticket_id` ASC) VISIBLE,
  CONSTRAINT `comment_id`
    FOREIGN KEY (`comment_id`)
    REFERENCES `ticket_system`.`Comments` (`idComments`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_ticket_id`
    FOREIGN KEY (`ticket_id`)
    REFERENCES `ticket_system`.`Tickets` (`idTickets`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `ticket_system`.`Attachments`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `ticket_system`.`Attachments` (
  `idAttachments` INT NOT NULL,
  `file_name` VARCHAR(45) NULL,
  `file_type` VARCHAR(45) NULL,
  `ticket_id` INT NULL,
  PRIMARY KEY (`idAttachments`),
  INDEX `ticket_id_idx` (`ticket_id` ASC) VISIBLE,
  CONSTRAINT `fk_Attachments_ticket_id`
    FOREIGN KEY (`ticket_id`)
    REFERENCES `ticket_system`.`Tickets` (`idTickets`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;

