import { api } from '@/utils/api';

const getTokenQuery = () => {
    const token = localStorage.getItem("token");
    return token ? `&SignedString=${encodeURIComponent(token)}` : "";
};

export interface AvatarResponse {
    url: string;
    success: boolean;
    message?: string;
}

export const avatarApi = {
  uploadAvatar: async (resumeID: string, userID: number, file: File): Promise<AvatarResponse> => {
        const formData = new FormData();
        formData.append('file', file);

        const response = await api.post(
            `editor/upload-avatar?resume_id=${resumeID}&user_id=${userID}${getTokenQuery()}`,
            formData,
            {
                headers: {
                    'Content-Type': undefined,
                },
            }
        );
        return response.data;
    } 
};