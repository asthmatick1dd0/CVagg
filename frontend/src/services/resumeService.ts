import axios from 'axios';
import type { Resume } from '@/types/resume.types';

const api = axios.create({
    baseURL: 'https://localhost:8080/api',
    headers: {
        'Content-Type': 'application/json',
    },
});

export const resumeApi = {
    fetchResumes: async (): Promise<Resume[]> => {
        const response = await api.get<Resume[]>('/resumes');
        return response.data;
    },
    fetchResumeById: async (id: string): Promise<Resume> => {
        const response = await api.get<Resume>(`/resumes/${id}`);
        return response.data;
    },
};

