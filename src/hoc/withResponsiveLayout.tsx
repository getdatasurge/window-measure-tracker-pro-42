import React from 'react';
import PageContent from '@/components/layout/PageContent';
import DashboardShell from '@/components/layout/DashboardShell';

interface WithResponsiveLayoutOptions {
  className?: string;
  useDashboardShell?: boolean;
}

export function withResponsiveLayout<P extends object>(
  PageComponent: React.ComponentType<P>,
  options: WithResponsiveLayoutOptions = {}
) {
  const { 
    className = '',
    useDashboardShell = true
  } = options;

  // Display name for React DevTools
  const displayName = PageComponent.displayName || PageComponent.name || 'Component';

  const WrappedPage: React.FC<P> = (props) => {
    const pageContent = (
      <PageContent className={className}>
        <PageComponent {...props} />
      </PageContent>
    );

    // If useDashboardShell is true, wrap with DashboardShell
    if (useDashboardShell) {
      return (
        <DashboardShell>
          {pageContent}
        </DashboardShell>
      );
    }

    // Otherwise just return the PageContent
    return pageContent;
  };

  WrappedPage.displayName = `withResponsiveLayout(${displayName})`;
  
  return WrappedPage;
}

export default withResponsiveLayout;
