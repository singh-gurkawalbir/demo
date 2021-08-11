import React from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import { makeStyles } from '@material-ui/styles';
import { useSelector } from 'react-redux';
import { Typography } from '@material-ui/core';

import { selectors } from '../../reducers';
// eslint-disable-next-line import/no-extraneous-dependencies
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
    const { merged: resourceData} = selectors.resourceData(state, 'exports', resourceId);

    return !!(resourceData?.file?.xlsx?.keyColumns?.length || resourceData?.file?.csv?.keyColumns?.length);
  });

  return (
    <>
      {isOldKeyColumnFeature ? (
        <NotificationToaster variant="warning" size="large">
          <Typography variant="h6" className={classes.titleStatusPanel}>
            You’re using a deprecated option “Key Columns” to group your records. Use the new and improved option in the “How would you like to sort and group records” section. Your group settings may be affected when you use the new sorting and grouping option.
          </Typography>
        </NotificationToaster>
      ) : ''}
    </>
  );
}
