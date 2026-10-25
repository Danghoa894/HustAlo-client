import { ButtonHTMLAttributes } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  iconOnly?: boolean;
}

export function Button({ children, className = '', iconOnly, ...props }: ButtonProps) {
  return (
    <button className={`${iconOnly ? 'icon-button' : 'button'} ${className}`} {...props}>
      {children}
    </button>
  );
}
