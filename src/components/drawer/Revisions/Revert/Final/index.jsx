import React, { useCallback } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Typography, IconButton } from '@material-ui/core';
import { useDispatch } from 'react-redux';
import { useHistory, useRouteMatch } from 'react-router-dom';
import RightDrawer from '../../../Right';
import ActionGroup from '../../../../ActionGroup';
import useConfirmDialog from '../../../../ConfirmDialog';
import DrawerHeader from '../../../Right/DrawerHeader';
import DrawerContent from '../../../Right/DrawerContent';
import DrawerFooter from '../../../Right/DrawerFooter';
import { TextButton } from '../../../../Buttons';
import CancelIcon from '../../../../icons/CancelIcon';
import actions from '../../../../../actions';
// import { selectors } from '../../../../../reducers';

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
  const dispatch = useDispatch();
  const { confirmDialog } = useConfirmDialog();
  const history = useHistory();
  const classes = useStyles();
  const { revId } = match.params;

  const onClose = useCallback(() => {
    history.replace(parentUrl);
  }, [history, parentUrl]);

  const handleCancel = useCallback(
    () => {
      confirmDialog({
        title: 'You\'ve got a revert in progress',
        message: 'Are you sure you want to close this installer? \n Your current merge in progress for your revert will be canceled ',
        buttons: [
          {
            label: 'Cancel revert',
            onClick: () => {
              onClose();
              dispatch(actions.integrationLCM.revision.cancel(integrationId, revId));
            },
          },
          {
            label: 'Continue revert',
            variant: 'outlined',
          },
        ],
      });
    },
    [onClose, dispatch, confirmDialog, integrationId, revId],
  );

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
        <div> merge install steps </div>
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
