import { useState, useEffect, useCallback } from "react";
import type { Resume } from "@/types/resume.types";
import { resumeApi } from "@/services/resumeService";
import { useAuth } from "@/contexts/AuthContext"; 

export const useResumes = () => {
    const { user } = useAuth();

    const [resumes, setResumes] = useState<Resume[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null); 

    const fetchResumes = useCallback(async () => {
        if (!user || !user.id) {
            return;
        }

        setLoading(true);
        setError(null);
        try {
            const data = await resumeApi.fetchResumes(Number(user.id));
            setResumes(Array.isArray(data) ? data : []);
        } catch (err: any) {
            console.error("Fetch error:", err);
            
            if (err.response?.status === 404) {
                setResumes([]);
            } else {
                setError("Ошибка при загрузке резюме.");
            }
        } finally {
            setLoading(false);
        }
    }, [user]);

     const saveResume = async (data: Partial<Resume>) => {
        if (!user || !user.id) return null;

        setLoading(true);
        setError(null);
        try {
            const newResume = await resumeApi.saveResume(data, Number(user.id));
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
    const updateResume = async (id: number, data: Partial<Resume>) => {
        if (!user || !user.id) return null;

        setLoading(true);
        setError(null);
        try {
            const updated = await resumeApi.updateResume(id, data, Number(user.id));
            
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
        if (user && user.id) {
            fetchResumes();
        }
    }, [fetchResumes, user]);

    return { resumes, loading, error, refetch: fetchResumes, saveResume, updateResume};
};
