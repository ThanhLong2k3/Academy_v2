USE Academi_v4;

DELIMITER $$

-- Thêm Position
CREATE PROCEDURE AddPosition(
    IN p_PositionName NVARCHAR(50)
)
BEGIN
    DECLARE EXIT HANDLER FOR SQLEXCEPTION 
    BEGIN
        SELECT 1 AS RESULT;
    END;
    
    INSERT INTO `Position` (PositionName) 
    VALUES (p_PositionName);
    
    SELECT 0 AS RESULT;
END$$
DELIMITER $$

CREATE PROCEDURE GetDivisionsByPageOrder(
    IN p_PageIndex INT,        
    IN p_PageSize INT,         
    IN p_OrderType VARCHAR(4),  
    IN p_DivisionName VARCHAR(255),  
    IN p_DepartmentName VARCHAR(255) 
)
BEGIN
    DECLARE v_Offset INT;
    DECLARE v_Filter VARCHAR(1000);
    SET v_Offset = (p_PageIndex - 1) * p_PageSize;
    
    -- Xử lý điều kiện tìm kiếm
    SET v_Filter = '';

    IF p_DivisionName IS NOT NULL AND p_DivisionName != '' THEN
        SET v_Filter = CONCAT(v_Filter, " AND d.DivisionName LIKE '%", p_DivisionName, "%' ");
    END IF;
    
    IF p_DepartmentName IS NOT NULL AND p_DepartmentName != '' THEN
        SET v_Filter = CONCAT(v_Filter, " AND dept.DepartmentName LIKE '%", p_DepartmentName, "%' ");
    END IF;

    -- Xây dựng SQL động
    SET @sql = CONCAT(
        'SELECT d.*, COUNT(*) OVER () AS TotalRecords 
         FROM division d 
         LEFT JOIN department dept ON d.DepartmentId = dept.Id
         WHERE d.IsDeleted = 0', 
        v_Filter,
        ' ORDER BY d.DivisionName ', p_OrderType,
        ' LIMIT ', p_PageSize, ' OFFSET ', v_Offset
    );

    -- Thực thi SQL động
    PREPARE stmt FROM @sql;
    EXECUTE stmt;
    DEALLOCATE PREPARE stmt;
END$$

DELIMITER ;


-- Cập nhật Position
CREATE PROCEDURE UpdatePosition(
    IN p_Id INT,
    IN p_PositionName NVARCHAR(50)
)
BEGIN
    DECLARE EXIT HANDLER FOR SQLEXCEPTION 
    BEGIN
        SELECT 1 AS RESULT;
    END;
    
    UPDATE `Position`
    SET PositionName = p_PositionName
    WHERE Id = p_Id AND IsDeleted = 0;
    
    SELECT 0 AS RESULT;
END$$

-- Xóa mềm Position
CREATE PROCEDURE DeletePosition(
    IN p_Id INT
)
BEGIN
    DECLARE EXIT HANDLER FOR SQLEXCEPTION 
    BEGIN
        SELECT 1 AS RESULT;
    END;
    
    UPDATE `Position`
    SET IsDeleted = 1
    WHERE Id = p_Id;
    
    SELECT 0 AS RESULT;
END$$

-- Lấy danh sách Position

DELIMITER $$

CREATE PROCEDURE GetPositionsByPageOrder(
    IN p_PageIndex INT,         -- Trang hiện tại
    IN p_PageSize INT,          -- Số dòng trên mỗi trang
    IN p_OrderType VARCHAR(4),  -- 'ASC' hoặc 'DESC'
    IN p_PositionName VARCHAR(255)  -- Tên vị trí cần tìm (có thể NULL)
)
BEGIN
    DECLARE v_Offset INT;
    DECLARE v_PositionFilter VARCHAR(400);
    SET v_Offset = (p_PageIndex - 1) * p_PageSize;

    -- Xử lý điều kiện tìm kiếm
    IF p_PositionName IS NOT NULL AND p_PositionName != '' THEN
        SET v_PositionFilter = CONCAT(" AND PositionName LIKE '%", p_PositionName, "%' ");
    ELSE
        SET v_PositionFilter = "";
    END IF;

    -- Xây dựng SQL lấy danh sách vị trí kèm tổng số bản ghi
    SET @sql = CONCAT(
        'SELECT *, COUNT(*) OVER () AS TotalRecords FROM Position WHERE isdeleted=0',
        v_PositionFilter,
        ' ORDER BY PositionName ', p_OrderType,
        ' LIMIT ', p_PageSize, ' OFFSET ', v_Offset
    );

    -- Debug câu SQL (nếu cần kiểm tra)
    -- SELECT @sql;

    -- Thực thi SQL động
    PREPARE stmt FROM @sql;
    EXECUTE stmt;
    DEALLOCATE PREPARE stmt;
