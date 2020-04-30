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
    value,
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
  const { formTouched, onClickWhenValid } = useEnableButtonOnTouchedForm({
    ...props,
    formIsValid: isValid,
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

  if (!isButtonVisible) return null;

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

  if (!form) return null;

  return (
    <DynaAction
      {...props}
      value={form.value}
      fields={form.fields}
      disabled={!!(form.disabled || props.disabled)}
      isValid={props.isValid === undefined ? form.isValid : props.isValid}
    />
  );
};

export default DynaActionWrapped;
