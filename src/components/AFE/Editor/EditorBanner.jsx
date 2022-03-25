import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { useSelector, shallowEqual } from 'react-redux';
import { Typography } from '@material-ui/core';
import { selectors } from '../../../reducers';
import NotificationToaster from '../../NotificationToaster';

const useStyles = makeStyles(theme => ({
  titleStatusPanel: {
    color: theme.palette.secondary.main,
    fontFamily: 'Roboto400',
  },
  notification: {
    marginBottom: theme.spacing(3),
  },
}));

// currently only mappings editor supports notification
// we can update this component in future when we need to show the banner for other editors
export default function EditorBanner({editorId}) {
  const classes = useStyles();
  const mappingVersion = useSelector(state => selectors.mappingVersion(state));
  const {message, variant} = useSelector(state => selectors.mappingEditorNotification(state, editorId), shallowEqual);

  if (!message) return null;

  return (
    <NotificationToaster
      variant={variant}
      size="large"
      onClose
      className={classes.notification}>
      <Typography variant="h6" className={classes.titleStatusPanel}>
        {message}
        {mappingVersion === 2 && <a target="_blank" rel="noreferrer" href="https://docs.celigo.com/hc/en-us/articles/4536629083035-Mapper-2-0"> Learn about Mapper 2.0’s advantages</a>}
      </Typography>
    </NotificationToaster>
  );
}
