import { useState, useEffect } from "react";
import type { Resume } from "@/types/resume.types";
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

    useEffect(() => {
        fetchResumes();
    }, []);

    return { resumes, loading, error, refetch: fetchResumes };
};

