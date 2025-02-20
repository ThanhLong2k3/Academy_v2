import { message } from 'antd';

interface Document {
  DocumentFile?: File;
  DocumentLink?: string;
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
    if (doc.DocumentFile && !doc.DocumentLink) {
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
    if (doc.DocumentFile && !doc.DocumentLink) {
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
    const response = await fetch('/api/uploadfile', {
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
        if (doc.DocumentFile && !doc.DocumentLink) {
          updatedDocuments[index] = {
            ...doc,
            DocumentLink: result.uploadedPaths[uploadedIndex],
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

export async function uploadFilesImage(files: File[]): Promise<string[]> {
  const formData = new FormData();

  files.forEach((file, index) => {
    formData.append(`file${index}`, file);
  });

  try {
    const response = await fetch('/api/uploadfile', {
      method: 'POST',
      body: formData,
    });

    const data = await response.json();

    if (data.status === 'success') {
      return data.uploadedPaths;
    } else {
      throw new Error(data.error || 'Upload failed');
    }
  } catch (error) {
    console.error('Error uploading files:', error);
    throw error;
  }
}

export async function getInforFile(filePath: string) {
  if (!filePath) {
    throw new Error('Thiếu đường dẫn file');
  }

  try {
    const response = await fetch(
      `/api/uploadfile?path=${encodeURIComponent(filePath)}`,
      {
        method: 'GET',
      },
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Lấy thông tin file thất bại');
    }

    return {
      success: true,
      fileInfo: data, // Thông tin file trả về
    };
  } catch (error) {
    console.error('Lỗi khi lấy thông tin file:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Lỗi không xác định',
    };
  }
}
