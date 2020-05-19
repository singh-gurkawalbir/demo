import { useCallback, useMemo } from 'react';
import Button from '@material-ui/core/Button';
import useEnableButtonOnTouchedForm from '../../hooks/useEnableButtonOnTouchedForm';
import trim from '../../utils/trim';
import useFormContext from '../Form/FormContext';

function FormButton({
  onClick,
  children,
  id,
  className,
  color,
  resourceType,
  skipDisableButtonForFormTouched = false,
  resourceId,
  formKey,
  ...props
}) {
  const {
    fields,
    isValid: formInValid,
    disabled: formDisabled,
    value: formValue,
  } = useFormContext(formKey) || {};
  const {
    isValid = formInValid,
    disabled = formDisabled,
    value = formValue,
  } = props;
  const handleClick = useCallback(() => onClick(trim(value)), [onClick, value]);
  const { formTouched, onClickWhenValid } = useEnableButtonOnTouchedForm({
    onClick: handleClick,
    fields,
    formIsValid: isValid,
    resourceId,
    resourceType,
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

const DynaSubmit = props => {
  const form = useFormContext(props);

  if (!form) return null;

  return <FormButton {...form} {...props} />;
};

export default DynaSubmit;
