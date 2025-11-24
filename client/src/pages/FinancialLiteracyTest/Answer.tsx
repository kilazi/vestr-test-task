import React from 'react';
import Checkbox from '../../components/shared/Checkbox';

interface AnswerProps {
  value: string;
  label: string;
  checked: boolean;
  onChange: (value: string) => void;
  name: string;
}

const Answer: React.FC<AnswerProps> = ({ value, label, checked, onChange, name }) => {
  const handleChange = (isChecked: boolean) => {
    if (isChecked) {
      onChange(value);
    }
  };

  return (
    <Checkbox
      checked={checked}
      onChange={handleChange}
      label={label}
      value={value}
      name={name}
    />
  );
};

export default Answer;

