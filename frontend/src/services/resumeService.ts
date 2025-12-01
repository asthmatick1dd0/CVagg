import axios from 'axios';
import type { Resume } from '@/types/resume.types';

const api = axios.create({
    baseURL: '/api/v1',
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
});

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

