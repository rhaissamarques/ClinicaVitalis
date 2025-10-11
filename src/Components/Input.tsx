// src/components/Input/Input.tsx
import React from "react";
import './Input.css';

interface InputProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type?: 'text' | 'email' | 'number' | 'password' | 'checkbox' | 'date';
  placeholder?: string;
  label?: string;
  className?: string;
  variant?: 'default' | 'outlined' | 'filled';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  id?: string;
  name?: string;
}

export default function Input({
  value,
  onChange,
  type = 'text',
  placeholder,
  label,
  className = '',
  variant = 'default',
  size = 'medium',
  disabled = false,
  id,
  name
}: InputProps) {
  const inputClasses = `input input-${variant} input-${size} ${className}`;

  return (
    <div className="input-wrapper">
      {label && <label htmlFor={id || name} className="input-label">{label}</label>}
      <input
        id={id || name}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        className={inputClasses}
      />
    </div>
  );
}
