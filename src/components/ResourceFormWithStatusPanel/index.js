import { useState } from 'react';
import { makeStyles } from '@material-ui/core';
import clsx from 'clsx';
import ReactResizeDetector from 'react-resize-detector';
import ConnectionStatusPanel from '../ConnectionStatusPanel';
import ResourceForm from '../ResourceFormFactory';

const useStyles = makeStyles(() => ({
  removeTopPadding: {
    paddingTop: `0px !important`,
  },
  form: {
    height: props =>
      `calc(100vh - ${props.heightOffset || 138}px - ${
        props.notificationPanelHeight
      }px)`,
    width: props => {
      if (props.occupyFullWidth) return '100%';

      return props.variant === 'edit' ? '100%' : 660;
    },
    maxHeight: 'unset',
    padding: 0,
  },
}));

export default function ResourceFormWithStatusPanel({ className, ...props }) {
  const { resourceType, resourceId } = props;
  const [notificationPanelHeight, setNotificationPanelHeight] = useState(0);
  const classes = useStyles({
    ...props,
    notificationPanelHeight,
  });
  const resize = (width, height) => {
    setNotificationPanelHeight(height);
  };

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
        <ReactResizeDetector handleHeight onResize={resize} />
      </div>
      <ResourceForm className={classes.form} {...props} />
    </div>
  );
}
