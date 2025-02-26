import { documentAPI } from '@/libs/api/document.api';
import { Up_Document_DTO } from '@/models/document.model';
import { useCallback } from 'react';
interface NewDocumentDTO {
  DocumentName: string;
  DocumentLink: string;
}

export const useAddDocuments = () => {
  const addDocuments = useCallback(
    async (
      relatedType: string,
      relatedId: number,
      uploadedDocuments: NewDocumentDTO[],
    ) => {
      const newDocuments = uploadedDocuments.filter((doc) => !('Id' in doc)); // Kiểm tra không có Id
      if (newDocuments.length === 0) return { success: true, failedDocs: [] };

      const results = await Promise.all(
        newDocuments.map(async (doc) => {
          try {
            await documentAPI.createdocument({
              DocumentName: doc.DocumentName,
              DocumentLink: doc.DocumentLink,
              RelatedId: relatedId,
              RelatedType: relatedType,
            });
            return { success: true, document: doc };
          } catch (error) {
            console.error(`Failed to add document ${doc.DocumentName}:`, error);
            return { success: false, document: doc };
          }
        }),
      );

      const failedDocs = results
        .filter((r) => !r.success)
        .map((r) => r.document);
      return { success: failedDocs.length === 0, failedDocs };
    },
    [],
  );

  return { addDocuments };
};

export const useUpdateDocuments = () => {
  const updateDocuments = useCallback(
    async (
      documentUpload: Up_Document_DTO[],
      documentAfter: Up_Document_DTO[],
    ) => {
      const documentAfterCopy = [...documentAfter];
      const updatedDataDocuments = documentUpload.filter(
        (doc) =>
          doc.Id &&
          !documentAfterCopy.some(
            (oldDoc) =>
              oldDoc.Id === doc.Id &&
              oldDoc.DocumentName === doc.DocumentName &&
              oldDoc.DocumentLink === doc.DocumentLink,
          ),
      );

      if (updatedDataDocuments.length === 0)
        return { success: true, failedDocs: [] };

      const results = await Promise.all(
        updatedDataDocuments.map(async (doc) => {
          try {
            await documentAPI.updatedocument(doc);
            return { success: true, document: doc };
          } catch (error) {
            console.error(
              `Failed to update document ${doc.DocumentName}:`,
              error,
            );
            return { success: false, document: doc };
          }
        }),
      );

      const failedDocs = results
        .filter((r) => !r.success)
        .map((r) => r.document);
      return { success: failedDocs.length === 0, failedDocs };
    },
    [],
  );

  return { updateDocuments };
};
