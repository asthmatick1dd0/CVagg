import { TEMPLATE_IDS, type TemplateId } from "@/components/pdf/ResumeDocument";

const TEMPLATE_STORAGE_PREFIX = "resume_template_";

const isTemplateId = (value: string | null): value is TemplateId => {
  return value !== null && TEMPLATE_IDS.includes(value as TemplateId);
};

const isValidResumeId = (resumeId?: string | number | null) => {
  return !(
    resumeId === null ||
    resumeId === undefined ||
    resumeId === "" ||
    resumeId === "0" ||
    resumeId === "undefined"
  );
};

export const getStoredResumeTemplateId = (
  resumeId?: string | number | null
): TemplateId | null => {
  if (!isValidResumeId(resumeId)) return null;
  if (typeof window === "undefined") return null;

  try {
    const value = localStorage.getItem(`${TEMPLATE_STORAGE_PREFIX}${resumeId}`);
    return isTemplateId(value) ? value : null;
  } catch {
    return null;
  }
};

export const setStoredResumeTemplateId = (
  resumeId?: string | number | null,
  templateId?: TemplateId
) => {
  if (!isValidResumeId(resumeId)) return;
  if (!templateId || typeof window === "undefined") return;

  try {
    localStorage.setItem(`${TEMPLATE_STORAGE_PREFIX}${resumeId}`, templateId);
  } catch {}
};