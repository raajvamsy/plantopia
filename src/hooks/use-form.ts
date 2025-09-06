'use client';

import { useState, useCallback } from 'react';

interface FormState<T> {
  data: T;
  errors: Partial<Record<keyof T, string>>;
  isLoading: boolean;
  isSubmitting: boolean;
}

interface UseFormOptions<T> {
  initialData: T;
  validate?: (data: T) => Partial<Record<keyof T, string>>;
  onSubmit?: (data: T) => Promise<void> | void;
}

export function useForm<T extends Record<string, unknown>>({
  initialData,
  validate,
  onSubmit,
}: UseFormOptions<T>) {
  const [state, setState] = useState<FormState<T>>({
    data: initialData,
    errors: {},
    isLoading: false,
    isSubmitting: false,
  });

  const setField = useCallback((field: keyof T, value: T[keyof T]) => {
    setState(prev => ({
      ...prev,
      data: { ...prev.data, [field]: value },
      errors: { ...prev.errors, [field]: undefined }, // Clear error when field changes
    }));
  }, []);

  const setError = useCallback((field: keyof T, error: string) => {
    setState(prev => ({
      ...prev,
      errors: { ...prev.errors, [field]: error },
    }));
  }, []);

  const setErrors = useCallback((errors: Partial<Record<keyof T, string>>) => {
    setState(prev => ({
      ...prev,
      errors: { ...prev.errors, ...errors },
    }));
  }, []);

  const clearErrors = useCallback(() => {
    setState(prev => ({
      ...prev,
      errors: {},
    }));
  }, []);

  const setLoading = useCallback((isLoading: boolean) => {
    setState(prev => ({ ...prev, isLoading }));
  }, []);

  const setSubmitting = useCallback((isSubmitting: boolean) => {
    setState(prev => ({ ...prev, isSubmitting }));
  }, []);

  const validateForm = useCallback(() => {
    if (!validate) return true;
    
    const errors = validate(state.data);
    setErrors(errors);
    return Object.keys(errors).length === 0;
  }, [state.data, validate, setErrors]);

  const handleSubmit = useCallback(async (e?: React.FormEvent) => {
    e?.preventDefault();
    
    if (!validateForm()) return false;
    
    if (!onSubmit) return true;
    
    try {
      setSubmitting(true);
      clearErrors();
      await onSubmit(state.data);
      return true;
    } catch (error) {
      console.error('Form submission error:', error);
      return false;
    } finally {
      setSubmitting(false);
    }
  }, [state.data, validateForm, onSubmit, setSubmitting, clearErrors]);

  const reset = useCallback(() => {
    setState({
      data: initialData,
      errors: {},
      isLoading: false,
      isSubmitting: false,
    });
  }, [initialData]);

  return {
    data: state.data,
    errors: state.errors,
    isLoading: state.isLoading,
    isSubmitting: state.isSubmitting,
    setField,
    setError,
    setErrors,
    clearErrors,
    setLoading,
    setSubmitting,
    validateForm,
    handleSubmit,
    reset,
  };
}

export default useForm;
