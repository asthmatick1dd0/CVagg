import type { Resume } from '@/types/resume.types';
import { api } from '@/utils/api';

const getTokenQuery = () => {
    const token = localStorage.getItem("token");
    return token ? `&SignedString=${encodeURIComponent(token)}` : "";
};

export const resumeApi = {
    fetchResumes: async (userID: number): Promise<Resume[]> => {
        const response = await api.get(`/dashboard/resumes?user_id=${userID}${getTokenQuery()}`);
        return response.data;
    },
    fetchResumeById: async (id: string, userID: number): Promise<Resume> => {
        const response = await api.get<Resume>(`/editor/resume/${id}?user_id=${userID}${getTokenQuery()}`);
        return response.data;
    },
    saveResume: async (data: Partial<Resume>, userId: number): Promise<Resume> => {
        const response = await api.post(
            `/editor/resume?user_id=${userId}${getTokenQuery()}`,
            {
                ...data,
                user_id: userId,
            }
        );
        return response.data;
    },
    // на будущее! обновление существующего резюме
    updateResume: async (id: number, data: Partial<Resume>, userId: number): Promise<Resume> => {
        const response = await api.patch(
            `/editor/resume/${id}?user_id=${userId}${getTokenQuery()}`,
            { ...data, user_id: userId }
        );
        return response.data;
    }
};

