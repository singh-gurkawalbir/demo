import React, {useCallback} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Typography } from '@material-ui/core';

import { selectors } from '../../reducers';
// eslint-disable-next-line import/no-extraneous-dependencies
import NotificationToaster from '../NotificationToaster';
import actions from '../../actions';

export default function NetSuiteBundleInstallNotification({resourceType, resourceId, className}) {
  const dispatch = useDispatch();
  const {showBundleInstallNotification, showSuiteAppInstallNotification, bundleUrl} = useSelector(
    state => selectors.resourceFormState(state, resourceType, resourceId)
  );

  const isRealTimeExport = useSelector(state => {
    const { merged: resourceData} = selectors.resourceData(state, resourceType, resourceId);

    return resourceType === 'exports' && (resourceData.resourceType === 'realtime' || resourceData.type === 'distributed');
  });

  const handleClose = useCallback(() => {
    dispatch(actions.resourceForm.hideBundleInstallNotification(resourceType, resourceId));
  }, [dispatch, resourceId, resourceType]);

  return (
    <>
      {showBundleInstallNotification && (
      <NotificationToaster className={className} variant="warning" size="large" onClose={handleClose}>
        <Typography variant="h6">
          Install the{' '}
          <a
            target="_blank"
            rel="noreferrer"
            href={bundleUrl}>
            <u>install the integrator.io SuiteBundle</u>
          </a>
          {' '}in your NetSuite account {isRealTimeExport ? ' to enable Real-time export capabilities.' : ' to integrate with SuiteScript APIs.'}

        </Typography>
      </NotificationToaster>
      )}
      {showSuiteAppInstallNotification && (
      <NotificationToaster className={className} variant="warning" size="large" onClose={handleClose}>
        <Typography variant="h6">
          Install the{' '}
          <a
            target="_blank"
            rel="noreferrer"
            href={bundleUrl}>
            <u>Integrator.io SuiteApp</u>
          </a>
          {' '}in your NetSuite account {isRealTimeExport ? ' to enable Real-time export capabilities.' : ' to integrate with SuiteScript APIs.'}

        </Typography>
      </NotificationToaster>
      )}

    </>
  );
}
