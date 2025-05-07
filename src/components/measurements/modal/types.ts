
import { Measurement } from '@/types/measurement';

export interface MeasurementModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  measurement?: Measurement;
  onSave: (measurement: Measurement) => void;
  mode: 'create' | 'edit';
  defaultValues?: Partial<Measurement>;
}

export interface MeasurementFormState extends Measurement {
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
  formData: MeasurementFormState;
  isSaving: boolean;
  onPrevious: () => void;
  onNext: () => void;
  onCancel: () => void;
  onSave: () => void;
}

export interface ModalContentProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  formData: MeasurementFormState;
  updateFormData: (field: string, value: any) => void;
  errors: {[key: string]: string};
  setErrors: React.Dispatch<React.SetStateAction<{[key: string]: string}>>;
}
