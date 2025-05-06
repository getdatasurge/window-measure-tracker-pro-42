
/**
 * Utility to fix pointer events for the Feedbucket widget
 * This ensures the widget can receive user interactions by setting pointer-events to "all"
 */

export const enableFeedbucketInteraction = () => {
  // Function to update the element's style
  const applyFeedbucketFix = () => {
    const feedbucketElement = document.querySelector('feedbucket-app');
    if (feedbucketElement) {
      // Cast to HTMLElement to access style property
      const element = feedbucketElement as HTMLElement;
      // Apply the fix only if needed
      if (element.style.pointerEvents !== 'all') {
        element.style.pointerEvents = 'all';
        console.log('[Feedbucket] pointer-events enabled.');
        
        // If we found and fixed it, we can disconnect the observer
        if (observer) {
          observer.disconnect();
          clearInterval(intervalId);
        }
      }
    }
  };

  // Use both approaches for better coverage:
  // 1. MutationObserver for modern browsers
  let observer: MutationObserver | null = null;
  try {
    observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        if (mutation.type === 'childList' && mutation.addedNodes.length) {
          applyFeedbucketFix();
        }
      }
    });
    observer.observe(document.body, { childList: true, subtree: true });
  } catch (err) {
    console.error('[Feedbucket] MutationObserver error:', err);
  }

  // 2. Fallback interval approach for maximum compatibility
  const intervalId = setInterval(applyFeedbucketFix, 1000);
  
  // Immediate check in case element is already in the DOM
  applyFeedbucketFix();
  
  // Clean up function for component unmounting
  return () => {
    if (observer) {
      observer.disconnect();
    }
    clearInterval(intervalId);
  };
};
