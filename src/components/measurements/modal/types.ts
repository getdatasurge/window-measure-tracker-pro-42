
import { MeasurementFormData } from '@/hooks/measurements/types';

export interface MeasurementModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  measurement?: MeasurementFormData;
  onSave: (measurement: MeasurementFormData & { recorded_by?: string }) => void;
  mode: 'create' | 'edit';
  defaultValues?: Partial<MeasurementFormData>;
}

export interface MeasurementFormState extends MeasurementFormData {
  tempId?: string;
  isValid?: boolean;
}

export interface ModalHeaderProps {
  mode: 'create' | 'edit';
  formData: MeasurementFormState;
  onClose: () => void;
}

export interface ModalFooterProps {
  currentStep: number;
  totalSteps: number;
  formData: MeasurementFormData;
  isSaving: boolean;
  onPrevious: () => void;
  onNext: () => void;
  onCancel: () => void;
  onSave: () => void;
}

export interface ModalContentProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  formData: MeasurementFormData;
  updateFormData: (field: string, value: any) => void;
  errors: {[key: string]: string};
  setErrors: React.Dispatch<React.SetStateAction<{[key: string]: string}>>;
}
