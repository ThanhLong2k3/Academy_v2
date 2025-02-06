CREATE DATABASE Academi_v4;
USE Academi_v4;
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  fullName VARCHAR(255) NOT NULL,
  role ENUM('admin', 'user') DEFAULT 'user',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
CREATE TABLE `Position` (
    Id INT AUTO_INCREMENT PRIMARY KEY,
    PositionName NVARCHAR(50),
    IsDeleted BOOLEAN DEFAULT 0
);

CREATE TABLE Department(
    Id INT AUTO_INCREMENT PRIMARY KEY,
    DepartmentName NVARCHAR(50) NOT NULL,
    Description NVARCHAR(50) NULL,
    IsDeleted BOOLEAN DEFAULT 0
);

CREATE TABLE Division(
    Id INT AUTO_INCREMENT PRIMARY KEY,
    DivisionName NVARCHAR(50) NOT NULL,
    DepartmentId INT,
    Description NVARCHAR(50) NULL,
    IsDeleted BOOLEAN DEFAULT 0,
    FOREIGN KEY (DepartmentId) REFERENCES Department(Id) ON UPDATE CASCADE ON DELETE CASCADE
);

CREATE TABLE Personnel (
    Id INT AUTO_INCREMENT PRIMARY KEY,
    DivisionId INT,
    PersonnelName NVARCHAR(50) NOT NULL,
    PositionId INT,
    DateOfBirth DATE NULL,
    Picture BLOB NULL,
    Email NVARCHAR(50),
    Description TEXT NULL,
    PhoneNumber VARCHAR(10),
    JoinDate DATE NULL,
    EndDate DATE NULL,
    WorkStatus NVARCHAR(50),
    IsDeleted TINYINT(1) DEFAULT 0,  -- Use TINYINT(1) for BOOLEAN
    FOREIGN KEY (DivisionId) REFERENCES Division(Id) ON UPDATE CASCADE,
    FOREIGN KEY (PositionId) REFERENCES `Position`(Id) ON UPDATE CASCADE
);


CREATE TABLE Partner(
    Id INT AUTO_INCREMENT PRIMARY KEY,
    PartnerName NVARCHAR(50) NOT NULL,
    PhoneNumber VARCHAR(10),
    Email NVARCHAR(50),
    Address NVARCHAR(100),
    StartDate DATE,
    EndDate DATE,
    PartnershipStatus NVARCHAR(50),
    IsDeleted BOOLEAN DEFAULT 0
);

CREATE TABLE Customer(
    Id INT AUTO_INCREMENT PRIMARY KEY,
    CustomerName NVARCHAR(50) NOT NULL,
    PhoneNumber VARCHAR(10),
    Email NVARCHAR(50),
    Address NVARCHAR(50),
    IsDeleted BOOLEAN DEFAULT 0
);

CREATE TABLE Project(
    Id INT AUTO_INCREMENT PRIMARY KEY,
    ProjectName NVARCHAR(50),
    DepartmentId INT,
    PartnerId INT,
    Description TEXT NULL,
    ProjectStartDate DATE,
    ProjectEndDate DATE NULL,
    ProjectStatus NVARCHAR(50),
    DocumentLink TEXT,
    IsDeleted BOOLEAN DEFAULT 0,
    FOREIGN KEY (DepartmentId) REFERENCES Department(Id) ON UPDATE CASCADE,
    FOREIGN KEY (PartnerId) REFERENCES Partner(Id) ON UPDATE CASCADE
);

CREATE TABLE Product(
    Id INT AUTO_INCREMENT PRIMARY KEY,
    ProductName NVARCHAR(50),
    DepartmentId INT,
    ProductStartDate DATE,
    ProductEndDate DATE NULL,
    ProductStatus NVARCHAR(50),
    DocumentLink TEXT,
    IsDeleted BOOLEAN DEFAULT 0,
    FOREIGN KEY (DepartmentId) REFERENCES Department(Id) ON UPDATE CASCADE
);

