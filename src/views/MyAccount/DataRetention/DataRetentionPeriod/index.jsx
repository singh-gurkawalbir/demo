import React, { useMemo, useCallback, useEffect, useState } from 'react';
import makeStyles from '@mui/styles/makeStyles';
import { useDispatch, useSelector } from 'react-redux';
import useFormInitWithPermissions from '../../../../hooks/useFormInitWithPermissions';
import DynaForm from '../../../../components/DynaForm';
import DynaSubmit from '../../../../components/DynaForm/DynaSubmit';
import { selectors } from '../../../../reducers';
import actions from '../../../../actions';
import useEnqueueSnackbar from '../../../../hooks/enqueueSnackbar';
import messageStore, { message } from '../../../../utils/messageStore';
import { ACCOUNT_SETTINGS_DATA_RETENTION_ASYNC_KEY, FORM_SAVE_STATUS } from '../../../../constants';
import useConfirmDialog from '../../../../components/ConfirmDialog';
import RawHtml from '../../../../components/RawHtml';
import useFormContext from '../../../../components/Form/FormContext';
import NotificationToaster from '../../../../components/NotificationToaster';

const useStyles = makeStyles(theme => ({
  periodChangedNotification: {
    padding: 0,
    marginTop: theme.spacing(-1),
    marginBottom: theme.spacing(1),
  },
}));

export default function DataRetentionPeriod() {
  const classes = useStyles();
  const dispatch = useDispatch();
  const { confirmDialog } = useConfirmDialog();
  const [enquesnackbar] = useEnqueueSnackbar();
  const [remountKey, setRemountKey] = useState(1);
  const maxAllowedDataRetention = useSelector(state => selectors.platformLicense(state)?.maxAllowedDataRetention);
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
          maxAllowedDataRetention: (maxAllowedDataRetention || 30),
        },
      },
    }),
    [dataRetentionPeriod, maxAllowedDataRetention]
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
      message: <RawHtml
        html={messageStore('DATA_RETENTION.PERIOD_UPDATE_CONFIRM', {
          newDataRetentionPeriod: values.dataRetentionPeriod,
          currentDataRetentionPeriod: dataRetentionPeriod})} />,
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
  }, [confirmDialog, dispatch, dataRetentionPeriod]);

  useEffect(() => {
    setRemountKey(key => key + 1);
  }, [dataRetentionPeriod]);

  useEffect(() => {
    if (areUserAccountSettingsUpdated) {
      enquesnackbar({
        message: message.DATA_RETENTION.PERIOD_UPDATED,
        variant: 'success',
      });
      dispatch(actions.asyncTask.clear(ACCOUNT_SETTINGS_DATA_RETENTION_ASYNC_KEY));
    }
  }, [areUserAccountSettingsUpdated, enquesnackbar, dispatch]);

  return (
    <div>
      <DynaForm formKey={formKey} />
      {isPeriodChanged ? (
        <NotificationToaster variant="warning" className={classes.periodChangedNotification} transparent noBorder>
          <RawHtml html={message.DATA_RETENTION.PERIOD_CHANGE_INFO} />
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