END$$

DELIMITER ;



-- Department

DELIMITER $$


CREATE PROCEDURE AddDepartment(
    IN p_DepartmentName NVARCHAR(50),
    IN p_Descripttion NVARCHAR(250)
)
BEGIN
    DECLARE EXIT HANDLER FOR SQLEXCEPTION 
    BEGIN
        SELECT 1 AS RESULT;
    END;
    
    INSERT INTO Department (DepartmentName,Description ) 
    VALUES (p_DepartmentName,p_Descripttion);
    
    SELECT 0 AS RESULT;
END$$


CREATE PROCEDURE UpdateDepartment(
    IN p_Id INT,
	IN p_DepartmentName NVARCHAR(50),
    IN p_Description NVARCHAR(250)
)
BEGIN
    DECLARE EXIT HANDLER FOR SQLEXCEPTION 
    BEGIN
        SELECT 1 AS RESULT;
    END;
    
    UPDATE Department
    SET DepartmentName = p_DepartmentName,Description=p_Description
    WHERE Id = p_Id AND IsDeleted = 0;
    
    SELECT 0 AS RESULT;
END$$


CREATE PROCEDURE DeleteDepartment(
    IN p_Id INT
)
BEGIN
    DECLARE EXIT HANDLER FOR SQLEXCEPTION 
    BEGIN
        SELECT 1 AS RESULT;
    END;
    
    UPDATE Department
    SET IsDeleted = 1
    WHERE Id = p_Id;
    
    SELECT 0 AS RESULT;
END$$

DELIMITER $$

CREATE PROCEDURE GetDepartmentByPageOrder(
    IN p_PageIndex INT,
    IN p_PageSize INT,
    IN p_OrderType VARCHAR(4),
    IN p_DepartmentName VARCHAR(255)
)
BEGIN
    DECLARE v_Offset INT;
    SET v_Offset = (p_PageIndex - 1) * p_PageSize;

    -- Truy vấn danh sách Department cùng số lượng Division của từng Department
    SELECT 
        d.Id AS Department,
        d.DepartmentName,
        d.Description,
        COUNT(dv.Id) AS TotalDivisions,  -- Đếm số lượng Division
        COUNT(*) OVER () AS TotalRecords
    FROM Department d
    LEFT JOIN Division dv ON d.Id = dv.DepartmentId AND dv.IsDeleted = 0  -- Đổi bí danh từ 'div' thành 'dv'
    WHERE d.IsDeleted = 0
        AND (p_DepartmentName IS NULL OR p_DepartmentName = '' OR d.DepartmentName LIKE CONCAT('%', p_DepartmentName, '%'))
    GROUP BY d.Id, d.DepartmentName, d.Description
    ORDER BY d.DepartmentName 
    LIMIT p_PageSize OFFSET v_Offset;
END$$

DELIMITER ;



DELIMITER ;


-- Division

DELIMITER $$

CREATE PROCEDURE AddDivision(
    IN d_DivisionName NVARCHAR(50),
    IN d_DepartmentId INT,
    IN d_Description NVARCHAR(250)
)
BEGIN
    DECLARE EXIT HANDLER FOR SQLEXCEPTION 
    BEGIN
        SELECT 1 AS RESULT;
    END;
    
    INSERT INTO Division (DivisionName,DepartmentId,Description) 
    VALUES (d_DivisionName,d_DepartmentId,d_Description);
    
    SELECT 0 AS RESULT;
END$$

CREATE PROCEDURE UpdateDivision(
    IN p_Id INT,
    IN d_DivisionName NVARCHAR(50),
    IN d_DepartmentId INT,
    IN d_Description NVARCHAR(250)
)
BEGIN
    DECLARE EXIT HANDLER FOR SQLEXCEPTION 
    BEGIN
        SELECT 1 AS RESULT;
    END;
    
    UPDATE Division
    SET DivisionName = d_DivisionName,
    DepartmentId=d_DepartmentId,
    Description=d_Description
    WHERE Id = p_Id AND IsDeleted = 0;
    
    SELECT 0 AS RESULT;
END$$

CREATE PROCEDURE DeleteDivision(
    IN p_Id INT
)
BEGIN
    DECLARE EXIT HANDLER FOR SQLEXCEPTION 
    BEGIN
        SELECT 1 AS RESULT;
    END;
    
    UPDATE Division
    SET IsDeleted = 1
    WHERE Id = p_Id;
    
    SELECT 0 AS RESULT;
END$$

 
DELIMITER $$

