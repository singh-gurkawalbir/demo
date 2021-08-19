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
  const isOldKeyColumnFeature = useSelector(state => {
    const resource = selectors.resource(state, 'exports', resourceId);

    return !!(resource?.file?.xlsx?.keyColumns?.length || resource?.file?.csv?.keyColumns?.length);
  });

  if (!isOldKeyColumnFeature) {
    return null;
  }

  return (
    <NotificationToaster variant="warning" size="large">
      <Typography variant="h6" className={classes.titleStatusPanel}>
        You’re using a deprecated option “Key Columns” to group your records. Use the new and improved option in the “How would you like to sort and group records” section. Your group settings may be affected when you use the new sorting and grouping option.
        <a target="_blank" rel="noreferrer" href="https://docs.celigo.com/hc/en-us/articles/4405373029019-Sort-and-group-content-for-all-file-providers"> Learn more</a>.
      </Typography>
    </NotificationToaster>
  );
}
