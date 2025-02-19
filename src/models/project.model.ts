export interface Add_project {
  ProjectName: string;
  DepartmentId: number;
  PartnerId: number;
  Description: string | null;
  ProjectStartDate: string;
  ProjectEndDate: string | null;
  ProjectStatus: string;
}

export interface Up_project {
  Id: number;
  ProjectName: string;
  DepartmentId: number;
  PartnerId: number;
  Description: string | null;
  ProjectStartDate: string;
  ProjectEndDate: string | null;
  ProjectStatus: string;
}

export interface Get_project {
  Id: number;
  ProjectName: string;
  DepartmentId: number;
  DepartmentName: string;
  PartnerId: number;
  PartnerName: string;
  Description: string | null;
  ProjectStartDate: string;
  ProjectEndDate: string | null;
  ProjectStatus: string;
  TotalRecords: number;
}