CREATE PROCEDURE GetPartnerByPageOrder(
    IN p_PageIndex INT,         -- Trang hiện tại
    IN p_PageSize INT,          -- Số dòng trên mỗi trang
    IN p_OrderType VARCHAR(4),  -- 'ASC' hoặc 'DESC'
    IN p_PartnerName VARCHAR(255),
    IN p_PhoneNumber VARCHAR(10)
)
BEGIN
    DECLARE v_Offset INT;
    DECLARE v_FilterCondition VARCHAR(1000);
    
    SET v_Offset = (p_PageIndex - 1) * p_PageSize;
    SET v_FilterCondition = ' WHERE isdeleted = 0 ';  -- Bắt đầu với điều kiện isdeleted = 0

    -- Xây dựng điều kiện WHERE dựa trên giá trị đầu vào
    IF p_PartnerName IS NOT NULL AND p_PartnerName <> '' THEN
        SET v_FilterCondition = CONCAT(v_FilterCondition, " AND PartnerName LIKE '%", p_PartnerName, "%' ");
    END IF;
    
    IF p_PhoneNumber IS NOT NULL AND p_PhoneNumber <> '' THEN
        SET v_FilterCondition = CONCAT(v_FilterCondition, " AND PhoneNumber LIKE '%", p_PhoneNumber, "%' ");
    END IF;

    -- Lấy tổng số bản ghi phù hợp với điều kiện
    SET @sql_count = CONCAT(
        'SELECT COUNT(*) INTO @TotalRecords FROM Partner ', v_FilterCondition
    );
    PREPARE stmt_count FROM @sql_count;
    EXECUTE stmt_count;
    DEALLOCATE PREPARE stmt_count;

    -- Lấy danh sách đối tác với phân trang
    SET @sql = CONCAT(
        'SELECT *, @TotalRecords AS TotalRecords FROM Partner ',
        v_FilterCondition,
        ' ORDER BY PartnerName ', p_OrderType,
        ' LIMIT ', p_PageSize, ' OFFSET ', v_Offset
    );

    PREPARE stmt FROM @sql;
    EXECUTE stmt;
    DEALLOCATE PREPARE stmt;
END$$

DELIMITER ;

DELIMITER ;


-- Partner

	DELIMITER $$

CREATE PROCEDURE GetPartnerByPageOrder(
    IN p_PageIndex INT,         -- Trang hiện tại
    IN p_PageSize INT,          -- Số dòng trên mỗi trang
    IN p_OrderType VARCHAR(4),  -- 'ASC' hoặc 'DESC'
    IN p_PartnerName VARCHAR(255),
    IN p_PhoneNumber VARCHAR(10)
)
BEGIN
    DECLARE v_Offset INT;
    DECLARE v_FilterCondition VARCHAR(500);
    
    SET v_Offset = (p_PageIndex - 1) * p_PageSize;
    SET v_FilterCondition = '';

    -- Xây dựng điều kiện WHERE dựa trên giá trị đầu vào
    IF p_PartnerName IS NOT NULL AND p_PartnerName <> '' THEN
        SET v_FilterCondition = CONCAT(" PartnerName LIKE '%", p_PartnerName, "%' ");
    END IF;
    
    IF p_PhoneNumber IS NOT NULL AND p_PhoneNumber <> '' THEN
        IF v_FilterCondition <> '' THEN
            SET v_FilterCondition = CONCAT(v_FilterCondition, " AND ");
        END IF;
        SET v_FilterCondition = CONCAT(v_FilterCondition, " PhoneNumber LIKE '%", p_PhoneNumber, "%' ");
    END IF;
    
    -- Kiểm tra xem có điều kiện WHERE không
    IF v_FilterCondition <> '' THEN
        SET v_FilterCondition = CONCAT(" WHERE ", v_FilterCondition);
    END IF;

    -- Tạo câu truy vấn động
    SET @sql = CONCAT(
        'SELECT * FROM Partner where isdeleted=0',  
        v_FilterCondition,
        ' ORDER BY PartnerName ', p_OrderType,
        ' LIMIT ', p_PageSize, ' OFFSET ', v_Offset
    );

   
    PREPARE stmt FROM @sql;
    EXECUTE stmt;
    DEALLOCATE PREPARE stmt;
END$$

DELIMITER ;
DELIMITER $$

