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
  uploadAvatar: async (userID: number, file: File): Promise<AvatarResponse> => {
        const formData = new FormData();
        formData.append('avatar', file);

        const response = await api.post(
            `/upload-avatar?user_id=${userID}${getTokenQuery()}`,
            formData,
            {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            }
        );
        return response.data;
    },
    // удаление на будущее
    // deleteAvatar: async (userID: number): Promise<{success: boolean}> => {
    //     const response = await api.delete(
    //         `/delete-avatar?user_id=${userID}${getTokenQuery()}`
    //     );
    //     return response.data;
    // }
};