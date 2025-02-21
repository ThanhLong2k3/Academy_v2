export interface GetTopic {
  Id: number;
  TopicName: string;
  DepartmentId: number;
  TopicStartDate: string;
  TopicEndDate: string;
  Description: string;
  TopicStatus: string;
  DepartmentName: string;
  TotalRecords: number;
}

export interface AddTopic {
  TopicName: string;
  DepartmentId: number;
  TopicStartDate: string;
  TopicEndDate: string | null;
  Description: string;
  TopicStatus: string;
}

export interface UpTopic {
  Id: number;
  TopicName: string;
  DepartmentId: number;
  TopicStartDate: string;
  TopicEndDate: string | null;
  Description: string;
  TopicStatus: string;
}
