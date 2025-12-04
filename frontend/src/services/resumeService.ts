import type { Resume } from '@/types/types';
import { api } from '@/utils/api';

export const resumeApi = {
    fetchResumes: async (userID: number = 1): Promise<Resume[]> => {
        const response = await api.get(`/dashboard/resumes?user_id=${userID}`);
        return response.data;
    },
    fetchResumeById: async (id: string, userID: number = 1): Promise<Resume> => {
        const response = await api.get<Resume>(`/dashboard/resumes/:${id}?user_id=${userID}`);
        return response.data;
    },
    saveResume: async (data: Partial<Resume>, userID: number = 1): Promise<Resume> => {
        const response = await api.post<Resume>(`/editor/save?user_id=${userID}`, data);
        return response.data;
    },
    updateResume: async (id: string, data: Partial<Resume>, userID: number = 1): Promise<Resume> => {
        const response = await api.patch<Resume>(`/editor/:${id}/save?user_id=${userID}`, data);
        return response.data;
    },
};

