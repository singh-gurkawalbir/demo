import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { useSelector } from 'react-redux';
import { Typography } from '@material-ui/core';
import { selectors } from '../../reducers';
import NotificationToaster from '../NotificationToaster';

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

    return !hasKeyColumns || isRestCsvExport;
  });

  if (hideNotification) {
    return null;
  }

  return (
    <NotificationToaster variant="warning" size="large">
      <Typography variant="h6" className={classes.titleStatusPanel}>
        You’re using a deprecated option “Key Columns” to group your records. Use the new and improved option in the “How would you like to sort and group records” section. Your group settings may be affected when you use the new sorting and grouping option.
      </Typography>
    </NotificationToaster>
  );
}
