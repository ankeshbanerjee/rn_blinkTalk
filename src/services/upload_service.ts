import axios from 'axios';
import {FileUploadResponse} from '../models/FileResponse';

export const uploadSingleFile = (formData: FormData) =>
  axios.post<FileUploadResponse>('/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
