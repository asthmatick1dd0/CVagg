import { Avatar as MuiAvatar } from '@mui/material';
import { User } from 'lucide-react';

type AvatarSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

interface AvatarProps {
    src?: string | null;
    alt?: string;
    size?: AvatarSize;
    fallback?: string;
    className?: string;
    onClick?: () => void;
}

const sizeMap: Record<AvatarSize, number> = {
    xs: 16,
    sm: 32,
    md: 40,
    lg: 56,
    xl: 96,
};

export const Avatar = ({
    src,
    alt = 'Avatar',
    size = 'md',
    fallback,
    className = '',
    onClick,
}: AvatarProps) => {
    const sizePx = sizeMap[size];

    const getInitials = (name: string): string => {
        return name
            .split(' ')
            .map(n => n[0])
            .join('')
            .toUpperCase()
            .slice(0, 2);
    };

    return (
        <div className={className} onClick={onClick} style={{ cursor: onClick ? 'pointer' : 'default' }}>
            <MuiAvatar
                src={src || undefined}
                alt={alt}
                sx={{
                    width: sizePx,
                    height: sizePx,
                    bgcolor: 'grey.300',
                    '&:hover': onClick ? { opacity: 0.8 } : {},
                }}
            >
                {fallback ? getInitials(fallback) : <User size={sizePx * 0.5} />}
            </MuiAvatar>
        </div>
    );
};