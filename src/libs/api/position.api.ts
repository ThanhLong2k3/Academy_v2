import { GetPosition, AddPosistion } from '../../models/position.model';
import { CallApi } from '@/libs/call_API';

export const PositionAPI = {
  getAllPosition: async () => {
    const data: GetPosition[] = await CallApi.getAll<GetPosition>('position');
    return data;
  },
  getPositionsByPageOrder: async (
    pageIndex: number,
    pageSize: number,
    orderType: 'ASC' | 'DESC',
  ) => {
    const data: GetPosition[] = await CallApi.getAll<GetPosition>(
      `position?pageIndex=${pageIndex}&pageSize=${pageSize}&orderType=${orderType}`,
    );
    return data;
  },

  createPosition: async (newPosition: AddPosistion) => {
    const data = await CallApi.create<number>('position', newPosition);
    return data;
  },

  updatePosition: async (position: GetPosition) => {
    const data = await CallApi.update<number>('position', position);
    return data;
  },

  deletePosition: async (Id: number): Promise<number> => {
    const data = await CallApi.delete<number>('position', Id);
    return data;
  },
};
