export interface GetDepartment {
  Id: number;
  DepartmentName: string;
  Description: string;
  TotalDivisions: number;
  TotalRecords: number;
}

export interface AddDepartment {
  DepartmentName: string;
  Description: string;
}
