export interface GetDepartment {
  Id: number;
  DepartmentName: string;
  Description: string;
  TotalRecords: number;
}

export interface AddDepartment {
  DepartmentName: string;
  Description: string;
}
