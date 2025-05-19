"use client";

import { Form, Formik, FormikProps } from 'formik';
import React, { useState } from 'react';
import { CustomDatePicker, CustomImageUpload, CustomInput, CustomSelect } from './index';
import { CustomFormProps, Field as FormField } from './types';
import { uploadImage } from '@/utils/helperFunctions';
import { isEmpty } from 'lodash';

const CustomForm: React.FC<CustomFormProps> = ({
  fields,
  validationSchema,
  onSubmit,
  resetKey,
  onReset,
  onInputValueChange,
  onDropdownOpen,
  submitButtonText = 'Submit',
  showReset = true,
  className = '',
  dealId = '',
  showSuccess = (message: string) => { },
  selectedDeal = {},
  onExchangeCheck = () => { },
  selectedExchange = ''
}) => {
  const [uploadingImage, setUploadingImage] = useState<{ fieldName: string } | null>(null);
  const sumPrices = (allItems: object[], type: string) => {
    return allItems.reduce((total: any, item: any) => {
      if (type == 'price') {
        return total + Number(item.price);
      } else {
        return total + Number(item.finalCashBackForUser);
      }
    }, 0);
  };
  const initialValues = fields.reduce((acc, field) => {
    if (field.type === 'multiselect') {
      acc[field.name] = [];
    } else {
      acc[field.name] = field.initialValue || '';
    }
    return acc;
  }, {} as { [key: string]: any });

  const handleInputChange = (
    fieldName: string,
    value: any,
    setFieldValue: (field: string, value: any) => void,
    setFieldError: (field: string, error: string) => void,
    resetField?: (field: string) => void,
    fileName?: string
  ) => {
    if (onInputValueChange) {
      const shouldPreventDefault = onInputValueChange(fieldName, value, setFieldValue, setFieldError);
      if (shouldPreventDefault) {
        return;
      }
    }

    const field = fields.find(f => f.name === fieldName);
    if (field?.type === 'multiselect') {
      // Ensure value is always an array for multiselect
      const newValue = Array.isArray(value) ? value : [];
      setFieldValue(fieldName, newValue);
      
      // Calculate sums for price and cashback
      let priceValue = sumPrices(newValue, 'price');
      let cashBackValue = sumPrices(newValue, 'cashback');
      setFieldValue('price', !!priceValue ? priceValue.toString() : '');
      setFieldValue('finalCashBackForUser', !!cashBackValue ? cashBackValue.toString() : '');
      return;
    }

    if (fieldName === 'brandName') {
      setFieldValue('price', '');
      setFieldValue('finalCashBackForUser', '');
    }

    if (
      ((fieldName === 'deliveredScreenshot') ||
      (fieldName === 'reviewScreenshot') ||
      (fieldName === 'sellerFeedback') ||
      (fieldName === 'orderScreenShot'))
    ) {
      if (!value) {
        setFieldValue(fieldName, '');
        return;
      }
      const confirmUpload = window.confirm('Are you sure you want to upload this image?');

      if (!confirmUpload) {
        if (resetField) resetField(fieldName);
        return;
      }

      const uploadImageAsync = async () => {
        setUploadingImage({ fieldName });
        try {
          const res = await uploadImage(
            { uri: value, name: fileName || '', type: 'jpeg/png' },
            dealId,
          );
          if (!!res) {
            setFieldValue(fieldName, res?.data);
            showSuccess(res?.message);
          }
        } catch (error) {
          console.error('Error uploading image:', error);
        } finally {
          setUploadingImage(null);
        }
      };

      uploadImageAsync();
      return;
    }

    setFieldValue(fieldName, value);
  };

  const renderField = (
    field: FormField,
    formikProps: FormikProps<{ [key: string]: any }>
  ) => {
    const { setFieldValue, setFieldError, values, touched, errors } = formikProps;

    switch (field.type) {
      case 'text':
      case 'email':
      case 'password':
      case 'numeric':
        return (
          <CustomInput
            key={field.name}
            field={field}
            value={values[field.name]}
            onChange={(value) => handleInputChange(field.name, value, setFieldValue, setFieldError)}
            error={touched[field.name] && errors[field.name] ? errors[field.name] as string : undefined}
          />
        );

      case 'select':
      case 'multiselect':
        return (
          <CustomSelect
            key={field.name}
            field={field}
            value={values[field.name]}
            onChange={(value) => handleInputChange(field.name, value, setFieldValue, setFieldError)}
            error={touched[field.name] && errors[field.name] ? errors[field.name] as string : undefined}
            onDropdownOpen={(isOpen) => onDropdownOpen?.(isOpen, field.name)}
          />
        );

      case 'image':
        return (
          <CustomImageUpload
            key={field.name}
            field={field}
            value={values[field.name]}
            onChange={(value, fileName) => {
              const resetFieldFn = (fieldName: string) => {
                setFieldValue(fieldName, '');
              };
              handleInputChange(field.name, value, setFieldValue, setFieldError, resetFieldFn, fileName);
            }}
            error={touched[field.name] && errors[field.name] ? errors[field.name] as string : undefined}
            isUploading={uploadingImage?.fieldName === field.name}
          />
        );

      case 'date':
        return (
          <CustomDatePicker
            key={field.name}
            field={field}
            value={values[field.name]}
            onChange={(value) => handleInputChange(field.name, value, setFieldValue, setFieldError)}
            error={touched[field.name] && errors[field.name] ? errors[field.name] as string : undefined}
          />
        );

      default:
        return null;
    }
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={async (values, { setSubmitting }) => {
        try {
          onSubmit(values);
        } catch (error) {
          console.error('Submit error:', error);
        } finally {
          setSubmitting(false);
        }
      }}
      key={resetKey}
      enableReinitialize
    >
      {(formikProps) => (
        <Form className={`space-y-6 ${className}`}>
          {fields.map((field) => renderField(field, formikProps))}

          {!isEmpty(selectedDeal[0]?.exchangeDealProducts) && (
            <div className="mt-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Select Product For Exchange</h3>
              <div className="space-y-2">
                {selectedDeal[0]?.exchangeDealProducts.map((item: string, index: number) => (
                  <div key={index} className="flex items-center">
                    <input
                      type="checkbox"
                      id={`exchange-${index}`}
                      checked={item === selectedExchange}
                      onChange={() => onExchangeCheck(item)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor={`exchange-${index}`} className="ml-2 block text-sm text-gray-900">
                      {item}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex justify-between items-center pt-4">
            <button
              type="submit"
              disabled={formikProps.isSubmitting}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-lg font-medium 
                hover:from-blue-700 hover:to-indigo-700 transition-colors duration-200 
                disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {formikProps.isSubmitting ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  <span>Submitting...</span>
                </div>
              ) : (
                submitButtonText
              )}
            </button>

            {showReset && (
              <button
                type="button"
                onClick={() => {
                  formikProps.resetForm();
                  onReset?.();
                }}
                className="ml-4 text-red-500 hover:text-red-700 font-medium"
              >
                Reset
              </button>
            )}
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default CustomForm; 