CREATE TABLE Topic(
    Id INT AUTO_INCREMENT PRIMARY KEY,
    TopicName NVARCHAR(50),
    DepartmentId INT,
    TopicStartDate DATE,
    TopicEndDate DATE NULL,
    Description TEXT NULL,
    TopicStatus NVARCHAR(50),
    DocumentLink TEXT,
    IsDeleted BOOLEAN DEFAULT 0,
    FOREIGN KEY (DepartmentId) REFERENCES Department(Id) ON UPDATE CASCADE
);

CREATE TABLE TrainingCourse(
    Id INT AUTO_INCREMENT PRIMARY KEY,
    CourseName NVARCHAR(100),
    ServiceStatus NVARCHAR(50),
    Description TEXT NULL,
    Duration INT,
    InstructorId INT,
    IsDeleted BOOLEAN DEFAULT 0,
    FOREIGN KEY (InstructorId) REFERENCES Personnel(Id) ON UPDATE CASCADE
);

CREATE TABLE Service(
    Id INT AUTO_INCREMENT PRIMARY KEY,
    ServiceName NVARCHAR(100),
    Description TEXT NULL,
    ServiceStatus NVARCHAR(50),
    IsDeleted BOOLEAN DEFAULT 0
);

CREATE TABLE IntellectualProperty(
    Id INT AUTO_INCREMENT PRIMARY KEY,
    DepartmentId INT,
    IntellectualPropertyName NVARCHAR(100),
    IntellectualPropertyImage BLOB,
    Description TEXT NULL,
    IntellectualPropertyStatus NVARCHAR(50),
    IsDeleted BOOLEAN DEFAULT 0,
    FOREIGN KEY (DepartmentId) REFERENCES Department(Id)
);

CREATE TABLE Document(
    Id INT AUTO_INCREMENT PRIMARY KEY,
    DocumentName NVARCHAR(50) NOT NULL,
    DocumentLink TEXT NOT NULL,
    RelatedId INT NOT NULL,
    RelatedType NVARCHAR(50) NOT NULL,
    IsDeleted BOOLEAN DEFAULT 0
);

CREATE TABLE Customer_Link(
    CustomerId INT,
    RelatedId INT,
    RelatedType NVARCHAR(50),
    PRIMARY KEY(CustomerId, RelatedId, RelatedType),
    FOREIGN KEY (CustomerId) REFERENCES Customer(Id)
);

-- ADD DATA
INSERT INTO `Position` (PositionName, IsDeleted) VALUES
('Software Engineer', 0),
('Project Manager', 0),
('Business Analyst', 0),
('HR Manager', 0),
('Sales Manager', 0);

INSERT INTO Department (DepartmentName, Description, IsDeleted) VALUES
('Engineering', 'Responsible for developing software solutions', 0),
('HR', 'Handles recruitment and employee relations', 0),
('Sales', 'Manages customer relationships and sales', 0),
('Finance', 'Manages company finances', 0);

INSERT INTO Division (DivisionName, DepartmentId, Description, IsDeleted) VALUES
('Development Division', 1, 'Develops and maintains software products', 0),
('QA Division', 1, 'Ensures software quality and testing', 0),
('Sales Division', 3, 'Handles sales operations and customer support', 0);

INSERT INTO Personnel (DivisionId, PersonnelName, PositionId, DateOfBirth, Email, Description, PhoneNumber, JoinDate, WorkStatus, IsDeleted) VALUES
(1, 'Alice Johnson', 1, '1985-03-15', 'alice.johnson@example.com', 'Software developer with 5 years of experience in Java and Python', '1234567890', '2015-06-01', 'Active', 0),
(2, 'Bob Smith', 2, '1980-07-21', 'bob.smith@example.com', 'Project manager with 10 years of experience', '0987654321', '2010-02-15', 'Active', 0),
(3, 'Charlie Brown', 3, '1990-11-12', 'charlie.brown@example.com', 'Sales professional with expertise in B2B sales', '1122334455', '2018-08-01', 'Active', 0);

