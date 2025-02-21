import { UploadFile } from 'antd';

export interface GetIntellectualProperty {
  Id: number;
  DepartmentId: number;
  IntellectualPropertyName: string;
  IntellectualPropertyImage: string | UploadFile[];
  Description: string;
  IntellectualPropertyStatus: string;
  DepartmentName: string;
  TotalRecords: number;
}
export interface AddIntellectualProperty {
  DepartmentId: number;
  IntellectualPropertyName: string;
  IntellectualPropertyImage: string;
  Description: string;
  IntellectualPropertyStatus: string;
}

export interface UpIntellectualProperty {
  Id: number;
  DepartmentId: number;
  IntellectualPropertyName: string;
  IntellectualPropertyImage: string;
  Description: string;
  IntellectualPropertyStatus: string;
}
