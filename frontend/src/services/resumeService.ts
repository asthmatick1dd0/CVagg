import type { Resume } from '@/types/types';
import { api } from '@/utils/api';

export const resumeApi = {
    fetchResumes: async (userID: number = 1): Promise<Resume[]> => {
        const response = await api.get(`/dashboard/resumes?user_id=${userID}`);
        return response.data;
    },
    fetchResumeById: async (id: string, userID: number = 1): Promise<Resume> => {
        const response = await api.get<Resume>(`/resumes/:${id}?user_id=${userID}`);
        return response.data;
    },
};

