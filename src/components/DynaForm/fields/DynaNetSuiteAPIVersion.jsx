import React, { useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import makeStyles from '@mui/styles/makeStyles';
import { Spinner } from '@celigo/fuse-ui';
import FieldMessage from './FieldMessage';
import DynaRadio from './radiogroup/DynaRadioGroup';
import { selectors } from '../../../reducers';
import actions from '../../../actions';
import useSelectorMemo from '../../../hooks/selectors/useSelectorMemo';

const useStyles = makeStyles(theme => ({
  refreshLoader: {
    marginLeft: theme.spacing(1),
  },
}));

export default function DynaNetsuiteAPIVersion(props) {
  const { onFieldChange, connectionId, isNew, resourceType, resourceId, value, id } = props;

  const classes = useStyles();
  const dispatch = useDispatch();

  const isOffline = useSelector(state =>
    selectors.isConnectionOffline(state, connectionId)
  );

  const [refreshBundleInstalledInfo, setRefreshBundleInstalledInfo] = useState(true);
  // isFieldChanged is used to know when user manually updates API version
  const [isFieldChanged, setIsFieldChanged] = useState(false);

  const { data, status, errorMessage } = useSelectorMemo(
    selectors.makeOptionsFromMetadata,
    connectionId,
    `connections/${connectionId}/distributedApps`,
    'suitescript-bundle-status'
  );

  const isSuiteBundleInstalled = data?.bundle?.success;
  const isSuiteAppInstalled = data?.suiteapp?.success;
  const isLoadingMetadata = !status || status === 'requested';
  const url = (value === 'suiteapp2.0' || value === 'suiteapp1.0') ? data?.suiteapp?.URL : data?.bundle?.URL;

  const handleFieldChange = useCallback(
    (id, value) => {
      setIsFieldChanged(true);
      onFieldChange(id, value);
    },
    [onFieldChange],
  );

  useEffect(() => {
    if (isNew && !isFieldChanged) {
    // update field to SuiteApp 2.x version if the field is not touched yet

      onFieldChange(id, 'suiteapp2.0');
    }
  }, [isNew, id, isFieldChanged, onFieldChange]);

  useEffect(() => {
    if ((!data || refreshBundleInstalledInfo) && !isOffline) {
      dispatch(actions.metadata.getBundleInstallStatus(connectionId));
      setRefreshBundleInstalledInfo(false);
    }

    if (!isLoadingMetadata && !refreshBundleInstalledInfo && !isOffline) {
      const showBundleInstallNotification = value === 'suitebundle' && !isSuiteBundleInstalled;
      const showSuiteAppInstallNotification = (value === 'suiteapp2.0' || value === 'suiteapp1.0') && !isSuiteAppInstalled;

      if (showBundleInstallNotification) {
        dispatch(actions.resourceForm.hideSuiteAppInstallNotification(resourceType, resourceId));
        dispatch(actions.resourceForm.showBundleInstallNotification(url, resourceType, resourceId));
      }

      if (showSuiteAppInstallNotification) {
        dispatch(actions.resourceForm.hideBundleInstallNotification(resourceType, resourceId));
        dispatch(actions.resourceForm.showSuiteAppInstallNotification(url, resourceType, resourceId));
      }
    }

    return () => {
      dispatch(actions.resourceForm.hideBundleInstallNotification(resourceType, resourceId));
      dispatch(actions.resourceForm.hideSuiteAppInstallNotification(resourceType, resourceId));
    };
  }, [connectionId, data, dispatch, isOffline, refreshBundleInstalledInfo, resourceId, resourceType, isLoadingMetadata, isSuiteAppInstalled, isSuiteBundleInstalled, value, url]);
  if (isNew && isLoadingMetadata && !errorMessage) {
    return (
      <span
        className={classes.refreshLoader}>
        <Spinner />
      </span>
    );
  }

  return (
    <>
      <DynaRadio {...props} onFieldChange={handleFieldChange} />
      <FieldMessage errorMessages={errorMessage} />
    </>
  );
}

