export interface FileUploadResponse {
  result: File;
  success: boolean;
  message: string;
}

export interface File {
  fileUrl: string;
  extension: string;
}
