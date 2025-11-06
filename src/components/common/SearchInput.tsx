import type { ChangeEvent } from 'react';

export type SearchInputProps = {
  value: string;
  placeholder?: string;
  onChange: (value: string) => void;
};

const SearchInput = ({ value, placeholder, onChange }: SearchInputProps) => {
  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    onChange(event.target.value);
  };

  return (
    <div style={{ position: 'relative', width: '100%' }}>
      <input
        type="search"
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        style={{
          width: '100%',
          padding: '16px 18px',
          borderRadius: '14px',
          border: '1px solid #cbd5f5',
          fontSize: '1rem',
          boxShadow: '0 10px 20px rgba(15, 23, 42, 0.08) inset'
        }}
      />
    </div>
  );
};

export default SearchInput;
