import { type SelectHTMLAttributes, forwardRef } from 'react';
import { cn } from '../utils/cn';

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
    label?: string;
    error?: string;
    options: { value: string | number; label: string }[];
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
    ({ label, error, options, className, ...props }, ref) => {
        return (
            <div className="w-full">
                {label && (
                    <label className="label" htmlFor={props.id}>
                        {label}
                        {props.required && <span className="text-red-500 ml-1">*</span>}
                    </label>
                )}
                <select
                    ref={ref}
                    className={cn(
                        'input',
                        error && 'border-red-500 focus:ring-red-500',
                        className
                    )}
                    {...props}
                >
                    <option value="">Seleccionar...</option>
                    {options.map((option) => (
                        <option key={option.value} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </select>
                {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
            </div>
        );
    }
);

Select.displayName = 'Select';
