
// Export all UI components for easier imports
export * from "./accordion";
export * from "./alert";
export * from "./alert-dialog";
export * from "./aspect-ratio";
export * from "./avatar";
export * from "./badge";
export * from "./button";
export * from "./calendar";
export * from "./card";
export * from "./carousel";
export * from "./checkbox";
export * from "./collapsible";
export * from "./command";
export * from "./context-menu";
export * from "./dialog";
export * from "./dropdown-menu";
export * from "./form";
export * from "./hover-card";
export * from "./input";
export * from "./input-otp";
export * from "./label";
export * from "./menubar";
export * from "./navigation-menu";
export * from "./pagination";
export * from "./popover";
export * from "./progress";
export * from "./radio-group";
export * from "./resizable";
export * from "./scroll-area";
export * from "./select";
export * from "./separator";
export * from "./sheet";
export * from "./skeleton";
export * from "./slider";
// Export Sonner toast component with explicit naming to avoid conflict
export { Toaster as SonnerToaster } from "./sonner";
export * from "./spinner";
export * from "./switch";
export * from "./table";
export * from "./tabs";
export * from "./textarea";
export * from "./toast";
export * from "./toaster";
export * from "./toggle";
export * from "./toggle-group";
export * from "./tooltip";
export * from "./sidebar";
export * from "./chart";
export * from "./breadcrumb";
export * from "./drawer";

// Export custom UI components
export { default as GlobalSearch } from "./GlobalSearch";
export { SidebarToggle } from "./SidebarToggle"; // Changed from default export to named export
export { default as ThemeToggle } from "./ThemeToggle";
