import { CallApi } from '@/libs/call_API';
import {
  AddIntellectualProperty,
  UpIntellectualProperty,
  GetIntellectualProperty,
} from '@/models/IntellectualProperty.model';
export const IntellectualPropertyAPI = {
  getIntellectualPropertysByPageOrder: async (
    pageIndex: number,
    pageSize: number,
    orderType: 'ASC' | 'DESC',
    IntellectualPropertyName?: string,
  ) => {
    const queryParams = new URLSearchParams({
      pageIndex: pageIndex.toString(),
      pageSize: pageSize.toString(),
      orderType,
    });

    if (IntellectualPropertyName) {
      queryParams.append('intellectualPropertyName', IntellectualPropertyName);
    }

    const data: GetIntellectualProperty[] =
      await CallApi.getAll<GetIntellectualProperty>(
        `intellectualProperty?${queryParams.toString()}`,
      );

    return data;
  },

  createIntellectualProperty: async (
    newIntellectualProperty: AddIntellectualProperty,
  ) => {
    const data = await CallApi.create<number>(
      'intellectualProperty',
      newIntellectualProperty,
    );
    return data;
  },

  updateIntellectualProperty: async (
    IntellectualProperty: UpIntellectualProperty,
  ) => {
    const data = await CallApi.update<number>(
      'intellectualProperty',
      IntellectualProperty,
    );
    return data;
  },

  deleteIntellectualProperty: async (Id: number): Promise<number> => {
    const data = await CallApi.delete<number>('intellectualProperty', Id);
    return data;
  },
};
