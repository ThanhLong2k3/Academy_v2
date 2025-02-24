import { IStatistics } from '@/models/boasBoard.model';
import { CallApi } from '@/libs/call_API';

export const doashBoardAPI = {
  getAlldoashBoard: async () => {
    const data: IStatistics[] = await CallApi.getAll<IStatistics>('doashBoard');
    return data;
  },
};
