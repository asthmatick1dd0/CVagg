import { useState, useEffect } from "react";
import type { Resume } from "@/types/types";
import { resumeApi } from "@/services/resumeService";

export const useResumes = () => {
    const [resumes, setResumes] = useState<Resume[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null); 

    const fetchResumes = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await resumeApi.fetchResumes();
            setResumes(data);
        } catch (err) {
            setError("Ошибка при загрузке резюме.");
        } finally {
            setLoading(false);
        }
    };

     const saveResume = async (data: Partial<Resume>) => {
        setLoading(true);
        setError(null);
        try {
            const newResume = await resumeApi.saveResume(data);
            setResumes(prev => [...prev, newResume]);
            return newResume;
        } catch (err) {
            console.error(err);
            setError("Ошибка при сохранении резюме.");
            return null;
        } finally {
            setLoading(false);
        }
    };

    // на будущее: хук для обновления резюме
    const updateResume = async (id: string, data: Partial<Resume>) => {
        setLoading(true);
        setError(null);
        try {
            const updated = await resumeApi.updateResume(id, data);
            setResumes(prev =>
                prev.map(r => (r.id === updated.id ? updated : r))
            );
            return updated;
        } catch (err) {
            console.error(err);
            setError("Ошибка при обновлении резюме.");
            return null;
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchResumes();
    }, []);

    return { resumes, loading, error, refetch: fetchResumes, saveResume, updateResume};
};

