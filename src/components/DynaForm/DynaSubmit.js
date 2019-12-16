import { useCallback } from 'react';
import { FormContext } from 'react-forms-processor/dist';
import Button from '@material-ui/core/Button';

function FormButton({
  disabled,
  isValid,
  onClick,
  children,
  id,
  className,
  value = {},
  color,
}) {
  const handleClick = useCallback(() => onClick(value), [onClick, value]);

  return (
    <Button
      data-test={
        id || (typeof children === 'string' && children) || 'saveButton'
      }
      variant="outlined"
      color={color || 'primary'}
      className={className}
      disabled={disabled || !isValid}
      onClick={handleClick}>
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
