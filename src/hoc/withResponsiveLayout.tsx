import React from 'react';
import PageContent from '@/components/layout/PageContent';
import DashboardShell from '@/components/layout/DashboardShell';

interface WithResponsiveLayoutOptions {
  className?: string;
  useDashboardShell?: boolean;
  title?: string;
  description?: string;
  layoutType?: 'default' | 'minimal' | 'onboarding';
}

export function withResponsiveLayout<P extends object>(
  PageComponent: React.ComponentType<P>,
  options: WithResponsiveLayoutOptions = {}
) {
  const { 
    className = '',
    useDashboardShell = true,
    title,
    description,
    layoutType = 'default'
  } = options;

  // Display name for React DevTools
  const displayName = PageComponent.displayName || PageComponent.name || 'Component';

  const WrappedPage: React.FC<P> = (props) => {
    // Update document title and meta description if provided
    React.useEffect(() => {
      if (title) {
        document.title = title;
      }
      
      if (description) {
        // Find existing description meta tag or create a new one
        let metaDescription = document.querySelector('meta[name="description"]');
        if (!metaDescription) {
          metaDescription = document.createElement('meta');
          metaDescription.setAttribute('name', 'description');
          document.head.appendChild(metaDescription);
        }
        metaDescription.setAttribute('content', description);
      }

      // Cleanup function to reset title when component unmounts
      return () => {
        if (title) {
          document.title = 'Lovable Dashboard'; // Default title
        }
      };
    }, []);

    let content;

    // Handle different layout types
    if (layoutType === 'minimal') {
      content = <PageComponent {...props} />;
    } else if (layoutType === 'onboarding') {
      content = (
        <div className="max-w-xl mx-auto py-10">
          <PageComponent {...props} />
        </div>
      );
    } else {
      // Default layout
      content = (
        <PageContent className={className}>
          <PageComponent {...props} />
        </PageContent>
      );
    }

    // If useDashboardShell is true, wrap with DashboardShell
    if (useDashboardShell && layoutType === 'default') {
      return (
        <DashboardShell>
          {content}
        </DashboardShell>
      );
    }

    // Otherwise just return the content
    return content;
  };

  WrappedPage.displayName = `withResponsiveLayout(${displayName})`;
  
  return WrappedPage;
}

export default withResponsiveLayout;
