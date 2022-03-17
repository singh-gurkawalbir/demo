import React, { useCallback } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { useHistory, useRouteMatch } from 'react-router-dom';
import RightDrawer from '../../../Right';
import DrawerHeader from '../../../Right/DrawerHeader';
import DrawerContent from '../../../Right/DrawerContent';
import DrawerFooter from '../../../Right/DrawerFooter';
import { TextButton, FilledButton } from '../../../../Buttons';
import CancelIcon from '../../../../icons/CancelIcon';
import InstallSteps from '../../InstallSteps';
import useCancelRevision from '../../hooks/useCancelRevision';
import CeligoDivider from '../../../../CeligoDivider';

const useStyles = makeStyles(theme => ({
  icon: {
    marginRight: theme.spacing(0.5),
  },
  drawerHeaderWrapper: {
    alignItems: 'center',
  },
}));

function MergePullDrawerContent({ parentUrl, integrationId }) {
  const match = useRouteMatch();
  const history = useHistory();
  const classes = useStyles();
  const { revId } = match.params;

  const onClose = useCallback(() => {
    history.replace(parentUrl);
  }, [history, parentUrl]);

  const handleCancel = useCancelRevision({ integrationId, revisionId: revId, onClose });

  return (
    <>
      <DrawerHeader title="Review changes" handleClose={onClose} className={classes.drawerHeaderWrapper}>
        <TextButton
          startIcon={<CancelIcon />}
          size="small"
          data-test="expandAll"
          onClick={handleCancel}>
          Cancel merge
        </TextButton>
        <CeligoDivider position="right" />
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