-- Thêm mới Partner
CREATE PROCEDURE AddPartner(
    IN p_PartnerName NVARCHAR(50),
    IN p_PhoneNumber VARCHAR(10),
    IN p_Email NVARCHAR(50),
    IN p_Address NVARCHAR(100),
    IN p_StartDate DATE,
    IN p_EndDate DATE, -- Có thể NULL
    IN p_PartnershipStatus NVARCHAR(50)
)
BEGIN
    DECLARE EXIT HANDLER FOR SQLEXCEPTION 
    BEGIN
        SELECT 1 AS RESULT;
    END;

    INSERT INTO Partner (PartnerName, PhoneNumber, Email, Address, StartDate, EndDate, PartnershipStatus)
    VALUES (p_PartnerName, p_PhoneNumber, p_Email, p_Address, p_StartDate, 
        IFNULL(p_EndDate, NULL), -- Đảm bảo NULL nếu không nhập
        p_PartnershipStatus
    );

    SELECT 0 AS RESULT;
END$$

-- Cập nhật Partner
CREATE PROCEDURE UpdatePartner(
    IN p_Id INT,
    IN p_PartnerName NVARCHAR(50),
    IN p_PhoneNumber VARCHAR(10),
    IN p_Email NVARCHAR(50),
    IN p_Address NVARCHAR(100),
    IN p_StartDate DATE,
    IN p_EndDate DATE, -- Có thể NULL
    IN p_PartnershipStatus NVARCHAR(50)
)
BEGIN
    DECLARE EXIT HANDLER FOR SQLEXCEPTION 
    BEGIN
        SELECT 1 AS RESULT;
    END;

    UPDATE Partner
    SET 
        PartnerName = p_PartnerName,
        PhoneNumber = p_PhoneNumber,
        Email = p_Email,
        Address = p_Address,
        StartDate = p_StartDate,
        EndDate = IFNULL(p_EndDate, NULL), -- Đảm bảo NULL nếu không nhập
        PartnershipStatus = p_PartnershipStatus
    WHERE Id = p_Id AND IsDeleted = 0;

    SELECT 0 AS RESULT;
END$$

-- Xóa Partner (chỉ đánh dấu IsDeleted = 1)
CREATE PROCEDURE DeletePartner(
    IN p_Id INT
)
BEGIN
    DECLARE EXIT HANDLER FOR SQLEXCEPTION 
    BEGIN
        SELECT 1 AS RESULT;
    END;

    UPDATE Partner
    SET IsDeleted = 1
    WHERE Id = p_Id;

    SELECT 0 AS RESULT;
END$$

DELIMITER ;

-- customer
DELIMITER $$

CREATE PROCEDURE GetCustomerByPageOrder(
    IN p_PageIndex INT,         -- Trang hiện tại
    IN p_PageSize INT,          -- Số dòng trên mỗi trang
    IN p_OrderType VARCHAR(4),  -- 'ASC' hoặc 'DESC'
    IN p_CustomerName VARCHAR(255),
    IN p_PhoneNumber VARCHAR(10)
)
BEGIN
    DECLARE v_Offset INT;
    DECLARE v_FilterCondition VARCHAR(1000);
    
    SET v_Offset = (p_PageIndex - 1) * p_PageSize;
    SET v_FilterCondition = ' WHERE IsDeleted = 0 ';  -- Chỉ lấy khách hàng chưa bị xóa

    -- Xây dựng điều kiện WHERE dựa trên giá trị đầu vào
    IF p_CustomerName IS NOT NULL AND p_CustomerName <> '' THEN
        SET v_FilterCondition = CONCAT(v_FilterCondition, " AND CustomerName LIKE '%", p_CustomerName, "%' ");
    END IF;
    
    IF p_PhoneNumber IS NOT NULL AND p_PhoneNumber <> '' THEN
        SET v_FilterCondition = CONCAT(v_FilterCondition, " AND PhoneNumber LIKE '%", p_PhoneNumber, "%' ");
    END IF;

    -- Lấy tổng số bản ghi phù hợp với điều kiện
    SET @sql_count = CONCAT(
        'SELECT COUNT(*) INTO @TotalRecords FROM Customer ', v_FilterCondition
    );
    PREPARE stmt_count FROM @sql_count;
    EXECUTE stmt_count;
    DEALLOCATE PREPARE stmt_count;

    -- Lấy danh sách khách hàng với phân trang
    SET @sql = CONCAT(
        'SELECT *, @TotalRecords AS TotalRecords FROM Customer ',
        v_FilterCondition,
        ' ORDER BY CustomerName ', p_OrderType,
        ' LIMIT ', p_PageSize, ' OFFSET ', v_Offset
    );

    PREPARE stmt FROM @sql;
    EXECUTE stmt;
    DEALLOCATE PREPARE stmt;
END$$

DELIMITER ;


DELIMITER $$

-- Thêm mới customer
CREATE PROCEDURE AddCustomer(
    IN p_CustomerName NVARCHAR(50),
    IN p_PhoneNumber VARCHAR(10),
    IN p_Email NVARCHAR(50),
    IN p_Address NVARCHAR(100)
)
BEGIN
    DECLARE EXIT HANDLER FOR SQLEXCEPTION 
    BEGIN
        SELECT 1 AS RESULT;
    END;

    INSERT INTO Customer (CustomerName, PhoneNumber, Email, Address)
    VALUES (p_CustomerName, p_PhoneNumber, p_Email, p_Address);

    SELECT 0 AS RESULT;
