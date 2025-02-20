import {
  AddPersonnel,
  UpPersonnel,
  GetPersonnel,
} from '@/models/persionnel.model';
import { CallApi } from '@/libs/call_API';

export const personnelAPI = {
  getpersonnelsByPageOrder: async (
    pageIndex: number,
    pageSize: number,
    orderType: 'ASC' | 'DESC',
    personnelName?: string,
  ) => {
    const queryParams = new URLSearchParams({
      pageIndex: pageIndex.toString(),
      pageSize: pageSize.toString(),
      orderType,
    });

    if (personnelName) {
      queryParams.append('personnelName', personnelName);
    }

    const data: GetPersonnel[] = await CallApi.getAll<GetPersonnel>(
      `personnel?${queryParams.toString()}`,
    );

    return data;
  },

  createpersonnel: async (newpersonnel: AddPersonnel) => {
    const data = await CallApi.create<number>('personnel', newpersonnel);
    return data;
  },

  updatepersonnel: async (personnel: UpPersonnel) => {
    const data = await CallApi.update<number>('personnel', personnel);
    return data;
  },

  deletepersonnel: async (Id: number): Promise<number> => {
    const data = await CallApi.delete<number>('personnel', Id);
    return data;
  },
};
