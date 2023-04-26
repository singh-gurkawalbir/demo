import React from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { Typography } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import { generateId } from '../../../../../../utils/string';
import { selectors } from '../../../../../../reducers';
import { REVISION_TYPES } from '../../../../../../constants';
import { drawerPaths, buildDrawerUrl } from '../../../../../../utils/rightDrawer';
import NotificationToaster from '../../../../../NotificationToaster';
import { message } from '../../../../../../utils/messageStore';

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
      params: { revId: generateId() },
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
          {message.REVERT_NOT_ALLOWED}

        </Typography>
      </NotificationToaster>
    );
  }

  return <div className={classes.error}> {revisionResourceDiffError} </div>;
}
