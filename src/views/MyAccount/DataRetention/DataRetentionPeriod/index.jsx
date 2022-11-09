import React, { useMemo, useCallback, useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { useDispatch, useSelector } from 'react-redux';
import useFormInitWithPermissions from '../../../../hooks/useFormInitWithPermissions';
import DynaForm from '../../../../components/DynaForm';
import DynaSubmit from '../../../../components/DynaForm/DynaSubmit';
import { selectors } from '../../../../reducers';
import actions from '../../../../actions';
import useEnqueueSnackbar from '../../../../hooks/enqueueSnackbar';
import messageStore from '../../../../utils/messageStore';
import { ACCOUNT_SETTINGS_DATA_RETENTION_ASYNC_KEY, FORM_SAVE_STATUS } from '../../../../constants';
import useConfirmDialog from '../../../../components/ConfirmDialog';
import RawHtml from '../../../../components/RawHtml';
import useFormContext from '../../../../components/Form/FormContext';
import NotificationToaster from '../../../../components/NotificationToaster';

const useStyles = makeStyles(() => ({
  root: {
  },
}));

export default function DataRetentionPeriod() {
  const classes = useStyles();
  const dispatch = useDispatch();
  const { confirmDialog } = useConfirmDialog();
  const [enquesnackbar] = useEnqueueSnackbar();
  const [remountKey, setRemountKey] = useState(1);
  const platformLicense = useSelector(state => selectors.platformLicense(state));
  const dataRetentionPeriod = useSelector(selectors.dataRetentionPeriod);
  const areUserAccountSettingsUpdated = useSelector(state => selectors.asyncTaskStatus(state, ACCOUNT_SETTINGS_DATA_RETENTION_ASYNC_KEY) === FORM_SAVE_STATUS.COMPLETE);
  const fieldMeta = useMemo(
    () => ({
      fieldMap: {
        dataRetentionPeriod: {
          id: 'dataRetentionPeriod',
          name: 'dataRetentionPeriod',
          type: 'selectdataretentionperiod',
          label: 'Data retention period',
          defaultValue: dataRetentionPeriod,
          noApi: true,
          isLoggable: false,
          helpKey: 'accountSettings.dataRetentionPeriod',
          maxAllowedDataRetention: platformLicense.maxAllowedDataRetention,
        },
      },
    }),
    [dataRetentionPeriod, platformLicense.maxAllowedDataRetention]
  );

  const formKey = useFormInitWithPermissions({
    fieldMeta,
    remount: remountKey,
  });
  const {
    value: formValue,
  } = useFormContext(formKey) || {};
  const isPeriodChanged = formValue?.dataRetentionPeriod !== dataRetentionPeriod;

  const updateDataRetentionPeriod = useCallback(values => {
    confirmDialog({
      title: 'Confirm save',
      message: <RawHtml html={messageStore('DATA_RETENTION_PERIOD_UPDATE_CONFIRM')} />,
      buttons: [
        { label: 'Save',
          dataTest: 'confirmDataRetentionSave',
          onClick: () => {
            dispatch(actions.accountSettings.update(values));
          },
        },
        { label: 'Cancel',
          dataTest: 'confirmDataRetentionCancel',
          variant: 'text',
        },
      ],
    });
  }, [confirmDialog, dispatch]);

  useEffect(() => {
    setRemountKey(key => key + 1);
  }, [dataRetentionPeriod]);

  useEffect(() => {
    if (areUserAccountSettingsUpdated) {
      enquesnackbar({
        message: messageStore('DATA_RETENTION_PERIOD_UPDATED'),
        variant: 'success',
      });
      dispatch(actions.asyncTask.clear(ACCOUNT_SETTINGS_DATA_RETENTION_ASYNC_KEY));
    }
  }, [areUserAccountSettingsUpdated, enquesnackbar, dispatch]);

  return (
    <div>
      <DynaForm formKey={formKey} />
      {isPeriodChanged ? (
        <NotificationToaster variant="warning" transparent >
          <RawHtml html={messageStore('DATA_RETENTION_PERIOD_CHANGE_INFO')} />
        </NotificationToaster>
      ) : ''}
      <div className={classes.footer}>
        <DynaSubmit
          formKey={formKey}
          disabled={!isPeriodChanged}
          data-test="dataRetentionSave"
          onClick={updateDataRetentionPeriod}>
          Save
        </DynaSubmit>
      </div>
    </div>
  );
}