END$$

-- Cập nhật Partner
CREATE PROCEDURE UpdateCustomer(
    IN p_Id INT,
    IN p_CustomerName NVARCHAR(50),
    IN p_PhoneNumber VARCHAR(10),
    IN p_Email NVARCHAR(50),
    IN p_Address NVARCHAR(100)
)
BEGIN
    DECLARE EXIT HANDLER FOR SQLEXCEPTION 
    BEGIN
        SELECT 1 AS RESULT;
    END;

    UPDATE Customer
    SET 
        CustomerName = p_CustomerName,
        PhoneNumber = p_PhoneNumber,
        Email = p_Email,
        Address = p_Address
    WHERE Id = p_Id AND IsDeleted = 0;

    SELECT 0 AS RESULT;
END$$


CREATE PROCEDURE DeleteCustomer(
    IN p_Id INT
)
BEGIN
    DECLARE EXIT HANDLER FOR SQLEXCEPTION 
    BEGIN
        SELECT 1 AS RESULT;
    END;

    UPDATE Customer
    SET IsDeleted = 1
    WHERE Id = p_Id;

    SELECT 0 AS RESULT;
END$$

DELIMITER ;
CALL GetDivisionsByPageOrder(1, 100, 'ASC');
DELIMITER $$

-- Tạo Stored Procedure thêm nhân viên (bỏ trường p_IsDeleted)
CREATE PROCEDURE AddPersonnel(
    IN p_DivisionId INT,
    IN p_PersonnelName NVARCHAR(50),
    IN p_PositionId INT,
    IN p_DateOfBirth DATE,
    IN p_Picture BLOB,
    IN p_Email NVARCHAR(50),
    IN p_Description TEXT,
    IN p_PhoneNumber VARCHAR(10),
    IN p_JoinDate DATE,
    IN p_EndDate DATE,
    IN p_WorkStatus NVARCHAR(50)
)
BEGIN
    INSERT INTO Personnel (
        DivisionId, PersonnelName, PositionId, DateOfBirth, Picture, Email, 
        Description, PhoneNumber, JoinDate, EndDate, WorkStatus
    ) 
    VALUES (
        p_DivisionId, p_PersonnelName, p_PositionId, p_DateOfBirth, p_Picture, p_Email, 
        p_Description, p_PhoneNumber, p_JoinDate, p_EndDate, p_WorkStatus
    );
END $$

DELIMITER ;
CREATE PROCEDURE UpdatePersonnel(
    IN p_Id INT,
    IN p_DivisionId INT,
    IN p_PersonnelName NVARCHAR(50),
    IN p_PositionId INT,
    IN p_DateOfBirth DATE,
    IN p_Picture BLOB,
    IN p_Email NVARCHAR(50),
    IN p_Description TEXT,
    IN p_PhoneNumber VARCHAR(10),
    IN p_JoinDate DATE,
    IN p_EndDate DATE,
    IN p_WorkStatus NVARCHAR(50),
    IN p_IsDeleted TINYINT(1)
)
BEGIN
    UPDATE Personnel
    SET 
        DivisionId = p_DivisionId,
        PersonnelName = p_PersonnelName,
        PositionId = p_PositionId,
        DateOfBirth = p_DateOfBirth,
        Picture = p_Picture,
        Email = p_Email,
        Description = p_Description,
        PhoneNumber = p_PhoneNumber,
        JoinDate = p_JoinDate,
        EndDate = p_EndDate,
        WorkStatus = p_WorkStatus,
        IsDeleted = p_IsDeleted
    WHERE Id = p_Id;
END;



-- PROJECT

 

DELIMITER $$

CREATE PROCEDURE AddProject(
    IN p_ProjectName NVARCHAR(50),
    IN p_DepartmentId INT,
    IN p_PartnerId INT,
    IN p_Description TEXT,
    IN p_ProjectStartDate DATE,
    IN p_ProjectEndDate DATE,
    IN p_ProjectStatus NVARCHAR(50)
)
BEGIN
    DECLARE v_NewProjectId INT;

    DECLARE EXIT HANDLER FOR SQLEXCEPTION 
    BEGIN
        SELECT -1 AS NewProjectId; -- Nếu lỗi, trả về -1
    END;

    INSERT INTO Project (ProjectName, DepartmentId, PartnerId, Description, ProjectStartDate, ProjectEndDate, ProjectStatus)
    VALUES (p_ProjectName, p_DepartmentId, p_PartnerId, p_Description, p_ProjectStartDate, p_ProjectEndDate, p_ProjectStatus);
    
    SET v_NewProjectId = LAST_INSERT_ID(); -- Lấy ID vừa thêm

    SELECT v_NewProjectId AS NewId; -- Trả về ID
