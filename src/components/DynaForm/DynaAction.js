import { useEffect, useMemo, useCallback } from 'react';
import { FormContext } from 'react-forms-processor/dist';
import { useDispatch } from 'react-redux';
import Button from '@material-ui/core/Button';
import { isFormTouched } from '../../forms/utils';
import actions from '../../actions';

export const useEnableButtonOnTouchedForm = ({
  onClick,
  fields,
  formIsValid,
  resourceId,
  resourceType,
}) => {
  const dispatch = useDispatch();
  const formTouched = useMemo(() => isFormTouched(fields), [fields]);
  const onClickWhenValid = useCallback(
    value => {
      dispatch(
        actions.resourceForm.showFormValidations(resourceType, resourceId)
      );

      // Util user resolves form validation do we allow the onClick to take place ...
      if (formIsValid) onClick(value);
    },
    [dispatch, formIsValid, onClick, resourceId, resourceType]
  );

  return { formTouched, onClickWhenValid };
};

function DynaAction(props) {
  const {
    disabled,
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
    resourceType,
    resourceId,
    isValid,
  } = props;
  const { formTouched, onClickWhenValid } = useEnableButtonOnTouchedForm({
    onClick,
    fields,
    formIsValid: isValid,
    resourceId,
    resourceType,
  });

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
      disabled={disabled || !formTouched}
      onClick={() => {
        onClickWhenValid(value);
      }}>
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
