
import React from 'react';
import { Search, Plus, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { recordUtility } from '@/utils/knowledgeBase';

interface NoDataFallbackProps {
  title?: string;
  description?: string;
  icon?: 'search' | 'plus' | 'file' | React.ReactNode;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
  variant?: 'default' | 'inline' | 'minimal' | 'card';
}

/**
 * A component for displaying empty states with optional actions
 */
export function NoDataFallback({
  title = 'No data found',
  description = 'We couldn\'t find any matching data.',
  icon = 'search',
  actionLabel,
  onAction,
  className,
  variant = 'default'
}: NoDataFallbackProps) {
  // Record this utility in the knowledge base
  recordUtility(
    'NoDataFallback', 
    'UI component for displaying empty states with action prompts',
    '<NoDataFallback title="No projects" actionLabel="Create Project" onAction={openModal} />'
  );

  // Determine which icon to use
  let IconComponent: React.ReactNode;
  
  if (icon === 'search') {
    IconComponent = <Search className="h-6 w-6 text-muted-foreground" />;
  } else if (icon === 'plus') {
    IconComponent = <Plus className="h-6 w-6 text-muted-foreground" />;
  } else if (icon === 'file') {
    IconComponent = <FileText className="h-6 w-6 text-muted-foreground" />;
  } else {
    IconComponent = icon;
  }

  // Render different variants based on the prop
  switch (variant) {
    case 'inline':
      return (
        <div className={cn('flex items-center gap-3 py-2 text-sm text-muted-foreground', className)}>
          {typeof IconComponent === 'object' && (
            React.isValidElement(IconComponent) ? 
              React.cloneElement(IconComponent as React.ReactElement, { 
                className: cn('h-4 w-4', (IconComponent as React.ReactElement).props.className) 
              }) : 
              IconComponent
          )}
          <span className="flex-1">{description}</span>
          {actionLabel && onAction && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onAction}
              className="h-7 px-2 py-1"
            >
              {actionLabel}
            </Button>
          )}
        </div>
      );

    case 'minimal':
      return (
        <div className={cn('rounded-md border bg-muted/30 p-3 text-center', className)}>
          <div className="text-sm text-muted-foreground">{description}</div>
          {actionLabel && onAction && (
            <Button
              variant="link"
              size="sm"
              onClick={onAction}
              className="mt-2"
            >
              {actionLabel}
            </Button>
          )}
        </div>
      );

    case 'card':
      return (
        <div className={cn('rounded-lg border bg-card p-6 text-center shadow-sm', className)}>
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-muted">
            {IconComponent}
          </div>
          <h3 className="mt-4 text-lg font-medium">{title}</h3>
          <p className="mt-2 text-sm text-muted-foreground">{description}</p>
          {actionLabel && onAction && (
            <Button className="mt-4" onClick={onAction}>
              {actionLabel}
            </Button>
          )}
        </div>
      );

    default:
      return (
        <div className={cn('flex flex-col items-center justify-center px-6 py-12 text-center', className)}>
          <div className="rounded-full bg-muted p-3">
            {IconComponent}
          </div>
          <h3 className="mt-4 text-lg font-medium">{title}</h3>
          <p className="mt-2 max-w-sm text-sm text-muted-foreground">
            {description}
          </p>
          {actionLabel && onAction && (
            <Button className="mt-4" variant="outline" onClick={onAction}>
              {actionLabel}
            </Button>
          )}
        </div>
      );
  }
}

export default NoDataFallback;