INSERT INTO Partner (PartnerName, PhoneNumber, Email, Address, StartDate, PartnershipStatus, IsDeleted) VALUES
('Tech Solutions Ltd.', '1231231234', 'contact@techsolutions.com', '123 Tech Street, City', '2020-01-15', 'Active', 0),
('Innovative Software Co.', '5675675678', 'contact@innosoft.com', '456 Innovation Blvd, Tech City', '2019-11-20', 'Active', 0);

INSERT INTO Customer (CustomerName, PhoneNumber, Email, Address, IsDeleted) VALUES
('John Doe', '5551234567', 'john.doe@example.com', '789 Customer St, City', 0),
('Jane Smith', '5557654321', 'jane.smith@example.com', '123 Client Rd, Tech City', 0);

INSERT INTO Project (ProjectName, DepartmentId, PartnerId, Description, ProjectStartDate, ProjectEndDate, ProjectStatus, DocumentLink, IsDeleted) VALUES
('Website Development', 1, 1, 'Develop a new e-commerce platform', '2024-01-01', '2024-12-31', 'In Progress', 'http://example.com/docs/project1', 0),
('Mobile App Development', 1, 2, 'Develop a mobile application for client XYZ', '2024-03-01', '2024-11-30', 'In Progress', 'http://example.com/docs/project2', 0);

INSERT INTO Product (ProductName, DepartmentId, ProductStartDate, ProductEndDate, ProductStatus, DocumentLink, IsDeleted) VALUES
('Web Application', 1, '2024-01-01', '2024-12-31', 'In Development', 'http://example.com/docs/product1', 0),
('Mobile App', 1, '2024-03-01', '2024-11-30', 'In Development', 'http://example.com/docs/product2', 0);

INSERT INTO Topic (TopicName, DepartmentId, TopicStartDate, TopicEndDate, Description, TopicStatus, DocumentLink, IsDeleted) VALUES
('Cloud Computing', 1, '2024-01-01', '2024-06-30', 'Research on cloud technologies for software development', 'Active', 'http://example.com/docs/topic1', 0),
('AI in Business', 1, '2024-02-01', '2024-07-31', 'Investigating the use of AI in business applications', 'Active', 'http://example.com/docs/topic2', 0);

INSERT INTO TrainingCourse (CourseName, ServiceStatus, Description, Duration, InstructorId, IsDeleted) VALUES
('Java Development Basics', 'Active', 'A beginner course on Java programming', 30, 1, 0),
('Project Management Essentials', 'Active', 'An introductory course on managing projects', 40, 2, 0);


INSERT INTO Service (ServiceName, Description, ServiceStatus, IsDeleted) VALUES
('Cloud Hosting', 'Provides scalable cloud hosting solutions for clients', 'Active', 0),
('Mobile App Development', 'Mobile app development services for businesses', 'Active', 0);

INSERT INTO IntellectualProperty (DepartmentId, IntellectualPropertyName, IntellectualPropertyImage, Description, IntellectualPropertyStatus, IsDeleted) VALUES
(1, 'Cloud Software Framework', NULL, 'A software framework for cloud computing', 'Active', 0),
(1, 'AI Algorithm for Business', NULL, 'An algorithm for AI-powered business solutions', 'Active', 0);

INSERT INTO Document (DocumentName, DocumentLink, RelatedId, RelatedType, IsDeleted) VALUES
('Project Proposal - Website Development', 'http://example.com/docs/proposal1', 1, 'Project', 0),
('API Documentation - Mobile App', 'http://example.com/docs/api1', 2, 'Project', 0);

INSERT INTO Customer_Link (CustomerId, RelatedId, RelatedType) VALUES
(1, 1, 'Project'),
(2, 2, 'Project');

-- PROCEDURE 
DELIMITER $$

CREATE PROCEDURE AddPosition1(
    IN p_PositionName NVARCHAR(50),
    OUT p_Result INT
)
BEGIN
    DECLARE EXIT HANDLER FOR SQLEXCEPTION 
    BEGIN
        SET p_Result = 1; -- Trả về 1 nếu xảy ra lỗi
    END;

    INSERT INTO Position (PositionName) 
    VALUES (p_PositionName);

    SET p_Result = 0; -- Trả về 0 nếu thành công
    SELECT p_Result;
