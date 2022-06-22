import React, { useMemo, useState, useCallback, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { useSelector, useDispatch } from 'react-redux';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Stepper from '../Stepper';
import HeaderWithHelpText from '../HeaderWithHelpText';
import useNotifySetupSuccess from '../useNotifySetupSuccess';
import useFormInitWithPermissions from '../../../../../hooks/useFormInitWithPermissions';
import { selectors } from '../../../../../reducers';
import actions from '../../../../../actions';
import DynaForm from '../../../../../components/DynaForm';
import useFormContext from '../../../../../components/Form/FormContext';
import OutlinedButton from '../../../../../components/Buttons/OutlinedButton';

const PRIMARY_ACCOUNT_FORM_KEY = 'mfa-primary-account-form';

const useStyles = makeStyles(theme => ({
  connect: {
    marginTop: theme.spacing(1),
  },
}));

function TrustDeviceStep({ trustDevice, setTrustDevice }) {
  const isMobileCodeVerified = useSelector(selectors.isMobileCodeVerified);

  return (
    <>
      <HeaderWithHelpText helpKey="mfa.trustDevice" title="Trust device">
        <span>Trust this device you&apos;ve used to sign into integrator.io</span>
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

function PrimaryAccountSelect() {
  const primaryAccounts = useSelector(selectors.primaryAccounts);
  const selectedPrimaryAccount = useSelector(selectors.selectedPrimaryAccount);
  const isMobileCodeVerified = useSelector(selectors.isMobileCodeVerified);
  const [remountKey, setRemountKey] = useState(1);

  useEffect(() => {
    setRemountKey(remountKey + 1);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isMobileCodeVerified]);

  const primaryAccountOptions = useMemo(() => (
    [{
      items: primaryAccounts.map(
        acc => ({label: acc.ownerUser?.name, value: acc.ownerUser?._id})
      ),
    }]
  ), [primaryAccounts]);

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

  useFormInitWithPermissions({ fieldMeta, formKey: PRIMARY_ACCOUNT_FORM_KEY, remountKey, disabled: !isMobileCodeVerified });

  return <DynaForm formKey={PRIMARY_ACCOUNT_FORM_KEY} />;
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
    };

    dispatch(actions.mfa.setup(payload));
  }, [dispatch, formValue, isValid, trustDevice]);

  return (
    <>
      <Stepper index={4}>
        <PrimaryAccountSelect />
      </Stepper>
      <Stepper index={5}>
        <TrustDeviceStep trustDevice={trustDevice} setTrustDevice={setTrustDevice} />
      </Stepper>
      <Stepper index={6} isLast>
        <HeaderWithHelpText helpKey="mfa.connect">
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

function ConnectOwnerDevice() {
  const dispatch = useDispatch();
  const classes = useStyles();
  const [trustDevice, setTrustDevice] = useState(false);
  const isMobileCodeVerified = useSelector(selectors.isMobileCodeVerified);
  const connectDevice = useCallback(() => {
    dispatch(actions.mfa.setup({ trustDevice, enabled: true }));
  }, [dispatch, trustDevice]);

  return (
    <>
      <Stepper index={4}>
        <TrustDeviceStep trustDevice={trustDevice} setTrustDevice={setTrustDevice} />
      </Stepper>
      <Stepper index={5} isLast>
        <HeaderWithHelpText helpKey="mfa.connect">
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

  useNotifySetupSuccess({ mode: 'connect' });

  if (isAccountOwner) {
    return <ConnectOwnerDevice />;
  }

  return <ConnectAccountUserDevice />;
}

