import { ChangeEvent } from 'react';

interface FormFieldProps {
  label: string;
  name: string;
  id: string;
  type?: 'text' | 'select' | 'number';
  defaultValue?: string;
  placeholder?: string;
  required?: boolean;
  className?: string;
  options?: { value: string; label: string }[];
  onChange?: (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
}

export default function FormField({
  label,
  name,
  id,
  type = 'text',
  defaultValue = '',
  placeholder = '',
  required = false,
  className = '',
  options,
  onChange
}: FormFieldProps) {
  return (
    <div className='items-center gap-2 border-b border-border'>
      <div className='flex gap-1'>
        <label htmlFor={id} className="block text-sm font-medium text-secondary whitespace-nowrap">
          {label}:
        </label>
        {required && <span className='text-sm text-secondary'>*</span>}
      </div>
      {type === 'select' ? (
        <select
          name={name}
          id={id}
          className={`form-input ${className}`}
          defaultValue={defaultValue}
          required={required}
          onChange={onChange}
        >
          <option value="" disabled>Select</option>
          {options?.map(({ value, label }) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
      ) : (
        <input
          type={type}
          name={name}
          id={id}
          className={`form-input placeholder:text-primary/15 ${className}`}
          defaultValue={defaultValue}
          placeholder={placeholder}
          required={required}
          onChange={onChange}
          min={type === 'number' ? 0 : undefined}
          step={type === 'number' ? 'any' : undefined}
        />
      )}
    </div>
  );
} 