END$$

DELIMITER ;

DELIMITER $$

CREATE PROCEDURE UpdatePosition(
    IN p_Id INT,
    IN p_PositionName NVARCHAR(50),
    OUT p_Result INT
)
BEGIN
    DECLARE EXIT HANDLER FOR SQLEXCEPTION 
    BEGIN
        SET p_Result = 1; -- Trả về 1 nếu xảy ra lỗi
    END;

    UPDATE `Position`
    SET PositionName = p_PositionName
    WHERE Id = p_Id AND IsDeleted = 0;

    IF ROW_COUNT() > 0 THEN
        SET p_Result = 0; -- Trả về 0 nếu thành công
    ELSE
        SET p_Result = 1; -- Trả về 1 nếu không tìm thấy bản ghi
    END IF;
END$$

DELIMITER ;

-- Thủ tục xóa (gắn cờ IsDeleted) Position
DELIMITER $$

CREATE PROCEDURE DeletePosition(
    IN p_Id INT,
    OUT p_Result INT
)
BEGIN
    -- Khai báo HANDLER trước các câu lệnh SQL
    DECLARE CONTINUE HANDLER FOR SQLEXCEPTION
    BEGIN
        SET p_Result = 1; -- Trả về 1 nếu có lỗi
    END;

    -- Cập nhật trạng thái xóa cho bản ghi
    UPDATE Position
    SET IsDeleted = 1
    WHERE Id = p_Id;

    -- Kiểm tra xem có bản ghi nào bị ảnh hưởng không
    IF ROW_COUNT() > 0 THEN
        SET p_Result = 0; -- Trả về 0 nếu thành công
    ELSE
        SET p_Result = 1; -- Trả về 1 nếu không tìm thấy bản ghi
    END IF;

END$$

DELIMITER ;

DELIMITER //


CREATE PROCEDURE GetPositions()
BEGIN
    SELECT Id, PositionName
    FROM Position
    WHERE IsDeleted = 0;
END //

DELIMITER ;
-- DEPARTMENT
DELIMITER //

CREATE PROCEDURE AddDepartment(
    IN p_DepartmentName NVARCHAR(50),
    IN p_Description NVARCHAR(50),
    OUT p_Result INT
)
BEGIN
    DECLARE EXIT HANDLER FOR SQLEXCEPTION 
    BEGIN
        SET p_Result = 1; -- Failure
        RESIGNAL;
    END;

    INSERT INTO Department (DepartmentName, Description, IsDeleted)
    VALUES (p_DepartmentName, p_Description, 0);

    SET p_Result = 0; -- Success
END//
DELIMITER //
CREATE PROCEDURE UpdateDepartment(
    IN p_Id INT,
    IN p_DepartmentName NVARCHAR(50),
    IN p_Description NVARCHAR(50),
    OUT p_Result INT
)
BEGIN
    DECLARE EXIT HANDLER FOR SQLEXCEPTION 
    BEGIN
        SET p_Result = 1; -- Failure
        RESIGNAL;
    END;

    UPDATE Department
    SET DepartmentName = p_DepartmentName,
        Description = p_Description
    WHERE Id = p_Id AND IsDeleted = 0;

    IF ROW_COUNT() = 0 THEN
        SET p_Result = 1; -- No record found
    ELSE
        SET p_Result = 0; -- Success
    END IF;
END//
DELIMITER //
CREATE PROCEDURE DeleteDepartment(
    IN p_Id INT,
    OUT p_Result INT
)
BEGIN
    DECLARE EXIT HANDLER FOR SQLEXCEPTION 
    BEGIN
        SET p_Result = 1; -- Failure
        RESIGNAL;
    END;

    UPDATE Department
    SET IsDeleted = 1
    WHERE Id = p_Id;

    IF ROW_COUNT() = 0 THEN
        SET p_Result = 1; -- No record found
    ELSE
        SET p_Result = 0; -- Success
    END IF;
