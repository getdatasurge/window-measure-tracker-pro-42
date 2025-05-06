
import { toast } from "react-toastify";
import { useToast } from "@/hooks/use-toast";

/**
 * Helper function to handle errors consistently throughout the application
 * @param error Error object or message
 * @param options Toast configuration options
 */
export const handleError = (
  error: unknown,
  options: {
    title?: string;
    message?: string;
    showToast?: boolean;
    logToConsole?: boolean;
  } = {}
) => {
  const {
    title = "Error",
    message = "An unexpected error occurred",
    showToast = true,
    logToConsole = true
  } = options;
  
  // Extract error message from various error types
  let errorMessage = message;
  if (error instanceof Error) {
    errorMessage = error.message;
  } else if (typeof error === "string") {
    errorMessage = error;
  } else if (error && typeof error === "object" && "message" in error && typeof error.message === "string") {
    errorMessage = error.message;
  }

  // Log to console if needed
  if (logToConsole) {
    console.error(title, error);
  }

  // Show toast if needed
  if (showToast) {
    toast.error(
      <div>
        <div className="font-semibold">{title}</div>
        <p className="text-sm">{errorMessage}</p>
      </div>,
      { 
        position: "top-center",
        autoClose: 5000,
      }
    );
  }

  return errorMessage;
};

/**
 * Custom hook for shadcn toast with error handling
 */
export const useErrorToast = () => {
  const { toast: shadcnToast } = useToast();
  
  const errorToast = (error: unknown, options: {
    title?: string;
    description?: string;
  } = {}) => {
    const errorMessage = error instanceof Error ? error.message : String(error);
    
    shadcnToast({
      variant: "destructive",
      title: options.title || "Error",
      description: options.description || errorMessage,
    });
    
    // Still log to console
    console.error(options.title || "Error", error);
  };
  
  return {
    errorToast
  };
};
