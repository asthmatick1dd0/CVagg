import { getSkillName } from '@/constants/skills';
import type { AIResponse } from '@/types/ai.types';
import type { Resume } from '@/types/resume.types';
import { api } from '@/utils/api';

const getTokenQuery = () => {
  const token = localStorage.getItem("token");
  return token ? `&SignedString=${encodeURIComponent(token)}` : "";
};

const extractText = (value: any): string => {
  if (!value) return '';
  if (typeof value === 'string') return value.trim();
  if (typeof value === 'object') {
    return JSON.stringify(value).replace(/[\{\}\[\]"]/g, ' ').replace(/\s+/g, ' ').trim(); 
  }
  return String(value).trim();
};

const extractSkills = (skills: any): string[] => {
  if (!skills) return [];
  if (typeof skills === 'string') {
    return skills.split(',').map(s => s.trim()).filter(Boolean);
  }
  if (Array.isArray(skills)) {
    return skills
      .map(skill => {
        if (typeof skill === 'string') return skill.trim();
        return `${getSkillName(skill?.SkillId || '')}`.trim();
      })
      .filter(Boolean);
  }
  return [];
};

export const aiApi = {
  analyzeResume: async (
    resumeId: string | number, 
    userId: number, 
    resumeData: Partial<Resume>
  ): Promise<AIResponse> => {
    
    const summary = extractText(resumeData?.personalInfo);

    let experienceText = '';

    if (Array.isArray(resumeData?.experience)) {
      experienceText = resumeData.experience
        .map((exp: any) => {
          const position = exp.position || '';
          const company = exp.company || '';
          const startDate = exp.start_date || '';
          const endDate = exp.end_date || '';
          return `${position} at ${company}\n from ${startDate} to ${endDate}`.trim();
        })
        .join('\n\n');
    } else {
      experienceText = extractText(resumeData?.experience);
    }

    const payload = {
      mode: "resume_analyze" as const,
      resume: {
        summary: summary,
        experience: experienceText,
        skills: extractSkills(resumeData?.skills),
      },
    };

    console.log("Payload:", payload);

    const response = await api.post<AIResponse>(
      `/editor/resume/${resumeId}/analyze?user_id=${userId}${getTokenQuery()}`,
      payload
    );

    return response.data;
  },

  sendMessage: async (
    resumeId: string | number, 
    userId: number, 
    resumeData: Partial<Resume>,
    text: string
  ): Promise<AIResponse> => {
    
    const summary = extractText(resumeData?.personalInfo);

    let experienceText = '';

    if (Array.isArray(resumeData?.experience)) {
      experienceText = resumeData.experience
        .map((exp: any) => {
          const position = exp.position || '';
          const company = exp.company || '';
          const startDate = exp.start_date || '';
          const endDate = exp.end_date || '';
          return `${position} at ${company}\n from ${startDate} to ${endDate}`.trim();
        })
        .join('\n\n');
    } else {
      experienceText = extractText(resumeData?.experience);
    }

    const payload = {
      mode: "answer" as const,
      question: text,
      resume: {
        summary: summary,
        experience: experienceText,
        skills: extractSkills(resumeData?.skills),
      },
    };

    console.log("Payload:", payload);

    const response = await api.post<AIResponse>(
      `/editor/resume/${resumeId}/analyze?user_id=${userId}${getTokenQuery()}`,
      payload
    );

    return response.data;
  }
}