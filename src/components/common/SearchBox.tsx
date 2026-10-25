import { Icon } from '@/assets/icons';
import { ReactNode } from 'react';

interface SearchBoxProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  showKeyboardShortcut?: boolean;
  className?: string;
  rightContent?: ReactNode;
}

export function SearchBox({
  value,
  onChange,
  placeholder = 'Tìm kiếm',
  showKeyboardShortcut = true,
  className = '',
  rightContent,
}: SearchBoxProps) {
  return (
    <label className={`search-box ${className}`}>
      <Icon name="search" className="size-4 text-muted" />
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
      />
      {rightContent}
      {showKeyboardShortcut && !rightContent && <kbd>⌘ K</kbd>}
    </label>
  );
}
