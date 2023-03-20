
import React, { useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import makeStyles from '@mui/styles/makeStyles';
import actions from '../../../../../actions';
import { selectors } from '../../../../../reducers';
import useConfirmDialog from '../../../../ConfirmDialog';
import CeligoSwitch from '../../../../CeligoSwitch';
import Spinner from '../../../../Spinner';

const useStyles = makeStyles(theme => ({
  integrationAppsSwitchOnOff: {
    marginRight: theme.spacing(2),
    padding: 0,
  },
}));

export default function OnOffCell({
  connectorId: resourceId,
  published: isPublished,
  applications,
  resourceType,
  tooltip,
}) {
  const classes = useStyles();

  const { confirmDialog } = useConfirmDialog();
  const dispatch = useDispatch();
  const toggleStatus = useSelector(state => selectors.connectorPublishStatus(state, resourceId));
  const handleTogglePublishConfirm = useCallback(() => {
    const label = isPublished ? 'unpublish' : 'publish';

    confirmDialog({
      title: `Confirm ${label}`,
      message: `Are you sure you want to ${label} this integration app?`,
      buttons: [
        {
          label: isPublished ? 'Unpublish' : 'Publish',
          onClick: () => dispatch(actions.connectors.publish.request(resourceId, isPublished)),
        },
        {
          label: 'Cancel',
          variant: 'text',
        },
      ],
    });
  }, [confirmDialog, isPublished, resourceId, dispatch]);

  if (resourceType !== 'connectors' && !applications?.length) {
    return null;
  }

  if (toggleStatus === 'loading') {
    return <Spinner />;
  }

  return (
    <CeligoSwitch
      checked={isPublished}
      tooltip={tooltip}
      onChange={handleTogglePublishConfirm}
      className={classes.integrationAppsSwitchOnOff}
    />
  );
}