END$$

DELIMITER ;


DELIMITER $$
-- Cập nhật dự án
CREATE PROCEDURE UpdateProject(
    IN p_Id INT,
    IN p_ProjectName NVARCHAR(50),
    IN p_DepartmentId INT,
    IN p_PartnerId INT,
    IN p_Description TEXT,
    IN p_ProjectStartDate DATE,
    IN p_ProjectEndDate DATE,
    IN p_ProjectStatus NVARCHAR(50)
)
BEGIN
    DECLARE EXIT HANDLER FOR SQLEXCEPTION 
    BEGIN
        SELECT 1 AS RESULT;
    END;

    UPDATE Project
    SET ProjectName = p_ProjectName,
        DepartmentId = p_DepartmentId,
        PartnerId = p_PartnerId,
        Description = p_Description,
        ProjectStartDate = p_ProjectStartDate,
        ProjectEndDate = p_ProjectEndDate,
        ProjectStatus = p_ProjectStatus
    WHERE Id = p_Id AND IsDeleted = 0;

    SELECT 0 AS RESULT;
END$$

-- Xóa mềm dự án
CREATE PROCEDURE DeleteProject(
    IN p_Id INT
)
BEGIN
    DECLARE EXIT HANDLER FOR SQLEXCEPTION 
    BEGIN
        SELECT 1 AS RESULT;
    END;

    UPDATE Project
    SET IsDeleted = 1
    WHERE Id = p_Id;

    SELECT 0 AS RESULT;
END$$

-- Lấy danh sách dự án với phân trang & sắp xếp
CREATE PROCEDURE GetProjectByPageOrder(
    IN p_PageIndex INT,
    IN p_PageSize INT,
    IN p_OrderType VARCHAR(4),
    IN p_ProjectName VARCHAR(255)
)
BEGIN
    DECLARE v_Offset INT;
    SET v_Offset = (p_PageIndex - 1) * p_PageSize;

    SELECT 
        p.Id,
        p.ProjectName,
        p.DepartmentId,
        d.DepartmentName,
        p.PartnerId,
        pr.PartnerName,
        p.Description,
        p.ProjectStartDate,
        p.ProjectEndDate,
        p.ProjectStatus,
        COUNT(*) OVER () AS TotalRecords
    FROM Project p
    LEFT JOIN Department d ON p.DepartmentId = d.Id
    LEFT JOIN Partner pr ON p.PartnerId = pr.Id
    WHERE p.IsDeleted = 0
        AND (p_ProjectName IS NULL OR p_ProjectName = '' OR p.ProjectName LIKE CONCAT('%', p_ProjectName, '%'))
    ORDER BY 
        CASE WHEN p_OrderType = 'ASC' THEN p.ProjectName END ASC,
        CASE WHEN p_OrderType = 'DESC' THEN p.ProjectName END DESC
    LIMIT p_PageSize OFFSET v_Offset;
END$$

DELIMITER ;
 

-- Document
DELIMITER $$

-- Thêm mới tài liệu
CREATE PROCEDURE AddDocument(
    IN p_DocumentName NVARCHAR(50),
    IN p_DocumentLink TEXT,
    IN p_RelatedId INT,
    IN p_RelatedType NVARCHAR(50)
)
BEGIN
    DECLARE EXIT HANDLER FOR SQLEXCEPTION 
    BEGIN
        SELECT 1 AS RESULT;
    END;

    INSERT INTO Document (DocumentName, DocumentLink, RelatedId, RelatedType)
    VALUES (p_DocumentName, p_DocumentLink, p_RelatedId, p_RelatedType);

    SELECT 0 AS RESULT;
END$$

-- Cập nhật tài liệu
CREATE PROCEDURE UpdateDocument(
    IN p_Id INT,
    IN p_DocumentName NVARCHAR(50),
    IN p_DocumentLink TEXT,
    IN p_RelatedId INT,
    IN p_RelatedType NVARCHAR(50)
)
BEGIN
    DECLARE EXIT HANDLER FOR SQLEXCEPTION 
    BEGIN
        SELECT 1 AS RESULT;
    END;

    UPDATE Document
    SET DocumentName = p_DocumentName,
        DocumentLink = p_DocumentLink,
        RelatedId = p_RelatedId,
        RelatedType = p_RelatedType
    WHERE Id = p_Id AND IsDeleted = 0;

    SELECT 0 AS RESULT;
