import { useState, useCallback } from 'react';
import axios from 'axios';
import { avatarApi, type AvatarResponse } from '@/services/avatarService.ts';

interface UseAvatarOptions {
    maxSizeInMB?: number;
    allowedTypes?: string[];
}

interface UseAvatarReturn {
    uploading: boolean;
    error: string | null;
    preview: string | null;
    uploadAvatar: (resumeID: string | number | null | undefined, userID: number, file: File) => Promise<AvatarResponse | null>;
    setPreview: (url: string | null) => void;
    clearError: () => void;
    validateFile: (file: File) => boolean;
}

export const useAvatar = (options: UseAvatarOptions = {}): UseAvatarReturn => {
    const {
        maxSizeInMB = 5,
        allowedTypes = ['image/png', 'image/jpg', 'image/jpeg'],
    } = options;

    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [preview, setPreview] = useState<string | null>(null);

    const validateFile = useCallback((file: File): boolean => {
        setError(null);

        if (!allowedTypes.includes(file.type)) {
            setError('Неподдерживаемый формат файла. Разрешены: JPG, JPEG, PNG.');
            return false;
        }

        const maxSizeInBytes = maxSizeInMB * 1024 * 1024;
        if (file.size > maxSizeInBytes) {
            setError(`Файл слишком большой. Максимальный размер: ${maxSizeInMB} МБ.`);
            return false;
        }

        return true;
    }, [allowedTypes, maxSizeInMB]);

    const uploadAvatar = useCallback(async (
        resumeID: string | number | null | undefined,
        userID: number,
        file: File
    ): Promise<AvatarResponse | null> => {
        if (!validateFile(file)) return null;

        setUploading(true);
        setError(null);

        try {
            const response = await avatarApi.uploadAvatar(resumeID, userID, file);
            setPreview(response.url);
            return response;
        } catch (err) {
            let message = 'Не удалось загрузить изображение. Попробуйте еще раз.';
            if (axios.isAxiosError(err)) {
                const backendMessage =
                    (err.response?.data as { error?: string; message?: string } | undefined)?.error ||
                    (err.response?.data as { error?: string; message?: string } | undefined)?.message;

                if (err.response?.status === 413 || backendMessage === 'file too large') {
                    message = 'Файл слишком большой. Максимальный размер: 5 МБ.';
                } else if (backendMessage === 'unsupported file type') {
                    message = 'Неподдерживаемый формат файла. Разрешены: JPG, JPEG, PNG.';
                } else if (backendMessage === 'file is required') {
                    message = 'Файл не найден. Выберите изображение и попробуйте снова.';
                } else if (backendMessage) {
                    message = backendMessage;
                } else if (err.message) {
                    message = err.message;
                }
            } else if (err instanceof Error) {
                message = err.message;
            }
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
