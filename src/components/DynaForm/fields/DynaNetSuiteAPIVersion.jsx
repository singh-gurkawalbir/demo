import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import Spinner from '../../Spinner';
import actions from '../../../actions';
import DynaRadio from './radiogroup/DynaRadioGroup';
import { selectors } from '../../../reducers';
import useSelectorMemo from '../../../hooks/selectors/useSelectorMemo';
import ErroredMessageComponent from './ErroredMessageComponent';

const useStyles = makeStyles(theme => ({
  refreshGenericResourceActionBtn: {
    alignSelf: 'flex-start',
    marginTop: theme.spacing(4),
  },
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
    const currentFieldValue = isNew && !isInitValueChanged ? initValueForField : value;
    const showBundleInstallNotification = currentFieldValue === 'true' ? !isSuiteAppInstalled : !isSuiteBundleInstalled;

    if (!isLoading && !refreshBundleInstalledInfo) {
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
  ]);

  useEffect(() => {
    if (!data || refreshBundleInstalledInfo) {
      dispatch(actions.metadata.getBundleInstallStatus(connectionId));
      setRefreshBundleInstalledInfo(false);
    }
  }, [dispatch, data, connectionId, refreshBundleInstalledInfo]);

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
          className={clsx(
            classes.refreshGenericResourceActionBtn,
            classes.refreshLoader
          )}>
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
      <ErroredMessageComponent errorMessages={errorMessage} />
    </>
  );
}
