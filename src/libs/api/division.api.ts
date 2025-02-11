import { Division_DTO, GetDivision } from '@/models/division.model';
import { CallApi } from '@/libs/call_API';

export const divisionAPI = {
  getAlldivision: async () => {
    const data: GetDivision[] = await CallApi.getAll<GetDivision>('division');
    return data;
  },

  getDivisionByPageOrder: async (
    pageIndex: number,
    pageSize: number,
    orderType: 'ASC' | 'DESC',
    divisionName?: string,
    departmentName?: string,
  ) => {
    const queryParams = new URLSearchParams({
      pageIndex: pageIndex.toString(),
      pageSize: pageSize.toString(),
      orderType,
    });

    if (divisionName) {
      queryParams.append('divisionName', divisionName);
    }

    if (departmentName) {
      queryParams.append('departmentName', departmentName);
    }

    const data: GetDivision[] = await CallApi.getAll<GetDivision>(
      `division?${queryParams.toString()}`,
    );

    return data;
  },

  createdivision: async (newdivision: Division_DTO) => {
    const data = await CallApi.create<number>('division', newdivision);
    return data;
  },

  updatedivision: async (division: Division_DTO) => {
    const data = await CallApi.update<number>('division', division);
    return data;
  },

  deletedivision: async (Id: number): Promise<number> => {
    const data = await CallApi.delete<number>('division', Id);
    return data;
  },
};
