import React, { useCallback } from 'react';
import {makeStyles} from '@material-ui/core/styles';
import { useHistory, useRouteMatch } from 'react-router-dom';
import RightDrawer from '../../../Right';
import DrawerHeader from '../../../Right/DrawerHeader';
import DrawerContent from '../../../Right/DrawerContent';
import DrawerFooter from '../../../Right/DrawerFooter';
import InstallSteps from '../../InstallSteps';
import RevisionHeader from '../../RevisionHeader';
import { REVISION_DRAWER_MODES } from '../../../../../utils/revisions';
import FilledButton from '../../../../Buttons/FilledButton';

const useStyles = makeStyles(() => ({
  drawerHeader: {
    '& > h4': {
      whiteSpace: 'nowrap',
    },
  },
}));

function MergePullDrawerContent({ parentUrl, integrationId }) {
  const match = useRouteMatch();
  const classes = useStyles();
  const history = useHistory();
  const { revId } = match.params;

  const onClose = useCallback(() => {
    history.replace(parentUrl);
  }, [history, parentUrl]);

  return (
    <>
      <DrawerHeader className={classes.drawerHeader} title="Review changes" handleClose={onClose}>
        <RevisionHeader
          integrationId={integrationId}
          revisionId={revId}
          onClose={onClose}
          mode={REVISION_DRAWER_MODES.MERGE} />
      </DrawerHeader>
      <DrawerContent>
        <InstallSteps integrationId={integrationId} revisionId={revId} />
      </DrawerContent>
      <DrawerFooter>
        <FilledButton
          data-test="cancelMerge"
          onClick={onClose}>
          Close
        </FilledButton>
      </DrawerFooter>
    </>
  );
}

export default function MergePullDrawer({ integrationId }) {
  const match = useRouteMatch();

  return (
    <RightDrawer
      path="pull/:revId/merge"
      variant="temporary"
      height="tall"
      width="xl">
      <MergePullDrawerContent integrationId={integrationId} parentUrl={match.url} />
    </RightDrawer>
  );
}
