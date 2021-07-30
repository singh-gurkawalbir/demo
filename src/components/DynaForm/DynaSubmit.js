import React, { useCallback, useMemo } from 'react';
import useEnableButtonOnTouchedForm from '../../hooks/useEnableButtonOnTouchedForm';
import trim from '../../utils/trim';
import useFormContext from '../Form/FormContext';
import { OutlinedButton } from '../Buttons';

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
    <OutlinedButton
      data-test={
        id || (typeof children === 'string' && children) || 'saveButton'
      }
      color={color}
      className={className}
      disabled={buttonDisabled}
      onClick={onClickBtn}>
      {children}
    </OutlinedButton>
  );
}
