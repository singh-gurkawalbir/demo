import { useEffect } from 'react';
import { FormContext } from 'react-forms-processor/dist';
import Button from '@material-ui/core/Button';

function DynaAction(props) {
  const {
    disabled,
    isValid,
    onClick,
    children,
    className,
    value,
    id,
    dataTest,
    registerField,
    fields,
    visibleWhen,
    visibleWhenAll,
  } = props;

  useEffect(() => {
    const matchingActionField = fields.find(field => field.id === id);

    // name does not really matter since this is an action button
    // and we are ignoring the value associated to this field
    // through omitWhenValueIs
    if (!matchingActionField) {
      registerField({
        id,
        name: id,
        visibleWhen,
        visibleWhenAll,
        omitWhenValueIs: [undefined],
      });
    }
  }, [registerField, fields, id, visibleWhen, visibleWhenAll]);

  if (id) {
    const matchingActionField = fields.find(field => field.id === id);

    if (matchingActionField && !matchingActionField.visible) return null;
  }

  return (
    <Button
      data-test={id || dataTest}
      variant="outlined"
      color="primary"
      className={className}
      disabled={disabled || !isValid}
      onClick={() => onClick(value)}>
      {children}
    </Button>
  );
}

// field props are getting merged first
const DynaActionWrapped = props => (
  <FormContext.Consumer {...props}>
    {form => (
      <DynaAction
        {...form}
        {...props}
        disabled={!!(form.disabled || props.disabled)}
      />
    )}
  </FormContext.Consumer>
);

export default DynaActionWrapped;
