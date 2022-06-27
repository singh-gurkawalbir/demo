import React from 'react';
import { useSelector } from 'react-redux';
import { nanoid } from 'nanoid';
import { Link } from 'react-router-dom';
import { makeStyles, Typography } from '@material-ui/core';
import { selectors } from '../../../../../../reducers';
import { REVISION_TYPES } from '../../../../../../utils/constants';
import { drawerPaths, buildDrawerUrl } from '../../../../../../utils/rightDrawer';
import NotificationToaster from '../../../../../NotificationToaster';

const useStyles = makeStyles(theme => ({
  error: {
    color: theme.palette.error.main,
  },
}));

export default function ResourceDiffError({ integrationId, type, parentUrl }) {
  const classes = useStyles();
  const revisionResourceDiffError = useSelector(state => selectors.revisionResourceDiffError(state, integrationId));

  if (type === REVISION_TYPES.PULL) {
    const openPullDrawerUrl = buildDrawerUrl({
      path: drawerPaths.LCM.OPEN_PULL,
      baseUrl: parentUrl,
      params: { revId: nanoid() },
    });

    return (
      <NotificationToaster variant="error" size="large">
        <Typography variant="body2">
          There are no changes between this clone and your source integration.
          <Link to={openPullDrawerUrl} > Create a new pull </Link> and select a different integration.
        </Typography>
      </NotificationToaster>
    );
  }
  if (type === REVISION_TYPES.REVERT) {
    return (
      <NotificationToaster variant="error" size="large">
        <Typography variant="body2">
          Your revert is not allowed. Your operation is already on the same revision you&apos;re trying to revert to.
        </Typography>
      </NotificationToaster>
    );
  }

  return <div className={classes.error}> {revisionResourceDiffError} </div>;
}
