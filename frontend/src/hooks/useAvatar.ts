import { useState, useCallback } from 'react';
import { avatarApi, type AvatarResponse } from '@/services/avatarService.ts';

interface UseAvatarOptions {
    maxSizeInMB?: number;
    allowedTypes?: string[];
}

interface UseAvatarReturn {
    uploading: boolean;
    error: string | null;
    preview: string | null;
    uploadAvatar: (userID: number, file: File) => Promise<AvatarResponse | null>;
    setPreview: (url: string | null) => void;
    clearError: () => void;
    validateFile: (file: File) => boolean;
}

export const useAvatar = (options: UseAvatarOptions = {}): UseAvatarReturn => {
    const {
        maxSizeInMB = 5,
        allowedTypes = ['image/jpeg', 'image/png', 'image/webp'],
    } = options;

    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [preview, setPreview] = useState<string | null>(null);

    const validateFile = useCallback((file: File): boolean => {
        setError(null);

        if (!allowedTypes.includes(file.type)) {
            setError(`Невалидный формат. Поддерживаемые форматы: ${allowedTypes.join(', ')}`);
            return false;
        }

        const maxSizeInBytes = maxSizeInMB * 1024 * 1024;
        if (file.size > maxSizeInBytes) {
            setError(`Файл слишком большой. Максимальный размер: ${maxSizeInMB}MB`);
            return false;
        }

        return true;
    }, [allowedTypes, maxSizeInMB]);

    const uploadAvatar = useCallback(async (
        userID: number,
        file: File
    ): Promise<AvatarResponse | null> => {
        if (!validateFile(file)) return null;

        setUploading(true);
        setError(null);

        try {
            const response = await avatarApi.uploadAvatar(userID, file);
            setPreview(response.url);
            return response;
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Ошибка загрузки';
            setError(message);
            return null;
        } finally {
            setUploading(false);
        }
    }, [validateFile]);

    const clearError = useCallback(() => setError(null), []);

    return {
        uploading,
        error,
        preview,
        uploadAvatar,
        setPreview,
        clearError,
        validateFile,
    };
};