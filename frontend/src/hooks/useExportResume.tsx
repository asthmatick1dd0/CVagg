import { useState, useCallback } from 'react';
import { pdf } from '@react-pdf/renderer';
import { saveAs } from 'file-saver';
import type { Resume } from '@/types/resume.types';
import { resumeApi } from '@/services/resumeService';
import ResumeDocument from '@/components/pdf/ResumeDocument';
import JSZip from 'jszip';

interface ExportOptions {
  filename?: string;
  asZip?: boolean;
}

interface UseExportResumeReturn {
  exportResume: (resumeData: Partial<Resume>, options?: ExportOptions) => Promise<void>;
  exportMultipleResumes: (resumeIds: number[], userId: number, options?: ExportOptions) => Promise<void>;
  
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

  // Генерация имени файла
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

  // Генерация одного PDF
  const generatePdfBlob = async (resumeData: Partial<Resume>): Promise<Blob> => {
    const doc = <ResumeDocument data={resumeData} />;
    return await pdf(doc).toBlob();
  };

  // Экспорт одного резюме по данным
  const exportResume = useCallback(async (
    resumeData: Partial<Resume>, 
    options?: ExportOptions
  ): Promise<void> => {
    setIsExporting(true);
    setError(null);
    setCurrentFile(null);

    try {
      const blob = await generatePdfBlob(resumeData);
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
  }, []);

  // Экспорт нескольких резюме (пока не рабочий...........)
  const exportMultipleResumes = useCallback(async (
  resumeIds: number[], 
  userId: number, 
  options?: ExportOptions
): Promise<void> => {
  setIsExporting(true);
  setError(null);
  setCurrentFile(null);

  try {
    const zip = new JSZip();
    const total = resumeIds.length;

    for (let i = 0; i < total; i++) {
      const resumeId = resumeIds[i];
      const resume = await resumeApi.fetchResumeById(String(resumeId), userId);
      const resumeData = {
        ...resume,
      };
      console.log('Fetched resume for export:', resumeData);
      const blob = await generatePdfBlob(resumeData);
      const filename = generateFilename(resumeData, `${options?.filename || 'resume'}_${resumeId}`);
      console.log(`Generated PDF for resume ID ${resumeId} with filename: ${filename}.pdf`);
      zip.file(`${filename}.pdf`, blob);
    }

    const zipBlob = await zip.generateAsync({ type: 'blob' });
    saveAs(zipBlob, `${options?.filename || 'resumes'}.zip`);

  } catch (err) {
    console.error('Export multiple error:', err);
    setError(err instanceof Error ? err.message : 'Ошибка при экспорте нескольких резюме');
    throw err;
  } finally {
    setIsExporting(false);
    setCurrentFile(null);
  }
}, []);
  return {
    exportResume,
    exportMultipleResumes,
    isExporting,
    error,
    currentFile,
    clearError,
  };
}

