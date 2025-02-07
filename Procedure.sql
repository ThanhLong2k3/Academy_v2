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