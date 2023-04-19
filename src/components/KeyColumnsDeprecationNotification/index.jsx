import React from 'react';
import makeStyles from '@mui/styles/makeStyles';
import { useSelector } from 'react-redux';
import { Typography } from '@mui/material';
import { selectors } from '../../reducers';
import NotificationToaster from '../NotificationToaster';
import { SORT_GROUP_CONTENT_URL } from '../../constants';
import { message } from '../../utils/messageStore';

const useStyles = makeStyles(theme => ({
  titleStatusPanel: {
    color: theme.palette.secondary.main,
    fontFamily: 'Roboto400',
  },
}));

export default function KeyColumnsDeprecationNotification({ resourceId}) {
  const classes = useStyles();
  const hideNotification = useSelector(state => {
    const resource = selectors.resource(state, 'exports', resourceId);
    const hasKeyColumns = !!(resource?.file?.xlsx?.keyColumns?.length || resource?.file?.csv?.keyColumns?.length);
    const isRestCsvExport = selectors.isRestCsvMediaTypeExport(state, resourceId);
    const isHTTPExport = resource?.adaptorType === 'HTTPExport';

    return !hasKeyColumns || isRestCsvExport || isHTTPExport;
  });

  if (hideNotification) {
    return null;
  }

  return (
    <NotificationToaster variant="warning" size="large">
      <Typography variant="h6" className={classes.titleStatusPanel}>
        {message.KEY_COLUMN_DEPRECATION}<a target="_blank" rel="noreferrer" href={SORT_GROUP_CONTENT_URL}> Learn more</a>.
      </Typography>
    </NotificationToaster>
  );
}
