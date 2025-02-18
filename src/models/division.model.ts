export interface Division_DTO {
  Id: number;
  DivisionName: string;
  DepartmentId: number;
  Description: string;
}

export interface GetDivision {
  Id: number;
  DivisionName: string;
  DepartmentId: number;
  DepartmentName: string;
  Description: string;
  TotalRecords: number;
}
