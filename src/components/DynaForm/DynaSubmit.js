import React, { useCallback, useMemo } from 'react';
import Button from '@material-ui/core/Button';
import useEnableButtonOnTouchedForm from '../../hooks/useEnableButtonOnTouchedForm';
import trim from '../../utils/trim';
import useFormContext from '../Form/FormContext';

export default function FormButton({
  onClick,
  children,
  id,
  className,
  color,
  skipDisableButtonForFormTouched = false,
  ...props
}) {
  const {
    fields,
    isValid: formIsValid,
    disabled: formDisabled,
    value: formValue,
  } = useFormContext(props.formKey) || {};
  const {
    isValid = formIsValid,
    disabled = formDisabled,
    value = formValue,
  } = props;
  const handleClick = useCallback(() => onClick(trim(value)), [onClick, value]);
  const { formTouched, onClickWhenValid } = useEnableButtonOnTouchedForm({
    ...props,
    onClick: handleClick,
    fields,
    formIsValid: isValid,
  });
  const buttonDisabled = useMemo(
    () => disabled || (skipDisableButtonForFormTouched ? false : !formTouched),
    [disabled, formTouched, skipDisableButtonForFormTouched]
  );
  const onClickBtn = useCallback(() => {
    if (skipDisableButtonForFormTouched) return onClick(value);
    onClickWhenValid(trim(value));
  }, [onClick, onClickWhenValid, skipDisableButtonForFormTouched, value]);

  if (!fields || !value) return null;

  return (
    <Button
      data-test={
        id || (typeof children === 'string' && children) || 'saveButton'
      }
      variant="outlined"
      color={color || 'primary'}
      className={className}
      disabled={buttonDisabled}
      onClick={onClickBtn}>
      {children}
    </Button>
  );
}
