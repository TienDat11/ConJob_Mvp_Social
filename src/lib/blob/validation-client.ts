

import {
  ALLOWED_IMAGE_TYPES,
  FILE_SIZE_LIMITS,
} from './validation';


function formatBytes(bytes: number): string {
  const units = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));

  if (bytes === 0) return '0 Bytes';
  if (i === 0) return `${bytes} Bytes`;

  return `${Math.round(bytes / Math.pow(1024, i) * 100) / 100} ${units[i]}`;
}


function createValidationError(message: string): Error {
  const error = new Error(`Validation failed: ${message}`);
  error.name = 'ValidationError';
  return error;
}


export function validateFile(file: File): void {
  const errors: string[] = [];


  if (file.size > FILE_SIZE_LIMITS.POST_IMAGE) {
    errors.push(
      `File size ${formatBytes(file.size)} exceeds maximum ${formatBytes(FILE_SIZE_LIMITS.POST_IMAGE)}`
    );
  }


  if (
    file.type &&
    file.type !== 'application/octet-stream' &&
    !ALLOWED_IMAGE_TYPES.includes(
      file.type as (typeof ALLOWED_IMAGE_TYPES)[number]
    )
  ) {
    errors.push(
      `Invalid MIME type: ${file.type}. Only ${ALLOWED_IMAGE_TYPES.join(', ')} are allowed.`
    );
  }


  if (errors.length > 0) {
    throw createValidationError(errors.join('; '));
  }
}


export function validateFileByExtension(fileName: string): void {
  const ext = fileName.toLowerCase().split('.').pop();
  const allowedExtensions = ['jpg', 'jpeg', 'png', 'webp'];

  if (!ext || !allowedExtensions.includes(ext)) {
    throw createValidationError(
      `Invalid file extension: .${ext}. Only ${allowedExtensions.join(', ')} are allowed.`
    );
  }
}
