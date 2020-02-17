import { useCallback, useMemo } from 'react';
import { FormContext } from 'react-forms-processor/dist';
import Button from '@material-ui/core/Button';
import useEnableButtonOnTouchedForm from '../../hooks/useEnableButtonOnTouchedForm';

function FormButton({
  disabled,
  isValid,
  onClick,
  children,
  id,
  className,
  value = {},
  color,
  fields,
  resourceType,
  skipDisableButtonForFormTouched = false,
  resourceId,
}) {
  const handleClick = useCallback(() => onClick(value), [onClick, value]);
  const { formTouched, onClickWhenValid } = useEnableButtonOnTouchedForm({
    onClick: handleClick,
    fields,
    formIsValid: isValid,
    resourceId,
    resourceType,
  });
  const buttonDisabled = useMemo(
    () => (disabled || skipDisableButtonForFormTouched ? false : !formTouched),
    [disabled, formTouched, skipDisableButtonForFormTouched]
  );
  const onClickBtn = useCallback(() => {
    if (skipDisableButtonForFormTouched) return onClick(value);
    onClickWhenValid(value);
  }, [onClick, onClickWhenValid, skipDisableButtonForFormTouched, value]);

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

const DynaSubmit = props => (
  <FormContext.Consumer {...props}>
    {form => <FormButton {...form} {...props} />}
  </FormContext.Consumer>
);

export default DynaSubmit;
