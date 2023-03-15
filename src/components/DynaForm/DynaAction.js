import React, { useCallback } from 'react';
import Button from '@mui/material/Button';
import { useSelector } from 'react-redux';
import makeStyles from '@mui/styles/makeStyles';
import useEnableButtonOnTouchedForm from '../../hooks/useEnableButtonOnTouchedForm';
import { selectors } from '../../reducers';
import trim from '../../utils/trim';
import useFormContext from '../Form/FormContext';

const useStyles = makeStyles(theme => ({
  actionButton: {
    marginTop: theme.spacing.double,
    marginLeft: theme.spacing.double,
  },
}));

export default function DynaAction(props) {
  const {
    disabled,
    children,
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
  const classes = useStyles();
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
      className={classes.actionButton}
      disabled={!!(formDisabled || disabled) || !formTouched}
      onClick={onClick}>
      {children}
    </Button>
  );
}
