import { useRef, type ChangeEvent, useEffect, useState } from 'react';
import { Camera, Loader2, Trash, X } from 'lucide-react';
import { Avatar } from './Avatar';
import { useAvatar } from '@/hooks/useAvatar';
import { Button } from './ui/button';

interface AvatarUploadProps {
    resumeID?: string | number | null;
    userID: number;
    currentAvatarUrl?: string | null;
    userName?: string;
    onUploadSuccess?: (url: string) => void;
    onUploadError?: (error: string) => void;
    onDelete?: () => void;
}

export const AvatarUpload = ({
    resumeID,
    userID,
    currentAvatarUrl,
    userName,
    onUploadSuccess,
    onUploadError,
    onDelete,
}: AvatarUploadProps) => {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [localPreview, setLocalPreview] = useState<string | null>(null);
    
    const {
        uploading,
        error,
        uploadAvatar,
        clearError,
    } = useAvatar({ maxSizeInMB: 5 });

    // Load saved avatar from localStorage on mount
    useEffect(() => {
        if (resumeID) {
            const savedAvatar = localStorage.getItem(`avatar_${resumeID}`);
            if (savedAvatar) {
                setLocalPreview(savedAvatar);
            }
        }
    }, [resumeID]);

    // Convert file to base64 and save to localStorage
    const saveAvatarToStorage = async (file: File, resumeId: string | number) => {
        return new Promise<string>((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => {
                const base64 = reader.result as string;
                localStorage.setItem(`avatar_${resumeId}`, base64);
                resolve(base64);
            };
            reader.onerror = () => reject(new Error('Failed to read file'));
            reader.readAsDataURL(file);
        });
    };

    const displayUrl = localPreview || currentAvatarUrl;
    const hasResumeId = Boolean(resumeID);

    // Clean up blob URLs when localPreview changes
    useEffect(() => {
        return () => {
            if (localPreview && localPreview.startsWith('blob:')) {
                URL.revokeObjectURL(localPreview);
            }
        };
    }, [localPreview]);

    const handleFileSelect = async (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        if (!hasResumeId) {
            onUploadError?.('Сохраните резюме перед загрузкой фотографии');
            return;
        }

        // Clean up any existing blob URL (but keep base64 data)
        if (localPreview && localPreview.startsWith('blob:')) {
            URL.revokeObjectURL(localPreview);
        }

        // Show local preview immediately
        const newLocalPreview = URL.createObjectURL(file);
        setLocalPreview(newLocalPreview);

        const result = await uploadAvatar(String(resumeID), userID, file);

        if (result?.url) {
            // Save the uploaded image as base64 to localStorage for persistence
            try {
                const base64Data = await saveAvatarToStorage(file, String(resumeID));
                setLocalPreview(base64Data);
            } catch (storageError) {
                console.warn('Failed to save avatar to localStorage:', storageError);
            }
            onUploadSuccess?.(result.url);
        } else if (error) {
            // Clean up local preview URL on error
            URL.revokeObjectURL(newLocalPreview);
            setLocalPreview(null);
            onUploadError?.(error);
        }

        // Reset input
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const handleDeleteAvatar = () => {
        if (resumeID) {
            localStorage.removeItem(`avatar_${resumeID}`);
        }
        setLocalPreview(null);
        onDelete?.();
    };

    const triggerFileSelect = () => {
        fileInputRef.current?.click();
    };

    return (
        <div className="relative w-[96px] h-[96px]">
        <div className="flex flex-col items-center gap-3">
            {/* Avatar with upload overlay */}
            <div className="relative group">
                <Avatar src={displayUrl}
                    alt={userName || 'User avatar'}
                    size="xl"
                    fallback={userName}
                    className={uploading ? 'opacity-50' : ''}
                    />

                {/* Upload overlay */}
                <button
                    type="button"
                    onClick={(e) => {
                        e.preventDefault();
                        triggerFileSelect();
                    }}
                    disabled={!hasResumeId || uploading}
                    className="
                        absolute inset-0
                        rounded-full
                        bg-black/50
                        opacity-0
                        group-hover:opacity-100
                        transition-opacity
                        flex
                        items-center
                        justify-center
                        cursor-pointer
                        disabled:cursor-not-allowed
                    "
                    aria-label="Upload avatar"
                >
                    {uploading ? (
                        <Loader2 className="w-8 h-8 text-white animate-spin" />
                    ) : (
                        <Camera className="w-8 h-8 text-white" />
                    )}
                </button>

                {/* Hidden file input */}
                <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/jpeg,image/png,image/webp,image/gif"
                    onChange={handleFileSelect}
                    className="hidden"
                    aria-hidden="true"
                />
            </div>

            {/* Status text */}
            <p className="text-xs text-foreground text-center">
                {uploading
                    ? 'Загрузка...'
                    : hasResumeId
                    ? ''
                    : 'Сохраните резюме, чтобы загрузить фото'}
            </p>

            {localPreview && !uploading && (
                    <Button
                    variant={"destructive"}
                    onClick={handleDeleteAvatar}
                    className="absolute start-0 bottom-0 z-50 rounded-full"
                >
                    <Trash/>
                </Button>
            )}

            {/* Error message */}
            {error && (
                <div className="flex items-center gap-2 text-sm text-red-500 bg-red-50 px-3 py-2 rounded-lg">
                    <span>{error}</span>
                    <button
                        onClick={clearError}
                        className="hover:text-red-700"
                        aria-label="Dismiss error"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>
            )}
        </div>
        </div>
    );
};