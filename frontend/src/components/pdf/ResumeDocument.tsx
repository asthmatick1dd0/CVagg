import type { Resume } from "@/types/resume.types";

export const categoryOrder = [
  "Frontend",
  "Backend", 
  "Базы данных",
  "DevOps",
  "Облако",
  "Мобильная разработка",
  "ИИ/ML",
  "Дата-инженерия",
  "Безопасность",
  "Тестирование",
  "Инструменты",
  "Архитектура",
  "Дизайн",
  "Софт-скиллы",
  "Сети",
  "Системное программирование",
  "Другое"
];

export const getAdaptiveNameFontSize = (fullName: string | null | undefined): number => {
  const len = fullName?.length || 0;
  return len > 26 ? 12 : len > 21 ? 14 : len > 18 ? 18 : len > 16 ? 21 : 24;
};

export const formatDate = (isoStr: string | null | undefined): string => {
  if (!isoStr) return "Настоящее время";
  try {
    const date = new Date(isoStr);
    if (isNaN(date.getTime())) return isoStr;
    const months = [
      "Янв", "Фев", "Мар", "Апр", "Май", "Июн",
      "Июл", "Авг", "Сен", "Окт", "Ноя", "Дек"
    ];
    return `${months[date.getMonth()]} ${date.getFullYear()}`;
  } catch {
    return isoStr;
  }
};

export interface ResumeDocumentProps {
  data: Partial<Resume>;
  avatarBase64?: string | null;
}

export type TemplateId = 'minimal';