END$$

-- Xóa mềm tài liệu
CREATE PROCEDURE DeleteDocument(
    IN p_Id INT
)
BEGIN
    DECLARE EXIT HANDLER FOR SQLEXCEPTION 
    BEGIN
        SELECT 1 AS RESULT;
    END;

    UPDATE Document
    SET IsDeleted = 1
    WHERE Id = p_Id;

    SELECT 0 AS RESULT;
END$$

-- Lấy danh sách tài liệu có phân trang & sắp xếp
CREATE PROCEDURE GetDocumentByPageOrder(
    IN p_PageIndex INT,
    IN p_PageSize INT,
    IN p_OrderType VARCHAR(4),
    IN p_DocumentName VARCHAR(255),
    IN p_RelatedType NVARCHAR(50)
)
BEGIN
    DECLARE v_Offset INT;
    SET v_Offset = (p_PageIndex - 1) * p_PageSize;

    SELECT 
        d.Id AS DocumentId,
        d.DocumentName,
        d.DocumentLink,
        d.RelatedId,
        d.RelatedType,
        COUNT(*) OVER () AS TotalRecords
    FROM Document d
    WHERE d.IsDeleted = 0
        AND (p_DocumentName IS NULL OR p_DocumentName = '' OR d.DocumentName LIKE CONCAT('%', p_DocumentName, '%'))
        AND (p_RelatedType IS NULL OR p_RelatedType = '' OR d.RelatedType = p_RelatedType)
    ORDER BY 
        CASE WHEN p_OrderType = 'ASC' THEN d.DocumentName END ASC,
        CASE WHEN p_OrderType = 'DESC' THEN d.DocumentName END DESC
    LIMIT p_PageSize OFFSET v_Offset;
END$$

DELIMITER ;


-- services:
DELIMITER $$

-- Thêm Service
CREATE PROCEDURE AddService(
    IN p_ServiceName NVARCHAR(100),
    IN p_Description TEXT,
    IN p_ServiceStatus NVARCHAR(50)
)
BEGIN
    DECLARE EXIT HANDLER FOR SQLEXCEPTION 
    BEGIN
        SELECT 1 AS RESULT;
    END;
    
    INSERT INTO `Service` (ServiceName, Description, ServiceStatus) 
    VALUES (p_ServiceName, p_Description, p_ServiceStatus);
    
    SELECT 0 AS RESULT;
END$$

-- Cập nhật Service
CREATE PROCEDURE UpdateService(
    IN p_Id INT,
    IN p_ServiceName NVARCHAR(100),
    IN p_Description TEXT,
    IN p_ServiceStatus NVARCHAR(50)
)
BEGIN
    DECLARE EXIT HANDLER FOR SQLEXCEPTION 
    BEGIN
        SELECT 1 AS RESULT;
    END;
    
    UPDATE `Service`
    SET ServiceName = p_ServiceName,
        Description = p_Description,
        ServiceStatus = p_ServiceStatus,
        updated_at = CURRENT_TIMESTAMP
    WHERE Id = p_Id AND IsDeleted = 0;
    
    SELECT 0 AS RESULT;
END$$

-- Xóa mềm Service
CREATE PROCEDURE DeleteService(
    IN p_Id INT
)
BEGIN
    DECLARE EXIT HANDLER FOR SQLEXCEPTION 
    BEGIN
        SELECT 1 AS RESULT;
    END;
    
    UPDATE `Service`
    SET IsDeleted = 1, updated_at = CURRENT_TIMESTAMP
    WHERE Id = p_Id;
    
    SELECT 0 AS RESULT;
END$$

-- Lấy danh sách Service
CREATE PROCEDURE GetServicesByPageOrder(
    IN p_PageIndex INT,         -- Trang hiện tại
    IN p_PageSize INT,          -- Số dòng trên mỗi trang
    IN p_OrderType VARCHAR(4),  -- 'ASC' hoặc 'DESC'
    IN p_ServiceName VARCHAR(255)  -- Tên dịch vụ cần tìm (có thể NULL)
)
BEGIN
    DECLARE v_Offset INT;
    DECLARE v_ServiceFilter VARCHAR(400);
    SET v_Offset = (p_PageIndex - 1) * p_PageSize;

    -- Xử lý điều kiện tìm kiếm
    IF p_ServiceName IS NOT NULL AND p_ServiceName != '' THEN
        SET v_ServiceFilter = CONCAT(" AND ServiceName LIKE '%", p_ServiceName, "%' ");
    ELSE
        SET v_ServiceFilter = "";
    END IF;

    -- Xây dựng SQL lấy danh sách dịch vụ kèm tổng số bản ghi
    SET @sql = CONCAT(
        'SELECT *, COUNT(*) OVER () AS TotalRecords FROM Service WHERE isdeleted=0',
        v_ServiceFilter,
        ' ORDER BY ServiceName ', p_OrderType,
        ' LIMIT ', p_PageSize, ' OFFSET ', v_Offset
    );

    -- Thực thi SQL động
    PREPARE stmt FROM @sql;
    EXECUTE stmt;
    DEALLOCATE PREPARE stmt;
