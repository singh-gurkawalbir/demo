import { useEffect, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import Button from '@material-ui/core/Button';
import useEnableButtonOnTouchedForm from '../../hooks/useEnableButtonOnTouchedForm';
import trim from '../../utils/trim';
import useFormContext from '../Form/FormContext';
import actions from '../../actions';

function DynaAction(props) {
  const {
    disabled,
    children,
    className,
    value,
    id,
    dataTest,
    fields: fieldsById,
    visibleWhen,
    visibleWhenAll,
    isValid,
    formKey,
    variant = 'outlined',
    color = 'primary',
  } = props;
  const dispatch = useDispatch();
  const registerField = useCallback(
    field => dispatch(actions.form.field.registerField(formKey)(field)),
    [dispatch, formKey]
  );
  const fields = Object.values(fieldsById);
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
const DynaActionWrapped = props => {
  const form = useFormContext(props);

  return (
    <DynaAction
      {...form}
      {...props}
      disabled={!!(form.disabled || props.disabled)}
      isValid={props.isValid === undefined ? form.isValid : props.isValid}
    />
  );
};

export default DynaActionWrapped;
