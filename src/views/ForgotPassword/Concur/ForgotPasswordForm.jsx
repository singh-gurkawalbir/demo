import { useDispatch, useSelector } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import React, { useCallback, useEffect, useState} from 'react';
import TextField from '@material-ui/core/TextField';
import clsx from 'clsx';
import actions from '../../../actions';
import { selectors } from '../../../reducers';
import { FilledButton} from '../../../components/Buttons';

const useStyles = makeStyles(theme => ({
  submit: {
    width: '100%',
    borderRadius: 4,
    height: 38,
    fontSize: theme.spacing(2),
    marginTop: theme.spacing(1),
  },
  editableFields: {
    textAlign: 'center',
    width: '100%',
    maxWidth: 500,
    marginBottom: 112,
    [theme.breakpoints.down('sm')]: {
      maxWidth: '100%',
    },
  },
  textField: {
    width: '100%',
    background: theme.palette.background.paper,
    marginBottom: 10,
  },
}));

export default function ForgotPassword({setShowError, email, className}) {
  const dispatch = useDispatch();
  const classes = useStyles();
  const [userEmail, setuserEmail] = useState(email || '');
  const resetRequestStatus = useSelector(state => selectors.requestResetStatus(state));
  const resetRequestErrorMsg = useSelector(state => selectors.requestResetError(state));

  useEffect(() => {
    if (resetRequestStatus === 'success') {
      setShowError(false);
    } else {
      setShowError(true);
    }
  }, [resetRequestStatus, resetRequestErrorMsg, setShowError]);

  const handleAuthentication = useCallback(userEmail => {
    dispatch(actions.auth.resetRequest(userEmail));
  }, [dispatch]);
  const handleOnSubmit = useCallback(e => {
    e.preventDefault();
    const email = e?.target?.email?.value || e?.target?.elements?.email?.value;

    handleAuthentication(email);
  }, [handleAuthentication]);
  const handleOnChangeEmail = useCallback(e => {
    setuserEmail(e.target.value);
  }, []);

  return (
    <div className={clsx(classes.editableFields, className)}>
      <form onSubmit={handleOnSubmit}>
        <TextField
          data-private
          data-test="email"
          id="email"
          type="email"
          variant="filled"
          placeholder="Email"
          value={userEmail}
          onChange={handleOnChangeEmail}
          className={classes.textField}
        />
        <FilledButton
          data-test="submit"
          type="submit"
          className={classes.submit}
          value="Submit">
          Request password reset
        </FilledButton>
      </form>
    </div>
  );
}

