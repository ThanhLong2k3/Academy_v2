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
    IsDeleted BOOLEAN DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE Department(
    Id INT AUTO_INCREMENT PRIMARY KEY,
    DepartmentName NVARCHAR(50) NOT NULL,
    Description NVARCHAR(50) NULL,
    IsDeleted BOOLEAN DEFAULT 0,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE Division(
    Id INT AUTO_INCREMENT PRIMARY KEY,
    DivisionName NVARCHAR(50) NOT NULL,
    DepartmentId INT,
    Description NVARCHAR(50) NULL,
    IsDeleted BOOLEAN DEFAULT 0,
    FOREIGN KEY (DepartmentId) REFERENCES Department(Id) ON UPDATE CASCADE ON DELETE CASCADE,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
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
    FOREIGN KEY (PositionId) REFERENCES `Position`(Id) ON UPDATE CASCADE,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
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
    IsDeleted BOOLEAN DEFAULT 0,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE Customer(
    Id INT AUTO_INCREMENT PRIMARY KEY,
    CustomerName NVARCHAR(50) NOT NULL,
    PhoneNumber VARCHAR(10),
    Email NVARCHAR(50),
    Address NVARCHAR(50),
    IsDeleted BOOLEAN DEFAULT 0,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
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
    FOREIGN KEY (PartnerId) REFERENCES Partner(Id) ON UPDATE CASCADE,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
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
    FOREIGN KEY (DepartmentId) REFERENCES Department(Id) ON UPDATE CASCADE,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
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
    FOREIGN KEY (DepartmentId) REFERENCES Department(Id) ON UPDATE CASCADE,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE TrainingCourse(
    Id INT AUTO_INCREMENT PRIMARY KEY,
    CourseName NVARCHAR(100),
    ServiceStatus NVARCHAR(50),
    Description TEXT NULL,
    Duration INT,
    InstructorId INT,
    IsDeleted BOOLEAN DEFAULT 0,
    FOREIGN KEY (InstructorId) REFERENCES Personnel(Id) ON UPDATE CASCADE,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE Service(
    Id INT AUTO_INCREMENT PRIMARY KEY,
    ServiceName NVARCHAR(100),
    Description TEXT NULL,
    ServiceStatus NVARCHAR(50),
    IsDeleted BOOLEAN DEFAULT 0,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IntellectualProperty(
    Id INT AUTO_INCREMENT PRIMARY KEY,
    DepartmentId INT,
    IntellectualPropertyName NVARCHAR(100),
    IntellectualPropertyImage BLOB,
    Description TEXT NULL,
    IntellectualPropertyStatus NVARCHAR(50),
    IsDeleted BOOLEAN DEFAULT 0,
    FOREIGN KEY (DepartmentId) REFERENCES Department(Id),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE Document(
    Id INT AUTO_INCREMENT PRIMARY KEY,
    DocumentName NVARCHAR(50) NOT NULL,
    DocumentLink TEXT NOT NULL,
    RelatedId INT NOT NULL,
    RelatedType NVARCHAR(50) NOT NULL,
    IsDeleted BOOLEAN DEFAULT 0,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE Customer_Link(
    CustomerId INT,
    RelatedId INT,
    RelatedType NVARCHAR(50),
    PRIMARY KEY(CustomerId, RelatedId, RelatedType),
    FOREIGN KEY (CustomerId) REFERENCES Customer(Id),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
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
