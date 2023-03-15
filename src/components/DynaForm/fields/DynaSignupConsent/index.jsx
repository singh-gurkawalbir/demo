import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import makeStyles from '@mui/styles/makeStyles';
import actions from '../../../../actions';
import errorMessageStore from '../../../../utils/errorStore';
import DynaCheckbox from '../checkbox/DynaCheckbox';

const useStyles = makeStyles(theme => ({
  signupCheckBox: {
    display: 'flex',
    flexDirection: 'column !important',
    '& > .MuiFormControlLabel-root': {
      alignItems: 'flex-start',
      '& > .MuiButtonBase-root': {
        marginRight: theme.spacing(1),
      },
    },
  },
  signupLabel: {
    fontSize: theme.spacing(2),
  },
}));

export default function DynaSignupConsent(props) {
  const classes = useStyles();
  const dispatch = useDispatch();
  const { id, formKey, value } = props;
  const label = () => (
    <span className={classes.signupLabel}>
      I agree to the&nbsp;
      <a
        href="https://www.celigo.com/terms-of-service/"
        target="_blank"
        rel="noreferrer"
      >
        Terms of Service / Service Subscription Agreement&nbsp;
      </a>
      and&nbsp;
      <a
        href="https://www.celigo.com/privacy/"
        target="_blank"
        rel="noreferrer"
      >
        Privacy Policy
      </a>
    </span>
  );

  useEffect(() => {
    if (value) {
      dispatch(actions.form.forceFieldState(formKey)(id, {isValid: value}));

      return;
    }

    dispatch(actions.form.forceFieldState(formKey)(id, {
      isValid: false,
      errorMessages: errorMessageStore('SIGN_UP_CONSENT'),
    }));
  }, [dispatch, formKey, id, value]);

  // suspend force field state computation once the component turns invisible
  useEffect(() => () => {
    dispatch(actions.form.clearForceFieldState(formKey)(id));
  }, [dispatch, formKey, id]);

  return (
    <DynaCheckbox
      {...props}
      label={label()}
      className={classes.signupCheckBox} />
  );
}
