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
CREATE PROCEDURE GetPositions()
BEGIN
    SELECT Id, PositionName
    FROM `Position`
    WHERE IsDeleted = 0;
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


CREATE PROCEDURE GetDepartment()
BEGIN
    SELECT Id, DepartmentName,Description
    FROM Department
    WHERE IsDeleted = 0;
END$$

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

CREATE PROCEDURE GetDivision()
BEGIN
    SELECT d.Id,d.DivisionName,dp.DepartmentName,d.DepartmentId,d.Description
    FROM Division d INNER JOIN Department dp ON d.DepartmentId=dp.Id
    WHERE d.IsDeleted = 0;
END$$

DELIMITER ;





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
