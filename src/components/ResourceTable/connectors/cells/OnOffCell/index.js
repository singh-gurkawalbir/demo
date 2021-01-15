import { makeStyles } from '@material-ui/core/styles';
import React, { useState, useCallback, useEffect } from 'react';
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
  const [onOffInProgressStatus, setOnOffInProgressStatus] = useState(false);
  const toggleStatus = useSelector(state => selectors.toggleOnOffStatus(state, resourceId)?.status);
  const togglePublish = useCallback(() => {
    const patchSet = [
      {
        op: 'replace',
        path: '/published',
        value: !isPublished,
      },
    ];

    dispatch(actions.connectors.publishLoading(resourceId));
    setOnOffInProgressStatus(true);
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

  useEffect(() => {
    if (toggleStatus !== 'loading') {
      setOnOffInProgressStatus(false);
    }
  }, [toggleStatus]);

  if (onOffInProgressStatus) {
    return <Spinner size={24} className={classes.spinnerOnOff} />;
  }

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
