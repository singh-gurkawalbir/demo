import React, { useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import FieldMessage from './FieldMessage';
import Spinner from '../../Spinner';
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

  const handleFieldChange = useCallback(
    (id, value) => {
      setIsFieldChanged(true);
      onFieldChange(id, value);
    },
    [onFieldChange],
  );

  useEffect(() => {
    if (isNew && !isFieldChanged) {
    // update field to 2.0 version if the field is not touched yet and has only suiteApp installed
    // else 1.0 version
    // this also gets triggered, when the connection is changed on the resource form
      const fieldValue = !isSuiteBundleInstalled && isSuiteAppInstalled ? 'true' : 'false';

      onFieldChange(id, fieldValue);
    }
  }, [connectionId, isNew, id, isFieldChanged, isSuiteAppInstalled, isSuiteBundleInstalled, onFieldChange]);

  useEffect(() => {
    if ((!data || refreshBundleInstalledInfo) && !isOffline) {
      dispatch(actions.metadata.getBundleInstallStatus(connectionId));
      setRefreshBundleInstalledInfo(false);
    }

    if (!isLoadingMetadata && !refreshBundleInstalledInfo && !isOffline) {
      const showBundleInstallNotification = value === 'true' ? !isSuiteAppInstalled : !isSuiteBundleInstalled;

      if (!showBundleInstallNotification) {
        dispatch(actions.resourceForm.hideBundleInstallNotification(resourceType, resourceId));
      } else {
        const url = value === 'true' ? data?.suiteapp?.URL : data?.bundle?.URL;
        const bundleVersion = value === 'true' ? '2.0' : '1.0';

        dispatch(actions.resourceForm.showBundleInstallNotification(bundleVersion, url, resourceType, resourceId));
      }
    }

    return () => {
      dispatch(actions.resourceForm.hideBundleInstallNotification(resourceType, resourceId));
    };
  }, [connectionId, data, dispatch, isOffline, refreshBundleInstalledInfo, resourceId, resourceType, isLoadingMetadata, isSuiteAppInstalled, isSuiteBundleInstalled, value]);

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

