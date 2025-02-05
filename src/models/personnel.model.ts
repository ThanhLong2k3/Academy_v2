export interface Personnel_DTO {
    Id: number;
    DivisionId: number;
    PersonnelName: string;
    PositionId: number;
    DateOfBirth: Date;
    Picture: Blob | null;  
    Email: string;  
    Description: string | null;  
    PhoneNumber: string;  
    JoinDate: Date | null;
    EndDate: Date | null;
    WorkStatus: string;  
}

export interface GetPersonnel_DTO {
    Id: number;
    PersonnelName: string;
    Email: string;
    PhoneNumber: string;
    Picture: Blob | null;  
    DateOfBirth: Date;
    WorkStatus: string;
    DivisionId: number;
    DivisionName: string;
    PositionName: string;
    PositionId: number;
}
