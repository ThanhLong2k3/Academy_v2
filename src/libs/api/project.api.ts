import type {
  Add_project,
  Get_project,
  Up_project,
} from '@/models/project.model';

import { CallApi } from '@/libs/call_API';

export const projectAPI = {
  getAllproject: async () => {
    const data: Get_project[] = await CallApi.getAll<Get_project>('project');
    return data;
  },
  getprojectsByPageOrder: async (
    pageIndex: number,
    pageSize: number,
    orderType: 'ASC' | 'DESC',
    projectName?: string,
  ) => {
    const queryParams = new URLSearchParams({
      pageIndex: pageIndex.toString(),
      pageSize: pageSize.toString(),
      orderType,
    });

    if (projectName) {
      queryParams.append('projectName', projectName);
    }

    const data: Get_project[] = await CallApi.getAll<Get_project>(
      `project?${queryParams.toString()}`,
    );

    return data;
  },

  createproject: async (newproject: Add_project) => {
    const data = await CallApi.create<number>('project', newproject);
    return data;
  },

  updateproject: async (project: Up_project) => {
    const data = await CallApi.update<number>('project', project);
    return data;
  },

  deleteproject: async (Id: number): Promise<number> => {
    const data = await CallApi.delete<number>('project', Id);
    return data;
  },
};
