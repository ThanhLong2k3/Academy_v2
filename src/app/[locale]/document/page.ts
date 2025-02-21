import { documentAPI } from '@/libs/api/document.api';
import { Up_Document_DTO } from '@/models/document.model';
import { useCallback } from 'react';

export const useAddDocuments = () => {
  const addDocuments = useCallback(
    async (RelatedType: string, RelatedId: number, uploadedDocuments: any) => {
      const newDocuments = uploadedDocuments.filter((doc: any) => !doc.Id);
      //RelatedType = Product,Topic,Project
      if (newDocuments.length > 0) {
        for (const doc of newDocuments) {
          await documentAPI.createdocument({
            DocumentName: doc.DocumentName,
            DocumentLink: doc.DocumentLink,
            RelatedId: RelatedId,
            RelatedType: RelatedType,
          });
        }
      }
    },
    [],
  );

  return { addDocuments };
};

export const useUpdateDocuments = () => {
  const updateDocuments = useCallback(
    async (documentupload: any[], documentAfter: any[]) => {
      // Chỉ lấy những tài liệu có ID hợp lệ và bị thay đổi
      const updatedDataDocuments = documentupload.filter(
        (doc) =>
          doc.Id && // Đảm bảo có Id
          !documentAfter.some(
            (newDoc) =>
              newDoc.Id === doc.Id && // So sánh theo Id để tránh cập nhật trùng lặp
              newDoc.DocumentName === doc.DocumentName &&
              newDoc.DocumentLink === doc.DocumentLink,
          ),
      );

      if (updatedDataDocuments.length > 0) {
        await Promise.all(
          updatedDataDocuments.map((doc) => documentAPI.updatedocument(doc)),
        );
      }
    },
    [],
  );

  return { updateDocuments };
};
