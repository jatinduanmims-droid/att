export interface AttestationRecord {
  id: string;
  fileName: string;
  fileType: string;
  attestationType: string;
  year: number;
  uploadedBy: string;
  uploadDate: string;
  fileSize: string;
  fileSizeBytes: number;
  status: 'Submitted';
  remarks: string;
  dataUrl?: string;
}
