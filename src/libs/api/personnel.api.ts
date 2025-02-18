import { GetPersonnel_DTO, Personnel_DTO } from '../../models/personnel.model';
import { CallApi } from '@/libs/call_API';

export const PersonnelAPI = {
  getPersonnelsByPageOrder: async (
    pageIndex: number,
    pageSize: number,
    orderType: 'ASC' | 'DESC',
  ) => {
    const data: GetPersonnel_DTO[] = await CallApi.getAll<GetPersonnel_DTO>(
      `personnel?pageIndex=${pageIndex}&pageSize=${pageSize}&orderType=${orderType}`,
    );
    return data;
  },

  createPersonnel: async (personnel: Personnel_DTO) => {
    const data = await CallApi.create<number>('personnel', personnel);
    return data;
  },

  updatePersonnel: async (personnel: Personnel_DTO) => {
    const data = await CallApi.update<number>('personnel', personnel);
    return data;
  },

  deletePersonnel: async (Id: number): Promise<number> => {
    const data = await CallApi.delete<number>('personnel', Id);
    return data;
  },
};
