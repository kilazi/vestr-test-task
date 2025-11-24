import React from 'react';
import './Checkbox.css';

interface CheckboxProps {
  checked?: boolean;
  onChange?: (checked: boolean) => void;
  label?: string;
  value?: string;
  name?: string;
}

const Checkbox: React.FC<CheckboxProps> = ({ 
  checked = false, 
  onChange, 
  label, 
  value,
  name 
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (onChange) {
      onChange(e.target.checked);
    }
  };

  return (
    <label className="checkbox-label">
      <input
        type="radio"
        className="checkbox-input"
        checked={checked}
        onChange={handleChange}
        value={value}
        name={name}
      />
      {label && <span className="checkbox-text">{label}</span>}
    </label>
  );
};

export default Checkbox;

