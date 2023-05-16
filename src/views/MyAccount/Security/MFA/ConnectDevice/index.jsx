import React, { useMemo, useState, useCallback, useEffect } from 'react';
import makeStyles from '@mui/styles/makeStyles';
import { useSelector, useDispatch } from 'react-redux';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import { Typography } from '@mui/material';
import { OutlinedButton } from '@celigo/fuse-ui';
import Stepper from '../Stepper';
import HeaderWithHelpText from '../HeaderWithHelpText';
import useForm from '../../../../../components/Form';
import { selectors } from '../../../../../reducers';
import actions from '../../../../../actions';
import DynaForm from '../../../../../components/DynaForm';
import useFormContext from '../../../../../components/Form/FormContext';
import { message } from '../../../../../utils/messageStore';

const PRIMARY_ACCOUNT_FORM_KEY = 'mfa-primary-account-form';

const useStyles = makeStyles(theme => ({
  connect: {
    marginTop: theme.spacing(1),
  },
  verificationLabel: {
    '& .MuiFormLabel-root': {
      fontSize: 17,
      fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    },
  },
}));

function TrustDeviceStep({ trustDevice, setTrustDevice }) {
  const isMobileCodeVerified = useSelector(selectors.isMobileCodeVerified);

  return (
    <>
      <HeaderWithHelpText helpKey="mfa.trustDevice" title="Trust device">
        <Typography variant="h5">{message.SUBSCRIPTION.TRUST_DEVICE}</Typography>
      </HeaderWithHelpText>
      <div>
        <FormControlLabel
          disabled={!isMobileCodeVerified}
          control={(
            <Checkbox
              color="primary"
              checked={trustDevice}
              data-test="trustDevice"
              onChange={() => setTrustDevice(!trustDevice)}
            />
          )}
          label="Trust device"
        />
      </div>
    </>
  );
}

function PrimaryAccountSelect({className}) {
  const primaryAccounts = useSelector(selectors.primaryAccounts);

  const selectedPrimaryAccount = useSelector(selectors.selectedPrimaryAccount);
  const isMobileCodeVerified = useSelector(selectors.isMobileCodeVerified);
  const [remountKey, setRemountKey] = useState(1);
  const primaryAccountOptions = useMemo(() => (
    [{
      items: primaryAccounts.map(
        acc => ({label: acc.ownerUser?.company, value: acc.ownerUser?._id})
      ),
    }]
  ), [primaryAccounts]);

  useEffect(() => {
    setRemountKey(remountKey + 1);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isMobileCodeVerified, primaryAccountOptions]);

  const fieldMeta = useMemo(
    () => ({
      fieldMap: {
        _allowResetByUserId: {
          id: '_allowResetByUserId',
          name: '_allowResetByUserId',
          label: 'Choose primary account to reset MFA ',
          defaultValue: selectedPrimaryAccount,
          type: 'select',
          helpKey: 'mfa.primaryAccount',
          noApi: true,
          isLoggable: false,
          required: true,
          options: primaryAccountOptions,
        },
      },
    }),
    [primaryAccountOptions, selectedPrimaryAccount]
  );

  useForm({ fieldMeta, formKey: PRIMARY_ACCOUNT_FORM_KEY, remount: remountKey, disabled: !isMobileCodeVerified });

  return <DynaForm formKey={PRIMARY_ACCOUNT_FORM_KEY} className={className} />;
}

function ConnectAccountUserDevice() {
  const dispatch = useDispatch();
  const classes = useStyles();
  const [trustDevice, setTrustDevice] = useState(false);
  const isMobileCodeVerified = useSelector(selectors.isMobileCodeVerified);

  const { isValid, value: formValue } = useFormContext(PRIMARY_ACCOUNT_FORM_KEY) || {};
  const connectDevice = useCallback(() => {
    dispatch(actions.form.showFormValidations(PRIMARY_ACCOUNT_FORM_KEY));
    if (!isValid) return;
    const { _allowResetByUserId } = formValue;
    const payload = {
      _allowResetByUserId,
      trustDevice,
      enabled: true,
      context: 'setup',
    };

    dispatch(actions.mfa.setup(payload));
  }, [dispatch, formValue, isValid, trustDevice]);

  return (
    <>
      <Stepper index={4}>
        <PrimaryAccountSelect className={classes.verificationLabel} />
      </Stepper>
      <Stepper index={5}>
        <TrustDeviceStep trustDevice={trustDevice} setTrustDevice={setTrustDevice} />
      </Stepper>
      <Stepper index={6} isLast>
        <HeaderWithHelpText title="Connect your mobile device" helpKey="mfa.connect">
          <Typography variant="h5"> Connect your mobile device &nbsp;*</Typography>
        </HeaderWithHelpText>
        <div className={classes.connect}>
          <OutlinedButton
            disabled={!isMobileCodeVerified}
            onClick={connectDevice}>
            Connect
          </OutlinedButton>
        </div>
      </Stepper>
    </>
  );
}

function ConnectOwnerDevice() {
  const dispatch = useDispatch();
  const classes = useStyles();
  const [trustDevice, setTrustDevice] = useState(false);
  const isMobileCodeVerified = useSelector(selectors.isMobileCodeVerified);
  const connectDevice = useCallback(() => {
    dispatch(actions.mfa.setup({ trustDevice, enabled: true, context: 'setup'}));
  }, [dispatch, trustDevice]);

  return (
    <>
      <Stepper index={4}>
        <TrustDeviceStep trustDevice={trustDevice} setTrustDevice={setTrustDevice} />
      </Stepper>
      <Stepper index={5} isLast>
        <HeaderWithHelpText title="Connect your mobile device" helpKey="mfa.connect">
          <b> Connect your mobile device &nbsp;*</b>
        </HeaderWithHelpText>
        <div className={classes.connect}>
          <OutlinedButton
            disabled={!isMobileCodeVerified}
            onClick={connectDevice}>
            Connect
          </OutlinedButton>
        </div>
      </Stepper>
    </>
  );
}

export default function ConnectDevice() {
  const isAccountOwner = useSelector(state => selectors.isAccountOwner(state));

  if (isAccountOwner) {
    return <ConnectOwnerDevice />;
  }

  return <ConnectAccountUserDevice />;
}

