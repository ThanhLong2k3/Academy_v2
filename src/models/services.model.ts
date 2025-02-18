export interface Get_Services {
  Id: number;
  ServiceName: string;
  Description: string;
  ServiceStatus: string;
  TotalRecords: number;
}
export interface Add_Services {
  ServiceName: string;
  Description: string;
  ServiceStatus: string;
}

export interface Update_Services {
  Id: number;
  ServiceName: string;
  Description: string;
  ServiceStatus: string;
}
