import { useCallback } from 'react';
import { FormContext } from 'react-forms-processor/dist';
import Button from '@material-ui/core/Button';
import { useEnableButtonOnTouchedForm } from './DynaAction';

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

  return (
    <Button
      data-test={
        id || (typeof children === 'string' && children) || 'saveButton'
      }
      variant="outlined"
      color={color || 'primary'}
      className={className}
      disabled={disabled || formTouched}
      onClick={onClickWhenValid}>
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
