import React, { useState, useCallback } from 'react';
import { makeStyles } from '@material-ui/core';
import ReactResizeDetector from 'react-resize-detector';
import ConnectionStatusPanel from '../ConnectionStatusPanel';
import ResourceForm from '../ResourceFormFactory';
import GenericAdaptorNotification from '../GenericAdaptorNotification';
import NetSuiteBundleInstallNotification from '../NetSuiteBundleInstallNotification';

const useStyles = makeStyles(theme => ({
  form: {
    height: props =>
      `calc(100vh - ${props.heightOffset || 150}px - ${
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
    marginBottom: theme.spacing(2),
  },
}));

export default function ResourceFormWithStatusPanel({ isFlowBuilderView, className, showNotificationToaster, onCloseNotificationToaster, ...props }) {
  const { resourceType, resourceId } = props;
  const [notificationPanelHeight, setNotificationPanelHeight] = useState(0);
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
          <GenericAdaptorNotification className={classes.notification} onClose={onCloseNotificationToaster} />}
        <NetSuiteBundleInstallNotification className={classes.notification} resourceType={resourceType} resourceId={resourceId} />
        <ReactResizeDetector handleHeight onResize={resize} />
      </div>
      <ResourceForm className={classes.form} {...props} />
    </div>
  );
}
