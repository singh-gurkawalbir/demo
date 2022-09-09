import React, { useMemo, useCallback, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import CollapsableContainer from '../../../../../components/CollapsableContainer';
import useFormInitWithPermissions from '../../../../../hooks/useFormInitWithPermissions';
import DynaForm from '../../../../../components/DynaForm';
import Spinner from '../../../../../components/Spinner';
import DynaSubmit from '../../../../../components/DynaForm/DynaSubmit';
import { selectors } from '../../../../../reducers';
import actions from '../../../../../actions';

const useStyles = makeStyles(theme => ({
  footer: {
    margin: theme.spacing(2, 2, 0, 0),
  },
  container: {
    margin: theme.spacing(2),
  },
}));

export default function AccountSettings() {
  const classes = useStyles();
  const dispatch = useDispatch();
  const [remountKey, setRemountKey] = useState(1);

  const areAccountSettingsLoaded = useSelector(selectors.areAccountSettingsLoaded);
  const mfaAccountSettings = useSelector(selectors.mfaAccountSettings);

  const fieldMeta = useMemo(
    () => ({
      fieldMap: {
        dontAllowTrustedDevices: {
          id: 'dontAllowTrustedDevices',
          name: 'dontAllowTrustedDevices',
          label: 'Do not allow trusted devices',
          defaultValue: mfaAccountSettings?.dontAllowTrustedDevices,
          type: 'checkbox',
          noApi: true,
          isLoggable: false,
        },
        trustDeviceForPeriod: {
          id: 'trustDeviceForPeriod',
          name: 'trustDeviceForPeriod',
          type: 'text',
          label: 'Number of days until MFA is required again for trusted devices',
          defaultValue: mfaAccountSettings?.trustDeviceForPeriod,
          disabledWhen: [{ field: 'dontAllowTrustedDevices', is: [true] }],
          noApi: true,
          isLoggable: false,
        },
      },
    }),
    [mfaAccountSettings]
  );

  useEffect(() => {
    setRemountKey(key => key + 1);
  }, [mfaAccountSettings]);

  const formKey = useFormInitWithPermissions({ fieldMeta, remount: remountKey });

  const updateAccountSettings = useCallback(values => {
    const { dontAllowTrustedDevices, trustDeviceForPeriod } = values;

    dispatch(actions.mfa.updateAccountSettings({ dontAllowTrustedDevices, trustDeviceForPeriod }));
  }, [dispatch]);

  useEffect(() => {
    if (!areAccountSettingsLoaded) {
      dispatch(actions.mfa.requestAccountSettings());
    }
  }, [areAccountSettingsLoaded, dispatch]);

  if (!areAccountSettingsLoaded) {
    return (
      <CollapsableContainer title="Account settings" forceExpand>
        <Spinner centerAll />
      </CollapsableContainer>
    );
  }

  return (
    <CollapsableContainer title="Account settings" forceExpand>
      <div className={classes.container}>
        <DynaForm formKey={formKey} className={classes.ssoFormContainer} />
        <div className={classes.footer}>
          <DynaSubmit
            formKey={formKey}
            className={classes.saveConfig}
            onClick={updateAccountSettings}>
            Save
          </DynaSubmit>
        </div>
      </div>
    </CollapsableContainer>
  );
}

