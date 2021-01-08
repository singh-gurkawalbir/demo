import { makeStyles } from '@material-ui/core/styles';
import React, { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import actions from '../../../../../actions';
import useConfirmDialog from '../../../../ConfirmDialog';
import CeligoSwitch from '../../../../CeligoSwitch';

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
  const togglePublish = useCallback(() => {
    const patchSet = [
      {
        op: 'replace',
        path: '/published',
        value: !isPublished,
      },
    ];

    dispatch(actions.resource.patchStaged(resourceId, patchSet, 'value'));
    dispatch(actions.resource.commitStaged(resourceType, resourceId));
  }, [dispatch, isPublished, resourceId, resourceType]);
  const handleTogglePublishConfirm = useCallback(() => {
    const label = isPublished ? 'unpublish' : 'publish';

    confirmDialog({
      title: `Confirm ${label}`,
      message: `Are you sure you want to ${label} this integration app?`,
      buttons: [
        {
          label,
          onClick: togglePublish,
        },
        {
          label: 'Cancel',
          color: 'secondary',
        },
      ],
    });
  }, [confirmDialog, togglePublish, isPublished]);

  if (!(resourceType === 'templates' && !applications?.length)) {
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
