import { useState, useCallback } from 'react';
import { pdf } from '@react-pdf/renderer';
import { saveAs } from 'file-saver';
import type { Resume } from '@/types/resume.types';
import ResumeDocumentRenderer from '@/components/pdf/ResumeDocumentRenderer';

interface ExportOptions {
  filename?: string;
  asZip?: boolean;
  resumeId?: string | number;
  avatarBase64?: string | null;
}

interface UseExportResumeReturn {
  exportResume: (resumeData: Partial<Resume>, options?: ExportOptions) => Promise<void>;
  isExporting: boolean;
  error: string | null;
  currentFile: string | null;
  clearError: () => void;
}

export function useExportResume(): UseExportResumeReturn {
  const [isExporting, setIsExporting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentFile, setCurrentFile] = useState<string | null>(null);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Helper: Load avatar from localStorage
  const loadAvatarFromStorage = useCallback((resumeId?: string | number): string | null => {
    if (!resumeId) return null;
    const savedAvatar = localStorage.getItem(`avatar_${resumeId}`);
    return savedAvatar || null;
  }, []);

  // Helper: Convert external URL to Base64
  const convertImageToBase64 = useCallback(async (imageUrl: string): Promise<string | null> => {
    try {
      const response = await fetch(imageUrl);
      if (!response.ok) throw new Error(`Failed to fetch image: ${response.status}`);
      
      const blob = await response.blob();
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          resolve(reader.result as string);
        };
        reader.onerror = () => {
          console.error('Failed to convert image to Base64');
          resolve(null);
        };
        reader.readAsDataURL(blob);
      });
    } catch (error) {
      console.error('Error converting image:', error);
      return null;
    }
  }, []);

  // Generate filename
  const generateFilename = (resumeData: Partial<Resume>, customName?: string): string => {
    if (customName) return customName;
    
    const name = resumeData.personalInfo?.name || '';
    const surname = resumeData.personalInfo?.surname || '';
    const jobTitle = resumeData.personalInfo?.jobTitle || 'resume';
    
    if (name || surname) {
      return `${name}_${surname}_${jobTitle}_CV`.replace(/\s+/g, '_').replace(/_+/g, '_');
    }
    
    return `${jobTitle}_CV`.replace(/\s+/g, '_');
  };

  // Generate PDF with avatar
  const generatePdfBlob = async (
    resumeData: Partial<Resume>, 
    avatarBase64?: string | null
  ): Promise<Blob> => {
    const doc = <ResumeDocumentRenderer data={resumeData} avatarBase64={avatarBase64} />;
    return await pdf(doc).toBlob();
  };

  // Export single resume with avatar support
  const exportResume = useCallback(async (
    resumeData: Partial<Resume>, 
    options?: ExportOptions
  ): Promise<void> => {
    setIsExporting(true);
    setError(null);
    setCurrentFile(null);

    try {
      let avatarBase64: string | null = options?.avatarBase64 ?? null;
      
      // Method 1: Load from localStorage using resumeId
      if (!avatarBase64 && options?.resumeId) {
        avatarBase64 = loadAvatarFromStorage(options.resumeId);
      }

      // Method 2: If resume data already contains a data URL, use it directly
      if (!avatarBase64 && resumeData.personalInfo?.avatar?.startsWith?.('data:')) {
        avatarBase64 = resumeData.personalInfo.avatar;
      }
      
      // Method 3: If avatar URL exists in resume data, convert it to base64
      if (!avatarBase64 && resumeData.personalInfo?.avatar) {
        avatarBase64 = await convertImageToBase64(resumeData.personalInfo.avatar);
      }
      
      // Generate PDF with avatar
      const blob = await generatePdfBlob(resumeData, avatarBase64);
      const filename = generateFilename(resumeData, options?.filename);
      
      setCurrentFile(filename);
      saveAs(blob, `${filename}.pdf`);
      
    } catch (err) {
      console.error('Export error:', err);
      setError(err instanceof Error ? err.message : 'Ошибка при экспорте резюме');
      throw err;
    } finally {
      setIsExporting(false);
      setCurrentFile(null);
    }
  }, [loadAvatarFromStorage, convertImageToBase64]);

  return {
    exportResume,
    isExporting,
    error,
    currentFile,
    clearError,
  };
}