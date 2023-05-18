import React from 'react';
import { useSelector } from 'react-redux';
import makeStyles from '@mui/styles/makeStyles';
import { useRouteMatch, useHistory } from 'react-router-dom';
import { Typography } from '@mui/material';
import { FilledButton } from '@celigo/fuse-ui';
import RightDrawer from '../../../../../Right';
import DrawerHeader from '../../../../../Right/DrawerHeader';
import DrawerContent from '../../../../../Right/DrawerContent';
import DrawerFooter from '../../../../../Right/DrawerFooter';
import { selectors } from '../../../../../../../reducers';
import DateTimeDisplay from '../../../../../../DateTimeDisplay';
import { drawerPaths } from '../../../../../../../utils/rightDrawer';

const useStyles = makeStyles(theme => ({
  details: {
    marginBottom: theme.spacing(2),
  },
}));

function ErrorInfoDrawerContent({ integrationId, revisionId, parentUrl }) {
  const match = useRouteMatch();
  const classes = useStyles();
  const { errorId } = match.params;
  const revisionError = useSelector(state => selectors.revisionError(state, integrationId, revisionId, errorId));

  const history = useHistory();
  const onClose = () => {
    history.replace(parentUrl);
  };

  if (!revisionError) {
    onClose();

    return null;
  }

  return (
    <>
      <DrawerHeader title="View error" handleClose={onClose} />
      <DrawerContent>
        <Typography className={classes.details}><b>Timestamp</b><br /><DateTimeDisplay dateTime={revisionError.createdAt} /></Typography>
        <Typography className={classes.details}><b>Code</b><br />{revisionError.code}</Typography>
        <Typography className={classes.details}><b>Message</b><br />{revisionError.message}</Typography>
      </DrawerContent>
      <DrawerFooter>
        <FilledButton
          data-test="cancelRevisonErrorInfo"
          onClick={onClose}>
          Close
        </FilledButton>
      </DrawerFooter>
    </>
  );
}

export default function ErrorInfoDrawer({ integrationId, revisionId }) {
  const match = useRouteMatch();

  return (
    <RightDrawer path={drawerPaths.LCM.VIEW_REVISION_ERROR_INFO} height="tall">
      <ErrorInfoDrawerContent
        integrationId={integrationId}
        revisionId={revisionId}
        parentUrl={match.url} />
    </RightDrawer>
  );
}