END$$

DELIMITER ;


-- PRODUCT

DELIMITER $$

-- Thêm Product
CREATE PROCEDURE AddProduct(
    IN p_ProductName NVARCHAR(50),
    IN p_DepartmentId INT,
    IN p_ProductStartDate DATE,
    IN p_ProductEndDate DATE,
    IN p_ProductStatus NVARCHAR(50)
)
BEGIN
    DECLARE v_NewProductId INT;

    DECLARE EXIT HANDLER FOR SQLEXCEPTION 
    BEGIN
        SELECT -1 AS NewProductId; -- Nếu lỗi, trả về -1
    END;

    INSERT INTO Product (ProductName, DepartmentId, ProductStartDate, ProductEndDate, ProductStatus)
    VALUES (p_ProductName, p_DepartmentId, p_ProductStartDate, p_ProductEndDate, p_ProductStatus);

    SET v_NewProductId = LAST_INSERT_ID(); -- Lấy ID vừa thêm

    SELECT v_NewProductId AS NewId; -- Trả về ID mới
END$$

DELIMITER ;
DELIMITER $$

-- Cập nhật Product
CREATE PROCEDURE UpdateProduct(
    IN p_Id INT,
    IN p_ProductName NVARCHAR(50),
    IN p_DepartmentId INT,
    IN p_ProductStartDate DATE,
    IN p_ProductEndDate DATE,
    IN p_ProductStatus NVARCHAR(50)
)
BEGIN
    DECLARE EXIT HANDLER FOR SQLEXCEPTION 
    BEGIN
        SELECT 1 AS RESULT;
    END;
    
    UPDATE Product
    SET ProductName = p_ProductName,
        DepartmentId = p_DepartmentId,
        ProductStartDate = p_ProductStartDate,
        ProductEndDate = p_ProductEndDate,
        ProductStatus = p_ProductStatus
    WHERE Id = p_Id AND IsDeleted = 0;
    
    SELECT 0 AS RESULT;
END$$

-- Xóa mềm Product
CREATE PROCEDURE DeleteProduct(
    IN p_Id INT
)
BEGIN
    DECLARE EXIT HANDLER FOR SQLEXCEPTION 
    BEGIN
        SELECT 1 AS RESULT;
    END;
    
    UPDATE Product
    SET IsDeleted = 1
    WHERE Id = p_Id;
    
    SELECT 0 AS RESULT;
END$$

-- Lấy danh sách Product có phân trang và sắp xếp
CREATE PROCEDURE GetProductsByPageOrder(
    IN p_PageIndex INT,
    IN p_PageSize INT,
    IN p_OrderType VARCHAR(4),
    IN p_ProductName VARCHAR(255)
)
BEGIN
    DECLARE v_Offset INT;
    DECLARE v_ProductFilter VARCHAR(400);
    SET v_Offset = (p_PageIndex - 1) * p_PageSize;

    -- Xử lý điều kiện tìm kiếm
    IF p_ProductName IS NOT NULL AND p_ProductName != '' THEN
        SET v_ProductFilter = CONCAT(" AND p.ProductName LIKE '%", p_ProductName, "%' ");
    ELSE
        SET v_ProductFilter = "";
    END IF;

    -- Xây dựng SQL lấy danh sách sản phẩm kèm tổng số bản ghi
    SET @sql = CONCAT(
        'SELECT p.*, d.DepartmentName, COUNT(*) OVER () AS TotalRecords 
         FROM Product p 
         JOIN Department d ON p.DepartmentId = d.Id 
         WHERE p.IsDeleted=0',
        v_ProductFilter,
        ' ORDER BY p.ProductName ', p_OrderType,
        ' LIMIT ', p_PageSize, ' OFFSET ', v_Offset
    );

    -- Debug câu SQL (nếu cần kiểm tra)
    -- SELECT @sql;

    -- Thực thi SQL động
    PREPARE stmt FROM @sql;
    EXECUTE stmt;
    DEALLOCATE PREPARE stmt;
END$$

DELIMITER ;

DELIMITER $$

CREATE PROCEDURE GetDocuments_by_IdRelated(IN ID INT)
BEGIN 
    SELECT * FROM document WHERE RelatedId = ID AND IsDeleted = 0;
END $$

DELIMITER ;

