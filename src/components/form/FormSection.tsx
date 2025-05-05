
import React from 'react';

interface FormSectionProps {
  title?: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
}

const FormSection: React.FC<FormSectionProps> = ({ 
  title, 
  description, 
  children,
  className = ""
}) => (
  <section className={`mt-4 space-y-4 w-full overflow-hidden ${className}`}>
    {(title || description) && (
      <div>
        {title && <h3 className="text-md font-semibold text-white">{title}</h3>}
        {description && <p className="text-sm text-zinc-400">{description}</p>}
      </div>
    )}
    <div className="w-full overflow-hidden">
      {children}
    </div>
  </section>
);

export default FormSection;
