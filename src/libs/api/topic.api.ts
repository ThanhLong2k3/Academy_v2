import { GetTopic, AddTopic, UpTopic } from '@/models/topic.model';
import { CallApi } from '@/libs/call_API';

export const topicAPI = {
  gettopicsByPageOrder: async (
    pageIndex: number,
    pageSize: number,
    orderType: 'ASC' | 'DESC',
    topicName?: string,
  ) => {
    const queryParams = new URLSearchParams({
      pageIndex: pageIndex.toString(),
      pageSize: pageSize.toString(),
      orderType,
    });

    if (topicName) {
      queryParams.append('topicName', topicName);
    }

    const data: GetTopic[] = await CallApi.getAll<GetTopic>(
      `topic?${queryParams.toString()}`,
    );

    return data;
  },

  createtopic: async (newtopic: AddTopic) => {
    const data = await CallApi.create<number>('topic', newtopic);
    return data;
  },

  updatetopic: async (topic: UpTopic) => {
    const data = await CallApi.update<number>('topic', topic);
    return data;
  },

  deletetopic: async (Id: number): Promise<number> => {
    const data = await CallApi.delete<number>('topic', Id);
    return data;
  },
};
