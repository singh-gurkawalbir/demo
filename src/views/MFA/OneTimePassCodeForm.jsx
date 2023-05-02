import React, { useCallback, useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useHistory } from 'react-router-dom';
import TextField from '@mui/material/TextField';
import FormHelperText from '@mui/material/FormHelperText';
import { Box } from '@mui/material';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import makeStyles from '@mui/styles/makeStyles';
import { Spinner } from '@celigo/fuse-ui';
import { FilledButton, TextButton } from '../../components/Buttons';
import actions from '../../actions';
import { selectors } from '../../reducers';
import ErrorIcon from '../../components/icons/ErrorIcon';
import { NUMBER_REGEX } from '../../constants';
import getRoutePath from '../../utils/routePaths';
import LoginFormWrapper from '../../components/LoginScreen/LoginFormWrapper';

const useStyles = makeStyles(theme => ({
  wrapper: {
    textAlign: 'left',
    marginBottom: theme.spacing(2),
  },
  errorIcon: {
    marginRight: theme.spacing(0.5),
    fontSize: theme.spacing(2),
  },
}));

export default function OneTimePassCodeForm() {
  const classes = useStyles();
  const dispatch = useDispatch();
  const history = useHistory();
  const isMFAAuthRequestInProgress = useSelector(selectors.isMFAAuthRequested);
  const isMFAVerified = useSelector(selectors.isMFAAuthVerified);
  const { dontAllowTrustedDevices, isAccountUser } = useSelector(selectors.mfaAuthInfo);
  const mfaError = useSelector(selectors.mfaError);
  const [error, setError] = useState();
  const [trustDevice, setTrustDevice] = useState(false);
  // Trust device option is always available to account owner
  // For account user, depends on 'dontAllowTrustedDevices' configuration in the account settings of the owner
  const showTrustDevice = !isAccountUser || (isAccountUser && !dontAllowTrustedDevices);

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

    if (showTrustDevice) {
      payload.trustDevice = e?.target?.trustDevice?.checked || e?.target?.elements?.trustDevice?.checked;
    }
    dispatch(actions.auth.mfaVerify.request(payload));
  }, [dispatch, showTrustDevice]);

  useEffect(() => {
    setError(mfaError);
  }, [mfaError]);
  useEffect(() => {
    if (isMFAVerified) {
      history.push(getRoutePath('/'));
    }
  }, [history, isMFAVerified]);

  return (
    <LoginFormWrapper>
      <form onSubmit={handleOnSubmit}>
        <TextField
          data-private
          data-test="code"
          id="code"
          type="text"
          inputProps={{ maxLength: 6 }}
          variant="filled"
          placeholder="One-time passcode*"
          sx={{
            width: '100%',
            background: theme => theme.palette.background.paper,
            marginBottom: '10px',
          }} />
        {
            error && (
              <FormHelperText
                error
                sx={{
                  position: 'relative',
                  top: theme => theme.spacing(-1),
                  display: 'flex',
                  alignItems: 'center',
                  lineHeight: theme => theme.spacing(2),
                  color: theme => theme.palette.secondary.light,
                  marginBottom: theme => theme.spacing(1),
                }}>
                <ErrorIcon className={classes.errorIcon} data-private /> {error}
              </FormHelperText>
            )
          }
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            marginTop: theme => theme.spacing(1),
            marginBottom: theme => theme.spacing(2),
            ...(!showTrustDevice && {
              flexDirection: 'row-reverse',
            }),
          }}>
          {showTrustDevice && (
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
          <TextButton
            to={getRoutePath('/mfa/help')}
            data-test="needHelp"
            color="primary"
            className={classes.forgotPass}
            component={Link}
            role="link"
          >
            Need help?
          </TextButton>
        </Box>

        { isMFAAuthRequestInProgress ? <Spinner />
          : (
            <FilledButton
              data-test="submit"
              type="submit"
              submit
              value="Submit">
              Submit
            </FilledButton>
          )}
      </form>
    </LoginFormWrapper>
  );
}
