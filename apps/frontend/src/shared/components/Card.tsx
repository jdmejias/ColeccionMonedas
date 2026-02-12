import { type ReactNode } from 'react';
import { cn } from '../utils/cn';

interface CardProps {
    children: ReactNode;
    className?: string;
    onClick?: () => void;
}

export const Card = ({ children, className, onClick }: CardProps) => {
    return (
        <div
            className={cn(
                'card',
                onClick && 'cursor-pointer',
                className
            )}
            onClick={onClick}
        >
            {children}
        </div>
    );
};
