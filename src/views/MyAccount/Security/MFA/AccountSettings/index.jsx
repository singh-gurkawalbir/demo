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
import useEnqueueSnackbar from '../../../../../hooks/enqueueSnackbar';
import messageStore from '../../../../../utils/messageStore';
import { MFA_ACCOUNT_SETTINGS_ASYNC_KEY, FORM_SAVE_STATUS } from '../../../../../constants';

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
  const [enquesnackbar] = useEnqueueSnackbar();
  const [remountKey, setRemountKey] = useState(1);

  const areAccountSettingsLoaded = useSelector(selectors.areAccountSettingsLoaded);
  const mfaAccountSettings = useSelector(selectors.mfaAccountSettings);
  const areAccountSettingsUpdated = useSelector(state => selectors.asyncTaskStatus(state, MFA_ACCOUNT_SETTINGS_ASYNC_KEY) === FORM_SAVE_STATUS.COMPLETE);
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

    dispatch(actions.mfa.updateAccountSettings({ dontAllowTrustedDevices, trustDeviceForPeriod: +trustDeviceForPeriod }));
  }, [dispatch]);

  useEffect(() => {
    if (!areAccountSettingsLoaded) {
      dispatch(actions.mfa.requestAccountSettings());
    }
  }, [areAccountSettingsLoaded, dispatch]);

  useEffect(() => {
    if (areAccountSettingsUpdated) {
      enquesnackbar({
        message: messageStore('MFA_ACCOUNT_SETTINGS_UPDATED'),
        variant: 'success',
      });
      dispatch(actions.asyncTask.clear(MFA_ACCOUNT_SETTINGS_ASYNC_KEY));
    }
  }, [areAccountSettingsUpdated, enquesnackbar, dispatch]);

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

