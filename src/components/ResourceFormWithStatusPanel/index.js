import React, { useState, useCallback } from 'react';
import makeStyles from '@mui/styles/makeStyles';
import ReactResizeDetector from 'react-resize-detector';
import { selectors } from '../../reducers';
import ConnectionStatusPanel from '../ConnectionStatusPanel';
import KeyColumnsDeprecationNotification from '../KeyColumnsDeprecationNotification';
import ResourceForm from '../ResourceFormFactory';
import GenericAdaptorNotification from '../GenericAdaptorNotification';
import NetSuiteBundleInstallNotification from '../NetSuiteBundleInstallNotification';
import IsLoggableContextProvider from '../IsLoggableContextProvider';
import ConnectionVanLicenseStatusPanel from '../VAN';
import { useSelectorMemo } from '../../hooks';
import { emptyObject } from '../../constants';

const useStyles = makeStyles(theme => ({
  form: {
    height: props =>
      `calc(100vh - ${props.heightOffset || (155 + theme.appBarHeight)}px - ${
        props.notificationPanelHeight
      }px)`,
    width: props => {
      if (props.occupyFullWidth) return '100%';

      return props.variant === 'edit' ? '100%' : 660;
    },
    maxHeight: 'unset',
    padding: '0px !important',
  },
  notification: {
    paddingBottom: theme.spacing(2),
    '&:empty': {
      display: 'none',
    },
  },
}));

export default function ResourceFormWithStatusPanel({ isFlowBuilderView, className, showNotificationToaster, onCloseNotificationToaster, ...props }) {
  const { resourceType, resourceId } = props;
  const [notificationPanelHeight, setNotificationPanelHeight] = useState(0);

  // const isWebhookExport = useSelector(state =>
  //    selectors.resourceData(state, resourceType, resourceId)?.merged?.adaptorType === 'WebhookExport');

  // only webhooks and connection should  be redacted
  // TODO:enable it when we have isLoggable attribute defined for individaul field Meta
  // const isLoggable = !(isWebhookExport || resourceType === 'connections');

  const classes = useStyles({
    ...props,
    notificationPanelHeight,
  });
  const resource = useSelectorMemo(
    selectors.makeResourceDataSelector,
    resourceType,
    resourceId
  )?.merged || emptyObject;
  const resize = useCallback((width, height) => {
    setNotificationPanelHeight(height + 16);
  }, []);

  return (
    <div className={className}>
      <div>
        {['exports', 'imports', 'connections'].includes(resourceType) && (
          <ConnectionStatusPanel
            className={classes.notification}
            resourceType={resourceType}
            isFlowBuilderView={isFlowBuilderView}
            resourceId={resourceId}
          />
        )}
        { resource.type === 'van' && (
          <ConnectionVanLicenseStatusPanel
            className={classes.notification}
            resourceType={resourceType}
            resourceId={resourceId}
          />
        )}
        {showNotificationToaster &&
        (
          <div className={classes.notification}>
            <GenericAdaptorNotification onClose={onCloseNotificationToaster} />
          </div>
        )}
        <div className={classes.notification}>
          <NetSuiteBundleInstallNotification resourceType={resourceType} resourceId={resourceId} />
        </div>
        {
          resourceType === 'exports' && (
          <div className={classes.notification}>
            <KeyColumnsDeprecationNotification resourceId={resourceId} />
          </div>
          )
        }
        <ReactResizeDetector handleHeight onResize={resize} />
      </div>
      {/* if field is not loggable this context ensures that isLoggable is false */}
      <IsLoggableContextProvider isLoggable={false}>
        <ResourceForm className={classes.form} {...props} />
      </IsLoggableContextProvider>
    </div>
  );
}
