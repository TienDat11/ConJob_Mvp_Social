

import { type PutBlobResult } from '@vercel/blob';


export interface BlobClientConfig {
  token?: string;
  storeId?: string;
}


export function validateEnvironment(): void {
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    throw new Error(
      'Missing BLOB_READ_WRITE_TOKEN environment variable. ' +
        'Please create a Vercel Blob store and connect it to your project.'
    );
  }
}


export function getReadWriteToken(): string {
  return process.env.BLOB_READ_WRITE_TOKEN || '';
}


export const blobClientConfig: BlobClientConfig = {
  token: getReadWriteToken(),
};


export function extractStoreId(url: string): string | null {
  const match = url.match(/([a-z0-9]{32})\.public\.blob\.vercel-storage\.com/);
  return match ? match[1] : null;
}


export function isTrustedBlobUrl(url: string): boolean {
  const storeId = extractStoreId(url);
  return storeId !== null;
}


export function extractPathname(url: string): string {
  try {
    const urlObj = new URL(url);
    return urlObj.pathname.slice(1);
  } catch {
    throw new Error(`Invalid blob URL: ${url}`);
  }
}


export interface UploadOptions {
  cacheControlMaxAge?: number;
  addRandomSuffix?: boolean;
  abortSignal?: AbortSignal;
}

export interface UploadProgress {
  loaded: number;
  total: number;
  percentage: number;
}

export type UploadResult = PutBlobResult;


export enum BlobErrorType {
  VALIDATION_FAILED = 'VALIDATION_FAILED',
  UPLOAD_FAILED = 'UPLOAD_FAILED',
  SIZE_LIMIT_EXCEEDED = 'SIZE_LIMIT_EXCEEDED',
  TYPE_NOT_ALLOWED = 'TYPE_NOT_ALLOWED',
  NETWORK_ERROR = 'NETWORK_ERROR',
  RATE_LIMIT_EXCEEDED = 'RATE_LIMIT_EXCEEDED',
  QUOTA_EXCEEDED = 'QUOTA_EXCEEDED',
}

export interface BlobError {
  type: BlobErrorType;
  message: string;
  userMessage?: string;
  originalError?: Error;
}
