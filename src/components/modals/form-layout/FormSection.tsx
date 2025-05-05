
import React from 'react';

interface FormSectionProps {
  title?: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
}

export const FormSection: React.FC<FormSectionProps> = ({ 
  title, 
  description, 
  children,
  className = ""
}) => (
  <section className={`mt-6 space-y-4 ${className}`}>
    {(title || description) && (
      <div>
        {title && <h2 className="text-md font-semibold text-white">{title}</h2>}
        {description && <p className="text-sm text-zinc-400">{description}</p>}
      </div>
    )}
    {children}
  </section>
);
