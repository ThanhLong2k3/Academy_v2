import { CallApi } from '@/libs/call_API';
import {
  GetDepartment,
  AddDepartment,
  Department_DTO,
} from '@/models/department.model';
export const DepartmentAPI = {
  getAllDepartment: async () => {
    const data: Department_DTO[] =
      await CallApi.getAll<Department_DTO>('department');
    return data;
  },
  getDepartmentByPageOrder: async (
    pageIndex: number,
    pageSize: number,
    orderType: 'ASC' | 'DESC',
    positionName?: string,
  ) => {
    const queryParams = new URLSearchParams({
      pageIndex: pageIndex.toString(),
      pageSize: pageSize.toString(),
      orderType,
    });

    if (positionName) {
      queryParams.append('departmentName', positionName);
    }

    const data: Department_DTO[] = await CallApi.getAll<Department_DTO>(
      `department?${queryParams.toString()}`,
    );

    return data;
  },

  createDepartment: async (newDepartment: AddDepartment) => {
    const data = await CallApi.create<number>('department', newDepartment);
    return data;
  },

  updateDepartment: async (Department: AddDepartment) => {
    const data = await CallApi.update<number>('department', Department);
    return data;
  },

  deleteDepartment: async (Id: number): Promise<number> => {
    const data = await CallApi.delete<number>('department', Id);
    return data;
  },
};
