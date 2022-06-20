import React, { useMemo, useState, useCallback, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Stepper from '../Stepper';
import useFormInitWithPermissions from '../../../../../hooks/useFormInitWithPermissions';
import { selectors } from '../../../../../reducers';
import actions from '../../../../../actions';
import DynaForm from '../../../../../components/DynaForm';
import useFormContext from '../../../../../components/Form/FormContext';
import OutlinedButton from '../../../../../components/Buttons/OutlinedButton';

const PRIMARY_ACCOUNT_FORM_KEY = 'mfa-primary-account-form';

function TrustDeviceStep({ trustDevice, setTrustDevice }) {
  const isMobileCodeVerified = useSelector(selectors.isMobileCodeVerified);

  return (
    <>
      <div>Trust this device you’ve used to sign into integrator.io</div>
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
    </>
  );
}

function PrimaryAccountSelect() {
  const primaryAccounts = useSelector(selectors.primaryAccounts);
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
          disabled: isMobileCodeVerified,
          type: 'select',
          noApi: true,
          isLoggable: false,
          required: true,
          options: primaryAccountOptions,
        },
      },
    }),
    [primaryAccountOptions, isMobileCodeVerified]
  );

  useFormInitWithPermissions({ fieldMeta, formKey: PRIMARY_ACCOUNT_FORM_KEY, remountKey });

  return <DynaForm formKey={PRIMARY_ACCOUNT_FORM_KEY} />;
}

function ConnectAccountUserDevice() {
  const dispatch = useDispatch();
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

    dispatch(actions.mfa.setUp(payload));
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
        <OutlinedButton
          disabled={!isMobileCodeVerified}
          onClick={connectDevice}>
          Connect
        </OutlinedButton>
      </Stepper>
    </>
  );
}

function ConnectOwnerDevice() {
  const dispatch = useDispatch();
  const [trustDevice, setTrustDevice] = useState(false);
  const isMobileCodeVerified = useSelector(selectors.isMobileCodeVerified);
  const connectDevice = useCallback(() => {
    dispatch(actions.mfa.setUp({ trustDevice, enabled: true }));
  }, [dispatch, trustDevice]);

  return (
    <>
      <Stepper index={4}>
        <TrustDeviceStep trustDevice={trustDevice} setTrustDevice={setTrustDevice} />
      </Stepper>
      <Stepper index={5} isLast>
        <OutlinedButton
          disabled={!isMobileCodeVerified}
          onClick={connectDevice}>
          Connect
        </OutlinedButton>
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

