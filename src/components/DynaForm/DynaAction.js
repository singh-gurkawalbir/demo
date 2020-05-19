import Button from '@material-ui/core/Button';
import { useCallback } from 'react';
import { useSelector } from 'react-redux';
import useEnableButtonOnTouchedForm from '../../hooks/useEnableButtonOnTouchedForm';
import * as selectors from '../../reducers';
import trim from '../../utils/trim';
import useFormContext from '../Form/FormContext';

function DynaAction(props) {
  const {
    disabled,
    children,
    className,
    id,
    dataTest,
    visible,
    visibleWhen,
    visibleWhenAll,
    isValid,
    formKey,
    variant = 'outlined',
    color = 'primary',
  } = props;
  const { fields, value, disabled: formDisabled, isValid: formIsValidState } =
    useFormContext(formKey) || {};
  const formIsValid = isValid === undefined ? formIsValidState : isValid;
  const { formTouched, onClickWhenValid } = useEnableButtonOnTouchedForm({
    ...props,
    fields,
    formIsValid,
  });
  const onClick = useCallback(() => {
    onClickWhenValid(trim(value));
  }, [onClickWhenValid, value]);
  const isButtonVisible = useSelector(state =>
    selectors.isActionButtonVisible(state, formKey, {
      visible,
      visibleWhen,
      visibleWhenAll,
    })
  );

  // no state basically
  if (!fields || !value) return null;

  if (!isButtonVisible) return null;

  return (
    <Button
      data-test={id || dataTest}
      variant={variant}
      color={color}
      className={className}
      disabled={!!(formDisabled || disabled) || !formTouched}
      onClick={onClick}>
      {children}
    </Button>
  );
}

export default DynaAction;