END//

DELIMITER $$

CREATE PROCEDURE GetDepartments()
BEGIN
    SELECT Id, DepartmentName, Description
    FROM Department
    WHERE IsDeleted = 0;
END$$

DELIMITER ;

-- Division
DELIMITER $$
CREATE PROCEDURE AddDivision(
    IN p_DivisionName NVARCHAR(50),
    IN p_DepartmentId INT,
    IN p_Description NVARCHAR(50),
    OUT p_Result INT
)
BEGIN
    DECLARE EXIT HANDLER FOR SQLEXCEPTION 
    BEGIN
        SET p_Result = 1; -- Failure
        RESIGNAL;
    END;

    INSERT INTO Division (DivisionName, DepartmentId, Description, IsDeleted)
    VALUES (p_DivisionName, p_DepartmentId, p_Description, 0);

    SET p_Result = 0; -- Success
END$$
DELIMITER $$
CREATE PROCEDURE UpdateDivision(
    IN p_Id INT,
    IN p_DivisionName NVARCHAR(50),
    IN p_DepartmentId INT,
    IN p_Description NVARCHAR(50),
    OUT p_Result INT
)
BEGIN
    DECLARE EXIT HANDLER FOR SQLEXCEPTION 
    BEGIN
        SET p_Result = 1; -- Failure
        RESIGNAL;
    END;

    UPDATE Division
    SET DivisionName = p_DivisionName,
        DepartmentId = p_DepartmentId,
        Description = p_Description
    WHERE Id = p_Id AND IsDeleted = 0;

    IF ROW_COUNT() = 0 THEN
        SET p_Result = 1; -- No record found
    ELSE
        SET p_Result = 0; -- Success
    END IF;
END$$
DELIMITER $$
CREATE PROCEDURE DeleteDivision(
    IN p_Id INT,
    OUT p_Result INT
)
BEGIN
    DECLARE EXIT HANDLER FOR SQLEXCEPTION 
    BEGIN
        SET p_Result = 1; -- Failure
        RESIGNAL;
    END;

    UPDATE Division
    SET IsDeleted = 1
    WHERE Id = p_Id;

    IF ROW_COUNT() = 0 THEN
        SET p_Result = 1; -- No record found
    ELSE
        SET p_Result = 0; -- Success
    END IF;
END$$
DELIMITER $$

CREATE PROCEDURE GetDivisions()
BEGIN
    SELECT d.Id, d.DivisionName, d.Description, dep.DepartmentName,d.DepartmentId
    FROM Division d
    JOIN Department dep ON d.DepartmentId = dep.Id
    WHERE d.IsDeleted = 0;
END$$

DELIMITER ;

-- Personnel

DELIMITER $$
DELIMITER //
CREATE PROCEDURE AddPersonnel(
    IN p_PersonnelName NVARCHAR(50),
    IN p_DivisionId INT,
    IN p_PositionId INT,
    IN p_DateOfBirth DATE,
    IN p_Picture BLOB,
    IN p_Email NVARCHAR(50),
    IN p_Description TEXT,
    IN p_PhoneNumber VARCHAR(10),
    IN p_JoinDate DATE,
    IN p_EndDate DATE,
    IN p_WorkStatus NVARCHAR(50),
    OUT p_Result INT
)
BEGIN
    DECLARE EXIT HANDLER FOR SQLEXCEPTION 
    BEGIN
        SET p_Result = 1; -- Failure
        RESIGNAL;
    END;

    INSERT INTO Personnel (
        PersonnelName, DivisionId, PositionId, DateOfBirth, Picture, 
        Email, Description, PhoneNumber, JoinDate, EndDate, WorkStatus, IsDeleted
    )
    VALUES (
        p_PersonnelName, p_DivisionId, p_PositionId, p_DateOfBirth, p_Picture, 
        p_Email, p_Description, p_PhoneNumber, p_JoinDate, p_EndDate, p_WorkStatus, 0
    );

    SET p_Result = 0; -- Success
