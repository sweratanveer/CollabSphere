// This file defines the TypeScript interfaces for uploaded file data.
export interface FileProjectRef {
  id: string;
  projectName: string;
}

export interface FileUploaderRef {
  id: string;
  fullName: string;
}

export interface ProjectFile {
  id: string;
  originalName: string;
  storedName: string;
  mimeType: string;
  sizeBytes: number;
  path: string;
  project: FileProjectRef;
  uploadedBy: FileUploaderRef;
  createdAt: string;
}