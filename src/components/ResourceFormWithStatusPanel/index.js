import React, { useState, useCallback } from 'react';
import { makeStyles } from '@material-ui/core';
import clsx from 'clsx';
import ReactResizeDetector from 'react-resize-detector';
import ConnectionStatusPanel from '../ConnectionStatusPanel';
import ResourceForm from '../ResourceFormFactory';
import GenericAdaptorNotification from '../GenericAdaptorNotification';

const useStyles = makeStyles(theme => ({
  removeTopPadding: {
    paddingTop: '0px !important',
  },
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
    padding: 0,
  },
  notification: {
    margin: theme.spacing(2, 0),
  }
}));

export default function ResourceFormWithStatusPanel({ className, showNotificationToaster, assistantName, ...props }) {
  const { resourceType, resourceId } = props;
  const [notificationPanelHeight, setNotificationPanelHeight] = useState(0);
  const classes = useStyles({
    ...props,
    notificationPanelHeight,
  });
  const resize = useCallback((width, height) => {
    setNotificationPanelHeight(height);
  }, []);
  return (
    <div
      className={clsx(className, {
        [classes.removeTopPadding]: notificationPanelHeight,
      })}>
      <div>
        {['exports', 'imports', 'connections'].includes(resourceType) && (
          <ConnectionStatusPanel
            resourceType={resourceType}
            resourceId={resourceId}
          />
        )}
        {showNotificationToaster &&
          <GenericAdaptorNotification className={classes.notification} assistantName={assistantName} />}
        <ReactResizeDetector handleHeight onResize={resize} />
      </div>
      <ResourceForm className={classes.form} {...props} />
    </div>
  );
}
