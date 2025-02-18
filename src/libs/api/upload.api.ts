import { message } from 'antd';

interface Document {
  DocumentFile?: File;
  DocumentUrl?: string;
  [key: string]: any;
}

interface UploadResult {
  success: boolean;
  documents: Document[];
  uploadedPaths?: string[];
  error?: string;
}

export const uploadFile = async (
  documents: Document[],
): Promise<UploadResult> => {
  if (documents.length === 0) {
    return {
      success: false,
      documents: [],
      error: 'No documents to upload',
    };
  }

  const formData = new FormData();
  let hasFiles = false;
  let filesCount = 0;

  // Count files that need uploading
  documents.forEach((doc) => {
    if (doc.DocumentFile && !doc.DocumentUrl) {
      filesCount++;
    }
  });

  if (filesCount === 0) {
    return {
      success: true,
      documents,
      uploadedPaths: [],
    };
  }

  // Append files to FormData
  documents.forEach((doc, index) => {
    if (doc.DocumentFile && !doc.DocumentUrl) {
      formData.append(`file_${index}`, doc.DocumentFile);
      hasFiles = true;
    }
  });

  if (!hasFiles) {
    return {
      success: true,
      documents,
      uploadedPaths: [],
    };
  }

  try {
    const response = await fetch('/api/uploadImage', {
      method: 'POST',
      body: formData,
    });

    const result = await response.json();

    if (result.status === 'success' && result.uploadedPaths) {
      // Create a copy of documents to modify
      const updatedDocuments = [...documents];
      let uploadedIndex = 0;

      // Update documents with new URLs
      updatedDocuments.forEach((doc, index) => {
        if (doc.DocumentFile && !doc.DocumentUrl) {
          updatedDocuments[index] = {
            ...doc,
            DocumentUrl: result.uploadedPaths[uploadedIndex],
          };
          uploadedIndex++;
        }
      });

      return {
        success: true,
        documents: updatedDocuments,
        uploadedPaths: result.uploadedPaths,
      };
    } else {
      message.error('File upload failed');
      return {
        success: false,
        documents,
        error: 'Upload failed: Invalid server response',
      };
    }
  } catch (error) {
    console.error('Error uploading files:', error);
    message.error('Error uploading files');
    return {
      success: false,
      documents,
      error: error instanceof Error ? error.message : 'Unknown upload error',
    };
  }
};
