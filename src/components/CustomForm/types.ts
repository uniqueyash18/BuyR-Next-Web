export interface Field {
  name: string;
  label: string;
  type: 'text' | 'email' | 'password' | 'image' | 'select' | 'checkbox' | 'numeric' | 'date' | 'multiselect';
  options?: { label: string; value: any; id: string }[];
  initialValue?: any;
  isEditable?: boolean;
  subHeading?: string;
  maxDate?: Date;
  minDate?: Date;
  disabled?: boolean;
  placeholder?: string;
}

export interface CustomFormProps {
  fields: Field[];
  validationSchema: any;
  onSubmit: (values: { [key: string]: any }) => void;
  resetKey?: number;
  onReset?: () => void;
  onInputValueChange?: (
    field: string,
    value: any,
    setFieldValue: (field: string, value: any) => void,
    setFieldError: (field: string, error: string) => void
  ) => boolean | void;
  onDropdownOpen?: (isOpen: boolean, fieldName: string) => void;
  submitButtonText?: string;
  showReset?: boolean;
  className?: string;
  dealId?: string;
  t?: (key: string) => string;
  showSuccess?: (message: string) => void;
  uploadImage?: (file: any, dealId: string) => Promise<{ data: string; message: string }>;
  sumPrices?: (value: any, field: string) => number;
  toString?: (value: any) => string;
  selectedDeal?: any;
  onExchangeCheck?: (item: string) => void;
  selectedExchange?: string;
} 