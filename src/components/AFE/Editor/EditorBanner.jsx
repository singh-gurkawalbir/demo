import React from 'react';
import makeStyles from '@mui/styles/makeStyles';
import { useSelector, shallowEqual } from 'react-redux';
import { Typography } from '@mui/material';
import { selectors } from '../../../reducers';
import NotificationToaster from '../../NotificationToaster';
import RawHtml from '../../RawHtml';

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
  const {message, variant} = useSelector(state => selectors.mappingEditorNotification(state, editorId), shallowEqual);

  if (!message) return null;

  return (
    <NotificationToaster
      variant={variant}
      size="large"
      onClose
      className={classes.notification}>
      <Typography variant="h6" className={classes.titleStatusPanel}>
        <RawHtml html={message} />
      </Typography>
    </NotificationToaster>
  );
}
