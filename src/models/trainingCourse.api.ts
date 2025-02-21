export interface GetTrainingCourse {
  Id: number;
  CourseName: string;
  ServiceStatus: string;
  Description: string;
  Duration: string;
  InstructorId: number;
  InstructorName: string;
  TotalRecords: number;
}

export interface AddTrainingCourse {
  CourseName: string;
  ServiceStatus: string;
  Description: string;
  Duration: string;
  InstructorId: number;
}
export interface UpTrainingCourse {
  Id: number;
  CourseName: string;
  ServiceStatus: string;
  Description: string;
  Duration: string;
  InstructorId: number;
}
