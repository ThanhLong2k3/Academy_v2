import {
  Get_Services,
  Update_Services,
  Add_Services,
} from '../../models/services.model';
import { CallApi } from '@/libs/call_API';

export const servicesAPI = {
  getAllservices: async () => {
    const data: Get_Services[] = await CallApi.getAll<Get_Services>('services');
    return data;
  },
  getservicessByPageOrder: async (
    pageIndex: number,
    pageSize: number,
    orderType: 'ASC' | 'DESC',
    servicesName?: string,
  ) => {
    const queryParams = new URLSearchParams({
      pageIndex: pageIndex.toString(),
      pageSize: pageSize.toString(),
      orderType,
    });

    if (servicesName) {
      queryParams.append('serviceName', servicesName);
    }

    const data: Get_Services[] = await CallApi.getAll<Get_Services>(
      `services?${queryParams.toString()}`,
    );

    return data;
  },

  createservices: async (newservices: Add_Services) => {
    const data = await CallApi.create<number>('services', newservices);
    return data;
  },

  updateservices: async (services: Update_Services) => {
    const data = await CallApi.update<number>('services', services);
    return data;
  },

  deleteservices: async (Id: number): Promise<number> => {
    const data = await CallApi.delete<number>('services', Id);
    return data;
  },
};
