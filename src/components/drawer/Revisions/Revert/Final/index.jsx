import React, { useCallback } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Typography, IconButton } from '@material-ui/core';
import { useHistory, useRouteMatch } from 'react-router-dom';
import RightDrawer from '../../../Right';
import ActionGroup from '../../../../ActionGroup';
import DrawerHeader from '../../../Right/DrawerHeader';
import DrawerContent from '../../../Right/DrawerContent';
import DrawerFooter from '../../../Right/DrawerFooter';
import { TextButton } from '../../../../Buttons';
import CancelIcon from '../../../../icons/CancelIcon';
import InstallSteps from '../../InstallSteps';
import useCancelRevision from '../../hooks/useCancelRevision';

const useStyles = makeStyles(theme => ({
  container: {
    width: theme.spacing(11),
  },
  icon: {
    marginRight: theme.spacing(0.5),
  },
}));

function FinalRevertDrawerContent({ parentUrl, integrationId }) {
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
      <DrawerHeader title="Review changes " handleClose={onClose}>
        <ActionGroup>
          <IconButton
            size="small"
            className={classes.container}
            data-test="expandAll"
            onClick={handleCancel}>
            <CancelIcon className={classes.icon} />
            <Typography variant="body2"> Cancel revert</Typography>
          </IconButton>
        </ActionGroup>
      </DrawerHeader>
      <DrawerContent>
        <InstallSteps integrationId={integrationId} revisionId={revId} />
      </DrawerContent>
      <DrawerFooter>
        <TextButton
          data-test="cancelCreatePull"
          onClick={onClose}>
          Cancel
        </TextButton>
      </DrawerFooter>
    </>
  );
}

export default function FinalRevert({ integrationId }) {
  const match = useRouteMatch();

  return (
    <RightDrawer
      path="revert/:revId/final"
      variant="temporary"
      height="tall"
      width="full">
      <FinalRevertDrawerContent integrationId={integrationId} parentUrl={match.url} />
    </RightDrawer>
  );
}
