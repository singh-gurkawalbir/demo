import { makeStyles } from '@material-ui/core/styles';
import React, { useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import actions from '../../../../../actions';
import { selectors } from '../../../../../reducers';
import useConfirmDialog from '../../../../ConfirmDialog';
import CeligoSwitch from '../../../../CeligoSwitch';
import Spinner from '../../../../Spinner';

const useStyles = makeStyles(theme => ({
  celigoSwitchOnOff: {
    marginTop: theme.spacing(1),
  },
}));

export default function OnOffCell({
  connectorId: resourceId,
  published: isPublished,
  applications,
  resourceType,
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
          label,
          onClick: () => dispatch(actions.connectors.publish.loading(resourceId, isPublished)),
        },
        {
          label: 'Cancel',
          color: 'secondary',
        },
      ],
    });
  }, [confirmDialog, isPublished, resourceId, dispatch]);

  if (toggleStatus === 'loading') {
    return <Spinner size={24} className={classes.spinnerOnOff} />;
  }

  if (resourceType === 'connectors' || applications?.length) {
    return (
      <CeligoSwitch
        className={classes.celigoSwitchOnOff}
        checked={isPublished}
        onChange={handleTogglePublishConfirm}
      />
    );
  }

  return null;
}
