export interface Get_Product {
  Id: number;
  ProductName: string;
  DepartmentId: number;
  DepartmentName: string;
  ProductStartDate: string;
  ProductEndDate: string;
  ProductStatus: string;
  TotalRecords: number;
}
export interface Add_Product {
  ProductName: string;
  DepartmentId: number;
  ProductStartDate: string;
  ProductEndDate: string | null;
  ProductStatus: string;
}

export interface Update_Product {
  Id: number;
  ProductName: string;
  DepartmentId: number;
  ProductStartDate: string;
  ProductEndDate: string | null;
  ProductStatus: string;
}
