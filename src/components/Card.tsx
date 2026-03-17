import React from 'react';
import { cn } from '../lib/utils';

interface CardProps {
  children?: React.ReactNode;
  className?: string;
}

export function Card({ children, className, ...props }: CardProps & React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div 
      className={cn(
        "bg-white rounded-3xl overflow-hidden transition-all duration-300",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({ children, className, ...props }: CardProps & React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("px-8 py-6", className)} {...props}>
      {children}
    </div>
  );
}

export function CardContent({ children, className, ...props }: CardProps & React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("px-8 py-6", className)} {...props}>
      {children}
    </div>
  );
}
