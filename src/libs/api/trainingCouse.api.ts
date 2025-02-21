import { CallApi } from '@/libs/call_API';
import {
  AddTrainingCourse,
  GetTrainingCourse,
  UpTrainingCourse,
} from '@/models/trainingCourse.api';
export const trainingCouseAPI = {
  gettrainingCousesByPageOrder: async (
    pageIndex: number,
    pageSize: number,
    orderType: 'ASC' | 'DESC',
    trainingCouseName?: string,
  ) => {
    const queryParams = new URLSearchParams({
      pageIndex: pageIndex.toString(),
      pageSize: pageSize.toString(),
      orderType,
    });

    if (trainingCouseName) {
      queryParams.append('trainingCouseName', trainingCouseName);
    }

    const data: GetTrainingCourse[] = await CallApi.getAll<GetTrainingCourse>(
      `trainingCouse?${queryParams.toString()}`,
    );

    return data;
  },

  createtrainingCouse: async (newtrainingCouse: AddTrainingCourse) => {
    const data = await CallApi.create<number>(
      'trainingCouse',
      newtrainingCouse,
    );
    return data;
  },

  updatetrainingCouse: async (trainingCouse: UpTrainingCourse) => {
    const data = await CallApi.update<number>('trainingCouse', trainingCouse);
    return data;
  },

  deletetrainingCouse: async (Id: number): Promise<number> => {
    const data = await CallApi.delete<number>('trainingCouse', Id);
    return data;
  },
};
