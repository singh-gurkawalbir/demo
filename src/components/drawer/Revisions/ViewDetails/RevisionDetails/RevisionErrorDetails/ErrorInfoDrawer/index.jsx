import React from 'react';
import { useSelector } from 'react-redux';
import {makeStyles} from '@material-ui/core/styles';
import { useRouteMatch, useHistory } from 'react-router-dom';
import RightDrawer from '../../../../../Right';
import DrawerHeader from '../../../../../Right/DrawerHeader';
import DrawerContent from '../../../../../Right/DrawerContent';
import DrawerFooter from '../../../../../Right/DrawerFooter';
import { FilledButton } from '../../../../../../Buttons';
import { selectors } from '../../../../../../../reducers';
import DateTimeDisplay from '../../../../../../DateTimeDisplay';

const useStyles = makeStyles(theme => ({
  details: {
    margin: theme.spacing(2),
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
        <div className={classes.details}>
          <b> Timestamp </b>
          <div><DateTimeDisplay dateTime={revisionError.createdAt} /></div>
        </div>
        <div className={classes.details}>

          <b>Code</b>
          <div>{revisionError.code}</div>
        </div>
        <div className={classes.details}>

          <b>Message</b>
          <div>{revisionError.message}</div>
        </div>
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
    <RightDrawer
      path="error/:errorId"
      variant="temporary"
      height="tall"
      width="full">
      <ErrorInfoDrawerContent
        integrationId={integrationId}
        revisionId={revisionId}
        parentUrl={match.url} />
    </RightDrawer>
  );
}
