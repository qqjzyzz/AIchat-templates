import mammoth from 'mammoth';
import { logger } from '@/utils/logger';

export const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

export class DocumentProcessor {
  static async processWordDocument(file: File): Promise<string> {
    try {
      if (file.size > MAX_FILE_SIZE) {
        throw new Error('File size exceeds the maximum limit of 10MB');
      }

      if (!file.name.toLowerCase().endsWith('.docx')) {
        throw new Error('Only .docx files are supported');
      }

      const arrayBuffer = await file.arrayBuffer();
      const result = await mammoth.extractRawText({ arrayBuffer });
      
      if (result.messages.length > 0) {
        logger.warn('Warnings during document processing', result.messages);
      }

      return result.value;
    } catch (error) {
      logger.error('Error processing Word document', error);
      throw error;
    }
  }

  static validateFileSize(file: File): boolean {
    return file.size <= MAX_FILE_SIZE;
  }

  static validateFileType(file: File): boolean {
    return file.name.toLowerCase().endsWith('.docx');
  }
}

export interface ProcessedDocument {
  id: string;
  filename: string;
  content: string;
  timestamp: string;
} 