END//
DELIMITER //
CREATE PROCEDURE UpdatePersonnel(
    IN p_Id INT,
    IN p_PersonnelName NVARCHAR(50),
    IN p_DivisionId INT,
    IN p_PositionId INT,
    IN p_DateOfBirth DATE,
    IN p_Picture BLOB,
    IN p_Email NVARCHAR(50),
    IN p_Description TEXT,
    IN p_PhoneNumber VARCHAR(10),
    IN p_JoinDate DATE,
    IN p_EndDate DATE,
    IN p_WorkStatus NVARCHAR(50),
    OUT p_Result INT
)
BEGIN
    DECLARE EXIT HANDLER FOR SQLEXCEPTION 
    BEGIN
        SET p_Result = 1; -- Failure
        RESIGNAL;
    END;

    UPDATE Personnel
    SET 
        PersonnelName = p_PersonnelName,
        DivisionId = p_DivisionId,
        PositionId = p_PositionId,
        DateOfBirth = p_DateOfBirth,
        Picture = p_Picture,
        Email = p_Email,
        Description = p_Description,
        PhoneNumber = p_PhoneNumber,
        JoinDate = p_JoinDate,
        EndDate = p_EndDate,
        WorkStatus = p_WorkStatus
    WHERE Id = p_Id AND IsDeleted = 0;

    IF ROW_COUNT() = 0 THEN
        SET p_Result = 1; -- No record found
    ELSE
        SET p_Result = 0; -- Success
    END IF;
END//
DELIMITER //
CREATE PROCEDURE DeletePersonnel(
    IN p_Id INT,
    OUT p_Result INT
)
BEGIN
    DECLARE EXIT HANDLER FOR SQLEXCEPTION 
    BEGIN
        SET p_Result = 1; -- Failure
        RESIGNAL;
    END;

    UPDATE Personnel
    SET IsDeleted = 1
    WHERE Id = p_Id;

    IF ROW_COUNT() = 0 THEN
        SET p_Result = 1; -- No record found
    ELSE
        SET p_Result = 0; -- Success
    END IF;
END//

DELIMITER ;

DELIMITER $$

CREATE PROCEDURE GetPersonnel()
BEGIN
    SELECT 
        p.Id, p.PersonnelName,p.Picture, p.Email, p.PhoneNumber, p.DateOfBirth, p.WorkStatus,p.DivisionId,
        d.DivisionName, pos.PositionName,p.PositionId
    FROM Personnel p
    JOIN Division d ON p.DivisionId = d.Id
    JOIN `Position` pos ON p.PositionId = pos.Id
    WHERE p.IsDeleted = 0;
END$$

DELIMITER ;

-----------
-- Procedure to get customers
DELIMITER //
CREATE PROCEDURE GetCustomers()
BEGIN
    SELECT * FROM Customer WHERE IsDeleted = 0;
    SELECT 0 AS result;
END //
DELIMITER ;

-- Procedure to add a customer
DELIMITER //
CREATE PROCEDURE AddCustomer(
    IN p_CustomerName NVARCHAR(50),
    IN p_PhoneNumber VARCHAR(10),
    IN p_Email NVARCHAR(50),
    IN p_Address NVARCHAR(50)
)
BEGIN
    DECLARE exit handler for SQLEXCEPTION
    BEGIN
        -- ERROR
        SELECT 1 AS result;
        ROLLBACK;
    END;
    
    START TRANSACTION;
        INSERT INTO Customer (CustomerName, PhoneNumber, Email, Address)
        VALUES (p_CustomerName, p_PhoneNumber, p_Email, p_Address);
        
        -- SUCCESS
        SELECT 0 AS result;
    COMMIT;
END //
DELIMITER ;

