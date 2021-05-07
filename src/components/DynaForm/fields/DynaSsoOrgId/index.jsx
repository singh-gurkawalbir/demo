import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import actions from '../../../../actions';
import { selectors } from '../../../../reducers';
import DynaText from '../DynaText';
import VerifyTag from './VerifyTag';

const useStyles = makeStyles({
  ssoOrgIdField: {
    height: 80,
  },
});

export default function DynaSsoOrgId(props) {
  const { description, errorMessages, isValid, ...rest } = props;
  const { id, formKey, touched, value } = rest;
  const classes = useStyles();
  const dispatch = useDispatch();
  const validationError = useSelector(state => selectors.orgIdValidationError(state));
  const validationInProgress = useSelector(state => selectors.orgIdValidationInProgress(state));

  useEffect(() => {
    if (!touched) return;
    dispatch(actions.sso.validateOrgId(value));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, dispatch]);

  useEffect(() => {
    if (!value && touched) {
      dispatch(actions.form.forceFieldState(formKey)(id, {isValid: false, errorMessages: 'A value must be provided'}));
    } else if (validationInProgress) {
      dispatch(actions.form.forceFieldState(formKey)(id, {isValid: false}));
    } else if (validationError) {
      dispatch(actions.form.forceFieldState(formKey)(id, {isValid: false, errorMessages: validationError }));
    } else {
      dispatch(actions.form.forceFieldState(formKey)(id, {isValid: true}));
    }
  },
  [dispatch, formKey, id, validationError, validationInProgress, touched, value]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => () => dispatch(actions.sso.clearValidations()), []);

  return (
    <div className={classes.ssoOrgIdField}>
      <DynaText {...rest} isValid={!validationError} />
      <VerifyTag error={errorMessages} />
    </div>
  );
}
