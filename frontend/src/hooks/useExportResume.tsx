import { useState, useCallback } from "react";
import { pdf } from "@react-pdf/renderer";
import { saveAs } from "file-saver";
import type { Resume } from "@/types/resume.types";
import type { TemplateId } from "@/components/pdf/ResumeDocument";
import ResumeDocumentRenderer from "@/components/pdf/ResumeDocumentRenderer";
import { getStoredResumeTemplateId } from "@/utils/resumeTemplateStorage";

interface ExportOptions {
  filename?: string;
  asZip?: boolean;
  resumeId?: string | number;
  avatarBase64?: string | null;
  templateId?: TemplateId;
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

  const convertImageToBase64 = useCallback(async (imageUrl: string): Promise<string | null> => {
    try {
      const response = await fetch(imageUrl);
      if (!response.ok) {
        throw new Error(`Failed to fetch image: ${response.status}`);
      }

      const blob = await response.blob();

      return await new Promise((resolve) => {
        const reader = new FileReader();

        reader.onloadend = () => {
          resolve(reader.result as string);
        };

        reader.onerror = () => {
          console.error("Failed to convert image to Base64");
          resolve(null);
        };

        reader.readAsDataURL(blob);
      });
    } catch (error) {
      console.error("Error converting image:", error);
      return null;
    }
  }, []);

  const generateFilename = (resumeData: Partial<Resume>, customName?: string): string => {
    if (customName) return customName;

    const name = resumeData.personalInfo?.name || "";
    const surname = resumeData.personalInfo?.surname || "";
    const jobTitle = resumeData.personalInfo?.jobTitle || "resume";

    if (name || surname) {
      return `${name}_${surname}_${jobTitle}_CV`
        .replace(/\s+/g, "_")
        .replace(/_+/g, "_");
    }

    return `${jobTitle}_CV`
      .replace(/\s+/g, "_")
      .replace(/_+/g, "_");
  };

  const resolveExportTemplateId = (
    resumeData: Partial<Resume>,
    options?: ExportOptions
  ): TemplateId => {
    if (options?.templateId) {
      return options.templateId;
    }
    const resumeId = options?.resumeId ?? resumeData.id ?? resumeData.ID;
    const storedTemplateId = getStoredResumeTemplateId(resumeId);
    if (storedTemplateId) {
      return storedTemplateId;
    }
    return "minimal";
  };

  const generatePdfBlob = async (
    resumeData: Partial<Resume>,
    avatarBase64?: string | null,
    templateId: TemplateId = "minimal"
  ): Promise<Blob> => {
    const doc = (
      <ResumeDocumentRenderer
        data={resumeData}
        avatarBase64={avatarBase64}
        templateId={templateId}
      />
    );

    return await pdf(doc).toBlob();
  };

  const exportResume = useCallback(async (
    resumeData: Partial<Resume>,
    options?: ExportOptions
  ): Promise<void> => {
    setIsExporting(true);
    setError(null);
    setCurrentFile(null);

    try {
      const templateId = resolveExportTemplateId(resumeData, options);

      let avatarBase64: string | null = options?.avatarBase64 ?? null;

      // 1. already base64 in resume data
      if (!avatarBase64 && resumeData.personalInfo?.avatar?.startsWith?.("data:")) {
        avatarBase64 = resumeData.personalInfo.avatar;
      }

      // 2. external URL → base64
      if (!avatarBase64 && resumeData.personalInfo?.avatar) {
        avatarBase64 = await convertImageToBase64(resumeData.personalInfo.avatar);
      }

      const blob = await generatePdfBlob(resumeData, avatarBase64, templateId);
      const filename = generateFilename(resumeData, options?.filename);

      setCurrentFile(filename);
      saveAs(blob, `${filename}.pdf`);
    } catch (err) {
      console.error("Export error:", err);
      setError(err instanceof Error ? err.message : "Ошибка при экспорте резюме");
      throw err;
    } finally {
      setIsExporting(false);
      setCurrentFile(null);
    }
  }, [convertImageToBase64]);

  return {
    exportResume,
    isExporting,
    error,
    currentFile,
    clearError,
  };
}
