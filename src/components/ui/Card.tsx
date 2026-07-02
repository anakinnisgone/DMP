import type { HTMLAttributes, ReactNode } from 'react';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  hover?: boolean;
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

const PAD = {
  none: '',
  sm: 'p-3',
  md: 'p-4',
  lg: 'p-5',
};

export function Card({
  children,
  hover = false,
  padding = 'md',
  className = '',
  ...rest
}: CardProps) {
  return (
    <div
      className={`glass rounded-2xl shadow-glow ${PAD[padding]} ${
        hover ? 'card-hover cursor-pointer' : ''
      } ${className}`}
      {...rest}
    >
      {children}
    </div>
  );
}
