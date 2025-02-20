import { Add_Document_DTO, Up_Document_DTO } from '@/models/document.model';

import { CallApi } from '@/libs/call_API';

export const documentAPI = {
  getAlldocument: async () => {
    const data: Up_Document_DTO[] =
      await CallApi.getAll<Up_Document_DTO>('document');
    return data;
  },
  GetDocuments_by_IdRelated: async (relatedId: number, relatedType: string) => {
    const queryParams = new URLSearchParams({
      relatedId: relatedId.toString(),
      relatedType: relatedType.toString(),
    });

    const data: Up_Document_DTO[] = await CallApi.getAll<Up_Document_DTO>(
      `document?${queryParams.toString()}`,
    );
    if (relatedType) {
      queryParams.append('relatedType', relatedType);
    }
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
