import React, { useMemo, useCallback, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import makeStyles from '@mui/styles/makeStyles';
import { Spinner } from '@celigo/fuse-ui';
import CollapsableContainer from '../../../../../components/CollapsableContainer';
import useForm from '../../../../../components/Form';
import DynaForm from '../../../../../components/DynaForm';
import DynaSubmit from '../../../../../components/DynaForm/DynaSubmit';
import { selectors } from '../../../../../reducers';
import actions from '../../../../../actions';
import useEnqueueSnackbar from '../../../../../hooks/enqueueSnackbar';
import { message } from '../../../../../utils/messageStore';
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
          helpKey: 'mfa.dontAllowTrustedDevices',
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
          helpKey: 'mfa.trustDeviceForPeriod',
          validWhen: {
            matchesRegEx: {
              pattern: '^[1-9]\\d*$',
              message: 'Value must be numbers only',
            },
          },
        },
      },
    }),
    [mfaAccountSettings]
  );

  useEffect(() => {
    setRemountKey(key => key + 1);
  }, [mfaAccountSettings]);

  const formKey = useForm({ fieldMeta, remount: remountKey });

  const updateAccountSettings = useCallback(values => {
    dispatch(actions.mfa.updateAccountSettings(values));
  }, [dispatch]);

  useEffect(() => {
    if (!areAccountSettingsLoaded) {
      dispatch(actions.mfa.requestAccountSettings());
    }
  }, [areAccountSettingsLoaded, dispatch]);

  useEffect(() => {
    if (areAccountSettingsUpdated) {
      enquesnackbar({
        message: message.MFA.ACCOUNT_SETTINGS_UPDATED,
        variant: 'success',
      });
      dispatch(actions.asyncTask.clear(MFA_ACCOUNT_SETTINGS_ASYNC_KEY));
    }
  }, [areAccountSettingsUpdated, enquesnackbar, dispatch]);

  if (!areAccountSettingsLoaded) {
    return (
      <CollapsableContainer title="Account settings" forceExpand>
        <Spinner center="horizontal" size="large" />
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

