import { Add_Document_DTO, Up_Document_DTO } from '@/models/document.model';

import { CallApi } from '@/libs/call_API';

export const documentAPI = {
  getAlldocument: async () => {
    const data: Up_Document_DTO[] =
      await CallApi.getAll<Up_Document_DTO>('document');
    return data;
  },
  getdocumentsByPageOrder: async (
    pageIndex: number,
    pageSize: number,
    orderType: 'ASC' | 'DESC',
    documentName?: string,
  ) => {
    const queryParams = new URLSearchParams({
      pageIndex: pageIndex.toString(),
      pageSize: pageSize.toString(),
      orderType,
    });

    if (documentName) {
      queryParams.append('documentName', documentName);
    }

    const data: Up_Document_DTO[] = await CallApi.getAll<Up_Document_DTO>(
      `document?${queryParams.toString()}`,
    );

    return data;
  },

  createdocument: async (newdocument: Add_Document_DTO) => {
    const data = await CallApi.create<number>('document', newdocument);
    return data;
  },

  updatedocument: async (document: Up_Document_DTO) => {
    const data = await CallApi.update<number>('document', document);
    return data;
  },

  deletedocument: async (Id: number): Promise<number> => {
    const data = await CallApi.delete<number>('document', Id);
    return data;
  },
};
