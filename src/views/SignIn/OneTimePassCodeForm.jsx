import React, { useCallback, useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import clsx from 'clsx';
import TextField from '@material-ui/core/TextField';
import FormHelperText from '@material-ui/core/FormHelperText';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Link from '@material-ui/core/Link';
import { makeStyles } from '@material-ui/core/styles';
import { FilledButton } from '../../components/Buttons';
import Spinner from '../../components/Spinner';
import actions from '../../actions';
import { selectors } from '../../reducers';
import ErrorIcon from '../../components/icons/ErrorIcon';
import { NUMBER_REGEX } from '../../constants';

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
  message: {
    position: 'relative',
    top: theme.spacing(-1),
    display: 'flex',
    alignItems: 'center',
    lineHeight: `${theme.spacing(2)}px`,
    color: theme.palette.secondary.light,
    marginBottom: theme.spacing(1),
  },
  textField: {
    width: '100%',
    background: theme.palette.background.paper,
    marginBottom: 10,
  },
  wrapper: {
    textAlign: 'left',
    marginBottom: theme.spacing(2),
  },
  flexWrapper: {
    display: 'flex',
    justifyContent: 'space-between',
    marginTop: theme.spacing(1),
  },
  flexRight: {
    flexDirection: 'row-reverse',
  },
  errorIcon: {
    marginRight: theme.spacing(0.5),
    fontSize: theme.spacing(2),
  },
}));

export default function OneTimePassCodeForm({ dialogOpen }) {
  const classes = useStyles();
  const dispatch = useDispatch();
  const isMFAAuthRequestInProgress = useSelector(selectors.isMFAAuthRequested);
  const { dontAllowTrustedDevices } = useSelector(selectors.mfaAuthInfo);
  const mfaError = useSelector(selectors.mfaError);
  const [error, setError] = useState();
  const [trustDevice, setTrustDevice] = useState(false);
  const handleOnSubmit = useCallback(e => {
    e.preventDefault();
    const code = e?.target?.code?.value?.trim() || e?.target?.elements?.code?.value?.trim();

    if (!code.length) {
      setError('One time passcode is required');

      return;
    }
    if (!NUMBER_REGEX.test(code) || code.length !== 6) {
      setError('Invalid one time passcode');

      return;
    }

    const payload = { code };

    if (!dontAllowTrustedDevices) {
      payload.trustDevice = e.target.trustDevice.checked;
    }
    dispatch(actions.auth.mfaVerify.request(payload));
  }, [dispatch, dontAllowTrustedDevices]);

  useEffect(() => {
    setError(mfaError);
  }, [mfaError]);

  return (
    <div className={classes.editableFields}>
      <form onSubmit={handleOnSubmit}>
        <TextField
          data-private
          data-test="code"
          id="code"
          type="text"
          inputProps={{ maxLength: 6 }}
          variant="filled"
          placeholder="One-time passcode*"
          className={classes.textField} />
        {
            error && (
              <FormHelperText error className={classes.message}>
                <ErrorIcon className={classes.errorIcon} data-private /> {error}
              </FormHelperText>
            )
          }
        <div className={clsx(classes.flexWrapper, { [classes.flexRight]: dontAllowTrustedDevices })}>
          {!dontAllowTrustedDevices && (
          <FormControlLabel
            control={(
              <Checkbox
                id="trustDevice"
                color="primary"
                checked={trustDevice}
                data-test="trustDevice"
                onChange={() => setTrustDevice(t => !t)}
            />
          )}
            label="Trust this device" />
          )}
          {!dialogOpen && (
          <Link href="/mfa/help" className={classes.forgotPass} variant="body2">
            Need help?
          </Link>
          )}
        </div>

        { isMFAAuthRequestInProgress ? <Spinner />
          : (
            <FilledButton
              data-test="submit"
              type="submit"
              className={classes.submit}
              value="Submit">
              Submit
            </FilledButton>
          )}
      </form>
    </div>
  );
}
