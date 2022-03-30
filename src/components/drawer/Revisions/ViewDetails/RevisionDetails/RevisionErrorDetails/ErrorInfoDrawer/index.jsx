import React from 'react';
import { useSelector } from 'react-redux';
import {makeStyles} from '@material-ui/core/styles';
import { useRouteMatch, useHistory } from 'react-router-dom';
import { Typography } from '@material-ui/core';
import RightDrawer from '../../../../../Right';
import DrawerHeader from '../../../../../Right/DrawerHeader';
import DrawerContent from '../../../../../Right/DrawerContent';
import DrawerFooter from '../../../../../Right/DrawerFooter';
import { FilledButton } from '../../../../../../Buttons';
import { selectors } from '../../../../../../../reducers';
import DateTimeDisplay from '../../../../../../DateTimeDisplay';
import { DRAWER_URLS } from '../../../../../../../utils/drawerURLs';

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
        <Typography className={classes.details}><b>Code</b><br /><DateTimeDisplay dateTime={revisionError.code} /></Typography>
        <Typography className={classes.details}><b>Message</b><br /><DateTimeDisplay dateTime={revisionError.message} /></Typography>
      </DrawerContent>
      <DrawerFooter>
        <FilledButton
          data-test="cancelCreatePull"
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
    <RightDrawer path={DRAWER_URLS.VIEW_REVISION_ERROR_INFO} height="tall">
      <ErrorInfoDrawerContent
        integrationId={integrationId}
        revisionId={revisionId}
        parentUrl={match.url} />
    </RightDrawer>
  );
}