-- Procedure to update a customer
DELIMITER //
CREATE PROCEDURE UpdateCustomer(
    IN p_Id INT,
    IN p_CustomerName NVARCHAR(50),
    IN p_PhoneNumber VARCHAR(10),
    IN p_Email NVARCHAR(50),
    IN p_Address NVARCHAR(50)
)
BEGIN
    DECLARE exit handler for SQLEXCEPTION
    BEGIN
        -- ERROR
        SELECT 1 AS result;
        ROLLBACK;
    END;
    
    START TRANSACTION;
        UPDATE Customer
        SET CustomerName = p_CustomerName,
            PhoneNumber = p_PhoneNumber,
            Email = p_Email,
            Address = p_Address
        WHERE Id = p_Id AND IsDeleted = 0;
        
        -- SUCCESS
        SELECT 0 AS result;
    COMMIT;
END //
DELIMITER ;

-- Procedure to delete a customer (soft delete)
DELIMITER //
CREATE PROCEDURE DeleteCustomer(IN p_Id INT)
BEGIN
    DECLARE exit handler for SQLEXCEPTION
    BEGIN
        -- ERROR
        SELECT 1 AS result;
        ROLLBACK;
    END;
    
    START TRANSACTION;
        UPDATE Customer SET IsDeleted = 1 WHERE Id = p_Id;
        
        -- SUCCESS
        SELECT 0 AS result;
    COMMIT;
END //
DELIMITER ;



-- Procedure to get partners
DELIMITER //
CREATE PROCEDURE GetPartners()
BEGIN
    SELECT * FROM Partner WHERE IsDeleted = 0;
    SELECT 0 AS result;
END //
DELIMITER ;

-- Procedure to add a partner
DELIMITER //
CREATE PROCEDURE AddPartner(
    IN p_PartnerName NVARCHAR(50),
    IN p_PhoneNumber VARCHAR(10),
    IN p_Email NVARCHAR(50),
    IN p_Address NVARCHAR(100),
    IN p_StartDate DATE,
    IN p_EndDate DATE,
    IN p_PartnershipStatus NVARCHAR(50)
)
BEGIN
    DECLARE exit handler for SQLEXCEPTION
    BEGIN
        -- ERROR
        SELECT 1 AS result;
        ROLLBACK;
    END;
    
    START TRANSACTION;
        INSERT INTO Partner (PartnerName, PhoneNumber, Email, Address, StartDate, EndDate, PartnershipStatus,IsDeleted)
        VALUES (p_PartnerName, p_PhoneNumber, p_Email, p_Address, p_StartDate, IFNULL(p_EndDate, NULL), p_PartnershipStatus,0);
        
        -- SUCCESS
        SELECT 0 AS result;
    COMMIT;
END //
DELIMITER ;

-- Procedure to update a partner
DELIMITER //
CREATE PROCEDURE UpdatePartner(
    IN p_Id INT,
    IN p_PartnerName NVARCHAR(50),
    IN p_PhoneNumber VARCHAR(10),
    IN p_Email NVARCHAR(50),
    IN p_Address NVARCHAR(100),
    IN p_StartDate DATE,
    IN p_EndDate DATE,
    IN p_PartnershipStatus NVARCHAR(50)
)
BEGIN
    DECLARE exit handler for SQLEXCEPTION
    BEGIN
        -- ERROR
        SELECT 1 AS result;
        ROLLBACK;
    END;
    
    START TRANSACTION;
        UPDATE Partner
        SET PartnerName = p_PartnerName,
            PhoneNumber = p_PhoneNumber,
            Email = p_Email,
            Address = p_Address,
            StartDate = p_StartDate,
            EndDate = p_EndDate,
            PartnershipStatus = p_PartnershipStatus
        WHERE Id = p_Id AND IsDeleted = 0;
        
        -- SUCCESS
        SELECT 0 AS result;
    COMMIT;
END //
DELIMITER ;

-- Procedure to delete a partner (soft delete)
DELIMITER //
CREATE PROCEDURE DeletePartner(IN p_Id INT)
BEGIN
    DECLARE exit handler for SQLEXCEPTION
    BEGIN
        -- ERROR
        SELECT 1 AS result;
        ROLLBACK;
    END;
    
    START TRANSACTION;
        UPDATE Partner SET IsDeleted = 1 WHERE Id = p_Id;
        
        -- SUCCESS
        SELECT 0 AS result;
    COMMIT;
END //
DELIMITER ;

