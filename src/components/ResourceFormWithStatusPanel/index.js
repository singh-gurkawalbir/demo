import React, { useState, useCallback } from 'react';
import { makeStyles } from '@material-ui/core';
import ReactResizeDetector from 'react-resize-detector';
import { useSelector } from 'react-redux';
import ConnectionStatusPanel from '../ConnectionStatusPanel';
import ResourceForm from '../ResourceFormFactory';
import GenericAdaptorNotification from '../GenericAdaptorNotification';
import NetSuiteBundleInstallNotification from '../NetSuiteBundleInstallNotification';
import { selectors } from '../../reducers';

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
  },
}));

const notRedactAttr = {'data-public': 'true'};

const emptyObj = {};
export default function ResourceFormWithStatusPanel({ isFlowBuilderView, className, showNotificationToaster, onCloseNotificationToaster, ...props }) {
  const { resourceType, resourceId } = props;
  const [notificationPanelHeight, setNotificationPanelHeight] = useState(0);

  const isWebhookExport = useSelector(state =>
     selectors.resourceData(state, resourceType, resourceId)?.merged?.adaptorType === 'WebhookExport');

  // only webhooks should not be redacted
  const shouldRedactLogRocket = isWebhookExport || resourceType === 'connections';

  const classes = useStyles({
    ...props,
    notificationPanelHeight,
  });
  const resize = useCallback((width, height) => {
    setNotificationPanelHeight(height + 16);
  }, []);

  const shouldRedact = shouldRedactLogRocket ? emptyObj : notRedactAttr;

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
        <ReactResizeDetector handleHeight onResize={resize} />
      </div>
      <span {...shouldRedact}>
        <ResourceForm className={classes.form} {...props} />
      </span>
    </div>
  );
}
