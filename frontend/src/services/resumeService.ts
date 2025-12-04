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
        const response = await api.get<Resume>(`/resumes/${id}?user_id=${userID}${getTokenQuery()}`);
        return response.data;
    },
};

