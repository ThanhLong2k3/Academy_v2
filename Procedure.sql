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
        d.Id AS DepartmentId,
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


CALL GetDepartmentByPageOrder(1,20,'ASC',NULL)
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

SELECT COUNT(*) FROM division  WHERE 
