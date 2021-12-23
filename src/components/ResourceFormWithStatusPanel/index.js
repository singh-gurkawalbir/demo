import React, { useState, useCallback } from 'react';
import { makeStyles } from '@material-ui/core';
import ReactResizeDetector from 'react-resize-detector';
import { useSelector } from 'react-redux';
import ConnectionStatusPanel from '../ConnectionStatusPanel';
import KeyColumnsDeprecationNotification from '../KeyColumnsDeprecationNotification';
import ResourceForm from '../ResourceFormFactory';
import GenericAdaptorNotification from '../GenericAdaptorNotification';
import NetSuiteBundleInstallNotification from '../NetSuiteBundleInstallNotification';
import { selectors } from '../../reducers';
import IsLoggableContextProvider from '../IsLoggableContextProvider';

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
  const isLoggable = false;

  const classes = useStyles({
    ...props,
    notificationPanelHeight,
  });
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

      <IsLoggableContextProvider isLoggable={isLoggable}>
        <ResourceForm className={classes.form} {...props} />
      </IsLoggableContextProvider>
    </div>
  );
}
