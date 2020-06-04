import React, { useEffect, useCallback } from 'react';
import { FormContext } from 'react-forms-processor/dist';
import Button from '@material-ui/core/Button';
import useEnableButtonOnTouchedForm from '../../hooks/useEnableButtonOnTouchedForm';
import trim from '../../utils/trim';

function DynaAction(props) {
  const {
    disabled,
    children,
    className,
    value,
    id,
    dataTest,
    registerField,
    fields,
    visibleWhen,
    visibleWhenAll,
    isValid,
    variant = 'outlined',
    color = 'primary',
  } = props;
  const { formTouched, onClickWhenValid } = useEnableButtonOnTouchedForm({
    ...props,
    formIsValid: isValid,
  });
  const onClick = useCallback(() => {
    onClickWhenValid(trim(value));
  }, [onClickWhenValid, value]);

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
      variant={variant}
      color={color}
      className={className}
      disabled={disabled || !formTouched}
      onClick={onClick}>
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
        isValid={props.isValid === undefined ? form.isValid : props.isValid}
      />
    )}
  </FormContext.Consumer>
);

export default DynaActionWrapped;
