import React from 'react';
import {makeStyles} from '@material-ui/core/styles';
import { IconButton } from '@material-ui/core';
import { useDispatch, useSelector } from 'react-redux';
import RefreshIcon from '../../../../icons/RefreshIcon';
import actions from '../../../../../actions';
import { selectors } from '../../../../../reducers';
import { getTextAfterCount } from '../../../../../utils/string';
import StatusCircle from '../../../../StatusCircle';
import ActionGroup from '../../../../ActionGroup';
import CeligoDivider from '../../../../CeligoDivider';
import RevisionsGuide from '../../RevisionsGuide';
import ExpandAllResourceDiff from '../../ExpandAllResourceDiff';

const useStyles = makeStyles(theme => ({
  drawerHeaderActions: {
    width: '100%',
    display: 'flex',
  },
  conflictStatus: {
    display: 'flex',
    alignItems: 'center',
    marginLeft: 5,
  },
  drawerHeaderActionsGroup: {
    '& > :not(:last-child)': {
      marginRight: theme.spacing(1),
    },
  },
}));

const Conflicts = ({count}) => {
  const classes = useStyles();

  return (
    <>
      <CeligoDivider position="right" />
      <div className={classes.conflictStatus}>
        <StatusCircle variant={count ? 'error' : 'success'} size="mini" />
        <span>{getTextAfterCount('conflict', count)}</span>
      </div>
    </>
  );
};

export default function ReviewHeaderActions({ numConflicts, integrationId, revId }) {
  const dispatch = useDispatch();
  const classes = useStyles();
  const isResourceComparisonInProgress = useSelector(state => selectors.isResourceComparisonInProgress(state, integrationId));

  const handleRefresh = () => {
    dispatch(actions.integrationLCM.compare.pullRequest(integrationId, revId));
  };

  return (
    <>
      <div className={classes.drawerHeaderActions}>
        { !isResourceComparisonInProgress && <Conflicts count={numConflicts} /> }
        <ActionGroup position="right" className={classes.drawerHeaderActionsGroup}>
          <IconButton
            disabled={isResourceComparisonInProgress}
            size="small"
            data-test="expandAll"
            onClick={handleRefresh}>
            <RefreshIcon />
          </IconButton>
          <CeligoDivider position="right" />
          <ExpandAllResourceDiff integrationId={integrationId} />
          <RevisionsGuide />
        </ActionGroup>
      </div>
    </>
  );
}
