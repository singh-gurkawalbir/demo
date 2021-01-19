import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import Spinner from '../../Spinner';
import actions from '../../../actions';
import DynaRadio from './radiogroup/DynaRadioGroup';
import { selectors } from '../../../reducers';
import useSelectorMemo from '../../../hooks/selectors/useSelectorMemo';
import FieldMessage from './FieldMessage';

const useStyles = makeStyles(theme => ({
  refreshLoader: {
    marginLeft: theme.spacing(1),
  },
}));

export default function DynaNetSuiteAPIVersion(props) {
  const dispatch = useDispatch();
  const classes = useStyles();
  const [refreshBundleInstalledInfo, setRefreshBundleInstalledInfo] = useState(true);
  const [isInitValueChanged, setIsInitValueChanged] = useState(false);

  const {
    connectionId,
    isNew,
    value,
    resourceType,
    resourceId,
    onFieldChange,
  } = props;
  const commMetaPath = `connections/${connectionId}/distributedApps`;
  const filterKey = 'suitescript-bundle-status';

  const isOffline = useSelector(state =>
    selectors.isConnectionOffline(state, connectionId)
  );

  const {data, status, errorMessage} = useSelectorMemo(selectors.makeOptionsFromMetadata, connectionId,
    commMetaPath, filterKey);

  const isSuiteBundleInstalled = data?.bundle?.success;
  const isSuiteAppInstalled = data?.suiteapp?.success;

  const isLoading =
    (!status ||
      status === 'requested');

  // Based on installation info of bundle/suiteapp ,initial value will be selected
  // if both installed, then select api version as 1.0
  let initValueForField = 'false';

  if (!isSuiteBundleInstalled && isSuiteAppInstalled) {
    initValueForField = 'true';
  }

  useEffect(() => {
    if ((!data || refreshBundleInstalledInfo) && !isOffline) {
      dispatch(actions.metadata.getBundleInstallStatus(connectionId));
      setRefreshBundleInstalledInfo(false);
    }

    if (!isLoading && !refreshBundleInstalledInfo && !isOffline) {
      const currentFieldValue = isNew && !isInitValueChanged ? initValueForField : value;
      const showBundleInstallNotification = currentFieldValue === 'true' ? !isSuiteAppInstalled : !isSuiteBundleInstalled;

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
  },
  [
    isSuiteBundleInstalled,
    isSuiteAppInstalled,
    value,
    isLoading,
    data,
    dispatch,
    resourceType,
    resourceId,
    refreshBundleInstalledInfo,
    isNew,
    isInitValueChanged,
    initValueForField,
    connectionId,
    isOffline,
  ]);

  const handleFieldChange = (id, value) => {
    if (!isInitValueChanged) {
      setIsInitValueChanged(true);
    }
    onFieldChange(id, value);
  };

  return (
    <>
      {(isLoading && isNew && !errorMessage) ? (
        <span
          className={classes.refreshLoader}>
          <Spinner size={24} />
        </span>
      )
        : (
          <DynaRadio
            {...{...props,
              onFieldChange: handleFieldChange,
              ...(isNew && !isInitValueChanged) && {value: initValueForField}}
            } />
        )}
      <FieldMessage errorMessages={errorMessage} />
    </>
  );
}
