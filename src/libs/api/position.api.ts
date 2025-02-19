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
    positionName?: string,
  ) => {
    const queryParams = new URLSearchParams({
      pageIndex: pageIndex.toString(),
      pageSize: pageSize.toString(),
      orderType,
    });

    if (positionName) {
      queryParams.append('positionName', positionName);
    }

    const data: GetPosition[] = await CallApi.getAll<GetPosition>(
      `position?${queryParams.toString()}`,
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
